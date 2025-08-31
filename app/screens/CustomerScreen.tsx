import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import CustomerModal from '@components/CustomerModal';
import CustomerDetailModal from '@components/CustomerDetailModal';
import { TextInput } from '@components/CustomTextInput';

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

export default function CustomerScreen() {
  const [customers, setCustomers] = useState<Customer[]>([
    { 
      id: '1', 
      name: '김영희', 
      phone: '010-1234-5678', 
      lastVisit: '2024-01-15',
      totalSpent: 185000,
      visitCount: 12,
      points: 1850,
      coupons: [
        { id: 'c1', name: '신규고객 할인', amount: 10000, type: 'fixed', createdDate: '2024-01-01', expiryDate: '2024-03-01', isUsed: false },
        { id: 'c2', name: '생일 축하 쿠폰', amount: 20, type: 'percent', createdDate: '2023-12-15', expiryDate: '2024-02-15', isUsed: true, usedDate: '2024-01-12' },
        { id: 'c3', name: 'VIP 할인', amount: 15000, type: 'fixed', createdDate: '2024-01-10', expiryDate: '2024-04-10', isUsed: false },
      ],
      serviceHistory: [
        { id: '1', date: '2024-01-15', service: '커트', amount: 25000 },
        { id: '2', date: '2024-01-10', service: '파마', amount: 80000 },
        { id: '3', date: '2023-12-28', service: '염색', amount: 60000 },
        { id: '4', date: '2023-12-15', service: '커트', amount: 20000 },
      ]
    },
    { 
      id: '2', 
      name: '이지은', 
      phone: '010-9876-5432', 
      lastVisit: '2024-01-12',
      totalSpent: 320000,
      visitCount: 15,
      points: 3200,
      coupons: [
        { id: 'c4', name: '상시 고객 할인', amount: 25, type: 'percent', createdDate: '2024-01-05', expiryDate: '2024-04-05', isUsed: false },
        { id: 'c5', name: '연말 이벤트', amount: 30000, type: 'fixed', createdDate: '2023-12-20', expiryDate: '2024-02-20', isUsed: false },
      ],
      serviceHistory: [
        { id: '5', date: '2024-01-12', service: '염색', amount: 90000 },
        { id: '6', date: '2024-01-05', service: '커트', amount: 25000 },
        { id: '7', date: '2023-12-20', service: '파마', amount: 85000 },
        { id: '8', date: '2023-12-10', service: '커트', amount: 20000 },
        { id: '9', date: '2023-11-25', service: '기타', amount: 30000 },
        { id: '10', date: '2023-11-15', service: '염색', amount: 70000 },
      ]
    },
    {
      id: '3',
      name: '박민수',
      phone: '010-5555-1234',
      lastVisit: '2024-01-08',
      totalSpent: 95000,
      visitCount: 6,
      points: 950,
      coupons: [
        { id: 'c6', name: '첫 방문 할인', amount: 5000, type: 'fixed', createdDate: '2024-01-08', expiryDate: '2024-03-08', isUsed: false },
      ],
      serviceHistory: [
        { id: '11', date: '2024-01-08', service: '커트', amount: 22000 },
        { id: '12', date: '2023-12-22', service: '파마', amount: 73000 },
      ]
    },
    {
      id: '4',
      name: '정수진',
      phone: '010-7777-9999',
      lastVisit: '2024-01-14',
      totalSpent: 450000,
      visitCount: 22,
      points: 4500,
      coupons: [
        { id: 'c7', name: 'VIP 전용 쿠폰', amount: 30, type: 'percent', createdDate: '2024-01-01', expiryDate: '2024-06-01', isUsed: false },
        { id: 'c8', name: '연말 이벤트', amount: 50000, type: 'fixed', createdDate: '2023-12-25', expiryDate: '2024-03-25', isUsed: true, usedDate: '2024-01-08' },
        { id: 'c9', name: '생일 축하', amount: 15, type: 'percent', createdDate: '2023-11-20', expiryDate: '2024-02-20', isUsed: false },
      ],
      serviceHistory: [
        { id: '13', date: '2024-01-14', service: '염색', amount: 95000 },
        { id: '14', date: '2024-01-07', service: '커트', amount: 25000 },
        { id: '15', date: '2023-12-30', service: '파마', amount: 90000 },
        { id: '16', date: '2023-12-18', service: '커트', amount: 25000 },
        { id: '17', date: '2023-12-05', service: '염색', amount: 85000 },
        { id: '18', date: '2023-11-28', service: '기타', amount: 35000 },
        { id: '19', date: '2023-11-20', service: '커트', amount: 20000 },
        { id: '20', date: '2023-11-10', service: '파마', amount: 75000 },
      ]
    },
    {
      id: '5',
      name: '최예린',
      phone: '010-3333-4444',
      lastVisit: '2024-01-11',
      totalSpent: 65000,
      visitCount: 4,
      points: 650,
      coupons: [
        { id: 'c10', name: '신규고객 할인', amount: 10000, type: 'fixed', createdDate: '2024-01-11', expiryDate: '2024-04-11', isUsed: false },
      ],
      serviceHistory: [
        { id: '21', date: '2024-01-11', service: '커트', amount: 23000 },
        { id: '22', date: '2023-12-25', service: '염색', amount: 42000 },
      ]
    },
    {
      id: '6',
      name: '강동원',
      phone: '010-8888-2222',
      lastVisit: '2024-01-09',
      totalSpent: 0,
      visitCount: 0,
      points: 0,
      coupons: [],
      serviceHistory: []
    },
    {
      id: '7',
      name: '송혜교',
      phone: '010-1111-3333',
      lastVisit: '2024-01-13',
      totalSpent: 280000,
      visitCount: 18,
      points: 2800,
      coupons: [
        { id: 'c11', name: '상시 고객 할인', amount: 20, type: 'percent', createdDate: '2024-01-01', expiryDate: '2024-04-01', isUsed: false },
        { id: 'c12', name: '월간 이벤트', amount: 25000, type: 'fixed', createdDate: '2023-12-01', expiryDate: '2024-03-01', isUsed: true, usedDate: '2024-01-05' },
      ],
      serviceHistory: [
        { id: '23', date: '2024-01-13', service: '파마', amount: 85000 },
        { id: '24', date: '2024-01-05', service: '커트', amount: 22000 },
        { id: '25', date: '2023-12-28', service: '염색', amount: 75000 },
        { id: '26', date: '2023-12-15', service: '커트', amount: 20000 },
        { id: '27', date: '2023-12-01', service: '기타', amount: 28000 },
      ]
    },
    {
      id: '8',
      name: '조민준',
      phone: '010-4444-7777',
      lastVisit: '2024-01-16',
      totalSpent: 150000,
      visitCount: 9,
      points: 1500,
      coupons: [
        { id: 'c13', name: '신규고객 할인', amount: 15000, type: 'fixed', createdDate: '2024-01-16', expiryDate: '2024-04-16', isUsed: false },
      ],
      serviceHistory: [
        { id: '28', date: '2024-01-16', service: '커트', amount: 24000 },
        { id: '29', date: '2024-01-02', service: '염색', amount: 65000 },
        { id: '30', date: '2023-12-18', service: '파마', amount: 61000 },
      ]
    },
    {
      id: '9',
      name: '한지우',
      phone: '010-6666-9999',
      lastVisit: '2024-01-10',
      totalSpent: 420000,
      visitCount: 25,
      points: 4200,
      coupons: [
        { id: 'c14', name: 'VIP 전용 쿠폰', amount: 35, type: 'percent', createdDate: '2023-12-01', expiryDate: '2024-06-01', isUsed: false },
        { id: 'c15', name: '생일 축하', amount: 40000, type: 'fixed', createdDate: '2023-11-15', expiryDate: '2024-02-15', isUsed: false },
        { id: 'c16', name: '연말 이벤트', amount: 25, type: 'percent', createdDate: '2023-12-20', expiryDate: '2024-03-20', isUsed: true, usedDate: '2024-01-03' },
      ],
      serviceHistory: [
        { id: '31', date: '2024-01-10', service: '염색', amount: 95000 },
        { id: '32', date: '2024-01-03', service: '파마', amount: 88000 },
        { id: '33', date: '2023-12-20', service: '커트', amount: 25000 },
        { id: '34', date: '2023-12-10', service: '염색', amount: 82000 },
        { id: '35', date: '2023-11-28', service: '기타', amount: 45000 },
        { id: '36', date: '2023-11-15', service: '파마', amount: 85000 },
      ]
    },
    {
      id: '10',
      name: '이수진',
      phone: '010-2222-5555',
      lastVisit: '2024-01-07',
      totalSpent: 75000,
      visitCount: 5,
      points: 750,
      coupons: [
        { id: 'c17', name: '첫 방문 할인', amount: 8000, type: 'fixed', createdDate: '2024-01-07', expiryDate: '2024-04-07', isUsed: false },
      ],
      serviceHistory: [
        { id: '37', date: '2024-01-07', service: '커트', amount: 21000 },
        { id: '38', date: '2023-12-20', service: '염색', amount: 54000 },
      ]
    },
    {
      id: '11',
      name: '박지연',
      phone: '010-9999-1111',
      lastVisit: '2024-01-06',
      totalSpent: 210000,
      visitCount: 13,
      points: 2100,
      coupons: [
        { id: 'c18', name: '월간 이벤트', amount: 18, type: 'percent', createdDate: '2024-01-01', expiryDate: '2024-04-01', isUsed: false },
        { id: 'c19', name: '생일 축하', amount: 20000, type: 'fixed', createdDate: '2023-12-10', expiryDate: '2024-03-10', isUsed: true, usedDate: '2023-12-25' },
      ],
      serviceHistory: [
        { id: '39', date: '2024-01-06', service: '파마', amount: 78000 },
        { id: '40', date: '2023-12-25', service: '커트', amount: 23000 },
        { id: '41', date: '2023-12-10', service: '염색', amount: 68000 },
        { id: '42', date: '2023-11-22', service: '커트', amount: 21000 },
        { id: '43', date: '2023-11-08', service: '기타', amount: 20000 },
      ]
    },
  ]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();

  const filteredCustomers = customers.filter(customer => 
    customer.name.includes(searchText) || customer.phone.includes(searchText)
  );

  const handleSaveCustomer = (customer: Customer) => {
    if (editingCustomer) {
      // 수정
      setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    } else {
      // 새로 등록
      setCustomers(prev => [customer, ...prev]);
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(undefined);
    setModalVisible(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCustomer(undefined);
  };

  const handleCustomerPress = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedCustomer(undefined);
  };

  const handleDeleteCustomer = (id: string) => {
    Alert.alert(
      '고객 삭제',
      '정말 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: () => {
          setCustomers(prev => prev.filter(customer => customer.id !== id));
        }}
      ]
    );
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
              <ThemedText style={styles.lastVisit}>최근 방문: {customer.lastVisit}</ThemedText>
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