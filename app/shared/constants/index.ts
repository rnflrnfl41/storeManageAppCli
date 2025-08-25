// 공통 상수 정의

// API 관련
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// 앱 설정
export const APP_CONFIG = {
  APP_NAME: '스토어 관리 앱',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
} as const;

// 페이지네이션
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// 로컬 스토리지 키 (최소한만)
export const STORAGE_KEYS = {
  USER_INFO: 'userInfo',        // 사용자 정보 (토큰 포함)
  REFRESH_TOKEN: 'refreshToken', // refresh token (보안상 필요)
} as const;

// HTTP 상태 코드 (참고용)
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 앱 내부 상태 (네트워크 상태 등)
export const APP_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const DEFAULT_TIMEOUT = 20000;
