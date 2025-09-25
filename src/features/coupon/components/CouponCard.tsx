import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { CouponCardProps } from '../types';
import { colors, typography, spacing, borderRadius, shadows } from '@shared/styles/common';

export default function CouponCard({ coupon, onDelete, onUse }: CouponCardProps) {
  const isExpired = new Date(coupon.expiryDate) < new Date();
  const isUsed = coupon.used;
  const isActive = !isUsed && !isExpired;

  const getStatusColor = () => {
    if (isUsed) return colors.gray;
    if (isExpired) return colors.error;
    return colors.success;
  };

  const getStatusText = () => {
    if (isUsed) return '사용됨';
    if (isExpired) return '만료됨';
    return '사용가능';
  };

  const getAmountText = () => {
    if (coupon.type === 'percent') {
      return `${coupon.amount}%`;
    }
    return `${coupon.amount.toLocaleString()}원`;
  };

  const handleDelete = () => {
    Alert.alert(
      '쿠폰 삭제',
      '이 쿠폰을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => onDelete(coupon.id),
        },
      ]
    );
  };


  return (
    <View style={[styles.container, !isActive && styles.disabledContainer]}>
      <View style={styles.leftSection}>
        <View style={styles.amountSection}>
          <Text style={[styles.amount, !isActive && styles.disabledText]}>
            {getAmountText()}
          </Text>
          <Text style={[styles.amountLabel, !isActive && styles.disabledText]}>
            할인
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.header}>
          <Text style={[styles.title, !isActive && styles.disabledText]} numberOfLines={1}>
            {coupon.name}
          </Text>
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteButton}
            disabled={isUsed}
          >
            <Text style={[styles.deleteText, isUsed && styles.disabledText]}>
              ×
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.customerInfo}>
          <Text style={[styles.customerName, !isActive && styles.disabledText]}>
            {coupon.customerName}
          </Text>
        </View>

        <View style={styles.dateInfo}>
          {isUsed && coupon.usedDate ? (
            <Text style={[styles.usedDate, styles.disabledText]}>
              사용: {coupon.usedDate}
            </Text>
          ) : (
            <Text style={[styles.expiryDate, !isActive && styles.disabledText]}>
              만료: {coupon.expiryDate}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    ...shadows.small,
    minHeight: 100,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  leftSection: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: spacing.md,
  },
  amountSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  amount: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  amountLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xs,
    marginTop: spacing.sm,
  },
  statusText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
    fontSize: 11,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    ...typography.body1,
    color: colors.error,
    fontWeight: 'bold',
    fontSize: 16,
  },
  customerInfo: {
    marginBottom: spacing.xs,
  },
  customerName: {
    ...typography.body1,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dateInfo: {
    alignItems: 'flex-end',
  },
  usedDate: {
    ...typography.body2,
    color: colors.textDisabled,
    fontWeight: '600',
  },
  expiryDate: {
    ...typography.body2,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  disabledText: {
    color: colors.textDisabled,
  },
});
