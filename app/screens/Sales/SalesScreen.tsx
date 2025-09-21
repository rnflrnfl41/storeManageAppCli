import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarModal from '@components/CalendarModal';
import { ThemedText } from '@components/ThemedText';
import InlineSpinner from '@components/InlineSpinner';
import { LineChart } from 'react-native-chart-kit';
import SalesDetailModal from './components/SalesDetailModal';
import SalesRegisterModal from './components/SalesRegisterModal';
import { showConfirm, showError } from '@utils/alertUtils';
import { formatDate } from '@utils/index'
import { styles } from '@shared/styles/Sales';
import { Customer, Coupon, Service, SalesData, Sales } from '@shared/types/salesTypes';
import { axiosInstance } from '@services/apiClient';
import { useSalesData } from '@hooks/useSalesData';
import { salesService } from '@services/salesService';

const screenWidth = Dimensions.get('window').width;


export default function SalesScreen() {
  // API 데이터 훅 사용
  const {
    summary,
    chart,
    salesList,
    loading,
    loadSummaryData,
    loadChartData,
    loadSalesList,
    loadMoreSalesList,
    deleteSales: deleteSalesFromAPI,
  } = useSalesData();

  // UI 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [viewType, setViewType] = useState<'daily' | 'monthly'>('daily');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SalesData | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [tooltip, setTooltip] = useState<{ visible: boolean, x: number, y: number, data: any } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // createdAt에서 날짜 부분만 추출하는 헬퍼 함수
  const getDateFromCreatedAt = (createdAt: string) => createdAt.split(' ')[0];

  const handleRegisterSubmit = async (payload: {
    customer: Customer | null | 'guest';
    services: Service[];
    serviceAmounts: { [key: string]: number };
    coupon: Coupon | null;
    usedPoints: number;
    paymentMethod: 'card' | 'cash';
    totalAmount: number;
    finalAmount: number;
    visitDate: string;
  }) => {
    // 실제 저장용 Sales 데이터 생성
    const salesData: Sales = {
      memo: payload.services.map(s => s.name).join(', '), // 서비스 이름들을 메모로 사용
      visitDate: payload.visitDate, // 선택된 날짜 사용
      customerId: payload.customer === 'guest' ? 0 : parseInt(payload.customer?.id || '0'),
      totalServiceAmount: payload.totalAmount,
      discountAmount: Math.max(0, payload.totalAmount - payload.finalAmount),
      finalServiceAmount: payload.finalAmount,
      serviceList: payload.services.map(service => ({
        name: service.name,
        price: payload.serviceAmounts[service.id] || service.basePrice
      })),
      paymentMethod: payload.paymentMethod,
      usedPoint: payload.usedPoints,
      usedCouponId: payload.coupon?.id || ''
    };

    try {
      // API 호출로 매출 등록
      await salesService.registerSales(salesData);
      
      // 성공 시 관련 데이터 새로고침
      await Promise.all([
        loadSummaryData(payload.visitDate),
        loadSalesList(payload.visitDate, 1, true), // 강제 새로고침
      ]);
      
      // 모달 닫기
      setModalVisible(false);
    } catch (error) {
      console.error('매출 등록 실패:', error);
      throw error; // 에러를 다시 throw하여 모달이 닫히지 않도록 함
    }
  };



  const handleSalePress = (item: SalesData) => {
    setSelectedSale(item);
    setDetailModalVisible(true);
  };

  const deleteSales = async (id: number) => {
    const confirmed = await showConfirm('정말 삭제하시겠습니까?', {
      title: '매출 취소',
      confirmButtonText: '확인',
      denyButtonText: '취소'
    });

    if (confirmed) {
      try {
        await deleteSalesFromAPI(id, selectedDate);
        
        // 요약 데이터도 새로고침
        const today = new Date().toISOString().split('T')[0];
        if (selectedDate === today) {
          await loadSummaryData(today);
        }
      } catch (error) {
        console.error('매출 삭제 실패:', error);
      }
    }
  };

  const getTodaySales = () => {
    const today = new Date().toISOString().split('T')[0];
    return salesList[today]?.data || [];
  };

  const getSelectedDateSales = () => {
    return salesList[selectedDate]?.data || [];
  };

  // 더보기 가능 여부 확인
  const hasMoreData = () => {
    const currentData = salesList[selectedDate];
    if (!currentData) return false;
    return currentData.pagination.page < currentData.pagination.totalPages;
  };

  // 더보기 버튼 텍스트
  const getLoadMoreText = () => {
    const currentData = salesList[selectedDate];
    if (!currentData) return '더보기';
    
    const remainingCount = currentData.pagination.total - currentData.data.length;
    return remainingCount > 0 ? `더보기 (+${remainingCount})` : '더보기';
  };

  // 더보기 로딩 함수
  const handleLoadMore = async () => {
    if (loading.loadMore || !hasMoreData()) return;
    
    try {
      await loadMoreSalesList(selectedDate);
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
    await loadSalesList(newDate);
  };

  const getMonthSales = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    // 월별 데이터는 차트에서 가져오거나 별도 API 호출 필요
    return [];
  };

  const getTotalAmount = (data: SalesData[]) => {
    return data.reduce((sum, item) => sum + item.finalAmount, 0);
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
      const salesCount = chartData.counts?.[data.index] || 0;
      console.log(chartData); 

      const tooltipData = {
        date: selectedDate,
        amount,
        salesCount,
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
        loadSalesList(selectedDate, 1, true),
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

  const todaySales = getTodaySales();
  const monthSales = getMonthSales();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>매출관리</ThemedText>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <ThemedText style={styles.addButtonText}>+ 매출등록</ThemedText>
          </TouchableOpacity>
        </View>

        {/* 매출 요약 */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <ThemedText style={styles.summaryLabel}>오늘 매출</ThemedText>
            {loading.summary ? (
              <ThemedText style={[styles.summaryAmount, { color: '#8E8E93' }]}>로딩 중...</ThemedText>
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
            <ThemedText style={styles.summaryLabel}>이번 달 매출</ThemedText>
            {loading.summary ? (
              <ThemedText style={[styles.summaryAmount, { color: '#8E8E93' }]}>로딩 중...</ThemedText>
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
              <ThemedText style={styles.chartTitle}>매출 현황</ThemedText>
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
              <ThemedText style={{ color: '#8E8E93' }}>차트 데이터를 불러오는 중...</ThemedText>
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
                color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#4A90E2',
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
                  {tooltip.data.salesCount}건
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* 날짜 선택 및 매출 목록 */}
        <View style={styles.listContainer}>
          <View style={styles.dateSelector}>
            <TouchableOpacity style={styles.dateNavButton} onPress={() => navigateDate('prev')}>
              <Ionicons name="chevron-back" size={24} color="#007AFF" />
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
              <Ionicons name="chevron-forward" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.dayStats}>
            <ThemedText style={styles.dayStatsText}>
              총 {getSelectedDateSales().length}건 • {getTotalAmount(getSelectedDateSales()).toLocaleString()}원
            </ThemedText>
          </View>

          {loading.list ? (
            <View style={styles.emptyState}>
              <ThemedText style={{ color: '#8E8E93' }}>매출 목록을 불러오는 중...</ThemedText>
            </View>
          ) : getSelectedDateSales().length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#8E8E93" />
              <ThemedText style={styles.emptyText}>선택한 날짜에 매출이 없습니다</ThemedText>
            </View>
          ) : (
            <>
              {getSelectedDateSales()
                .sort((a, b) => b.time.localeCompare(a.time))
                .map((item) => (
                  <TouchableOpacity key={item.id} style={styles.salesItem} onPress={() => handleSalePress(item)}>
                    <View style={styles.salesInfo}>
                      <View style={styles.priceRow}>
                        <ThemedText style={styles.salesAmount}>
                          {item.finalAmount.toLocaleString()}원
                        </ThemedText>
                        {item.discountAmount > 0 && (
                          <ThemedText style={styles.originalAmount}>
                            {item.originalAmount.toLocaleString()}원
                          </ThemedText>
                        )}
                      </View>
                      <ThemedText style={styles.salesDescription}>{item.memo}</ThemedText>
                      <View style={styles.salesMeta}>
                        <ThemedText style={styles.salesTime}>{item.time}</ThemedText>
                        {item.customerName && (
                          <ThemedText style={styles.customerName}> • {item.customerName}</ThemedText>
                        )}
                        <View style={styles.paymentBadgeSmall}>
                          <Ionicons
                            name={item.paymentMethod === 'card' ? 'card' : 'cash'}
                            size={12}
                            color={item.paymentMethod === 'card' ? '#007AFF' : '#34C759'}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.salesActions}>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteSales(item.id)}
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
                    <InlineSpinner size="small" color="#007AFF" />
                  ) : (
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color="#007AFF"
                    />
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <SalesRegisterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleRegisterSubmit}
      />

      <SalesDetailModal
        visible={detailModalVisible}
        sale={selectedSale}
        onClose={() => setDetailModalVisible(false)}
        onDelete={deleteSales}
      />

      <CalendarModal
        visible={calendarVisible}
        currentDate={selectedDate}
        onClose={() => setCalendarVisible(false)}
        onSelect={async (dateString) => {
          setSelectedDate(dateString);
          setCalendarVisible(false);
          // 선택된 날짜의 데이터 로드
          await loadSalesList(dateString);
        }}
      />

      
    </SafeAreaView>
  );
}
