import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { CouponModalProps } from '../types';
import { colors, typography, spacing, borderRadius } from '@shared/styles/common';
import { CustomTextInput } from '@shared/components/CustomTextInput';
import { CalendarModal } from '@shared/components/CalendarModal';

export default function CouponModal({
  visible,
  customerId,
  customerName,
  onClose,
  onSave,
}: CouponModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'fixed' as 'percent' | 'fixed',
    expiryDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (visible) {
      // 모달이 열릴 때 폼 초기화 및 기본 만료일 설정 (오늘 + 3개월)
      const defaultExpiryDate = getDefaultExpiryDate();
      setFormData({
        name: '',
        amount: '',
        type: 'fixed',
        expiryDate: defaultExpiryDate,
      });
    }
  }, [visible]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('오류', '쿠폰명을 입력해주세요.');
      return;
    }

    if (!formData.amount.trim()) {
      Alert.alert('오류', '할인 금액을 입력해주세요.');
      return;
    }

    if (!formData.expiryDate) {
      Alert.alert('오류', '만료일을 선택해주세요.');
      return;
    }

    if (!customerId) {
      Alert.alert('오류', '고객을 선택해주세요.');
      return;
    }

    if (!customerName) {
      Alert.alert('오류', '고객명이 없습니다.');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('오류', '올바른 할인 금액을 입력해주세요.');
      return;
    }

    if (formData.type === 'percent' && amount > 100) {
      Alert.alert('오류', '할인율은 100%를 초과할 수 없습니다.');
      return;
    }

    setLoading(true);
    try {
      const success = await onSave({
        name: formData.name.trim(),
        amount,
        type: formData.type,
        expiryDate: formData.expiryDate,
        customerId,
        customerName,
      });

      if (success) {
        onClose();
      }
    } catch (error) {
      Alert.alert('오류', '쿠폰 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getDefaultExpiryDate = () => {
    const today = new Date();
    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(today.getMonth() + 3);
    return threeMonthsLater.toISOString().split('T')[0];
  };

  const handleDateSelect = (dateString: string) => {
    setFormData(prev => ({ ...prev, expiryDate: dateString }));
    setShowCalendar(false);
  };

  const handleQuickDateSelect = (months: number) => {
    const currentDate = formData.expiryDate ? new Date(formData.expiryDate) : new Date();
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + months);
    setFormData(prev => ({ ...prev, expiryDate: newDate.toISOString().split('T')[0] }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.title}>쿠폰 등록</Text>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, loading && styles.disabledButton]}
            disabled={loading}
          >
            <Text style={styles.saveText}>저장</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {customerName && (
            <View style={styles.customerInfo}>
              <Text style={styles.customerLabel}>고객</Text>
              <Text style={styles.customerName}>{customerName}</Text>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>쿠폰명 *</Text>
            <CustomTextInput
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="쿠폰명을 입력하세요"
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>할인 유형 *</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  formData.type === 'fixed' && styles.typeButtonActive,
                ]}
                onPress={() => setFormData(prev => ({ ...prev, type: 'fixed' }))}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    formData.type === 'fixed' && styles.typeButtonTextActive,
                  ]}
                >
                  정액 할인
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  formData.type === 'percent' && styles.typeButtonActive,
                ]}
                onPress={() => setFormData(prev => ({ ...prev, type: 'percent' }))}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    formData.type === 'percent' && styles.typeButtonTextActive,
                  ]}
                >
                  퍼센트 할인
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              할인 {formData.type === 'fixed' ? '금액' : '율'} *
            </Text>
            <View style={styles.amountContainer}>
              <CustomTextInput
                value={formData.amount}
                onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                placeholder={formData.type === 'fixed' ? '0' : '0'}
                keyboardType="numeric"
                style={styles.amountInput}
              />
              <Text style={styles.amountUnit}>
                {formData.type === 'fixed' ? '원' : '%'}
              </Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>만료일 *</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowCalendar(true)}
            >
              <Text style={[
                styles.dateInputText,
                !formData.expiryDate && styles.dateInputPlaceholder
              ]}>
                {formData.expiryDate ? formatDate(formData.expiryDate) : '날짜를 선택하세요'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.quickDateContainer}>
              <View style={styles.quickDateButtons}>
                <TouchableOpacity
                  style={styles.quickDateButton}
                  onPress={() => handleQuickDateSelect(-3)}
                >
                  <Text style={styles.quickDateButtonText}>-3개월</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDateButton}
                  onPress={() => handleQuickDateSelect(-1)}
                >
                  <Text style={styles.quickDateButtonText}>-1개월</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDateButton}
                  onPress={() => handleQuickDateSelect(1)}
                >
                  <Text style={styles.quickDateButtonText}>+1개월</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDateButton}
                  onPress={() => handleQuickDateSelect(3)}
                >
                  <Text style={styles.quickDateButtonText}>+3개월</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <CalendarModal
        visible={showCalendar}
        currentDate={formData.expiryDate || getTodayDate()}
        onClose={() => setShowCalendar(false)}
        onSelect={handleDateSelect}
        title="만료일 선택"
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  cancelButton: {
    padding: spacing.sm,
  },
  cancelText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  saveButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  disabledButton: {
    backgroundColor: colors.gray,
  },
  saveText: {
    ...typography.body1,
    color: colors.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  customerInfo: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  customerLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  customerName: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body1,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.sm,
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 0,
    ...typography.body1,
  },
  amountUnit: {
    ...typography.body1,
    color: colors.textSecondary,
    paddingRight: spacing.md,
  },
  dateInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  dateInputText: {
    ...typography.body1,
    color: colors.textPrimary,
  },
  dateInputPlaceholder: {
    color: colors.textSecondary,
  },
  quickDateContainer: {
    marginTop: spacing.sm,
  },
  quickDateButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  quickDateButton: {
    flex: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  quickDateButtonText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
