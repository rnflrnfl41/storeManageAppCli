import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from '@utils/navigateUtils';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  // TextInput,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';

import { LoadingDots } from '@components';
import { useOrientation } from '@hooks/useOrientation';
import { publicAxiosInstance } from '@services/apiClient';
import { tokenManager } from '@services/tokenManager';
import type { LoginRequest } from '@shared/types';
import { createResponsiveLoginStyles, loginStyles } from '@styles';
import { setUserInfo } from '@services/authService';
import { TextInput } from '@components/CustomTextInput';

const { width } = Dimensions.get('window');

type FormState = {
  userId: string;
  password: string;
  rememberMe: boolean;
};

type FormErrors = {
  userId?: string;
  password?: string;
};

export default function Login() {

  useEffect(() => {
    // 저장된 로그인 ID 불러오기
    loadRememberedLoginId();
    // 자동 로그인 시도
    tokenCheckLogin();
  }, []);

  const [formState, setFormState] = useState<FormState>({
    userId: '',
    password: '',
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // 저장된 로그인 ID 불러오기
  const loadRememberedLoginId = async () => {
    try {
      const savedLoginId = await AsyncStorage.getItem('rememberedLoginId');
      if (savedLoginId) {
        setFormState(s => ({ ...s, userId: savedLoginId, rememberMe: true }));
      }
    } catch (error) {
      console.log('저장된 로그인 ID 불러오기 실패:', error);
    }
  };

  //만약 저장된 refresh token 이 존재 하고 유효 하다면 메인 페이지로 이동
  const tokenCheckLogin = async () => {
    try {
      const refreshToken = await tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        console.log('저장된 refresh token이 없습니다.');
        return;
      }

      const response = await publicAxiosInstance.post(
        "/auth/user/refresh-token",
        { refreshToken }
      );

      const responseData = response.data;

      // 새로운 토큰들을 저장
      await tokenManager.saveAccessToken(responseData.accessToken);
      await tokenManager.saveRefreshToken(responseData.refreshToken);

      // 사용자 정보 저장 (토큰 제외)
      const { accessToken, refreshToken: newRefreshToken, ...userInfo } = responseData;
      await setUserInfo(userInfo);

      // 메인 페이지로 이동
      router.replace('Home');
      
    } catch (error: any) {
      console.log('자동 로그인 실패:', error.message || error);
      // 토큰이 만료되었거나 유효하지 않은 경우 토큰 삭제
      await tokenManager.clearTokens();
    }
  };

  // 에러 메시지 초기화
  const clearErrors = () => {
    setFormErrors({});
  };

  // 유효성 검사 함수
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // 아이디 검증
    if (!formState.userId.trim()) {
      errors.userId = '아이디를 입력해주세요.';
    }

    // 비밀번호 검증
    if (!formState.password) {
      errors.password = '비밀번호를 입력해주세요.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    // 에러 초기화
    clearErrors();

    // 유효성 검사
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const requestData: LoginRequest = {
      loginId: formState.userId.trim(),
      password: formState.password,
    };

    try {
      const response = await publicAxiosInstance.post('/auth/user/login', requestData);
      const responseData = response.data;

      // 토큰을 Keychain에 암호화해서 저장
      await tokenManager.saveAccessToken(responseData.accessToken);
      await tokenManager.saveRefreshToken(responseData.refreshToken);

      // userInfo에서 토큰을 제외한 정보만 저장
      const { accessToken, refreshToken, ...userInfo } = responseData;
      setUserInfo(userInfo);

      // 아이디 기억하기 처리
      if (formState.rememberMe) {
        await AsyncStorage.setItem('rememberedLoginId', formState.userId.trim());
      } else {
        await AsyncStorage.removeItem('rememberedLoginId');
      }

      // 메인 페이지로 이동
      router.replace('Home');
    } catch (error: any) {
      console.log('로그인 실패:', error);
      // 에러 메시지는 axiosInstance에서 자동으로 처리됨
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));

    // 입력 시 해당 필드 에러 메시지 제거
    if (field === 'userId' && formErrors.userId) {
      setFormErrors(prev => ({ ...prev, userId: undefined }));
    }
    if (field === 'password' && formErrors.password) {
      setFormErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  // 현재 디바이스에 맞는 스타일 선택
  const isTabletDevice = width >= 768; // 태블릿 기준 너비

  // 방향 감지
  const { isLandscape } = useOrientation();

  // 반응형 스타일 생성 (useMemo로 최적화)
  const styles = useMemo(() =>
    createResponsiveLoginStyles(isTabletDevice, isLandscape),
    [isTabletDevice, isLandscape]
  );

  return (
    <KeyboardAvoidingView
      style={loginStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={loginStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* 로고 */}
          <View style={styles.logoContainer}>
            <Image
              source={require('@assets/haircity-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* 로그인 폼 */}
          <View style={styles.form}>
            {/* 아이디 입력 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>아이디</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.userId && loginStyles.inputError
                ]}
                placeholder="아이디를 입력하세요"
                value={formState.userId}
                onChangeText={(value) => handleChange('userId', value)}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {formErrors.userId && (
                <Text style={styles.errorText}>{formErrors.userId}</Text>
              )}
            </View>

            {/* 비밀번호 입력 */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={[
                  styles.input,
                  formErrors.password && loginStyles.inputError
                ]}
                placeholder="비밀번호를 입력하세요"
                value={formState.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
                editable={!isLoading}
              />
              {formErrors.password && (
                <Text style={styles.errorText}>{formErrors.password}</Text>
              )}
            </View>

            {/* 아이디 기억하기 */}
            <View style={styles.rememberMeContainer}>
              <Pressable
                style={loginStyles.checkboxContainer}
                onPress={() => handleChange('rememberMe', !formState.rememberMe)}
                disabled={isLoading}
              >
                <View style={[
                  styles.checkbox,
                  formState.rememberMe && loginStyles.checkboxChecked
                ]}>
                  {formState.rememberMe && (
                    <Text style={styles.checkboxText}>✓</Text>
                  )}
                </View>
                <Text style={styles.rememberMeLabel}>아이디 기억하기</Text>
              </Pressable>
            </View>

            {/* 로그인 버튼 */}
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
                isLoading && loginStyles.loginButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingDots
                  size="medium"
                  color="#ffffff"
                />
              ) : (
                <Text style={styles.loginButtonText}>
                  로그인
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
