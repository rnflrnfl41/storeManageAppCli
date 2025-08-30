import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import AddScheduleModal from '@components/AddScheduleModal';
import '@config/calendarConfig';
import { calendarTheme } from '@shared/styles/CalendarStyles';
import { homeScreenStyles } from '@shared/styles/HomeScreenStyles';

import { ThemedText } from '@components/ThemedText';
import { logout } from '@services/authService';
import { router } from '@utils/navigateUtils';


interface Schedule {
  id: string;
  date: string;
  time: string;
  title: string;
  completed: boolean;
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('홈');
  const [userName, setUserName] = useState('사용자');
  const [storeName, setStoreName] = useState('Hair City');

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAllSchedules, setShowAllSchedules] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  /**
   * AsyncStorage에서 사용자 정보를 불러와서 사용자명과 매장명을 설정
   */
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



  /**
   * 로그아웃 확인 알림을 보여주고, 확인 시 로그아웃 처리 후 로그인 화면으로 이동
   */
  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace("Login");
          }
        }
      ]
    );
  };

  /**
   * 하단 독바나 퀴 메뉴의 기능 버튼 클릭 시 호출되는 함수
   * 현재는 로그만 출력하지만 추후 각 기능별 화면 이동 기능 추가 예정
   */
  const handleFeaturePress = (feature: string) => {
    setActiveTab(feature);
    console.log(`${feature} 기능 선택됨`);
  };

  /**
   * 일정 추가 모달을 열기
   */
  const handleAddSchedule = () => {
    setModalVisible(true);
  };

  /**
   * 새로운 일정을 일정 목록에 추가
   */
  const handleSaveSchedule = (schedule: Schedule) => {
    setSchedules(prev => [...prev, schedule]);
  };

  /**
   * 지정된 ID의 일정을 일정 목록에서 삭제
   */
  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
  };

  /**
   * 지정된 ID의 일정의 완료 상태를 토글 (완료 ↔ 미완료)
   */
  const handleToggleComplete = (scheduleId: string) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, completed: !schedule.completed }
          : schedule
      )
    );
  };

  /**
   * 일정 추가 모달을 닫기
   */
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  /**
   * 선택된 날짜에 해당하는 일정들을 시간 순서대로 정렬하여 반환
   */
  const getSelectedDateSchedules = () => {
    const selectedDateString = selectedDate.toDateString();
    return schedules
      .filter(schedule => 
        new Date(schedule.date).toDateString() === selectedDateString
      )
      .sort((a, b) => {
        // 시간을 24시간 형식으로 비교
        const timeA = a.time.replace(':', '');
        const timeB = b.time.replace(':', '');
        return parseInt(timeA) - parseInt(timeB);
      });
  };

  /**
   * 날짜 네비게이션 - 이전/다음 날짜로 이동
   * 날짜 변경 시 더 보기 상태를 초기화하여 3개만 보이도록 설정
   */
  const handleDateChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
    setShowAllSchedules(false); // 날짜 변경 시 더 보기 상태 초기화
  };

  /**
   * 캘린더 모달 열기 - 날짜 표시 영역 클릭 시 호출
   */
  const openCalendar = () => {
    setCalendarVisible(true);
  };

  /**
   * 캘린더에서 날짜 선택 시 호출
   */
  const handleCalendarDateSelect = (day: any) => {
    setSelectedDate(new Date(day.dateString));
    setCalendarVisible(false);
    setShowAllSchedules(false);
  };

  /**
   * 날짜를 한국어 형식으로 포맷팅 (ex: 1월 15일 (금))
   */
  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${month}월 ${day}일 (${weekDay})`;
  };

  return (
    <SafeAreaView style={homeScreenStyles.safeArea} edges={['top']}>
      <View style={homeScreenStyles.mainContainer}>
        <ScrollView style={homeScreenStyles.container} showsVerticalScrollIndicator={false}>
          {/* 헤더 영역 */}
          <View style={homeScreenStyles.header}>
            <View style={homeScreenStyles.storeInfo}>
              <Image 
                source={require('../../assets/haircity-logo.png')} 
                style={homeScreenStyles.logo}
                resizeMode="contain"
              />
              <View style={homeScreenStyles.storeDetails}>
                <ThemedText style={homeScreenStyles.storeName}>{storeName}</ThemedText>
                <ThemedText style={homeScreenStyles.userName}>{userName}님</ThemedText>
              </View>
            </View>
            <TouchableOpacity
              style={homeScreenStyles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          {/* 오늘 매출 카드 */}
          <View style={homeScreenStyles.salesCard}>
            <ThemedText style={homeScreenStyles.salesLabel}>오늘 매출</ThemedText>
            <ThemedText style={homeScreenStyles.salesValue}>₩0</ThemedText>
          </View>

          {/* Quick Menu */}
          <View style={homeScreenStyles.quickMenuCard}>
            <ThemedText style={homeScreenStyles.quickMenuTitle}>Quick Menu</ThemedText>
            <View style={homeScreenStyles.quickMenuGrid}>
              <TouchableOpacity 
                style={homeScreenStyles.quickMenuItem}
                onPress={() => handleFeaturePress('매출 등록')}
              >
                <View style={[homeScreenStyles.quickMenuIcon, { backgroundColor: '#4CAF50' }]}>
                  <Ionicons name="cash" size={24} color="white" />
                </View>
                <ThemedText style={homeScreenStyles.quickMenuLabel}>매출 등록</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={homeScreenStyles.quickMenuItem}
                onPress={() => handleFeaturePress('고객 등록')}
              >
                <View style={[homeScreenStyles.quickMenuIcon, { backgroundColor: '#2196F3' }]}>
                  <Ionicons name="person-add" size={24} color="white" />
                </View>
                <ThemedText style={homeScreenStyles.quickMenuLabel}>고객 등록</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={homeScreenStyles.quickMenuItem}
                onPress={() => handleFeaturePress('지출 등록')}
              >
                <View style={[homeScreenStyles.quickMenuIcon, { backgroundColor: '#FF5722' }]}>
                  <Ionicons name="card" size={24} color="white" />
                </View>
                <ThemedText style={homeScreenStyles.quickMenuLabel}>지출 등록</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* 캘린더 및 일정 */}
          <View style={homeScreenStyles.calendarCard}>
            <View style={homeScreenStyles.calendarHeader}>
              <ThemedText style={homeScreenStyles.calendarTitle}>일정</ThemedText>
              <TouchableOpacity 
                style={homeScreenStyles.addScheduleButton}
                onPress={handleAddSchedule}
              >
                <Ionicons name="add" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
            
            <View style={homeScreenStyles.dateNavigation}>
              <TouchableOpacity 
                style={homeScreenStyles.dateNavButton}
                onPress={() => handleDateChange('prev')}
              >
                <Ionicons name="chevron-back" size={20} color="#007AFF" />
              </TouchableOpacity>
              
              <View style={homeScreenStyles.dateDisplay}>
                <View style={homeScreenStyles.dateContainer}>
                  <TouchableOpacity onPress={openCalendar}>
                    <ThemedText style={homeScreenStyles.dateText}>{formatDate(selectedDate)}</ThemedText>
                  </TouchableOpacity>
                  {selectedDate.toDateString() === new Date().toDateString() && (
                    <View style={homeScreenStyles.todayBadge}>
                      <ThemedText style={homeScreenStyles.todayBadgeText}>오늘</ThemedText>
                    </View>
                  )}
                </View>
              </View>
              
              <TouchableOpacity 
                style={homeScreenStyles.dateNavButton}
                onPress={() => handleDateChange('next')}
              >
                <Ionicons name="chevron-forward" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <View style={homeScreenStyles.scheduleList}>
              {getSelectedDateSchedules().length > 0 ? (
                <>
                  {(showAllSchedules ? getSelectedDateSchedules() : getSelectedDateSchedules().slice(0, 3))
                    .map((schedule) => (
                      <View key={schedule.id} style={[
                        homeScreenStyles.scheduleItem,
                        schedule.completed && homeScreenStyles.scheduleItemCompleted
                      ]}>
                        <View style={homeScreenStyles.scheduleTime}>
                          <ThemedText style={[
                            homeScreenStyles.timeText,
                            schedule.completed && homeScreenStyles.timeTextCompleted
                          ]}>{schedule.time}</ThemedText>
                        </View>
                        <View style={homeScreenStyles.scheduleContent}>
                          <ThemedText style={[
                            homeScreenStyles.scheduleTitle,
                            schedule.completed && homeScreenStyles.scheduleTitleCompleted
                          ]}>{schedule.title}</ThemedText>
                        </View>
                        <View style={homeScreenStyles.scheduleActions}>
                          <TouchableOpacity
                            style={[
                              homeScreenStyles.completeButton,
                              schedule.completed && homeScreenStyles.completeButtonActive
                            ]}
                            onPress={() => handleToggleComplete(schedule.id)}
                          >
                            <Ionicons 
                              name="checkmark" 
                              size={14} 
                              color={schedule.completed ? "white" : "#4CAF50"} 
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={homeScreenStyles.deleteButton}
                            onPress={() => handleDeleteSchedule(schedule.id)}
                          >
                            <Ionicons name="close" size={14} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  }
                  {getSelectedDateSchedules().length > 3 && (
                    <TouchableOpacity 
                      style={homeScreenStyles.showMoreButton}
                      onPress={() => setShowAllSchedules(!showAllSchedules)}
                    >
                      <ThemedText style={homeScreenStyles.showMoreText}>
                        {showAllSchedules ? '접기' : '더보기'}
                      </ThemedText>
                      <Ionicons 
                        name={showAllSchedules ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color="#007AFF" 
                      />
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View style={homeScreenStyles.noSchedule}>
                  <Ionicons name="calendar-outline" size={32} color="#8E8E93" />
                  <ThemedText style={homeScreenStyles.noScheduleText}>이 날짜에 예정된 일정이 없습니다</ThemedText>
                  <TouchableOpacity 
                    style={homeScreenStyles.addFirstSchedule}
                    onPress={handleAddSchedule}
                  >
                    <ThemedText style={homeScreenStyles.addFirstScheduleText}>일정 추가하기</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* 하단 여백 (독바 공간 확보) */}
          <View style={{ height: 100 }} />
        </ScrollView>

        <AddScheduleModal
          visible={modalVisible}
          onClose={handleCloseModal}
          onSave={handleSaveSchedule}
        />

        {/* 캘린더 모달 */}
        <Modal
          visible={calendarVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setCalendarVisible(false)}
        >
          <TouchableOpacity 
            style={homeScreenStyles.calendarModalOverlay}
            activeOpacity={1}
            onPress={() => setCalendarVisible(false)}
          >
            <TouchableOpacity 
              style={homeScreenStyles.calendarModalContent}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={homeScreenStyles.calendarModalHeader}>
                <ThemedText style={homeScreenStyles.calendarModalTitle}>날짜 선택</ThemedText>
                <TouchableOpacity
                  style={homeScreenStyles.calendarCloseButton}
                  onPress={() => setCalendarVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>
              <Calendar
                current={selectedDate.toISOString().split('T')[0]}
                onDayPress={handleCalendarDateSelect}
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

        {/* 관리 메뉴 독바 - 하단 고정 */}
        <View style={homeScreenStyles.dockContainer}>
          <TouchableOpacity
            style={homeScreenStyles.dockItem}
            onPress={() => handleFeaturePress('매출 관리')}
          >
            <Ionicons 
              name="trending-up" 
              size={28} 
              color={activeTab === '매출 관리' ? '#007AFF' : '#8E8E93'} 
            />
            <ThemedText style={[
              homeScreenStyles.dockLabel, 
              { color: activeTab === '매출 관리' ? '#007AFF' : '#8E8E93' }
            ]}>매출</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeScreenStyles.dockItem}
            onPress={() => handleFeaturePress('지출 관리')}
          >
            <Ionicons 
              name="trending-down" 
              size={28} 
              color={activeTab === '지출 관리' ? '#007AFF' : '#8E8E93'} 
            />
            <ThemedText style={[
              homeScreenStyles.dockLabel, 
              { color: activeTab === '지출 관리' ? '#007AFF' : '#8E8E93' }
            ]}>지출</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeScreenStyles.dockItem}
            onPress={() => handleFeaturePress('홈')}
          >
            <Ionicons 
              name="home" 
              size={28} 
              color={activeTab === '홈' ? '#007AFF' : '#8E8E93'} 
            />
            <ThemedText style={[
              homeScreenStyles.dockLabel, 
              { color: activeTab === '홈' ? '#007AFF' : '#8E8E93' }
            ]}>홈</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeScreenStyles.dockItem}
            onPress={() => handleFeaturePress('고객 관리')}
          >
            <Ionicons 
              name="people" 
              size={28} 
              color={activeTab === '고객 관리' ? '#007AFF' : '#8E8E93'} 
            />
            <ThemedText style={[
              homeScreenStyles.dockLabel, 
              { color: activeTab === '고객 관리' ? '#007AFF' : '#8E8E93' }
            ]}>고객</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeScreenStyles.dockItem}
            onPress={() => handleFeaturePress('쿠폰 관리')}
          >
            <Ionicons 
              name="pricetag" 
              size={28} 
              color={activeTab === '쿠폰 관리' ? '#007AFF' : '#8E8E93'} 
            />
            <ThemedText style={[
              homeScreenStyles.dockLabel, 
              { color: activeTab === '쿠폰 관리' ? '#007AFF' : '#8E8E93' }
            ]}>쿠폰</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}


