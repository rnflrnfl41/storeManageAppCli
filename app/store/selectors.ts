import type { RootState } from './index';

// 사용자 정보 관련 selectors
export const selectUserInfo = (state: RootState) => state.auth.userInfo;

// 사용자 정보 세부 selectors
export const selectUserId = (state: RootState) => state.auth.userInfo?.userId;
export const selectLoginId = (state: RootState) => state.auth.userInfo?.loginId;
export const selectStoreId = (state: RootState) => state.auth.userInfo?.storeId;
export const selectUserName = (state: RootState) => state.auth.userInfo?.userName;

// 파생된 상태 selectors
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => false; // 로딩 상태는 컴포넌트에서 관리

// 복합 selectors
export const selectUserDisplayName = (state: RootState) => {
  const userInfo = state.auth.userInfo;
  return userInfo?.userName || userInfo?.loginId || '사용자';
};

// 토큰 유효성은 tokenManager에서 확인해야 함
// 이 selector는 제거하고 필요시 직접 tokenManager.isTokenExpired() 사용
