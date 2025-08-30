import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemedText } from '@components/ThemedText';
import '../config/calendarConfig';
import { calendarTheme } from '@shared/styles/CalendarStyles';
import { addScheduleModalStyles } from '@shared/styles/AddScheduleModalStyles';

interface Schedule {
  id: string;
  date: string;
  time: string;
  title: string;
  completed: boolean;
}

interface AddScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (schedule: Schedule) => void;
}

export default function AddScheduleModal({ visible, onClose, onSave }: AddScheduleModalProps) {
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const titleInputRef = useRef<TextInput>(null);

  // useEffect(() => {
  //   if (visible) {
  //     setTimeout(() => {
  //       titleInputRef.current?.focus();
  //     }, 100);
  //   }
  // }, [visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('알림', '일정 제목을 입력해주세요.');
      return;
    }

    const schedule: Schedule = {
      id: Date.now().toString(),
      date: selectedDate.toISOString(),
      time: selectedTime.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      title: title.trim(),
      completed: false
    };

    onSave(schedule);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    onClose();
  };

  const onCalendarDateSelect = (day: any) => {
    setSelectedDate(new Date(day.dateString));
    setShowCalendar(false);
  };

  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const confirmTime = () => {
    const newTime = new Date();
    newTime.setHours(selectedHour, selectedMinute, 0, 0);
    setSelectedTime(newTime);
    setShowTimePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={addScheduleModalStyles.modalOverlay}>
        <View style={addScheduleModalStyles.modalContent}>
          <View style={addScheduleModalStyles.modalHeader}>
            <ThemedText style={addScheduleModalStyles.modalTitle}>일정 추가</ThemedText>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={addScheduleModalStyles.modalForm}>
            <View style={addScheduleModalStyles.inputGroup}>
              <Text style={addScheduleModalStyles.inputLabel}>제목</Text>
              <TextInput
                ref={titleInputRef}
                style={addScheduleModalStyles.textInput}
                placeholder="일정 제목을 입력하세요"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={addScheduleModalStyles.inputGroup}>
              <Text style={addScheduleModalStyles.inputLabel}>날짜</Text>
              <TouchableOpacity
                style={addScheduleModalStyles.dateTimeButton}
                onPress={() => setShowCalendar(true)}
              >
                <Text style={addScheduleModalStyles.dateTimeText}>{formatDate(selectedDate)}</Text>
                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <View style={addScheduleModalStyles.inputGroup}>
              <Text style={addScheduleModalStyles.inputLabel}>시간</Text>
              <TouchableOpacity
                style={addScheduleModalStyles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={addScheduleModalStyles.dateTimeText}>{formatTime(selectedTime)}</Text>
                <Ionicons name="time-outline" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={addScheduleModalStyles.modalButtons}>
            <TouchableOpacity style={addScheduleModalStyles.cancelButton} onPress={handleClose}>
              <Text style={addScheduleModalStyles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={addScheduleModalStyles.saveButton} onPress={handleSave}>
              <Text style={addScheduleModalStyles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          </View>

          {/* 캘린더 모달 */}
          {showCalendar && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={showCalendar}
              onRequestClose={() => setShowCalendar(false)}
            >
              <TouchableOpacity 
                style={addScheduleModalStyles.calendarModalOverlay}
                activeOpacity={1}
                onPress={() => setShowCalendar(false)}
              >
                <TouchableOpacity 
                  style={addScheduleModalStyles.calendarModalContent}
                  activeOpacity={1}
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={addScheduleModalStyles.calendarModalHeader}>
                    <ThemedText style={addScheduleModalStyles.calendarModalTitle}>날짜 선택</ThemedText>
                    <TouchableOpacity
                      style={addScheduleModalStyles.calendarCloseButton}
                      onPress={() => setShowCalendar(false)}
                    >
                      <Ionicons name="close" size={24} color="#8E8E93" />
                    </TouchableOpacity>
                  </View>
                  <Calendar
                    current={selectedDate.toISOString().split('T')[0]}
                    onDayPress={onCalendarDateSelect}
                    markedDates={{
                      [selectedDate.toISOString().split('T')[0]]: {
                        selected: true,
                        selectedColor: '#007AFF'
                      }
                    }}
                    theme={calendarTheme}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
          )}

          {/* 시간 선택 모달 */}
          {showTimePicker && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={showTimePicker}
              onRequestClose={() => setShowTimePicker(false)}
            >
              <TouchableOpacity 
                style={addScheduleModalStyles.calendarModalOverlay}
                activeOpacity={1}
                onPress={() => setShowTimePicker(false)}
              >
                <TouchableOpacity 
                  style={addScheduleModalStyles.timeModalContent}
                  activeOpacity={1}
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={addScheduleModalStyles.timeModalHeader}>
                    <TouchableOpacity
                      style={addScheduleModalStyles.timeCancelButton}
                      onPress={() => setShowTimePicker(false)}
                    >
                      <Text style={addScheduleModalStyles.timeCancelText}>취소</Text>
                    </TouchableOpacity>
                    <ThemedText style={addScheduleModalStyles.timeModalTitle}>시간 선택</ThemedText>
                    <TouchableOpacity
                      style={addScheduleModalStyles.timeConfirmButton}
                      onPress={confirmTime}
                    >
                      <Text style={addScheduleModalStyles.timeConfirmText}>확인</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={addScheduleModalStyles.timePickerContainer}>
                    <View style={addScheduleModalStyles.timePickerColumn}>
                      <Text style={addScheduleModalStyles.timePickerLabel}>시</Text>
                      <ScrollView 
                        style={addScheduleModalStyles.timePickerScroll}
                        showsVerticalScrollIndicator={false}
                        snapToInterval={50}
                        decelerationRate="fast"
                      >
                        {hours.map((hour) => (
                          <TouchableOpacity
                            key={hour}
                            style={[
                              addScheduleModalStyles.timePickerOption,
                              selectedHour === hour && addScheduleModalStyles.selectedTimePickerOption
                            ]}
                            onPress={() => setSelectedHour(hour)}
                          >
                            <Text style={[
                              addScheduleModalStyles.timePickerOptionText,
                              selectedHour === hour && addScheduleModalStyles.selectedTimePickerOptionText
                            ]}>
                              {hour.toString().padStart(2, '0')}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                    
                    <Text style={addScheduleModalStyles.timeSeparator}>:</Text>
                    
                    <View style={addScheduleModalStyles.timePickerColumn}>
                      <Text style={addScheduleModalStyles.timePickerLabel}>분</Text>
                      <ScrollView 
                        style={addScheduleModalStyles.timePickerScroll}
                        showsVerticalScrollIndicator={false}
                        snapToInterval={50}
                        decelerationRate="fast"
                      >
                        {minutes.map((minute) => (
                          <TouchableOpacity
                            key={minute}
                            style={[
                              addScheduleModalStyles.timePickerOption,
                              selectedMinute === minute && addScheduleModalStyles.selectedTimePickerOption
                            ]}
                            onPress={() => setSelectedMinute(minute)}
                          >
                            <Text style={[
                              addScheduleModalStyles.timePickerOptionText,
                              selectedMinute === minute && addScheduleModalStyles.selectedTimePickerOptionText
                            ]}>
                              {minute.toString().padStart(2, '0')}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
          )}
        </View>
      </View>
    </Modal>
  );
}

