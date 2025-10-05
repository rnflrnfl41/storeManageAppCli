// 공통 타입 정의
export interface UserInfo {
  userId: number;
  loginId: string;
  storeId: number;
  userName: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Details: { id: string };
  // 필요시 다른 스크린 추가
};

export type AppStackParamList = {
  Login: undefined;
  Main: undefined;
  Details: { id: string };
  // 필요시 다른 스크린 추가
};

export type TabParamList = {
  Home: undefined;
  Sales: undefined;
  Expense: undefined;
  Customer: undefined;
  Coupon: undefined;
};

// 공통 로딩 상태 타입
export interface LoadingState {
  summary: boolean;
  chart: boolean;
  list: boolean;
  loadMore: boolean;
}

// 공통 차트 데이터 파라미터 타입
export interface ChartDataParams {
  type: 'daily' | 'monthly';
  startDate: string;
  endDate: string;
}

// 공통 차트 응답 타입
export interface ChartResponse {
  data: number[];
  dates: string[];
  counts: number[];
}

// 공통 요약 응답 타입
export interface SummaryResponse {
  today: {
    amount: number;
    count: number;
  };
  month: {
    amount: number;
    count: number;
  };
}

// 공통 리스트 파라미터 타입
export interface ListParams {
  date: string;
  page?: number;
  limit?: number;
}