import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@shared/styles/common';
import { CustomerBasic } from '../../customer/types/customerTypes';

interface CustomerSelectModalProps {
  visible: boolean;
  customers: CustomerBasic[];
  onClose: () => void;
  onSelect: (customer: CustomerBasic | null) => void;
}

export default function CustomerSelectModal({
  visible,
  customers,
  onClose,
  onSelect,
}: CustomerSelectModalProps) {
  const [searchText, setSearchText] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerBasic[]>([]);

  useEffect(() => {
    if (searchText.trim()) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.phone.includes(searchText)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchText, customers]);

  const handleSelect = (customer: CustomerBasic) => {
    if (customer.id === 0) {
      onSelect(null);
    } else {
      onSelect(customer);
    }
    onClose();
  };

  const renderCustomer = ({ item }: { item: CustomerBasic }) => (
    <TouchableOpacity
      style={styles.customerItem}
      onPress={() => handleSelect(item)}
    >
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerPhone}>{item.phone}</Text>
      </View>
      {item.lastVisit && (
        <Text style={styles.lastVisit}>
          마지막 방문: {item.lastVisit}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftSpace} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>고객 선택</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="고객명 또는 전화번호로 검색"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
        </View>

        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCustomer}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchText ? '검색 결과가 없습니다.' : '등록된 고객이 없습니다.'}
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  cancelText: {
    ...typography.h4,
    color: colors.textSecondary,
    fontWeight: '300',
    fontSize: 20,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  leftSpace: {
    width: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  searchContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  searchInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body1,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  list: {
    flex: 1,
  },
  customerItem: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  customerInfo: {
    marginBottom: spacing.xs,
  },
  customerName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  customerPhone: {
    ...typography.body1,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  lastVisit: {
    ...typography.body2,
    color: colors.textSecondary,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    ...typography.h4,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.7,
  },
});
