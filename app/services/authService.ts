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

/** 조회 */
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_INFO_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('AsyncStorage getUserInfo error', e);
    return null;
  }
};

/** 제거 */
export const removeUserInfo = async () => {
  try {
    await AsyncStorage.removeItem(USER_INFO_KEY);
  } catch (e) {
    console.error('AsyncStorage removeUserInfo error', e);
  }
};

/** 로그아웃 */
export const logout = async () => {
  await AsyncStorage.removeItem(USER_INFO_KEY);
  tokenManager.clearTokens().catch(error => {
    console.error('토큰 삭제 실패:', error);
  });
};
