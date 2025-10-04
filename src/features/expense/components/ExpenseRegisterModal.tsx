import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import { CustomTextInput } from '@components/CustomTextInput';
import { InlineSpinner } from '@components/InlineSpinner';
import { CalendarModal } from '@components';
import { ExpenseRegisterModalProps, ExpenseCategory, DEFAULT_EXPENSE_CATEGORIES } from '../types/expense.types';
import { styles } from './ExpenseModalStyles';

const screenWidth = Dimensions.get('window').width;

export const ExpenseRegisterModal: React.FC<ExpenseRegisterModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>(DEFAULT_EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);

  // 금액 포맷팅 함수
  const formatAmount = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 금액 증감 함수
  const adjustAmount = (delta: number) => {
    const currentAmount = parseInt(amount.replace(/[^0-9]/g, '') || '0');
    const newAmount = Math.max(0, currentAmount + delta);
    setAmount(newAmount.toString());
  };

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (visible) {
      setSelectedCategory(DEFAULT_EXPENSE_CATEGORIES[0]);
      setAmount('');
      setMemo('');
      setExpenseDate(new Date().toISOString().split('T')[0]);
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!amount.trim()) {
      Alert.alert('오류', '금액을 입력해주세요.');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('오류', '올바른 금액을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        category: selectedCategory,
        amount: amountValue,
        memo: memo.trim(),
        expenseDate,
      });
    } catch (error) {
      console.error('지출 등록 실패:', error);
      Alert.alert('오류', '지출 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = (category: ExpenseCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryItem,
        selectedCategory.id === category.id && styles.selectedCategoryItem,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <Ionicons name={category.icon as any} size={20} color="white" />
      </View>
      <ThemedText style={[
        styles.categoryText,
        selectedCategory.id === category.id && styles.selectedCategoryText,
      ]}>
        {category.name}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* 헤더 */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>지출 등록</ThemedText>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 카테고리 선택 */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>카테고리</ThemedText>
            <View style={styles.categoryGrid}>
              {DEFAULT_EXPENSE_CATEGORIES.map(renderCategoryItem)}
            </View>
          </View>

          {/* 날짜 선택 */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>날짜 *</ThemedText>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setCalendarVisible(true)}
            >
              <View style={styles.dateButtonContent}>
                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                <ThemedText style={styles.dateButtonText}>{expenseDate}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* 금액 입력 */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>금액 *</ThemedText>
            <TextInput
              value={formatAmount(amount)}
              onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setAmount(numericValue);
              }}
              placeholder="금액을 입력하세요"
              keyboardType="numeric"
              style={styles.amountInput}
            />
            
            {/* 금액 증감 버튼 */}
            <View style={styles.amountButtons}>
              <TouchableOpacity
                style={styles.amountButton}
                onPress={() => adjustAmount(-10000)}
              >
                <ThemedText style={styles.amountButtonText}>-10,000</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.amountButton}
                onPress={() => adjustAmount(-1000)}
              >
                <ThemedText style={styles.amountButtonText}>-1,000</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.amountButton}
                onPress={() => adjustAmount(1000)}
              >
                <ThemedText style={styles.amountButtonText}>+1,000</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.amountButton}
                onPress={() => adjustAmount(10000)}
              >
                <ThemedText style={styles.amountButtonText}>+10,000</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* 메모 입력 */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>메모</ThemedText>
            <TextInput
              value={memo}
              onChangeText={setMemo}
              placeholder="지출 내용을 입력하세요 (선택사항)"
              placeholderTextColor="#8E8E93"
              multiline
              style={styles.memoInput}
            />
          </View>
        </ScrollView>

        {/* 하단 고정 버튼 영역 */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={styles.cancelButtonBottom} 
            onPress={onClose} 
            disabled={loading}
          >
            <ThemedText style={styles.cancelButtonText}>취소</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.saveButtonBottom, loading && styles.saveButtonDisabled]} 
            onPress={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <InlineSpinner size="small" color="white" />
            ) : (
              <ThemedText style={styles.saveButtonText}>등록</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <CalendarModal
        visible={calendarVisible}
        currentDate={expenseDate}
        onClose={() => setCalendarVisible(false)}
        onSelect={(dateString: string) => {
          setExpenseDate(dateString);
          setCalendarVisible(false);
        }}
      />
    </Modal>
  );
};
