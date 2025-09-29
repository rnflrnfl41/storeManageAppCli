import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Coupon, CouponFilter, CouponForm } from '../types';
import { CustomerBasic } from '../../customer/types/customerTypes';
import { couponService } from '../services';
import { axiosInstance } from '@services/apiClient';
import CouponModal from '../components/CouponModal';
import CouponCard from '../components/CouponCard';
import CustomerSelectModal from '../components/CustomerSelectModal';
import { couponStyles as styles } from '../styles';

export default function CouponScreen() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [customers, setCustomers] = useState<CustomerBasic[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerBasic | null>(null);
  const [filter, setFilter] = useState<CouponFilter>({ status: 'all', customerId: 0 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCustomerFilter, setShowCustomerFilter] = useState(false);

  // 통계 계산
  const stats = {
    total: coupons.length,
    active: coupons.filter(c => !c.used && new Date(c.expiryDate) >= new Date()).length,
    used: coupons.filter(c => c.used).length,
    expired: coupons.filter(c => !c.used && new Date(c.expiryDate) < new Date()).length,
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCoupons();
  }, [coupons, filter, selectedCustomer]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 고객 목록 API 호출
      const customersResponse = await axiosInstance.get('/customer/all');
      console.log('고객 목록:', customersResponse.data);
      setCustomers(customersResponse.data);

      const allCoupons = await couponService.getAllCoupons();
      setCoupons(allCoupons);
    } catch (error) {
      Alert.alert('오류', '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filterCoupons = () => {
    let filtered = [...coupons];

    // 고객 필터링
    if (selectedCustomer) {
      filtered = filtered.filter(coupon => coupon.customerId === selectedCustomer.id);
    }

    // 상태 필터링
    switch (filter.status) {
      case 'active':
        filtered = filtered.filter(coupon => 
          !coupon.used && new Date(coupon.expiryDate) >= new Date()
        );
        break;
      case 'used':
        filtered = filtered.filter(coupon => coupon.used);
        break;
      case 'expired':
        filtered = filtered.filter(coupon => 
          !coupon.used && new Date(coupon.expiryDate) < new Date()
        );
        break;
    }

    setFilteredCoupons(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddCoupon = () => {
    setShowCustomerModal(true);
  };

  const handleSaveCoupon = async (couponData: CouponForm) => {
    try {
      console.log(couponData);
      await couponService.createCoupon(couponData);
      await loadData();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      await couponService.deleteCoupon(couponId);
      await loadData();
    } catch (error) {
      Alert.alert('오류', '쿠폰 삭제에 실패했습니다.');
    }
  };


  const handleSelectCustomer = (customer: CustomerBasic | null) => {
    if (customer && customer.id !== 0) {
      setSelectedCustomer(customer);
      setShowCouponModal(true);
    }
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
  };

  const handleCustomerFilter = (customer: CustomerBasic | null) => {
    setSelectedCustomer(customer);
    setShowCustomerFilter(false);
  };

  const renderCoupon = ({ item }: { item: Coupon }) => (
    <CouponCard
      coupon={item}
      onDelete={handleDeleteCoupon}
      onUse={() => {}} // 사용하기 기능 제거됨
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {selectedCustomer 
          ? `${selectedCustomer.name}님의 쿠폰이 없습니다.`
          : '쿠폰이 없습니다.'
        }
      </Text>
      <Text style={styles.emptySubtext}>
        {selectedCustomer 
          ? '새로운 쿠폰을 등록해보세요.'
          : '고객을 선택하고 쿠폰을 등록해보세요.'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>쿠폰 관리</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddCoupon}>
            <Text style={styles.addButtonText}>+ 쿠폰 등록</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={styles.customerFilterButton} 
            onPress={() => setShowCustomerFilter(true)}
          >
            <Text style={styles.customerFilterText}>
              {selectedCustomer ? selectedCustomer.name : '전체 고객'}
            </Text>
            <View style={styles.filterRightSection}>
              {selectedCustomer && (
                <TouchableOpacity onPress={handleClearCustomer} style={styles.clearButton}>
                  <Text style={styles.clearText}>×</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.filterIcon}>▼</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {[
          { key: 'all', label: '전체' },
          { key: 'active', label: '사용가능' },
          { key: 'used', label: '사용됨' },
          { key: 'expired', label: '만료됨' },
        ].map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterButton,
              filter.status === key && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(prev => ({ ...prev, status: key as any }))}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter.status === key && styles.filterButtonTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.activeStat]}>{stats.active}</Text>
          <Text style={styles.statLabel}>사용가능</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.usedStat]}>{stats.used}</Text>
          <Text style={styles.statLabel}>사용됨</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.expiredStat]}>{stats.expired}</Text>
          <Text style={styles.statLabel}>만료됨</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>전체</Text>
        </View>
      </View>

      <View style={styles.content}>
        <FlatList
          data={filteredCoupons}
          keyExtractor={(item) => item.id}
          renderItem={renderCoupon}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      <CouponModal
        visible={showCouponModal && !!selectedCustomer && selectedCustomer.id !== 0}
        customerId={selectedCustomer?.id || 0}
        customerName={selectedCustomer?.name || ''}
        onClose={() => setShowCouponModal(false)}
        onSave={handleSaveCoupon}
      />

      <CustomerSelectModal
        visible={showCustomerModal}
        customers={customers}
        onClose={() => setShowCustomerModal(false)}
        onSelect={handleSelectCustomer}
      />

      <CustomerSelectModal
        visible={showCustomerFilter}
        customers={[{ id: 0, name: '전체 고객', phone: '', lastVisit: null }, ...customers]}
        onClose={() => setShowCustomerFilter(false)}
        onSelect={handleCustomerFilter}
      />
    </SafeAreaView>
  );
}