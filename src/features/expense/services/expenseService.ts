import { axiosInstance } from '@services/apiClient';
import { ChartDataParams, ListParams } from '../../../shared/types';
import {
  Expense,
  ExpenseListResponse,
} from '../types/expense.types';

class ExpenseService {

  // 지출 등록
  async registerExpense(expenseData: Expense): Promise<void> {
    try {
      await axiosInstance.post('/expense', expenseData);
    } catch (error) {
      console.error('지출 등록 실패:', error);
      throw error;
    }
  }

  // 지출 삭제
  async deleteExpense(id: number, date: string): Promise<void> {
    try {
      await axiosInstance.delete(`/expense/${id}`, {
        params: { date }
      });
    } catch (error) {
      console.error('지출 삭제 실패:', error);
      throw error;
    }
  }

  // 지출 요약 조회
  async getExpenseSummary(date: string): Promise<any> {
    try {
      const response = await axiosInstance.get('/expense/summary/'+date);
      return response.data;
    } catch (error) {
      console.error('지출 요약 조회 실패:', error);
      throw error;
    }
  }

  // 지출 차트 데이터 조회
  async getExpenseChart(params: ChartDataParams): Promise<any> {
    try {
      const response = await axiosInstance.get('/expense/chart', {
        params
      });
      return response.data;
    } catch (error) {
      console.error('지출 차트 조회 실패:', error);
      throw error;
    }
  }

  // 지출 목록 조회 (Spring Pageable 호환)
  async getExpenseList(params: ListParams): Promise<ExpenseListResponse> {
    try {
      const response = await axiosInstance.get('/expense', {
        params: {
          date: params.date,
          page: params.page || 0,  // Spring Pageable은 0부터 시작
          size: params.limit || 20,  // Spring Pageable은 'size' 사용
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('지출 목록 조회 실패:', error);
      throw error;
    }
  }

}

export const expenseService = new ExpenseService();