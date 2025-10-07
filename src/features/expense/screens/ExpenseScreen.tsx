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

export default function ExpenseScreen() {
  // API 데이터 훅 사용
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

  // 초기 데이터 로딩
  useEffect(() => {
    const initializeData = async () => {
      const today = new Date().toISOString().split('T')[0];
      try {
        await Promise.all([
          loadSummaryData(today),
          loadChartData('daily'),
          loadExpenseList({ date: selectedDate, page: 0, limit: 5 }),
        ]);
      } catch (error) {
        console.error('초기 데이터 로딩 실패:', error);
      }
    };

    initializeData();
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
      categoryName: payload.category.name,
      amount: payload.amount,
    };

    try {
      // API 호출로 지출 등록
      await expenseService.registerExpense(expenseData);
      
      // 성공 시 관련 데이터 새로고침
      const today = new Date().toISOString().split('T')[0];
      await Promise.all([
        loadSummaryData(today), // 오늘 지출 요약 업데이트
        loadExpenseList({ date: payload.expenseDate, page: 0, limit: 5 }), // 해당 날짜 지출 목록 업데이트
        loadChartData('daily'), // 일별 차트 업데이트
        loadChartData('monthly'), // 월별 차트도 업데이트
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
    console.log(item);
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
        
        // 삭제 후 관련 데이터 새로고침
        const today = new Date().toISOString().split('T')[0];
        await Promise.all([
          loadSummaryData(today), // 오늘 지출 요약 업데이트
          loadExpenseList({ date: selectedDate, page: 0, limit: 5 }), // 해당 날짜 지출 목록 업데이트
          loadChartData('daily'), // 일별 차트 업데이트
          loadChartData('monthly'), // 월별 차트 업데이트
        ]);
      } catch (error) {
        console.error('지출 삭제 실패:', error);
      }
    }
  };

  const getTodayExpenses = () => {
    const today = new Date().toISOString().split('T')[0];
    return expenseList[today]?.data || [];
  };

  const getSelectedDateExpenses = () => {
    return expenseList[selectedDate]?.data || [];
  };

  // 더보기 가능 여부 확인
  const hasMoreData = () => {
    const currentData = expenseList[selectedDate];
    if (!currentData) {
      return false;
    }
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
    const chartData = viewType === 'daily' ? chart.daily : chart.monthly;
    
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
    const chartData = viewType === 'daily' ? chart.daily : chart.monthly;
    
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
        loadChartData('daily'),
        loadChartData('monthly'),
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
            {loading.summary ? (
              <InlineSpinner size="small" color="#FF3B30" />
            ) : (
              <>
                <ThemedText style={styles.summaryAmount}>
                  {summary?.today?.amount?.toLocaleString() || '0'}원
                </ThemedText>
                <ThemedText style={styles.summaryCount}>{summary?.today?.count || 0}건</ThemedText>
              </>
            )}
          </View>
          <View style={styles.summaryCard}>
            <ThemedText style={styles.summaryLabel}>이번 달 지출</ThemedText>
            {loading.summary ? (
              <InlineSpinner size="small" color="#FF3B30" />
            ) : (
              <>
                <ThemedText style={styles.summaryAmount}>
                  {summary?.month?.amount?.toLocaleString() || '0'}원
                </ThemedText>
                <ThemedText style={styles.summaryCount}>{summary?.month?.count || 0}건</ThemedText>
              </>
            )}
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
          {loading.chart ? (
            <View style={[styles.chart, { height: 220, justifyContent: 'center', alignItems: 'center' }]}>
              <InlineSpinner size="small" color="#FF3B30" />
            </View>
          ) : getChartData().datasets[0].data.length > 0 ? (
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

          {loading.list ? (
            <View style={styles.emptyState}>
              <InlineSpinner size="small" color="#FF3B30" />
              <ThemedText style={styles.emptyText}>로딩 중...</ThemedText>
            </View>
          ) : getSelectedDateExpenses().length === 0 ? (
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