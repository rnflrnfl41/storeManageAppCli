import { axiosInstance } from '@services/apiClient';
import {
  Expense,
  ExpenseData,
  ExpenseSummaryResponse,
  ExpenseChartResponse,
  ExpenseListResponse,
  ExpenseListParams,
  ChartDataParams,
} from '../types/expense.types';

class ExpenseService {
  // 지출 등록
  async registerExpense(expenseData: Expense): Promise<void> {
    try {
      await axiosInstance.post('/expenses', expenseData);
    } catch (error) {
      console.error('지출 등록 실패:', error);
      throw error;
    }
  }

  // 지출 삭제
  async deleteExpense(id: number, date: string): Promise<void> {
    try {
      await axiosInstance.delete(`/expenses/${id}`, {
        params: { date }
      });
    } catch (error) {
      console.error('지출 삭제 실패:', error);
      throw error;
    }
  }

  // 지출 요약 조회
  async getExpenseSummary(date: string): Promise<ExpenseSummaryResponse> {
    try {
      const response = await axiosInstance.get('/expenses/summary', {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('지출 요약 조회 실패:', error);
      throw error;
    }
  }

  // 지출 차트 데이터 조회
  async getExpenseChart(params: ChartDataParams): Promise<ExpenseChartResponse> {
    try {
      const response = await axiosInstance.get('/expenses/chart', {
        params
      });
      return response.data;
    } catch (error) {
      console.error('지출 차트 조회 실패:', error);
      throw error;
    }
  }

  // 지출 목록 조회
  async getExpenseList(params: ExpenseListParams): Promise<ExpenseListResponse> {
    try {
      const response = await axiosInstance.get('/expenses', {
        params: {
          date: params.date,
          page: params.page || 1,
          limit: params.limit || 20
        }
      });
      return response.data;
    } catch (error) {
      console.error('지출 목록 조회 실패:', error);
      throw error;
    }
  }

  // 지출 상세 조회
  async getExpenseDetail(id: number): Promise<ExpenseData> {
    try {
      const response = await axiosInstance.get(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      console.error('지출 상세 조회 실패:', error);
      throw error;
    }
  }
}

export const expenseService = new ExpenseService();
