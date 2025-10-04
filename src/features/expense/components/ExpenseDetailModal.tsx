import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import { ExpenseDetailModalProps, DEFAULT_EXPENSE_CATEGORIES } from '../types/expense.types';
import { styles } from './ExpenseModalStyles';

const screenWidth = Dimensions.get('window').width;

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({
  visible,
  expense,
  onClose,
  onDelete,
}) => {
  if (!expense) return null;

  const handleDelete = () => {
    onDelete(expense.id);
    onClose();
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.detailModalContent}>
          <View style={styles.detailHeader}>
            <ThemedText style={styles.detailTitle}>지출 상세</ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
            {/* 카테고리 정보 */}
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>카테고리</ThemedText>
              <View style={styles.categoryInfo}>
                {(() => {
                  const category = DEFAULT_EXPENSE_CATEGORIES.find(cat => cat.name === expense.categoryName);
                  return (
                    <>
                      <View style={[styles.categoryIcon, { backgroundColor: category?.color || '#8E8E93' }]}>
                        <Ionicons name={category?.icon as any || 'help-circle'} size={20} color="white" />
                      </View>
                      <ThemedText style={styles.categoryName}>{expense.categoryName}</ThemedText>
                    </>
                  );
                })()}
              </View>
            </View>

            {/* 금액 정보 */}
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>금액</ThemedText>
              <ThemedText style={styles.detailAmount}>
                {formatAmount(expense.amount)}원
              </ThemedText>
            </View>

            {/* 메모 정보 */}
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>메모</ThemedText>
              <ThemedText style={styles.detailValue}>{expense.memo}</ThemedText>
            </View>

            {/* 날짜 정보 */}
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>날짜</ThemedText>
              <ThemedText style={styles.detailValue}>
                {formatDate(expense.expenseDate)}
              </ThemedText>
            </View>

            {/* 삭제 버튼 */}
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <ThemedText style={styles.deleteButtonText}>지출 삭제</ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
