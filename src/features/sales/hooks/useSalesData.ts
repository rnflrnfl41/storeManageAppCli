import { useState, useEffect, useCallback } from 'react';
import { salesService } from '../services/salesService';
import { ChartDataParams, LoadingState } from '../../../shared/types';
import { SalesDataState } from '../types/sales.types';

const initialState: SalesDataState = {
  summary: null,
  chart: {
    daily: null,
    monthly: null,
  },
  salesList: {},
  loading: {
    summary: false,
    chart: false,
    list: false,
    loadMore: false,
  },
};

export const useSalesData = () => {
  const [state, setState] = useState<SalesDataState>(initialState);

  // 로딩 상태 업데이트
  const setLoading = useCallback((key: keyof LoadingState, loading: boolean) => {
    setState(prev => ({
      ...prev,
      loading: {
        ...prev.loading,
        [key]: loading,
      },
    }));
  }, []);

  // 요약 데이터 로딩
  const loadSummaryData = useCallback(async (date: string) => {
    try {
      setLoading('summary', true);
      const data = await salesService.getSummary(date);
      setState(prev => ({
        ...prev,
        summary: data,
      }));
    } catch (error) {
      console.error('요약 데이터 로딩 실패:', error);
    } finally {
      setLoading('summary', false);
    }
  }, [setLoading]);

  // 차트 데이터 로딩
  const loadChartData = useCallback(async (type: 'daily' | 'monthly') => {
    try {
      setLoading('chart', true);
      
      const today = new Date();
      let startDate: string;
      let endDate: string;

      if (type === 'daily') {
        // 최근 7일
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        startDate = start.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
      } else {
        // 최근 6개월
        const start = new Date(today);
        start.setMonth(start.getMonth() - 5);
        startDate = start.toISOString().slice(0, 7) + '-01';
        
        // 현재 달의 마지막 날 계산
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate = endOfMonth.toISOString().split('T')[0];
      }

      const params: ChartDataParams = {
        type,
        startDate,
        endDate,
      };

      const data = await salesService.getChartData(params);

      setState(prev => ({
        ...prev,
        chart: {
          ...prev.chart,
          [type]: data,
        },
      }));
    } catch (error) {
      console.error('차트 데이터 로딩 실패:', error);
    } finally {
      setLoading('chart', false);
    }
  }, [setLoading]);

  // 매출 목록 로딩
  const loadSalesList = useCallback(async (date: string, page: number = 1, forceRefresh: boolean = false) => {
    // 이미 캐시된 데이터가 있고 강제 새로고침이 아닌 경우
    if (!forceRefresh && state.salesList[date]) {
      return;
    }

    // 강제 새로고침인 경우 첫 페이지부터 다시 로딩
    if (forceRefresh) {
      page = 1;
    }

    try {
      setLoading('list', true);
      const data = await salesService.getSalesList({ date, page, limit: 5 });

      console.log(data);
      
      setState(prev => ({
        ...prev,
        salesList: {
          ...prev.salesList,
          [date]: {
            data: data.sales,
            pagination: data.pagination,
          },
        },
      }));
    } catch (error) {
      console.error('매출 목록 로딩 실패:', error);
    } finally {
      setLoading('list', false);
    }
  }, [state.salesList, setLoading]);

  // 더보기 로딩 (페이징)
  const loadMoreSalesList = useCallback(async (date: string) => {
    const currentData = state.salesList[date];
    if (!currentData) {
      console.warn('현재 날짜의 데이터가 없습니다.');
      return;
    }

    const nextPage = currentData.pagination.page + 1;
    const hasMore = nextPage <= currentData.pagination.totalPages;

    if (!hasMore) {
      console.log('더 이상 로드할 데이터가 없습니다.');
      return;
    }

    try {
      setLoading('loadMore', true);
      const data = await salesService.getSalesList({ date, page: nextPage, limit: 5 });
      
      setState(prev => ({
        ...prev,
        salesList: {
          ...prev.salesList,
          [date]: {
            data: [...prev.salesList[date].data, ...data.sales],
            pagination: data.pagination,
          },
        },
      }));
    } catch (error) {
      console.error('더보기 로딩 실패:', error);
    } finally {
      setLoading('loadMore', false);
    }
  }, [state.salesList, setLoading]);

  // 매출 삭제
  const deleteSales = useCallback(async (id: number, date: string) => {
    try {
      await salesService.deleteSales(id);
      
      // 로컬 상태에서도 제거
      setState(prev => ({
        ...prev,
        salesList: {
          ...prev.salesList,
          [date]: {
            ...prev.salesList[date],
            data: prev.salesList[date]?.data.filter(sale => sale.id !== id) || [],
            pagination: {
              ...prev.salesList[date]?.pagination,
              total: (prev.salesList[date]?.pagination.total || 1) - 1,
            },
          },
        },
      }));

      // 삭제 성공 후 요약 데이터 새로고침 (오늘 날짜일 때만)
      if (state.summary) {
        const today = new Date().toISOString().split('T')[0];
        if (date === today) {
          await loadSummaryData(today);
        }
      }
    } catch (error) {
      console.error('매출 삭제 실패:', error);
      throw error;
    }
  }, [state.summary, loadSummaryData]);

  // 초기 데이터 로딩
  const initializeData = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // 병렬로 요약 데이터와 차트 데이터 로딩
    await Promise.all([
      loadSummaryData(today),
      loadChartData('daily'),
      loadSalesList(today),
    ]);
  }, [loadSummaryData, loadChartData]);

  // 컴포넌트 마운트 시 초기 데이터 로딩
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return {
    // 데이터
    summary: state.summary,
    chart: state.chart,
    salesList: state.salesList,
    loading: state.loading,
    
    // 액션
    loadSummaryData,
    loadChartData,
    loadSalesList,
    loadMoreSalesList,
    deleteSales,
    initializeData,
  };
};

