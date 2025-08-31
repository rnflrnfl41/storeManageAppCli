import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import { TextInput } from '@components/CustomTextInput';

interface Customer {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
}

interface CustomerModalProps {
  visible: boolean;
  customer?: Customer;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'totalSpent' | 'visitCount' | 'points' | 'coupons' | 'serviceHistory'>) => void;
}

export default function CustomerModal({ visible, customer, onClose, onSave }: CustomerModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
    } else {
      setName('');
      setPhone('');
    }
  }, [customer, visible]);

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('오류', '이름과 전화번호를 모두 입력해주세요.');
      return;
    }

    const customerData = {
      id: customer?.id || Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      lastVisit: customer?.lastVisit || new Date().toISOString().split('T')[0]
    };

    onSave(customerData);
    onClose();
  };

  const isEdit = !!customer;

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
            <ThemedText style={styles.title}>
              {isEdit ? '고객 수정' : '고객 등록'}
            </ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>고객명</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="고객명을 입력하세요"
                value={name}
                onChangeText={setName}
                autoFocus={!isEdit}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>전화번호</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="전화번호를 입력하세요"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <ThemedText style={styles.cancelButtonText}>취소</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <ThemedText style={styles.saveButtonText}>
                {isEdit ? '수정' : '등록'}
              </ThemedText>
            </TouchableOpacity>
          </View>
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
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
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
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  buttons: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});