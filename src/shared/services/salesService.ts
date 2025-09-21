import { axiosInstance } from './apiClient';
import { 
  Sales, 
  SalesSummaryResponse, 
  SalesChartResponse, 
  SalesListResponse, 
  SalesListParams, 
  ChartDataParams 
} from '@shared/types/salesTypes';

// 매출 서비스 함수들
export const salesService = {
  // 요약 데이터 조회 (오늘/이번달 매출)
  getSummary: async (date: string): Promise<SalesSummaryResponse> => {
    const response = await axiosInstance.get(`/sales/summary/${date}`);
    return response.data;
  },

  // 차트 데이터 조회
  getChartData: async (params: ChartDataParams): Promise<SalesChartResponse> => {
    const { type, startDate, endDate } = params;
    const response = await axiosInstance.get(
      `/sales/chart?type=${type}&startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  // 매출 목록 조회
  getSalesList: async (params: SalesListParams): Promise<SalesListResponse> => {
    const { date, page = 1, limit = 5 } = params;
    const response = await axiosInstance.get(
      `/sales?date=${date}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // 매출 삭제
  deleteSales: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/sales/${id}`);
  },

  // 매출 등록
  registerSales: async (salesData: Sales): Promise<void> => {
    await axiosInstance.post('/sales/registration', salesData);
  },
};

