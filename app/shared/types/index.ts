// 공통 타입 정의
export interface UserInfo {
  userId: number;
  loginId: string;
  storeId: number;
  userName: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
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
  Home: undefined;
  Login: undefined;
  Details: { id: string };
  // 필요시 다른 스크린 추가
};
