import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import { styles } from '@shared/styles/Sales';
import { SalesData, SalesDetailModalProps } from '@shared/types/salesTypes';

const SalesDetailModal: React.FC<SalesDetailModalProps> = ({ visible, sale, onClose, onDelete }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.detailModalContent}>
          <View style={styles.detailHeader}>
            <ThemedText style={styles.detailTitle}>매출 상세</ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {sale && (
            <View style={styles.detailContent}>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>서비스</ThemedText>
                <ThemedText style={styles.detailValue}>{sale.memo}</ThemedText>
              </View>

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>원래 금액</ThemedText>
                <ThemedText style={styles.detailValue}>{sale.originalAmount.toLocaleString()}원</ThemedText>
              </View>

              {sale.discountAmount > 0 && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>할인 금액</ThemedText>
                  <ThemedText style={styles.discountAmount}>-{sale.discountAmount.toLocaleString()}원</ThemedText>
                </View>
              )}

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>최종 결제</ThemedText>
                <ThemedText style={styles.detailAmount}>{sale.finalAmount.toLocaleString()}원</ThemedText>
              </View>

              {sale.usedCoupon && sale.usedCoupon.discountAmount > 0 && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>사용 쿠폰</ThemedText>
                  <View style={styles.couponInfo}>
                    <ThemedText style={styles.couponName}>{sale.usedCoupon.name}</ThemedText>
                    <ThemedText style={styles.couponDiscount}>-{sale.usedCoupon.discountAmount.toLocaleString()}원</ThemedText>
                  </View>
                </View>
              )}

              {sale.usedPoints && sale.usedPoints > 0 && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>사용 포인트</ThemedText>
                  <ThemedText style={styles.pointsUsed}>{sale.usedPoints.toLocaleString()}P</ThemedText>
                </View>
              )}

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>결제 방식</ThemedText>
                <View style={styles.paymentBadge}>
                  <Ionicons
                    name={sale.paymentMethod === 'card' ? 'card' : 'cash'}
                    size={16}
                    color={sale.paymentMethod === 'card' ? '#007AFF' : '#34C759'}
                  />
                  <ThemedText
                    style={[
                      styles.paymentBadgeText,
                      { color: sale.paymentMethod === 'card' ? '#007AFF' : '#34C759' },
                    ]}
                  >
                    {sale.paymentMethod === 'card' ? '카드' : '현금'}
                  </ThemedText>
                </View>
              </View>

              {sale.customerName && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>고객명</ThemedText>
                  <ThemedText style={styles.detailValue}>{sale.customerName}</ThemedText>
                </View>
              )}

              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>일시</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {sale.date} {sale.time}
                </ThemedText>
              </View>

              <View style={styles.detailActions}>
                <TouchableOpacity
                  style={[styles.detailDeleteButton, { flex: 1 }]}
                  onPress={() => sale && onDelete(sale.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  <ThemedText style={styles.detailDeleteText}>삭제</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export { SalesDetailModal };


