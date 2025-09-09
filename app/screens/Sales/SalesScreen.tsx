import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarModal from '@components/CalendarModal';
import { ThemedText } from '@components/ThemedText';
import { LineChart } from 'react-native-chart-kit';
import SalesDetailModal from './components/SalesDetailModal';
import SalesRegisterModal from './components/SalesRegisterModal';
import { showConfirm, showError } from '@utils/alertUtils';
import { styles } from '@shared/styles/Sales';

interface Customer {
  id: string;
  name: string;
  phone: string;
  points: number;
  coupons: Coupon[];
}

interface Coupon {
  id: string;
  name: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
}

interface Service {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
}

interface SalesData {
  id: string;
  originalAmount: number; // 원래 금액
  discountAmount: number; // 할인 금액
  finalAmount: number; // 최종 결제 금액
  description: string;
  date: string;
  time: string;
  paymentMethod: 'card' | 'cash';
  customerName?: string;
  usedCoupon?: {
    name: string;
    discountAmount: number;
  };
  usedPoints?: number;
}

const screenWidth = Dimensions.get('window').width;

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: '김민수',
    phone: '010-1234-5678',
    points: 5000,
    coupons: [
      { id: '1', name: '신규고객 20% 할인', discountType: 'percent', discountValue: 20 },
      { id: '2', name: '5만원 할인쿠폰', discountType: 'fixed', discountValue: 50000 }
    ]
  },
  {
    id: '2',
    name: '이영희',
    phone: '010-2345-6789',
    points: 12000,
    coupons: [
      { id: '3', name: '생일 축하 15% 할인', discountType: 'percent', discountValue: 15 }
    ]
  },
  {
    id: '3',
    name: '박철수',
    phone: '010-3456-7890',
    points: 8500,
    coupons: []
  },
  {
    id: '4',
    name: '최지영',
    phone: '010-4567-8901',
    points: 3200,
    coupons: [
      { id: '4', name: '단골고객 10% 할인', discountType: 'percent', discountValue: 10 }
    ]
  }
];

const generateMockData = (): SalesData[] => {
  const mockData: SalesData[] = [];
  const today = new Date();

  // 최근 2주간의 가라 데이터 생성
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // 하루에 3-8개의 매출 생성
    const salesCount = Math.floor(Math.random() * 6) + 3;

    for (let j = 0; j < salesCount; j++) {
      const hour = Math.floor(Math.random() * 12) + 9; // 9시-20시
      const minute = Math.floor(Math.random() * 60);

      const services = [
        '커트',
        '파마',
        '염색',
        '트리트먼트',
        '스타일링',
        '펌+커트',
        '염색+커트',
        '하이라이트',
        '매직스트레이트',
        '볼륨펌',
        '디지털펌',
        '헤어케어',
        '두피케어',
        '웨딩헤어'
      ];

      const amounts = [25000, 35000, 45000, 55000, 65000, 75000, 85000, 95000, 120000, 150000, 180000, 30000, 40000, 200000];
      const customers = ['김민수', '이영희', '박철수', '최지영', '정수현', '강미영', '윤서준', '임하늘', '조은비', '한지우'];

      const randomIndex = Math.floor(Math.random() * services.length);
      const customerIndex = Math.floor(Math.random() * customers.length);

      const originalAmount = amounts[randomIndex];
      const hasDiscount = Math.random() > 0.6;
      let discountAmount = 0;
      let usedCoupon = undefined;
      let usedPoints = undefined;

      if (hasDiscount) {
        const discountType = Math.random();
        if (discountType > 0.7) {
          // 쿠폰 사용
          const coupons = [
            { name: '신규고객 20% 할인', type: 'percent', value: 20 },
            { name: '생일 축하 15% 할인', type: 'percent', value: 15 },
            { name: '단골고객 10% 할인', type: 'percent', value: 10 },
            { name: '1만원 할인쿠폰', type: 'fixed', value: 10000 }
          ];
          const coupon = coupons[Math.floor(Math.random() * coupons.length)];
          discountAmount = coupon.type === 'percent'
            ? Math.floor(originalAmount * (coupon.value / 100))
            : coupon.value;
          usedCoupon = { name: coupon.name, discountAmount };
        } else if (discountType > 0.4) {
          // 포인트 사용
          usedPoints = Math.floor(Math.random() * 10000) + 1000;
          discountAmount = usedPoints;
        } else {
          // 일반 할인
          discountAmount = Math.floor(originalAmount * 0.1);
        }
      }

      mockData.push({
        id: `${date.getTime()}-${j}`,
        originalAmount,
        discountAmount,
        finalAmount: originalAmount - discountAmount,
        description: services[randomIndex],
        date: date.toISOString().split('T')[0],
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        paymentMethod: Math.random() > 0.3 ? 'card' : 'cash',
        customerName: Math.random() > 0.2 ? customers[customerIndex] : undefined,
        usedCoupon,
        usedPoints,
      });
    }
  }

  return mockData.sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());
};

export default function SalesScreen() {
  const [salesData, setSalesData] = useState<SalesData[]>(generateMockData());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  // 상위는 모달 표시/편집 여부 등 최소 상태만 유지
  const [viewType, setViewType] = useState<'daily' | 'monthly'>('daily');
  
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SalesData | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [showAllSales, setShowAllSales] = useState(false);
  const [tooltip, setTooltip] = useState<{ visible: boolean, x: number, y: number, data: any } | null>(null);

  const resetModal = () => {
    setEditingId(null);
  };

  const handleRegisterSubmit = (payload: {
    customer: Customer | null | 'guest';
    services: Service[];
    serviceAmounts: { [key: string]: number };
    coupon: Coupon | null;
    usedPoints: number;
    paymentMethod: 'card' | 'cash';
    totalAmount: number;
    finalAmount: number;
  }) => {
    const now = new Date();
    const serviceNames = payload.services.map(s => s.name).join(', ');
    const newSales: SalesData = {
      id: editingId ? editingId : Date.now().toString(),
      originalAmount: payload.totalAmount,
      discountAmount: Math.max(0, payload.totalAmount - payload.finalAmount),
      finalAmount: payload.finalAmount,
      description: serviceNames,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0].slice(0, 5),
      paymentMethod: payload.paymentMethod,
      customerName: payload.customer === 'guest' ? '일회성 고객' : payload.customer?.name,
      usedCoupon: payload.coupon ? {
        name: payload.coupon.name,
        discountAmount: payload.coupon.discountType === 'percent'
          ? Math.floor(payload.totalAmount * (payload.coupon.discountValue / 100))
          : payload.coupon.discountValue
      } : undefined,
      usedPoints: payload.usedPoints > 0 ? payload.usedPoints : undefined,
    };

    if (editingId) {
      setSalesData(prev => prev.map(item => item.id === editingId ? newSales : item));
    } else {
      setSalesData(prev => [...prev, newSales]);
    }

    setModalVisible(false);
    resetModal();
  };

  const editSales = (item: SalesData) => {
    setEditingId(item.id);
    setDetailModalVisible(false);
    setModalVisible(true);
  };

  const handleSalePress = (item: SalesData) => {
    setSelectedSale(item);
    setDetailModalVisible(true);
  };

  const deleteSales = async (id: string) => {

    const confirmed = await showConfirm('정말 삭제하시겠습니까?', {
      title: '매출 취소',
      confirmButtonText: '확인',
      denyButtonText: '취소'
    });

    if (confirmed) {
      await setSalesData(prev => prev.filter(item => item.id !== id));
    }

  };

  const getTodaySales = () => {
    const today = new Date().toISOString().split('T')[0];
    return salesData.filter(item => item.date === today);
  };

  const getSelectedDateSales = () => {
    return salesData.filter(item => item.date === selectedDate);
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split('T')[0]);
    setShowAllSales(false); // 날짜 변경 시 더보기 상태 초기화
  };

  const getMonthSales = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return salesData.filter(item => item.date.startsWith(currentMonth));
  };

  const getTotalAmount = (data: SalesData[]) => {
    return data.reduce((sum, item) => sum + item.finalAmount, 0);
  };

  const getChartData = () => {
    if (viewType === 'daily') {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      const dates = [];

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
      }

      const data = dates.map(date => {
        const dayData = salesData.filter(item => item.date === date);
        return getTotalAmount(dayData);
      });

      return {
        labels: dates.map(date => {
          const d = new Date(date);
          return `${d.getMonth() + 1}/${d.getDate()}`;
        }),
        datasets: [{ data }],
        dates,
      };
    } else {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      const months = [];

      for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
        months.push(d.toISOString().slice(0, 7));
      }

      const data = months.map(month => {
        const monthData = salesData.filter(item => item.date.startsWith(month));
        return getTotalAmount(monthData);
      });

      return {
        labels: months.map(month => {
          const d = new Date(month + '-01');
          return `${d.getMonth() + 1}월`;
        }),
        datasets: [{ data }],
        dates: months,
      };
    }
  };

  const getChartDateRange = () => {
    if (viewType === 'daily') {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      return `${startDate.getMonth() + 1}/${startDate.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`;
    } else {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      return `${startDate.getMonth() + 1}월 - ${endDate.getMonth() + 1}월`;
    }
  };



  const handleChartPress = (data: any) => {
    if (data && data.index !== undefined) {
      const chartData = getChartData();
      const selectedDate = chartData.dates[data.index];
      const amount = chartData.datasets[0].data[data.index];
      const salesCount = viewType === 'daily'
        ? salesData.filter(item => item.date === selectedDate).length
        : salesData.filter(item => item.date.startsWith(selectedDate)).length;

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

  const todaySales = getTodaySales();
  const monthSales = getMonthSales();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
            <ThemedText style={styles.summaryAmount}>
              {getTotalAmount(todaySales).toLocaleString()}원
            </ThemedText>
            <ThemedText style={styles.summaryCount}>{todaySales.length}건</ThemedText>
          </View>
          <View style={styles.summaryCard}>
            <ThemedText style={styles.summaryLabel}>이번 달 매출</ThemedText>
            <ThemedText style={styles.summaryAmount}>
              {getTotalAmount(monthSales).toLocaleString()}원
            </ThemedText>
            <ThemedText style={styles.summaryCount}>{monthSales.length}건</ThemedText>
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
                onPress={() => setViewType('daily')}
              >
                <ThemedText style={[styles.toggleText, viewType === 'daily' && styles.activeToggleText]}>일별</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, viewType === 'monthly' && styles.activeToggle]}
                onPress={() => setViewType('monthly')}
              >
                <ThemedText style={[styles.toggleText, viewType === 'monthly' && styles.activeToggleText]}>월별</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          {salesData.length > 0 && (
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

          {getSelectedDateSales().length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#8E8E93" />
              <ThemedText style={styles.emptyText}>선택한 날짜에 매출이 없습니다</ThemedText>
            </View>
          ) : (
            <>
              {(showAllSales ? getSelectedDateSales() : getSelectedDateSales().slice(0, 5))
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
                      <ThemedText style={styles.salesDescription}>{item.description}</ThemedText>
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
                        style={styles.editButton}
                        onPress={() => editSales(item)}
                      >
                        <Ionicons name="create-outline" size={20} color="#007AFF" />
                      </TouchableOpacity>
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
              {getSelectedDateSales().length > 5 && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={() => setShowAllSales(!showAllSales)}
                >
                  <ThemedText style={styles.showMoreText}>
                    {showAllSales ? '접기' : `더보기 (+${getSelectedDateSales().length - 5})`}
                  </ThemedText>
                  <Ionicons
                    name={showAllSales ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#007AFF"
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <SalesRegisterModal
        visible={modalVisible}
        editing={!!editingId}
        customers={mockCustomers}
        onClose={() => { setModalVisible(false); resetModal(); }}
        onSubmit={handleRegisterSubmit}
      />

      <SalesDetailModal
        visible={detailModalVisible}
        sale={selectedSale}
        onClose={() => setDetailModalVisible(false)}
        onEdit={editSales}
        onDelete={deleteSales}
      />

      <CalendarModal
        visible={calendarVisible}
        currentDate={selectedDate}
        onClose={() => setCalendarVisible(false)}
        onSelect={(dateString) => {
          setSelectedDate(dateString);
          setCalendarVisible(false);
        }}
      />

      
    </SafeAreaView>
  );
}
