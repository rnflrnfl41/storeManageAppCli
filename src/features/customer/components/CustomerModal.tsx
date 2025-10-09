import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import { TextInput } from '@components/CustomTextInput';
import { CustomerModalProps } from '../types/customerTypes';

export default function CustomerModal({ visible, customer, onClose, onSave }: CustomerModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{name?: string; phone?: string}>({});

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
    } else {
      setName('');
      setPhone('');
    }
    setErrors({}); // 모달 열릴 때 에러 초기화
  }, [customer, visible]);

  const validatePhone = (phoneNumber: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
  };

  const formatPhone = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhone(text);
    setPhone(formatted);
    // 입력 시 에러 메시지 제거
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    // 입력 시 에러 메시지 제거
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleSave = async () => {
    const newErrors: {name?: string; phone?: string} = {};

    // 이름 검증
    if (!name.trim()) {
      newErrors.name = '고객명을 입력해주세요.';
    }

    // 전화번호 검증
    if (!phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!validatePhone(phone.trim())) {
      newErrors.phone = '전화번호를 010-0000-0000 형식으로 입력해주세요.';
    }

    setErrors(newErrors);

    // 에러가 있으면 저장 중단
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const customerData = {
      id: customer?.id || Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      lastVisit: customer?.lastVisit || null
    };

    const success = await onSave(customerData);
    if (success) {
      onClose();
    }
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
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="고객명을 입력하세요"
                value={name}
                onChangeText={handleNameChange}
                autoFocus={!isEdit}
              />
              {errors.name && (
                <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
              )}
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>전화번호</ThemedText>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="010-0000-0000"
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={13}
              />
              {errors.phone && (
                <ThemedText style={styles.errorText}>{errors.phone}</ThemedText>
              )}
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
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});