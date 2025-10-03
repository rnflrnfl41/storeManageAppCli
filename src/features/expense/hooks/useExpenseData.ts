import { useState, useCallback } from 'react';
import { expenseService } from '../services';
import {
  ExpenseDataState,
  LoadingState,
  ExpenseSummaryResponse,
  ExpenseChartResponse,
  ExpenseListResponse,
  ChartDataParams,
  ExpenseListParams,
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
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      
      if (type === 'daily') {
        startDate.setDate(startDate.getDate() - 30); // 최근 30일
      } else {
        startDate.setMonth(startDate.getMonth() - 12); // 최근 12개월
      }
      
      const params: ChartDataParams = {
        type,
        startDate: startDate.toISOString().split('T')[0],
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

  // 지출 목록 로드
  const loadExpenseList = useCallback(async (
    date: string,
    page: number = 1,
    forceRefresh: boolean = false
  ) => {
    if (forceRefresh) {
      setLoading({ list: true });
    } else {
      setLoading({ loadMore: true });
    }

    try {
      const params: ExpenseListParams = {
        date,
        page,
        limit: 20,
      };
      
      const response = await expenseService.getExpenseList(params);
      
      setState(prev => ({
        ...prev,
        expenseList: {
          ...prev.expenseList,
          [date]: {
            data: page === 1 ? response.expenses : [
              ...(prev.expenseList[date]?.data || []),
              ...response.expenses,
            ],
            pagination: response.pagination,
          },
        },
      }));
    } catch (error) {
      console.error('지출 목록 로드 실패:', error);
    } finally {
      setLoading({ list: false, loadMore: false });
    }
  }, [setLoading]);

  // 더보기 로드
  const loadMoreExpenseList = useCallback(async (date: string) => {
    const currentData = state.expenseList[date];
    if (!currentData) return;
    
    const nextPage = currentData.pagination.page + 1;
    await loadExpenseList(date, nextPage);
  }, [state.expenseList, loadExpenseList]);

  // 지출 삭제
  const deleteExpense = useCallback(async (id: number, date: string) => {
    try {
      await expenseService.deleteExpense(id, date);
      
      // 해당 날짜의 목록에서 삭제된 항목 제거
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
            },
          },
        },
      }));
      
      // 요약 데이터 새로고침
      await loadSummaryData(date);
    } catch (error) {
      console.error('지출 삭제 실패:', error);
      throw error;
    }
  }, [loadSummaryData]);

  return {
    summary: state.summary,
    chart: state.chart,
    expenseList: state.expenseList,
    loading: state.loading,
    loadSummaryData,
    loadChartData,
    loadExpenseList,
    loadMoreExpenseList,
    deleteExpense,
  };
};
