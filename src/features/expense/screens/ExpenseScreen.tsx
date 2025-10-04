import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CalendarModal } from '@components';
import { ThemedText } from '@components';
import { InlineSpinner } from '@components';
import { LineChart } from 'react-native-chart-kit';
import { ExpenseRegisterModal, ExpenseDetailModal } from '../components';
import { showConfirm, showError } from '@utils/alertUtils';
import { formatDate } from '../../../shared/utils';
import { styles } from '../styles/ExpenseStyles';
import { ExpenseData, ExpenseCategory, DEFAULT_EXPENSE_CATEGORIES } from '../types/expense.types';
import { SummaryResponse, ChartResponse } from '@shared/types';
import { useExpenseData } from '../hooks/useExpenseData';
import { expenseService } from '../services/expenseService';

const screenWidth = Dimensions.get('window').width;

// Mock 데이터 생성
const generateMockExpenseData = (): ExpenseData[] => {
  const categories = DEFAULT_EXPENSE_CATEGORIES;
  const today = new Date();
  const expenses: ExpenseData[] = [];
  
  for (let i = 0; i < 15; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    
    expenses.push({
      id: i + 1,
      amount: Math.floor(Math.random() * 500000) + 10000,
      memo: [
        '임대료 지불',
        '전기세 납부',
        '가스비 납부',
        '인터넷 요금',
        '소모품 구매',
        '장비 수리비',
        '광고비',
        '보험료',
        '청소용품',
        '사무용품',
        '커피 머신 수리',
        '인쇄비',
        '택배비',
        '정기점검비',
        '기타비용'
      ][Math.floor(Math.random() * 15)],
      expenseDate: date.toISOString().split('T')[0],
      categoryName: category.name,
    });
  }
  
  return expenses.sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime());
};

const mockSummary: SummaryResponse = {
  today: {
    amount: 125000,
    count: 3
  },
  month: {
    amount: 1850000,
    count: 28
  }
};

const mockChartData: ChartResponse = {
  data: [45000, 32000, 28000, 55000, 41000, 67000, 38000],
  dates: Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  }),
  counts: [2, 1, 1, 3, 2, 4, 2]
};

export default function ExpenseScreen() {
  // Mock 데이터 상태
  const [mockExpenses, setMockExpenses] = useState<ExpenseData[]>([]);
  const [mockSummary, setMockSummary] = useState<SummaryResponse>({
    today: { amount: 0, count: 0 },
    month: { amount: 0, count: 0 }
  });
  const [mockChart, setMockChart] = useState<{ daily: ChartResponse | null, monthly: ChartResponse | null }>({
    daily: null,
    monthly: null
  });

  // API 데이터 훅 사용 (실제로는 사용하지 않음)
  const {
    summary,
    chart,
    expenseList,
    loading,
    loadSummaryData,
    loadChartData,
    loadExpenseList,
    loadMoreExpenseList,
    deleteExpense: deleteExpenseFromAPI,
  } = useExpenseData();

  // UI 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [viewType, setViewType] = useState<'daily' | 'monthly'>('daily');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseData | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [tooltip, setTooltip] = useState<{ visible: boolean, x: number, y: number, data: any } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock 데이터 초기화
  useEffect(() => {
    const expenses = generateMockExpenseData();
    setMockExpenses(expenses);
    
    // 요약 데이터 계산
    const today = new Date().toISOString().split('T')[0];
    const todayExpenses = expenses.filter(expense => expense.expenseDate === today);
    const thisMonth = new Date().toISOString().slice(0, 7);
    const monthExpenses = expenses.filter(expense => expense.expenseDate.startsWith(thisMonth));
    
    setMockSummary({
      today: {
        amount: todayExpenses.reduce((sum, expense) => sum + expense.amount, 0),
        count: todayExpenses.length
      },
      month: {
        amount: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
        count: monthExpenses.length
      }
    });
    
    // 차트 데이터 설정
    setMockChart({
      daily: mockChartData,
      monthly: {
        data: [450000, 520000, 380000, 610000, 490000, 670000, 580000],
        dates: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (6 - i));
          return date.toISOString().slice(0, 7);
        }),
        counts: [15, 18, 12, 22, 16, 24, 20]
      }
    });
  }, []);

  const handleRegisterSubmit = async (payload: {
    category: ExpenseCategory;
    amount: number;
    memo: string;
    expenseDate: string;
  }) => {
    // 실제 저장용 Expense 데이터 생성
    const expenseData = {
      memo: payload.memo,
      expenseDate: payload.expenseDate,
      categoryId: payload.category.id,
      categoryName: payload.category.name,
      amount: payload.amount,
    };

    try {
      // API 호출로 지출 등록
      await expenseService.registerExpense(expenseData);
      
      // 성공 시 관련 데이터 새로고침
      await Promise.all([
        loadSummaryData(payload.expenseDate),
        loadExpenseList({ date: payload.expenseDate, page: 0, limit: 5 }), // 강제 새로고침
        loadChartData('daily'), // 일별 차트도 새로고침
      ]);
      
      // 모달 닫기
      setModalVisible(false);
    } catch (error) {
      console.error('지출 등록 실패:', error);
      throw error; // 에러를 다시 throw하여 모달이 닫히지 않도록 함
    }
  };

  const handleExpensePress = (item: ExpenseData) => {
    setSelectedExpense(item);
    setDetailModalVisible(true);
  };

  const deleteExpense = async (id: number) => {
    const confirmed = await showConfirm('정말 삭제하시겠습니까?', {
      title: '지출 삭제',
      confirmButtonText: '확인',
      denyButtonText: '취소'
    });

    if (confirmed) {
      try {
        await deleteExpenseFromAPI(id, selectedDate);
        // 차트 데이터 새로고침 (현재 보기 타입)
        await loadChartData(viewType);
      } catch (error) {
        console.error('지출 삭제 실패:', error);
      }
    }
  };

  const getTodayExpenses = () => {
    const today = new Date().toISOString().split('T')[0];
    return mockExpenses.filter(expense => expense.expenseDate === today);
  };

  const getSelectedDateExpenses = () => {
    return expenseList[selectedDate]?.data || [];
  };

  // 더보기 가능 여부 확인
  const hasMoreData = () => {
    const currentData = expenseList[selectedDate];
    if (!currentData) return false;
    
    const { pagination } = currentData;
    return pagination.page < pagination.totalPages;
  };

  // 더보기 버튼 텍스트
  const getLoadMoreText = () => {
    if (loading.loadMore) return '로딩 중...';
    
    const currentData = expenseList[selectedDate];
    if (!currentData) return '더보기';
    
    const remainingCount = currentData.pagination.total - currentData.data.length;
    return remainingCount > 0 ? `더보기 (+${remainingCount})` : '더보기';
  };

  // 더보기 로딩 함수
  const handleLoadMore = async () => {
    if (loading.loadMore || !hasMoreData()) return;
    
    try {
      await loadMoreExpenseList(selectedDate);
    } catch (error) {
      console.error('더보기 로딩 실패:', error);
    }
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const navigateDate = async (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const newDate = currentDate.toISOString().split('T')[0];
    setSelectedDate(newDate);
    
    // 새로운 날짜의 데이터 로딩
    await loadExpenseList({ date: newDate, page: 0, limit: 5 });
  };

  const getTotalAmount = (data: ExpenseData[]) => {
    return data.reduce((sum, item) => sum + item.amount, 0);
  };

  const getChartData = () => {
    const chartData = viewType === 'daily' ? mockChart.daily : mockChart.monthly;
    
    if (!chartData) {
      return {
        labels: [],
        datasets: [{ data: [] }],
        dates: [],
        counts: [],
      };
    }

    // dates를 기반으로 labels 동적 생성
    const labels = chartData.dates.map(date => {
      const d = new Date(date);
      return viewType === 'daily' 
        ? `${d.getMonth() + 1}/${d.getDate()}`
        : `${d.getMonth() + 1}월`;
    });

    return {
      labels,
      datasets: [{ data: chartData.data }],
      dates: chartData.dates,
      counts: chartData.counts || [],
    };
  };

  const getChartDateRange = () => {
    const chartData = viewType === 'daily' ? mockChart.daily : mockChart.monthly;
    
    if (!chartData || chartData.dates.length === 0) {
      return '';
    }

    if (viewType === 'daily') {
      const startDate = new Date(chartData.dates[0]);
      const endDate = new Date(chartData.dates[chartData.dates.length - 1]);
      return `${startDate.getMonth() + 1}/${startDate.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`;
    } else {
      const startMonth = chartData.dates[0];
      const endMonth = chartData.dates[chartData.dates.length - 1];
      return `${startMonth.slice(-2)}월 - ${endMonth.slice(-2)}월`;
    }
  };

  const handleChartPress = (data: any) => {
    if (data && data.index !== undefined) {
      const chartData = getChartData();
      const selectedDate = chartData.dates[data.index];
      const amount = chartData.datasets[0].data[data.index];
      
      // 차트 데이터에서 count 가져오기
      const expenseCount = chartData.counts?.[data.index] || 0;

      const tooltipData = {
        date: selectedDate,
        amount,
        expenseCount,
        viewType
      };

      setTooltip({
        visible: true,
        x: 0,
        y: 0,
        data: tooltipData
      });

      // 3초 후 자동으로 숨기기
      setTimeout(() => {
        setTooltip(null);
      }, 3000);
    }
  };

  // Pull-to-refresh 핸들러
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await Promise.all([
        loadSummaryData(today),
        loadChartData(viewType),
        loadExpenseList({ date: selectedDate, page: 0, limit: 5 }),
      ]);
    } catch (error) {
      console.error('데이터 새로고침 실패:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // 차트 타입 변경 핸들러
  const handleViewTypeChange = async (type: 'daily' | 'monthly') => {
    setViewType(type);
    await loadChartData(type);
  };

  const todayExpenses = getTodayExpenses();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 고정 헤더 */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>지출관리</ThemedText>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <ThemedText style={styles.addButtonText}>+ 지출등록</ThemedText>
        </TouchableOpacity>
      </View>

      {/* 스크롤 가능한 내용 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF3B30']}
            tintColor="#FF3B30"
          />
        }
      >
        {/* 지출 요약 */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <ThemedText style={styles.summaryLabel}>오늘 지출</ThemedText>
            <ThemedText style={styles.summaryAmount}>
              {mockSummary.today.amount.toLocaleString()}원
            </ThemedText>
            <ThemedText style={styles.summaryCount}>{mockSummary.today.count}건</ThemedText>
          </View>
          <View style={styles.summaryCard}>
            <ThemedText style={styles.summaryLabel}>이번 달 지출</ThemedText>
            <ThemedText style={styles.summaryAmount}>
              {mockSummary.month.amount.toLocaleString()}원
            </ThemedText>
            <ThemedText style={styles.summaryCount}>{mockSummary.month.count}건</ThemedText>
          </View>
        </View>

        {/* 차트 */}
        <View style={[styles.chartContainer, { position: 'relative' }]}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <ThemedText style={styles.chartTitle}>지출 현황</ThemedText>
              <ThemedText style={styles.chartDateRange}>{getChartDateRange()}</ThemedText>
            </View>
            <View style={styles.chartToggle}>
              <TouchableOpacity
                style={[styles.toggleButton, viewType === 'daily' && styles.activeToggle]}
                onPress={() => handleViewTypeChange('daily')}
              >
                <ThemedText style={[styles.toggleText, viewType === 'daily' && styles.activeToggleText]}>일별</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, viewType === 'monthly' && styles.activeToggle]}
                onPress={() => handleViewTypeChange('monthly')}
              >
                <ThemedText style={[styles.toggleText, viewType === 'monthly' && styles.activeToggleText]}>월별</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          {getChartData().datasets[0].data.length > 0 ? (
            <LineChart
              data={getChartData()}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#FF3B30',
                },
              }}
              bezier
              style={styles.chart}
              onDataPointClick={handleChartPress}
            />
          ) : (
            <View style={[styles.chart, { height: 220, justifyContent: 'center', alignItems: 'center' }]}>
              <ThemedText style={{ color: '#8E8E93' }}>차트 데이터가 없습니다</ThemedText>
            </View>
          )}
          <View style={styles.chartHint}>
            <Ionicons name="information-circle-outline" size={14} color="#8E8E93" />
            <ThemedText style={styles.chartHintText}>점을 클릭하면 상세 정보를 볼 수 있습니다</ThemedText>
          </View>

          {/* 툴팁 */}
          {tooltip && (
            <View style={styles.tooltip}>
              <View style={styles.tooltipContent}>
                <ThemedText style={styles.tooltipTitle}>
                  {tooltip.data.viewType === 'daily'
                    ? `${new Date(tooltip.data.date).getMonth() + 1}월 ${new Date(tooltip.data.date).getDate()}일`
                    : `${tooltip.data.date.slice(-2)}월`
                  }
                </ThemedText>
                <ThemedText style={styles.tooltipAmount}>
                  {tooltip.data.amount.toLocaleString()}원
                </ThemedText>
                <ThemedText style={styles.tooltipCount}>
                  {tooltip.data.expenseCount}건
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* 날짜 선택 및 지출 목록 */}
        <View style={styles.listContainer}>
          <View style={styles.dateSelector}>
            <TouchableOpacity style={styles.dateNavButton} onPress={() => navigateDate('prev')}>
              <Ionicons name="chevron-back" size={24} color="#FF3B30" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateDisplay} onPress={() => setCalendarVisible(true)}>
              <View style={styles.dateInfo}>
                <ThemedText style={styles.selectedDateMain}>{selectedDate}</ThemedText>
                {isToday(selectedDate) && (
                  <View style={styles.todayBadge}>
                    <ThemedText style={styles.todayText}>오늘</ThemedText>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateNavButton} onPress={() => navigateDate('next')}>
              <Ionicons name="chevron-forward" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          <View style={styles.dayStats}>
            <ThemedText style={styles.dayStatsText}>
              총 {getSelectedDateExpenses().length}건 • {getTotalAmount(getSelectedDateExpenses()).toLocaleString()}원
            </ThemedText>
          </View>

          {getSelectedDateExpenses().length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color="#8E8E93" />
              <ThemedText style={styles.emptyText}>선택한 날짜에 지출이 없습니다</ThemedText>
            </View>
          ) : (
            <>
              {getSelectedDateExpenses()
                .map((item) => (
                  <TouchableOpacity key={item.id} style={styles.expenseItem} onPress={() => handleExpensePress(item)}>
                    <View style={styles.expenseInfo}>
                      <View style={styles.priceRow}>
                        <ThemedText style={styles.expenseAmount}>
                          {item.amount.toLocaleString()}원
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.expenseDescription}>{item.memo}</ThemedText>
                      <View style={styles.expenseMeta}>
                        {(() => {
                          const category = DEFAULT_EXPENSE_CATEGORIES.find(cat => cat.name === item.categoryName);
                          return (
                            <>
                              <View style={[styles.categoryIcon, { backgroundColor: category?.color || '#8E8E93' }]}>
                                <Ionicons name={category?.icon as any || 'help-circle'} size={10} color="white" />
                              </View>
                              <ThemedText style={styles.categoryText}>{item.categoryName}</ThemedText>
                            </>
                          );
                        })()}
                      </View>
                    </View>
                    <View style={styles.expenseActions}>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteExpense(item.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              }
              {hasMoreData() && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={handleLoadMore}
                  disabled={loading.loadMore}
                >
                  <ThemedText style={styles.showMoreText}>
                    {loading.loadMore ? '로딩 중...' : getLoadMoreText()}
                  </ThemedText>
                  {loading.loadMore ? (
                    <InlineSpinner size="small" color="#FF3B30" />
                  ) : (
                    <Ionicons name="chevron-down" size={20} color="#FF3B30" />
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <ExpenseRegisterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleRegisterSubmit}
      />

      <ExpenseDetailModal
        visible={detailModalVisible}
        expense={selectedExpense}
        onClose={() => setDetailModalVisible(false)}
        onDelete={deleteExpense}
      />

      <CalendarModal
        visible={calendarVisible}
        currentDate={selectedDate}
        onClose={() => setCalendarVisible(false)}
        onSelect={async (dateString: string) => {
          setSelectedDate(dateString);
          setCalendarVisible(false);
          // 선택된 날짜의 데이터 로드
          await loadExpenseList({ date: dateString, page: 0, limit: 5 });
        }}
      />
    </SafeAreaView>
  );
}