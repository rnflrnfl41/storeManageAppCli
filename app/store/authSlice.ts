import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tokenManager } from '@services/tokenManager';

// 토큰을 제외한 사용자 정보만 저장
interface UserInfo {
  userId: string;
  storeId: string;
  userName: string;
  loginId: string;
  // accessToken, refreshToken은 제외
}

interface AuthState {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userInfo: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 로그인 성공 (토큰은 별도로 관리)
    loginSuccess: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
    
    // 로그인 실패
    loginFailure: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
    },
    
    // 로그아웃 (토큰 정리 포함)
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      // Keychain에서 모든 토큰 삭제
      tokenManager.clearTokens().catch(error => {
        console.error('토큰 삭제 실패:', error);
      });
    },
    
    // 사용자 정보 부분 업데이트
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
      }
    },
    
    // 사용자 정보 설정
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { 
  loginSuccess, 
  loginFailure, 
  logout,
  updateUserInfo,
  setUserInfo 
} = authSlice.actions;

export default authSlice.reducer;
