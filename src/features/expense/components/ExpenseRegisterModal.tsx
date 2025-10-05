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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import { InlineSpinner } from '@components/InlineSpinner';
import { CalendarModal } from '@components';
import { ExpenseRegisterModalProps, ExpenseCategory, DEFAULT_EXPENSE_CATEGORIES } from '../types/expense.types';
import { expenseModalStyles } from '../styles';

const screenWidth = Dimensions.get('window').width;

export const ExpenseRegisterModal: React.FC<ExpenseRegisterModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>(DEFAULT_EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('0');
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
      setAmount('0');
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
        expenseModalStyles.categoryItem,
        selectedCategory.id === category.id && expenseModalStyles.selectedCategoryItem,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <View style={[expenseModalStyles.categoryIcon, { backgroundColor: category.color }]}>
        <Ionicons name={category.icon as any} size={20} color="white" />
      </View>
      <ThemedText style={[
        expenseModalStyles.categoryText,
        selectedCategory.id === category.id && expenseModalStyles.selectedCategoryText,
      ]}>
        {category.name}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={expenseModalStyles.modalOverlay}>
        <View style={expenseModalStyles.modalContainer}>
          {/* 고정 헤더 */}
          <View style={expenseModalStyles.modalHeader}>
            <ThemedText style={expenseModalStyles.modalTitle}>지출 등록</ThemedText>
          </View>
          
          {/* 스크롤 가능한 내용 */}
          <ScrollView 
            style={expenseModalStyles.modalScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={expenseModalStyles.modalScrollContent}
          >
            <View style={expenseModalStyles.modalContent}>
              {/* 카테고리 선택 */}
              <View style={expenseModalStyles.inputContainer}>
                <ThemedText style={expenseModalStyles.inputLabel}>카테고리</ThemedText>
                <View style={expenseModalStyles.categoryGrid}>
                  {DEFAULT_EXPENSE_CATEGORIES.map(renderCategoryItem)}
                </View>
              </View>

              {/* 날짜 선택 */}
              <View style={expenseModalStyles.inputContainer}>
                <ThemedText style={expenseModalStyles.inputLabel}>날짜 *</ThemedText>
                <TouchableOpacity
                  style={expenseModalStyles.customerSelectButton}
                  onPress={() => setCalendarVisible(true)}
                >
                  <View style={expenseModalStyles.customerSelectContent}>
                    <Ionicons name="calendar-outline" size={20} color="#4A90E2" />
                    <ThemedText style={[expenseModalStyles.customerName, { marginLeft: 12, fontWeight: 'bold' }]}>{expenseDate}</ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              {/* 금액 입력 */}
              <View style={expenseModalStyles.inputContainer}>
                <View style={expenseModalStyles.amountCard}>
                  <View style={expenseModalStyles.amountHeader}>
                    <View style={expenseModalStyles.amountInfo}>
                      <Ionicons name="trending-down-outline" size={20} color="#FF3B30" />
                      <ThemedText style={expenseModalStyles.amountLabel}>지출 금액</ThemedText>
                    </View>
                    <ThemedText style={expenseModalStyles.amountValue}>
                      {formatAmount(amount) || '0'}원
                    </ThemedText>
                  </View>
                  <View style={expenseModalStyles.amountAdjustContainer}>
                    <TouchableOpacity style={expenseModalStyles.adjustButton} onPress={() => adjustAmount(-10000)}>
                      <ThemedText style={expenseModalStyles.adjustButtonText}>-10,000</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={expenseModalStyles.adjustButton} onPress={() => adjustAmount(-1000)}>
                      <ThemedText style={expenseModalStyles.adjustButtonText}>-1,000</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={expenseModalStyles.adjustButton} onPress={() => adjustAmount(1000)}>
                      <ThemedText style={expenseModalStyles.adjustButtonText}>+1,000</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={expenseModalStyles.adjustButton} onPress={() => adjustAmount(10000)}>
                      <ThemedText style={expenseModalStyles.adjustButtonText}>+10,000</ThemedText>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={expenseModalStyles.amountInput}
                    value={amount}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      setAmount(numericValue);
                    }}
                    placeholder="직접 입력"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* 메모 입력 */}
              <View style={expenseModalStyles.inputContainer}>
                <ThemedText style={expenseModalStyles.inputLabel}>메모</ThemedText>
                <TextInput
                  value={memo}
                  onChangeText={setMemo}
                  placeholder="지출 내용을 입력하세요 (선택사항)"
                  placeholderTextColor="#8E8E93"
                  multiline
                  style={expenseModalStyles.memoInput}
                />
              </View>
            </View>
          </ScrollView>
          
          {/* 고정 하단 버튼 */}
          <View style={expenseModalStyles.bottomButtonContainer}>
            <TouchableOpacity 
              style={expenseModalStyles.cancelButtonBottom} 
              onPress={onClose} 
              disabled={loading}
            >
              <ThemedText style={expenseModalStyles.cancelButtonText}>취소</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[expenseModalStyles.saveButtonBottom, loading && expenseModalStyles.saveButtonDisabled]} 
              onPress={handleSubmit} 
              disabled={loading}
            >
              {loading ? (
                <InlineSpinner size="small" color="white" />
              ) : (
                <ThemedText style={expenseModalStyles.saveButtonText}>등록</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
