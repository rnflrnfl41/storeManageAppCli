import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import { styles } from '@shared/styles/Sales';
import CustomerSearchModal, { CustomerSearchItem } from './CustomerSearchModal';
import { SERVICES } from '@/app/shared/constants';

export interface Coupon {
  id: string;
  name: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
}

export interface CustomerBrief {
  id: string;
  name: string;
  phone: string;
  points: number;
  coupons: Coupon[];
}

interface Props {
  visible: boolean;
  editing?: boolean;
  customers: CustomerBrief[];
  initialCustomer?: CustomerBrief | null | 'guest';
  initialSelectedServices?: ServiceItem[];
  initialServiceAmounts?: { [key: string]: number };
  initialCoupon?: Coupon | null;
  initialUsedPoints?: number;
  initialPaymentMethod?: 'card' | 'cash';
  onClose: () => void;
  onSubmit: (payload: {
    customer: CustomerBrief | null | 'guest';
    services: ServiceItem[];
    serviceAmounts: { [key: string]: number };
    coupon: Coupon | null;
    usedPoints: number;
    paymentMethod: 'card' | 'cash';
    totalAmount: number;
    finalAmount: number;
  }) => void;
}

const SalesRegisterModal: React.FC<Props> = ({
  visible,
  editing,
  customers,
  initialCustomer = null,
  initialSelectedServices = [],
  initialServiceAmounts = {},
  initialCoupon = null,
  initialUsedPoints = 0,
  initialPaymentMethod = 'card',
  onClose,
  onSubmit,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerBrief | null | 'guest'>(initialCustomer);
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>(initialSelectedServices);
  const [serviceAmounts, setServiceAmounts] = useState<{ [key: string]: number }>(initialServiceAmounts);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(initialCoupon);
  const [usedPoints, setUsedPoints] = useState<number>(initialUsedPoints || 0);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>(initialPaymentMethod || 'card');
  const [customerSearchVisible, setCustomerSearchVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setSelectedCustomer(initialCustomer ?? null);
    setSelectedServices(initialSelectedServices ?? []);
    setServiceAmounts(initialServiceAmounts ?? {});
    setSelectedCoupon(initialCoupon ?? null);
    setUsedPoints(initialUsedPoints ?? 0);
    setPaymentMethod(initialPaymentMethod ?? 'card');
  }, [visible]);

  const toggleService = (service: ServiceItem) => {
    setSelectedServices(prev => {
      const exists = prev.some(s => s.id === service.id);
      if (exists) {
        const next = prev.filter(s => s.id !== service.id);
        setServiceAmounts(prevAmt => {
          const copy = { ...prevAmt };
          delete copy[service.id];
          return copy;
        });
        return next;
      }
      setServiceAmounts(prevAmt => ({ ...prevAmt, [service.id]: service.basePrice }));
      return [...prev, service];
    });
  };

  const adjustServiceAmount = (serviceId: string, diff: number) => {
    setServiceAmounts(prev => ({ ...prev, [serviceId]: Math.max(0, (prev[serviceId] || 0) + diff) }));
  };

  const setServiceAmount = (serviceId: string, amount: number) => {
    setServiceAmounts(prev => ({ ...prev, [serviceId]: Math.max(0, amount) }));
  };

  const totalServiceAmount = useMemo(() => {
    return Object.values(serviceAmounts).reduce((sum, v) => sum + v, 0);
  }, [serviceAmounts]);

  const finalAmount = useMemo(() => {
    let discount = 0;
    if (selectedCoupon) {
      discount += selectedCoupon.discountType === 'percent'
        ? Math.floor(totalServiceAmount * (selectedCoupon.discountValue / 100))
        : selectedCoupon.discountValue;
    }
    discount += usedPoints;
    return Math.max(0, totalServiceAmount - discount);
  }, [selectedCoupon, usedPoints, totalServiceAmount]);

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setSelectedCoupon(null);
    setUsedPoints(0);
  };

  const handleSubmit = () => {
    onSubmit({
      customer: selectedCustomer,
      services: selectedServices,
      serviceAmounts,
      coupon: selectedCoupon,
      usedPoints,
      paymentMethod,
      totalAmount: totalServiceAmount,
      finalAmount,
    });
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalScrollView}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>{editing ? '매출 수정' : '매출 등록'}</ThemedText>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>고객 선택</ThemedText>
              <TouchableOpacity style={styles.customerSelectButton} onPress={() => setCustomerSearchVisible(true)}>
                <View style={styles.customerSelectContent}>
                  {selectedCustomer === 'guest' ? (
                    <View style={styles.guestCustomerDisplay}>
                      <Ionicons name="person-outline" size={20} color="#6c757d" />
                      <ThemedText style={styles.guestCustomerText}>일회성 고객</ThemedText>
                    </View>
                  ) : selectedCustomer ? (
                    <>
                      <View style={styles.customerInfo}>
                        <ThemedText style={styles.customerName}>{selectedCustomer.name}</ThemedText>
                        <ThemedText style={styles.customerPhone}>{selectedCustomer.phone}</ThemedText>
                      </View>
                      <View style={styles.customerPoints}>
                        <ThemedText style={styles.pointsText}>{selectedCustomer.points.toLocaleString()}P</ThemedText>
                        <ThemedText style={styles.couponsText}>쿠폰 {selectedCustomer.coupons.length}개</ThemedText>
                      </View>
                    </>
                  ) : (
                    <ThemedText style={styles.placeholderText}>고객을 선택하세요</ThemedText>
                  )}
                </View>
                {selectedCustomer ? (
                  <TouchableOpacity style={styles.customerClearButton} onPress={handleClearCustomer}>
                    <ThemedText style={styles.customerClearText}>취소</ThemedText>
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>서비스 선택</ThemedText>
              <View style={styles.servicesIconGrid}>
                {SERVICES.map((service) => {
                  const isSelected = selectedServices.some((s) => s.id === service.id);
                  return (
                    <TouchableOpacity
                      key={service.id}
                      style={[styles.serviceIconButton, isSelected && styles.selectedServiceIconButton]}
                      onPress={() => toggleService(service)}
                    >
                      <Ionicons name={service.icon as any} size={20} color={isSelected ? '#ffffff' : '#4A90E2'} />
                      <ThemedText style={[styles.serviceIconText, isSelected && styles.selectedServiceIconText]}>
                        {service.name}
                      </ThemedText>
                      {isSelected && (
                        <View style={styles.serviceIconBadge}>
                          <Ionicons name="checkmark" size={12} color="#ffffff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {selectedServices.length > 0 && (
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>금액 조절</ThemedText>
                {selectedServices.map((service) => (
                  <View key={service.id} style={styles.serviceAmountCard}>
                    <View style={styles.serviceAmountHeader}>
                      <View style={styles.serviceAmountInfo}>
                        <Ionicons name={service.icon as any} size={20} color="#4A90E2" />
                        <ThemedText style={styles.serviceAmountName}>{service.name}</ThemedText>
                      </View>
                      <ThemedText style={styles.serviceAmountValue}>
                        {(serviceAmounts[service.id] || service.basePrice).toLocaleString()}원
                      </ThemedText>
                    </View>
                    <View style={styles.amountAdjustContainer}>
                      <TouchableOpacity style={styles.adjustButton} onPress={() => adjustServiceAmount(service.id, -10000)}>
                        <ThemedText style={styles.adjustButtonText}>-10,000</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.adjustButton} onPress={() => adjustServiceAmount(service.id, -1000)}>
                        <ThemedText style={styles.adjustButtonText}>-1,000</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.adjustButton} onPress={() => adjustServiceAmount(service.id, 1000)}>
                        <ThemedText style={styles.adjustButtonText}>+1,000</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.adjustButton} onPress={() => adjustServiceAmount(service.id, 10000)}>
                        <ThemedText style={styles.adjustButtonText}>+10,000</ThemedText>
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      style={styles.amountInput}
                      value={(serviceAmounts[service.id] || service.basePrice).toString()}
                      onChangeText={(text) => setServiceAmount(service.id, parseInt(text) || 0)}
                      placeholder="직접 입력"
                      keyboardType="numeric"
                    />
                  </View>
                ))}
                <View style={styles.totalAmountDisplay}>
                  <ThemedText style={styles.totalAmountLabel}>총 서비스 금액</ThemedText>
                  <ThemedText style={styles.totalAmountValue}>{totalServiceAmount.toLocaleString()}원</ThemedText>
                </View>
              </View>
            )}

            {selectedCustomer && selectedCustomer !== 'guest' && (
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>할인 혜택</ThemedText>

                {selectedCustomer.coupons.length > 0 && (
                  <View style={styles.couponSection}>
                    <ThemedText style={styles.sectionSubtitle}>쿠폰 사용</ThemedText>
                    {selectedCustomer.coupons.map((coupon) => (
                      <TouchableOpacity
                        key={coupon.id}
                        style={[styles.couponItem, selectedCoupon?.id === coupon.id && styles.selectedCouponItem]}
                        onPress={() => setSelectedCoupon(selectedCoupon?.id === coupon.id ? null : coupon)}
                      >
                        <ThemedText style={styles.couponName}>{coupon.name}</ThemedText>
                        <ThemedText style={styles.couponValue}>
                          {coupon.discountType === 'percent'
                            ? `${coupon.discountValue}% 할인`
                            : `${coupon.discountValue.toLocaleString()}원 할인`}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={styles.pointsSection}>
                  <ThemedText style={styles.sectionSubtitle}>
                    포인트 사용 (보유: {selectedCustomer.points.toLocaleString()}P)
                  </ThemedText>
                  <View style={styles.pointsInputContainer}>
                    <TextInput
                      style={styles.pointsInput}
                      value={usedPoints.toString()}
                      onChangeText={(text) => setUsedPoints(parseInt(text) || 0)}
                      placeholder="사용할 포인트"
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={styles.maxPointsButton}
                      onPress={() => setUsedPoints(Math.min(selectedCustomer.points, totalServiceAmount))}
                    >
                      <ThemedText style={styles.maxPointsText}>전체</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>결제 방식</ThemedText>
              <View style={styles.paymentToggle}>
                <TouchableOpacity
                  style={[styles.paymentButton, paymentMethod === 'card' && styles.activePayment]}
                  onPress={() => setPaymentMethod('card')}
                >
                  <ThemedText style={[styles.paymentText, paymentMethod === 'card' && styles.activePaymentText]}>카드</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.paymentButton, paymentMethod === 'cash' && styles.activePayment]}
                  onPress={() => setPaymentMethod('cash')}
                >
                  <ThemedText style={[styles.paymentText, paymentMethod === 'cash' && styles.activePaymentText]}>현금</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {selectedServices.length > 0 && (
              <View style={styles.paymentSummary}>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>서비스 금액</ThemedText>
                  <ThemedText style={styles.summaryValue}>{totalServiceAmount.toLocaleString()}원</ThemedText>
                </View>
                {(selectedCoupon || usedPoints > 0) && (
                  <View style={styles.summaryRow}>
                    <ThemedText style={styles.summaryLabel}>할인</ThemedText>
                    <ThemedText style={styles.discountValue}>- {(totalServiceAmount - finalAmount).toLocaleString()}원</ThemedText>
                  </View>
                )}
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <ThemedText style={styles.totalLabel}>최종 결제</ThemedText>
                  <ThemedText style={styles.totalValue}>{finalAmount.toLocaleString()}원</ThemedText>
                </View>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <ThemedText style={styles.cancelButtonText}>취소</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
                <ThemedText style={styles.confirmButtonText}>{editing ? '수정' : '등록'}</ThemedText>
              </TouchableOpacity>
            </View>
            <CustomerSearchModal
              visible={customerSearchVisible}
              customers={customers as unknown as CustomerSearchItem[]}
              onSelectCustomer={(c) => { setSelectedCustomer(c as unknown as CustomerBrief); setCustomerSearchVisible(false); }}
              onSelectGuestCustomer={() => { setSelectedCustomer('guest'); setCustomerSearchVisible(false); }}
              onClose={() => setCustomerSearchVisible(false)}
            />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SalesRegisterModal;
