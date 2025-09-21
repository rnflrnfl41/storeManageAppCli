import React from 'react';
import { Modal, TouchableOpacity, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import { ThemedText } from '@components/ThemedText';
import { calendarTheme, calendarStyles } from '@shared/styles/CalendarStyles';

interface CalendarModalProps {
  visible: boolean;
  currentDate: Date | string;
  onClose: () => void;
  onSelect: (dateString: string) => void;
  title?: string;
}

export function CalendarModal({
  visible,
  currentDate,
  onClose,
  onSelect,
  title = '날짜 선택',
}: CalendarModalProps) {
  const current =
    typeof currentDate === 'string'
      ? currentDate
      : currentDate.toISOString().split('T')[0];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={calendarStyles.calendarModalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={calendarStyles.calendarModalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={calendarStyles.calendarModalHeader}>
            <ThemedText style={calendarStyles.calendarModalTitle}>{title}</ThemedText>
            <TouchableOpacity
              style={calendarStyles.calendarCloseButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={28} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          <Calendar
            current={current}
            onDayPress={(day) => onSelect(day.dateString)}
            markedDates={{
              [current]: {
                selected: true,
                selectedColor: '#007AFF',
              },
            }}
            theme={calendarTheme}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}


