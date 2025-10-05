import { StyleSheet } from 'react-native';
import { borderRadius, colors, shadows, spacing } from '@shared/styles/common';

// Login 기본 스타일
export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginHorizontal: spacing.sm,
    ...shadows.large,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 217, 0.1)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: spacing.md,
  },
  form: {
    marginTop: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: -0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.textPrimary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  rememberMeContainer: {
    marginBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.xs,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  rememberMeLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.4,
    elevation: 10,
  },
  loginButtonDisabled: {
    backgroundColor: colors.gray,
    opacity: 0.6,
    shadowOpacity: 0.1,
    elevation: 2,
    transform: [{ scale: 1 }],
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  networkTestButton: {
    backgroundColor: colors.info,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.info,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  networkTestButtonPressed: {
    backgroundColor: colors.darkGray,
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.3,
    elevation: 6,
  },
  networkTestButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});

// 반응형 로그인 스타일 생성 함수
export const createResponsiveLoginStyles = (isTablet: boolean, isLandscape: boolean = false) => ({
  card: {
    ...loginStyles.card,
    ...(isTablet && { 
      maxWidth: isLandscape ? 700 : 600, 
      padding: isLandscape ? 24 : 32, 
      marginHorizontal: isLandscape ? 16 : 16 
    })
  },
  logoContainer: {
    ...loginStyles.logoContainer,
    ...(isTablet && isLandscape && { 
      marginBottom: 20
    })
  },
  logo: {
    ...loginStyles.logo,
    ...(isTablet && { 
      width: isLandscape ? 150 : 200, 
      height: isLandscape ? 150 : 200, 
      marginBottom: isLandscape ? 16 : 24 
    })
  },
  form: {
    ...loginStyles.form,
    ...(isTablet && { 
      marginTop: isLandscape ? 20 : 32
    })
  },
  formGroup: {
    ...loginStyles.formGroup,
    ...(isTablet && { 
      marginBottom: isLandscape ? 20 : 32
    })
  },
  label: {
    ...loginStyles.label,
    ...(isTablet && { 
      fontSize: isLandscape ? 16 : 18, 
      marginBottom: isLandscape ? 12 : 16 
    })
  },
  input: {
    ...loginStyles.input,
    ...(isTablet && { 
      paddingHorizontal: isLandscape ? 20 : 32, 
      paddingVertical: isLandscape ? 16 : 24, 
      fontSize: isLandscape ? 16 : 18 
    })
  },
  errorText: {
    ...loginStyles.errorText,
    ...(isTablet && { 
      fontSize: isLandscape ? 14 : 16, 
      marginTop: isLandscape ? 6 : 8 
    })
  },
  rememberMeContainer: {
    ...loginStyles.rememberMeContainer,
    ...(isTablet && { 
      marginBottom: isLandscape ? 24 : 48
    })
  },
  checkbox: {
    ...loginStyles.checkbox,
    ...(isTablet && { 
      width: isLandscape ? 22 : 26, 
      height: isLandscape ? 22 : 26, 
      marginRight: isLandscape ? 12 : 16 
    })
  },
  checkboxText: {
    ...loginStyles.checkboxText,
    ...(isTablet && { 
      fontSize: isLandscape ? 14 : 16 
    })
  },
  rememberMeLabel: {
    ...loginStyles.rememberMeLabel,
    ...(isTablet && { 
      fontSize: isLandscape ? 15 : 17 
    })
  },
  loginButton: {
    ...loginStyles.loginButton,
    ...(isTablet && { 
      paddingVertical: isLandscape ? 20 : 32, 
      paddingHorizontal: isLandscape ? 20 : 32
    })
  },
  loginButtonPressed: {
    ...loginStyles.loginButtonPressed,
    ...(isTablet && { 
      transform: [{ scale: isLandscape ? 0.97 : 0.98 }]
    })
  },
  loginButtonText: {
    ...loginStyles.loginButtonText,
    ...(isTablet && { 
      fontSize: isLandscape ? 18 : 20 
    })
  },
  networkTestButton: {
    ...loginStyles.networkTestButton,
    ...(isTablet && { 
      paddingVertical: isLandscape ? spacing.md : spacing.md, 
      paddingHorizontal: isLandscape ? spacing.lg : spacing.lg, 
      marginBottom: isLandscape ? spacing.md : spacing.md 
    })
  },
  networkTestButtonPressed: {
    ...loginStyles.networkTestButtonPressed,
    ...(isTablet && { 
      transform: [{ scale: isLandscape ? 0.97 : 0.98 }]
    })
  },
  networkTestButtonText: {
    ...loginStyles.networkTestButtonText,
    ...(isTablet && { 
      fontSize: isLandscape ? 14 : 14 
    })
  }
});
