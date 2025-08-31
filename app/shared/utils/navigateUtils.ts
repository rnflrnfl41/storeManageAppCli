import { createNavigationContainerRef } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@types';

// Navigation ref 생성
export const navigationRef = createNavigationContainerRef<AppStackParamList>();

// router 유틸
export const router = {
  navigate(name: keyof AppStackParamList, params?: any) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name as any, params);
    }
  },
  replace(name: keyof AppStackParamList, params?: any) {
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
