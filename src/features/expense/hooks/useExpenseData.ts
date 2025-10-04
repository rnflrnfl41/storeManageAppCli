import { useState, useCallback } from 'react';
import { expenseService } from '../services';
import { LoadingState, ChartDataParams, ListParams } from '../../../shared/types';
import {
  ExpenseDataState,
  ExpenseListResponse,
} from '../types/expense.types';

const initialState: ExpenseDataState = {
  summary: null,
  chart: {
    daily: null,
    monthly: null,
  },
  expenseList: {},
  loading: {
    summary: false,
    chart: false,
    list: false,
    loadMore: false,
  },
};

export const useExpenseData = () => {
  const [state, setState] = useState<ExpenseDataState>(initialState);

  // 로딩 상태 업데이트
  const setLoading = useCallback((loadingState: Partial<LoadingState>) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, ...loadingState }
    }));
  }, []);

  // 요약 데이터 로드
  const loadSummaryData = useCallback(async (date: string) => {
    setLoading({ summary: true });
    try {
      const summary = await expenseService.getExpenseSummary(date);
      setState(prev => ({ ...prev, summary }));
    } catch (error) {
      console.error('요약 데이터 로드 실패:', error);
    } finally {
      setLoading({ summary: false });
    }
  }, [setLoading]);

  // 차트 데이터 로드
  const loadChartData = useCallback(async (type: 'daily' | 'monthly') => {
    setLoading({ chart: true });
    try {
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
      
      const chartData = await expenseService.getExpenseChart(params);
      setState(prev => ({
        ...prev,
        chart: {
          ...prev.chart,
          [type]: chartData,
        },
      }));
    } catch (error) {
      console.error('차트 데이터 로드 실패:', error);
    } finally {
      setLoading({ chart: false });
    }
  }, [setLoading]);

  // 지출 목록 로드 (Spring Pageable 호환)
  const loadExpenseList = useCallback(async (params: ListParams) => {
    setLoading({ list: true });

    try {
      const response = await expenseService.getExpenseList(params);
      
      // Spring Pageable 응답을 기존 형식으로 변환
      const transformedData = {
        data: response.content,
        pagination: {
          page: response.pageable.pageNumber,
          total: response.totalElements,
          totalPages: response.totalPages,
        }
      };
      
      setState(prev => ({
        ...prev,
        expenseList: {
          ...prev.expenseList,
          [params.date]: transformedData,
        },
      }));
    } catch (error) {
      console.error('지출 목록 로드 실패:', error);
    } finally {
      setLoading({ list: false });
    }
  }, [setLoading]);

  // 더보기 로딩 (페이징)
  const loadMoreExpenseList = useCallback(async (date: string) => {
    const currentData = state.expenseList[date];
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
      setLoading({ loadMore: true });
      const response = await expenseService.getExpenseList({ 
        date, 
        page: nextPage - 1, // Spring Pageable은 0부터 시작
        limit: 5
      });
      
      setState(prev => ({
        ...prev,
        expenseList: {
          ...prev.expenseList,
          [date]: {
            data: [...prev.expenseList[date].data, ...response.content],
            pagination: {
              page: response.pageable.pageNumber + 1, // 1부터 시작하도록 변환
              total: response.totalElements,
              totalPages: response.totalPages,
            },
          },
        },
      }));
    } catch (error) {
      console.error('더보기 로딩 실패:', error);
    } finally {
      setLoading({ loadMore: false });
    }
  }, [state.expenseList, setLoading]);

  // 지출 삭제
  const deleteExpense = useCallback(async (id: number, date: string) => {
    try {
      await expenseService.deleteExpense(id, date);
      
      // 로컬 상태에서 삭제된 항목 제거
      setState(prev => ({
        ...prev,
        expenseList: {
          ...prev.expenseList,
          [date]: {
            ...prev.expenseList[date],
            data: prev.expenseList[date]?.data.filter(item => item.id !== id) || [],
            pagination: {
              ...prev.expenseList[date]?.pagination,
              total: (prev.expenseList[date]?.pagination.total || 1) - 1,
            }
          },
        },
      }));
    } catch (error) {
      console.error('지출 삭제 실패:', error);
      throw error;
    }
  }, []);

  // 데이터 새로고침
  const refreshData = useCallback(async (date: string) => {
    await Promise.all([
      loadSummaryData(date),
      loadChartData('daily'),
      loadExpenseList({ date, page: 0, limit: 5 }),
    ]);
  }, [loadSummaryData, loadChartData, loadExpenseList]);

  return {
    ...state,
    loadSummaryData,
    loadChartData,
    loadExpenseList,
    loadMoreExpenseList,
    deleteExpense,
    refreshData,
  };
};