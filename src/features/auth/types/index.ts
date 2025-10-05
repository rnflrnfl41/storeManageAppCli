export interface FormState {
  userId: string;
  password: string;
  rememberMe: boolean;
};

export interface FormErrors {
  userId?: string;
  password?: string;
};

export interface LoginRequest {
  loginId: string;
  password: string;
}