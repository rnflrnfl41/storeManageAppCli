import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo } from '@types';
import { tokenManager } from '@services/tokenManager';

const USER_INFO_KEY = 'userInfo';

/** 저장 */
export const setUserInfo = async (user: UserInfo) => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(USER_INFO_KEY, jsonValue);
  } catch (e) {
    console.error('AsyncStorage setUserInfo error', e);
  }
};

/** 로그아웃 */
export const logout = async () => {
  await AsyncStorage.removeItem(USER_INFO_KEY);
  tokenManager.clearTokens().catch(error => {
    console.error('토큰 삭제 실패:', error);
  });
};
