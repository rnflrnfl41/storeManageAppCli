import { StyleSheet } from 'react-native';

// 공통 캘린더 테마
export const calendarTheme = {
  backgroundColor: '#ffffff',
  calendarBackground: '#ffffff',
  textSectionTitleColor: '#b6c1cd',
  selectedDayBackgroundColor: '#007AFF',
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#007AFF',
  dayTextColor: '#2d4150',
  textDisabledColor: '#d9e1e8',
  dotColor: '#00adf5',
  selectedDotColor: '#ffffff',
  arrowColor: '#007AFF',
  disabledArrowColor: '#d9e1e8',
  monthTextColor: '#2d4150',
  indicatorColor: '#007AFF',
  textDayFontWeight: '500',
  textMonthFontWeight: '600',
  textDayHeaderFontWeight: '500',
  textDayFontSize: 20,
  textMonthFontSize: 24,
  textDayHeaderFontSize: 18
} as any;

export const calendarStyles = StyleSheet.create({
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  calendarModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  calendarCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});