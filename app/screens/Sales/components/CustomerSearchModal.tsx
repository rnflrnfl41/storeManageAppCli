import React from 'react';
import { Modal, View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import { styles } from '@shared/styles/Sales';
import { useState, useMemo, useEffect } from 'react';
import { Customer, CustomerSearchModalProps } from '@shared/types/salesTypes';
import { axiosInstance } from '@services/apiClient';

const CustomerSearchModal: React.FC<CustomerSearchModalProps> = ({
  visible,
  onSelectCustomer,
  onSelectGuestCustomer,
  onClose,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (visible) {
      fetchCustomers();
    }
  }, [visible]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/customer/all/benefit');
      setCustomers(response.data || []);
    } catch (error) {
      console.log('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return customers.filter(c => c.name.includes(searchText) || c.phone.includes(searchText));
  }, [customers, searchText]);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.searchModal}>
          <View style={styles.searchHeader}>
            <ThemedText style={styles.searchTitle}>고객 검색</ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContent}>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="이름 또는 전화번호로 검색"
              autoFocus
            />

            <ScrollView style={styles.customerList} showsVerticalScrollIndicator={false}>
              {loading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ThemedText>고객 정보를 불러오는 중...</ThemedText>
                </View>
              ) : (
                filtered.map((customer) => (
                  <TouchableOpacity
                    key={customer.id}
                    style={styles.customerItem}
                    onPress={() => onSelectCustomer(customer)}
                  >
                    <View style={styles.customerItemInfo}>
                      <ThemedText style={styles.customerItemName}>{customer.name}</ThemedText>
                      <ThemedText style={styles.customerItemPhone}>{customer.phone}</ThemedText>
                    </View>
                    <View style={styles.customerItemMeta}>
                      <ThemedText style={styles.customerItemPoints}>{customer.points.toLocaleString()}P</ThemedText>
                      <ThemedText style={styles.customerItemCoupons}>쿠폰 {customer.coupons.length}개</ThemedText>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            <View style={styles.guestCustomerSection}>
              <TouchableOpacity 
                style={styles.guestCustomerButton}
                onPress={onSelectGuestCustomer}
              >
                <Ionicons name="person-outline" size={20} color="#6c757d" />
                <ThemedText style={styles.guestCustomerText}>일회성 고객</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomerSearchModal;
