import { StyleSheet } from 'react-native';
import { borderRadius, colors, shadows, spacing } from './common';

// 카드 스타일
export const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  content: {
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  elevated: {
    ...shadows.medium,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    ...shadows.small,
  },
  interactive: {
    ...shadows.small,
  },
  interactivePressed: {
    ...shadows.medium,
    transform: [{ scale: 0.98 }],
  },
});
