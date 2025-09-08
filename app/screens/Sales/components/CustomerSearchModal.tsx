import React from 'react';
import { Modal, View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import { styles } from '@shared/styles/Sales';
import { useState, useMemo } from 'react';

export interface CustomerSearchItem {
  id: string;
  name: string;
  phone: string;
  points: number;
  coupons: Array<{ id: string; name: string; discountType: 'percent' | 'fixed'; discountValue: number }>;
}

interface Props {
  visible: boolean;
  customers: CustomerSearchItem[];
  onSelectCustomer: (customer: CustomerSearchItem) => void;
  onSelectGuestCustomer: () => void;
  onClose: () => void;
}

const CustomerSearchModal: React.FC<Props> = ({
  visible,
  customers,
  onSelectCustomer,
  onSelectGuestCustomer,
  onClose,
}) => {
  const [searchText, setSearchText] = useState('');
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
              {filtered.map((customer) => (
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
              ))}
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
