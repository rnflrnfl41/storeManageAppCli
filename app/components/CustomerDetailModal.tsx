import React from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';

interface ServiceHistory {
  id: string;
  date: string;
  service: string;
  amount: number;
}

interface Coupon {
  id: string;
  name: string;
  amount: number;
  type: 'percent' | 'fixed';
  createdDate: string;
  expiryDate: string;
  isUsed: boolean;
  usedDate?: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
  totalSpent: number;
  visitCount: number;
  points: number;
  coupons: Coupon[];
  serviceHistory: ServiceHistory[];
}

interface CustomerDetailModalProps {
  visible: boolean;
  customer?: Customer;
  onClose: () => void;
}

export default function CustomerDetailModal({ visible, customer, onClose }: CustomerDetailModalProps) {
  const [showAllHistory, setShowAllHistory] = React.useState(false);
  const [showUsedCoupons, setShowUsedCoupons] = React.useState(false);
  
  if (!customer) return null;

  const getServiceIcon = (service: string) => {
    switch (service) {
      case '커트': return 'scissors-outline';
      case '파마': return 'water-outline';
      case '염색': return 'brush-outline';
      default: return 'build-outline';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>고객 정보</ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 기본 정보 */}
            <View style={styles.section}>
              <View style={styles.customerHeader}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={32} color="#007AFF" />
                </View>
                <View style={styles.customerBasicInfo}>
                  <ThemedText style={styles.customerName}>{customer.name}</ThemedText>
                  <ThemedText style={styles.customerPhone}>{customer.phone}</ThemedText>
                </View>
              </View>
            </View>

            {/* 통계 정보 */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>이용 현황</ThemedText>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons name="calendar" size={18} color="#4CAF50" />
                  </View>
                  <View style={styles.statTextContainer}>
                    <ThemedText style={styles.statLabel}>총 방문</ThemedText>
                    <ThemedText style={styles.statValue}>{customer.visitCount}회</ThemedText>
                  </View>
                </View>
                
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons name="card" size={18} color="#2196F3" />
                  </View>
                  <View style={styles.statTextContainer}>
                    <ThemedText style={styles.statLabel}>총 결제</ThemedText>
                    <ThemedText style={styles.statValue}>₩{customer.totalSpent.toLocaleString()}</ThemedText>
                  </View>
                </View>
              </View>
              
              <View style={styles.lastVisitCard}>
                <View style={styles.statIcon}>
                  <Ionicons name="time" size={18} color="#FF9800" />
                </View>
                <View style={styles.statTextContainer}>
                  <ThemedText style={styles.statLabel}>최근 방문일</ThemedText>
                  <ThemedText style={styles.statValue}>{customer.lastVisit}</ThemedText>
                </View>
              </View>
            </View>

            {/* 포인트 */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>포인트</ThemedText>
              <View style={styles.pointCard}>
                <View style={styles.pointIcon}>
                  <Ionicons name="star" size={28} color="#FFD700" />
                </View>
                <View>
                  <ThemedText style={styles.pointValue}>{customer.points}P</ThemedText>
                  <ThemedText style={styles.pointLabel}>사용 가능한 포인트</ThemedText>
                </View>
              </View>
            </View>

            {/* 쿠폰 */}
            <View style={styles.section}>
              {(() => {
                const activeCoupons = customer.coupons.filter(c => !c.isUsed);
                const usedCoupons = customer.coupons.filter(c => c.isUsed);
                const displayCoupons = showUsedCoupons 
                  ? customer.coupons.sort((a, b) => a.isUsed ? 1 : -1)
                  : activeCoupons;
                
                return (
                  <>
                    <View style={styles.couponHeader}>
                      <ThemedText style={styles.sectionTitle}>
                        보유 쿠폰 ({showUsedCoupons ? customer.coupons.length : activeCoupons.length}장)
                      </ThemedText>
                      {usedCoupons.length > 0 && (
                        <TouchableOpacity 
                          style={styles.toggleButton}
                          onPress={() => setShowUsedCoupons(!showUsedCoupons)}
                        >
                          <ThemedText style={styles.toggleButtonText}>
                            {showUsedCoupons ? '사용가능만' : `사용완료 (+${usedCoupons.length})`}
                          </ThemedText>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    {displayCoupons.map((coupon) => (
                      <View key={coupon.id} style={[styles.couponCard, coupon.isUsed && styles.usedCoupon]}>
                        <View style={styles.couponItemHeader}>
                          <ThemedText style={[styles.couponName, coupon.isUsed && styles.usedText]}>
                            {coupon.name}
                          </ThemedText>
                          <View style={[styles.statusBadge, coupon.isUsed ? styles.usedBadge : styles.activeBadge]}>
                            <ThemedText style={[styles.statusText, coupon.isUsed ? styles.usedStatusText : styles.activeStatusText]}>
                              {coupon.isUsed ? '사용완료' : '사용가능'}
                            </ThemedText>
                          </View>
                        </View>
                        <ThemedText style={[styles.couponAmount, coupon.isUsed && styles.usedText]}>
                          {coupon.type === 'percent' ? `${coupon.amount}% 할인` : `${coupon.amount.toLocaleString()}원 할인`}
                        </ThemedText>
                        <View style={styles.couponDetails}>
                          <ThemedText style={styles.couponDate}>생성일: {coupon.createdDate}</ThemedText>
                          {coupon.isUsed && coupon.usedDate ? (
                            <ThemedText style={styles.couponDate}>사용일: {coupon.usedDate}</ThemedText>
                          ) : (
                            <ThemedText style={styles.couponDate}>만료일: {coupon.expiryDate}</ThemedText>
                          )}
                        </View>
                      </View>
                    ))}
                    
                    {customer.coupons.length === 0 && (
                      <View style={styles.emptyCoupons}>
                        <Ionicons name="ticket-outline" size={32} color="#8E8E93" />
                        <ThemedText style={styles.emptyText}>보유한 쿠폰이 없습니다</ThemedText>
                      </View>
                    )}
                  </>
                );
              })()}
            </View>

            {/* 서비스 이력 */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>서비스 이력</ThemedText>
              {(() => {
                const sortedHistory = customer.serviceHistory
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                const displayHistory = showAllHistory ? sortedHistory : sortedHistory.slice(0, 5);
                
                return (
                  <>
                    {displayHistory.map((service) => (
                      <View key={service.id} style={styles.serviceItem}>
                        <View style={styles.serviceIcon}>
                          <Ionicons name={getServiceIcon(service.service)} size={20} color="#007AFF" />
                        </View>
                        <View style={styles.serviceInfo}>
                          <ThemedText style={styles.serviceName}>{service.service}</ThemedText>
                          <ThemedText style={styles.serviceDate}>{service.date}</ThemedText>
                        </View>
                        <ThemedText style={styles.serviceAmount}>₩{service.amount.toLocaleString()}</ThemedText>
                      </View>
                    ))}
                    
                    {sortedHistory.length > 5 && (
                      <TouchableOpacity 
                        style={styles.showMoreButton}
                        onPress={() => setShowAllHistory(!showAllHistory)}
                      >
                        <ThemedText style={styles.showMoreText}>
                          {showAllHistory ? '접기' : `더보기 (+${sortedHistory.length - 5}개)`}
                        </ThemedText>
                        <Ionicons 
                          name={showAllHistory ? 'chevron-up' : 'chevron-down'} 
                          size={16} 
                          color="#007AFF" 
                        />
                      </TouchableOpacity>
                    )}
                  </>
                );
              })()}
              
              {customer.serviceHistory.length === 0 && (
                <View style={styles.emptyHistory}>
                  <Ionicons name="time-outline" size={32} color="#8E8E93" />
                  <ThemedText style={styles.emptyText}>서비스 이력이 없습니다</ThemedText>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '95%',
    maxWidth: 450,
    height: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  customerBasicInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  lastVisitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pointCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE066',
  },
  pointIcon: {
    marginRight: 16,
  },
  pointValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 4,
  },
  pointLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  couponCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  usedCoupon: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  couponItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  toggleButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  couponName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
  },
  couponAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  couponDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  couponDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#E8F5E8',
  },
  usedBadge: {
    backgroundColor: '#F0F0F0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatusText: {
    color: '#4CAF50',
  },
  usedStatusText: {
    color: '#8E8E93',
  },
  usedText: {
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  emptyCoupons: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  serviceDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  serviceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  showMoreText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 4,
  },
});