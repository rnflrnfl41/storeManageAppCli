import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import { styles } from '@shared/styles/Sales';
import CustomerSearchModal from './CustomerSearchModal';
import CalendarModal from '@components/CalendarModal';
import { SERVICES } from '@/app/shared/constants';
import { Customer, Coupon, Service, SalesRegisterModalProps } from '@shared/types/salesTypes';

const SalesRegisterModal: React.FC<SalesRegisterModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null | 'guest'>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [serviceAmounts, setServiceAmounts] = useState<{ [key: string]: number }>({});
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [usedPoints, setUsedPoints] = useState<number>(0);
  const [usedPointsText, setUsedPointsText] = useState<string>(''); // 포인트 입력 텍스트 상태
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [customerSearchVisible, setCustomerSearchVisible] = useState(false);
  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().split('T')[0]); // 기본값: 오늘 날짜
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) {
      // 모달이 닫힐 때 초기화
      setSelectedCustomer(null);
      setSelectedServices([]);
      setServiceAmounts({});
      setSelectedCoupon(null);
      setUsedPoints(0);
      setUsedPointsText('');
      setPaymentMethod('card');
      setVisitDate(new Date().toISOString().split('T')[0]); // 오늘 날짜로 초기화
      setCalendarVisible(false);
      setValidationErrors([]);
    }
  }, [visible]);

  const toggleService = (service: Service) => {
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
    
    // 서비스 선택 시 validation 에러 제거
    if (validationErrors.includes('서비스를 하나 이상 선택해주세요')) {
      setValidationErrors(prev => prev.filter(error => error !== '서비스를 하나 이상 선택해주세요'));
    }
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
      discount += selectedCoupon.type === 'percent'
        ? Math.floor(totalServiceAmount * (selectedCoupon.amount / 100))
        : selectedCoupon.amount;
    }
    discount += usedPoints;
    return Math.max(0, totalServiceAmount - discount);
  }, [selectedCoupon, usedPoints, totalServiceAmount]);

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setSelectedCoupon(null);
    setUsedPoints(0);
    setUsedPointsText('');
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // 고객 선택 검증
    if (!selectedCustomer) {
      errors.push('고객을 선택해주세요');
    }

    // 서비스 선택 검증
    if (selectedServices.length === 0) {
      errors.push('서비스를 하나 이상 선택해주세요');
    }

    // 날짜 검증
    if (!visitDate || visitDate.trim() === '') {
      errors.push('방문 날짜를 선택해주세요');
    }

    // 거래 방식은 기본값이 'card'이므로 항상 있음
    // 하지만 명시적으로 검증
    if (!paymentMethod) {
      errors.push('거래 방식을 선택해주세요');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = () => {
    // 폼 검증
    if (!validateForm()) {
      return; // 검증 실패 시 등록 중단
    }

    // 검증 성공 시 등록 진행
    onSubmit({
      customer: selectedCustomer,
      services: selectedServices,
      serviceAmounts,
      coupon: selectedCoupon,
      usedPoints,
      paymentMethod,
      totalAmount: totalServiceAmount,
      finalAmount,
      visitDate,
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
            <ThemedText style={styles.modalTitle}>매출 등록</ThemedText>

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
                    <View style={styles.customerClearIcon}>
                      <Ionicons name="close" size={14} color="#ffffff" />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>방문 날짜</ThemedText>
              <TouchableOpacity style={styles.customerSelectButton} onPress={() => setCalendarVisible(true)}>
                <View style={styles.customerSelectContent}>
                  <Ionicons name="calendar-outline" size={20} color="#4A90E2" />
                  <ThemedText style={[styles.customerName, { marginLeft: 12, fontWeight: 'bold' }]}>{visitDate}</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
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
                          {coupon.type === 'percent'
                            ? `${coupon.amount}% 할인`
                            : `${coupon.amount.toLocaleString()}원 할인`}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={styles.pointsSection}>
                  <ThemedText style={styles.sectionSubtitle}>
                    포인트 사용 (보유: {selectedCustomer.points.toLocaleString()}P)
                  </ThemedText>
                  {usedPoints > selectedCustomer.points && (
                    <ThemedText style={styles.pointsWarningText}>
                      보유 포인트를 초과할 수 없습니다
                    </ThemedText>
                  )}
                  <View style={styles.pointsInputContainer}>
                    <View style={styles.pointsInputWrapper}>
                      <TextInput
                        style={[
                          styles.pointsInput,
                          usedPoints > selectedCustomer.points && styles.pointsInputError
                        ]}
                        value={usedPointsText}
                        onChangeText={(text) => {
                          // 숫자만 입력 허용
                          const numericText = text.replace(/[^0-9]/g, '');
                          setUsedPointsText(numericText);
                          
                          const numValue = parseInt(numericText) || 0;
                          // 보유 포인트를 초과하지 않도록 제한
                          const maxPoints = selectedCustomer.points;
                          const limitedValue = Math.min(numValue, maxPoints);
                          
                          setUsedPoints(limitedValue);
                          
                          // 제한된 값과 입력값이 다르면 텍스트도 업데이트
                          if (limitedValue !== numValue) {
                            setUsedPointsText(limitedValue.toString());
                          }
                        }}
                        onBlur={() => {
                          // 포커스가 벗어날 때 빈 문자열이면 0으로 설정
                          if (usedPointsText === '') {
                            setUsedPoints(0);
                          }
                        }}
                        placeholder="사용할 포인트"
                        keyboardType="numeric"
                      />
                      {usedPointsText !== '' && (
                        <TouchableOpacity
                          style={styles.pointsClearButton}
                          onPress={() => {
                            setUsedPointsText('');
                            setUsedPoints(0);
                          }}
                        >
                          <View style={styles.pointsClearIcon}>
                            <Ionicons name="close" size={14} color="#ffffff" />
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.maxPointsButton}
                      onPress={() => {
                        const maxPoints = Math.min(selectedCustomer.points, totalServiceAmount);
                        setUsedPoints(maxPoints);
                        setUsedPointsText(maxPoints.toString());
                      }}
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

            {/* Validation 에러 메시지 */}
            {validationErrors.length > 0 && (
              <View style={styles.validationErrorContainer}>
                {validationErrors.map((error, index) => (
                  <ThemedText key={index} style={styles.validationErrorText}>
                    • {error}
                  </ThemedText>
                ))}
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <ThemedText style={styles.cancelButtonText}>취소</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
                <ThemedText style={styles.confirmButtonText}>등록</ThemedText>
              </TouchableOpacity>
            </View>
            <CustomerSearchModal
              visible={customerSearchVisible}
              onSelectCustomer={(c) => { 
                setSelectedCustomer(c); 
                setCustomerSearchVisible(false);
                // 고객 선택 시 validation 에러 제거
                if (validationErrors.includes('고객을 선택해주세요')) {
                  setValidationErrors(prev => prev.filter(error => error !== '고객을 선택해주세요'));
                }
              }}
              onSelectGuestCustomer={() => { 
                setSelectedCustomer('guest'); 
                setCustomerSearchVisible(false);
                // 고객 선택 시 validation 에러 제거
                if (validationErrors.includes('고객을 선택해주세요')) {
                  setValidationErrors(prev => prev.filter(error => error !== '고객을 선택해주세요'));
                }
              }}
              onClose={() => setCustomerSearchVisible(false)}
            />
            <CalendarModal
              visible={calendarVisible}
              currentDate={visitDate}
              onClose={() => setCalendarVisible(false)}
              onSelect={(date) => {
                setVisitDate(date);
                setCalendarVisible(false);
                // 날짜 선택 시 validation 에러 제거
                if (validationErrors.includes('방문 날짜를 선택해주세요')) {
                  setValidationErrors(prev => prev.filter(error => error !== '방문 날짜를 선택해주세요'));
                }
              }}
              title="방문 날짜 선택"
            />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SalesRegisterModal;
