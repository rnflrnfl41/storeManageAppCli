import { createNavigationContainerRef } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 스택 스크린 타입 정의
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Details: { id: string };
  // 필요시 다른 스크린 추가
};

// Navigation ref 생성
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// router 유틸
export const router = {
  navigate(name: keyof RootStackParamList, params?: any) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name as any, params);
    }
  },
  replace(name: keyof RootStackParamList, params?: any) {
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name, params }],
      });
    }
  },
  goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  },
};
