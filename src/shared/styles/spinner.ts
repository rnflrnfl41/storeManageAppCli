import { StyleSheet } from 'react-native';
import { colors, shadows } from './common';

// GlobalSpinner 스타일
export const globalSpinnerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    width: 120,
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  spinnerOuter: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#667eea',
    borderRightColor: '#764ba2',
  },
});
