import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import CustomerModal from '@components/CustomerModal';
import CustomerDetailModal from '@components/CustomerDetailModal';
import { TextInput } from '@components/CustomTextInput';
import { axiosInstance } from '@services/apiClient';
import { showSuccess, showError, showConfirm } from '@shared/utils/alertUtils';
import { CustomerBasic } from '@shared/types/customerTypes';

export default function CustomerScreen() {
  const [customers, setCustomers] = useState<CustomerBasic[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerBasic | undefined>();
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerBasic | undefined>();

  const filteredCustomers = customers
    .filter(customer => customer.name.includes(searchText) || customer.phone.includes(searchText))
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/customer/all');
      setCustomers(response.data.sort((a: CustomerBasic, b: CustomerBasic) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('고객 목록 조회 실패:', error);
    }
  };

  // customer 생성 or 수정
  const handleSaveCustomer = async (customerData: CustomerBasic): Promise<boolean> => {
    try {
      const requestData = { name: customerData.name, phone: customerData.phone };
      const response = editingCustomer 
        ? await axiosInstance.put(`/customer/${customerData.id}`, requestData)
        : await axiosInstance.post('/customer', requestData);

      if (response.status === 200 || response.status === 201) {
        if (editingCustomer) {
          setCustomers(prev => prev.map(c => c.id === customerData.id ? { ...editingCustomer, ...customerData } : c).sort((a, b) => a.name.localeCompare(b.name)));
        } else {
          showSuccess("고객 등록 완료");
          setCustomers(prev => [...prev, response.data].sort((a, b) => a.name.localeCompare(b.name)));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(undefined);
    setModalVisible(true);
  };

  const handleEditCustomer = (customer: CustomerBasic) => {
    setEditingCustomer(customer);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCustomer(undefined);
  };

  const handleCustomerPress = (customer: CustomerBasic) => {
    setSelectedCustomer(customer);
    setDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedCustomer(undefined);
  };

  const deleteCustomer = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/customer/${id}`);
      if (response.status === 200 || response.status === 204) {
        setCustomers(prev => prev.filter(customer => customer.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    const confirmed = await showConfirm('정말 삭제하시겠습니까?', {
      title: '고객 삭제',
      confirmButtonText: '삭제',
      denyButtonText: '취소'
    });
    
    if (confirmed) {
      await deleteCustomer(id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>고객관리</ThemedText>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddCustomer}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* 검색바 */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="고객명 또는 전화번호 검색"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>



      {/* 고객 목록 */}
      <ScrollView
        style={styles.customerList}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredCustomers.map((customer) => (
          <TouchableOpacity
            key={customer.id}
            style={styles.customerCard}
            onPress={() => handleCustomerPress(customer)}
          >
            <View style={styles.customerInfo}>
              <ThemedText style={styles.customerName}>{customer.name}</ThemedText>
              <ThemedText style={styles.customerPhone}>{customer.phone}</ThemedText>
              <ThemedText style={styles.lastVisit}>
                최근 방문: {customer.lastVisit || '방문 이력 없음'}
              </ThemedText>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditCustomer(customer)}
              >
                <Ionicons name="create-outline" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCustomer(customer.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredCustomers.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#8E8E93" />
            <ThemedText style={styles.emptyText}>
              {searchText ? '검색 결과가 없습니다' : '등록된 고객이 없습니다'}
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <CustomerModal
        visible={modalVisible}
        customer={editingCustomer}
        onClose={handleCloseModal}
        onSave={handleSaveCustomer}
      />

      <CustomerDetailModal
        visible={detailModalVisible}
        customer={selectedCustomer}
        onClose={handleCloseDetailModal}
      />


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },

  customerList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  customerCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  lastVisit: {
    fontSize: 14,
    color: '#8E8E93',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
  },
  scrollContent: {
    paddingBottom: 120,
  },
});