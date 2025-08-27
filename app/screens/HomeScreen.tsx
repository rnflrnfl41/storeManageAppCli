import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@components/ThemedText';
import { logout } from '@services/authService';
import { cardStyles } from '@styles';
import { router } from '@utils/navigateUtils';
import { debugAsyncStorage } from '@utils/debugUtils';


interface Schedule {
  id: string;
  date: string;
  time: string;
  title: string;
  type: 'appointment' | 'task' | 'reminder';
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('홈');
  const [userName, setUserName] = useState('사용자');
  const [storeName, setStoreName] = useState('Hair City');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    debugAsyncStorage();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        setUserName(userInfo.userName || '사용자');
        setStoreName(userInfo.storeName || 'Hair City');
      }
    } catch (error) {
      console.log('사용자 이름 로드 실패:', error);
    }
  };



  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace("Login");
          }
        }
      ]
    );
  };

  const handleFeaturePress = (feature: string) => {
    setActiveTab(feature);
    console.log(`${feature} 기능 선택됨`);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddSchedule = () => {
    // TODO: 일정 추가 모달 열기
    console.log('일정 추가');
  };

  const getTodaySchedules = () => {
    const today = new Date().toDateString();
    return schedules.filter(schedule => 
      new Date(schedule.date).toDateString() === today
    );
  };

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${month}월 ${day}일 (주${weekDay})`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* 헤더 영역 */}
          <View style={styles.header}>
            <View style={styles.storeInfo}>
              <Image 
                source={require('../../assets/haircity-logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.storeDetails}>
                <ThemedText style={styles.storeName}>{storeName}</ThemedText>
                <ThemedText style={styles.userName}>{userName}님</ThemedText>
              </View>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          {/* 오늘 매출 카드 */}
          <View style={styles.salesCard}>
            <ThemedText style={styles.salesLabel}>오늘 매출</ThemedText>
            <ThemedText style={styles.salesValue}>₩0</ThemedText>
          </View>

          {/* Quick Menu */}
          <View style={styles.quickMenuCard}>
            <ThemedText style={styles.quickMenuTitle}>Quick Menu</ThemedText>
            <View style={styles.quickMenuGrid}>
              <TouchableOpacity 
                style={styles.quickMenuItem}
                onPress={() => handleFeaturePress('매출 등록')}
              >
                <View style={[styles.quickMenuIcon, { backgroundColor: '#4CAF50' }]}>
                  <Ionicons name="cash" size={24} color="white" />
                </View>
                <ThemedText style={styles.quickMenuLabel}>매출 등록</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickMenuItem}
                onPress={() => handleFeaturePress('고객 등록')}
              >
                <View style={[styles.quickMenuIcon, { backgroundColor: '#2196F3' }]}>
                  <Ionicons name="person-add" size={24} color="white" />
                </View>
                <ThemedText style={styles.quickMenuLabel}>고객 등록</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickMenuItem}
                onPress={() => handleFeaturePress('지출 등록')}
              >
                <View style={[styles.quickMenuIcon, { backgroundColor: '#FF5722' }]}>
                  <Ionicons name="card" size={24} color="white" />
                </View>
                <ThemedText style={styles.quickMenuLabel}>지출 등록</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* 캘린더 및 일정 */}
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <ThemedText style={styles.calendarTitle}>오늘 일정</ThemedText>
              <TouchableOpacity 
                style={styles.addScheduleButton}
                onPress={handleAddSchedule}
              >
                <Ionicons name="add" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.dateInfo}>
              <ThemedText style={styles.dateText}>{formatDate(new Date())}</ThemedText>
            </View>

            <View style={styles.scheduleList}>
              {getTodaySchedules().length > 0 ? (
                getTodaySchedules().map((schedule) => (
                  <View key={schedule.id} style={styles.scheduleItem}>
                    <View style={styles.scheduleTime}>
                      <ThemedText style={styles.timeText}>{schedule.time}</ThemedText>
                    </View>
                    <View style={styles.scheduleContent}>
                      <ThemedText style={styles.scheduleTitle}>{schedule.title}</ThemedText>
                      <ThemedText style={styles.scheduleType}>{schedule.type}</ThemedText>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noSchedule}>
                  <Ionicons name="calendar-outline" size={32} color="#8E8E93" />
                  <ThemedText style={styles.noScheduleText}>오늘 예정된 일정이 없습니다</ThemedText>
                  <TouchableOpacity 
                    style={styles.addFirstSchedule}
                    onPress={handleAddSchedule}
                  >
                    <ThemedText style={styles.addFirstScheduleText}>일정 추가하기</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* 하단 여백 (독바 공간 확보) */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* 관리 메뉴 독바 - 하단 고정 */}
        <View style={styles.dockContainer}>
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => handleFeaturePress('매출 관리')}
          >
            <Ionicons 
              name="trending-up" 
              size={28} 
              color={activeTab === '매출 관리' ? '#007AFF' : '#8E8E93'} 
            />
            <ThemedText style={[
              styles.dockLabel, 
              { color: activeTab === '매출 관리' ? '#007AFF' : '#8E8E93' }
            ]}>매출</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => handleFeaturePress('지출 관리')}
          >
            <Ionicons 
              name="trending-down" 
              size={28} 
              color={activeTab === '지출 관리' ? '#007AFF' : '#8E8E93'} 
            />
            <ThemedText style={[
              styles.dockLabel, 
              { color: activeTab === '지출 관리' ? '#007AFF' : '#8E8E93' }
            ]}>지출</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => handleFeaturePress('홈')}
          >
            <Ionicons 
              name="home" 
              size={28} 
              color={activeTab === '홈' ? '#007AFF' : '#8E8E93'} 
            />
            <ThemedText style={[
              styles.dockLabel, 
              { color: activeTab === '홈' ? '#007AFF' : '#8E8E93' }
            ]}>홈</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => handleFeaturePress('고객 관리')}
          >
            <Ionicons 
              name="people" 
              size={28} 
              color={activeTab === '고객 관리' ? '#007AFF' : '#8E8E93'} 
            />
            <ThemedText style={[
              styles.dockLabel, 
              { color: activeTab === '고객 관리' ? '#007AFF' : '#8E8E93' }
            ]}>고객</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => handleFeaturePress('쿠폰 관리')}
          >
            <Ionicons 
              name="pricetag" 
              size={28} 
              color={activeTab === '쿠폰 관리' ? '#007AFF' : '#8E8E93'} 
            />
            <ThemedText style={[
              styles.dockLabel, 
              { color: activeTab === '쿠폰 관리' ? '#007AFF' : '#8E8E93' }
            ]}>쿠폰</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'white',
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  userName: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },

  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  salesCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 24,
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  salesLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 8,
  },
  salesValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
  },
  quickMenuCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickMenuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  quickMenuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickMenuItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickMenuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickMenuLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  calendarCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  addScheduleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateInfo: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  scheduleList: {
    minHeight: 100,
  },
  scheduleItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  scheduleTime: {
    width: 60,
    marginRight: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  scheduleType: {
    fontSize: 12,
    color: '#8E8E93',
  },
  noSchedule: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noScheduleText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    marginBottom: 12,
  },
  addFirstSchedule: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
  },
  addFirstScheduleText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  dockContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  dockItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  dockLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
  },
  recentActivityCard: {
    margin: 20,
    marginTop: 8,
    marginBottom: 30,
    backgroundColor: 'white',
  },
  recentActivity: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  noActivityText: {
    fontSize: 15,
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});
