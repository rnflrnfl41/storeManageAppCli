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
import { showConfirm, showError } from '@utils/alertUtils';

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

const services: Service[] = [
  { id: '1', name: '커트', icon: 'cut', basePrice: 25000 },
  { id: '2', name: '파마', icon: 'flower', basePrice: 120000 },
  { id: '3', name: '염색', icon: 'color-palette', basePrice: 80000 },
  { id: '4', name: '트리트먼트', icon: 'leaf', basePrice: 45000 },
  { id: '5', name: '스타일링', icon: 'brush', basePrice: 35000 },
  { id: '6', name: '두피케어', icon: 'medical', basePrice: 30000 }
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
            { name: '5만원 할인쿠폰', type: 'fixed', value: 50000 }
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
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [customerName, setCustomerName] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [viewType, setViewType] = useState<'daily' | 'monthly'>('daily');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearchVisible, setCustomerSearchVisible] = useState(false);
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [serviceAmounts, setServiceAmounts] = useState<{ [key: string]: number }>({});
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [usedPoints, setUsedPoints] = useState(0);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SalesData | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [showAllSales, setShowAllSales] = useState(false);
  const [tooltip, setTooltip] = useState<{ visible: boolean, x: number, y: number, data: any } | null>(null);

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.includes(customerSearchText) ||
    customer.phone.includes(customerSearchText)
  );

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerName(customer.name);
    setCustomerSearchVisible(false);
    setCustomerSearchText('');
  };

  const toggleService = (service: Service) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.id === service.id);
      if (isSelected) {
        // 서비스 제거
        const newServices = prev.filter(s => s.id !== service.id);
        const newAmounts = { ...serviceAmounts };
        delete newAmounts[service.id];
        setServiceAmounts(newAmounts);
        return newServices;
      } else {
        // 서비스 추가
        setServiceAmounts(prev => ({ ...prev, [service.id]: service.basePrice }));
        return [...prev, service];
      }
    });
  };

  const adjustServiceAmount = (serviceId: string, adjustment: number) => {
    setServiceAmounts(prev => ({
      ...prev,
      [serviceId]: Math.max(0, (prev[serviceId] || 0) + adjustment)
    }));
  };

  const setServiceAmount = (serviceId: string, amount: number) => {
    setServiceAmounts(prev => ({
      ...prev,
      [serviceId]: Math.max(0, amount)
    }));
  };

  const getTotalServiceAmount = () => {
    return Object.values(serviceAmounts).reduce((sum, amount) => sum + amount, 0);
  };

  const calculateFinalAmount = () => {
    const totalAmount = getTotalServiceAmount();
    let discount = 0;

    if (selectedCoupon) {
      discount += selectedCoupon.discountType === 'percent'
        ? Math.floor(totalAmount * (selectedCoupon.discountValue / 100))
        : selectedCoupon.discountValue;
    }

    discount += usedPoints;

    return Math.max(0, totalAmount - discount);
  };

  const resetModal = () => {
    setSelectedCustomer(null);
    setCustomerName('');
    setSelectedServices([]);
    setServiceAmounts({});
    setDescription('');
    setAmount('');
    setSelectedCoupon(null);
    setUsedPoints(0);
    setDiscountAmount('');
    setEditingId(null);
  };

  const addSales = () => {
    if (selectedServices.length === 0 || getTotalServiceAmount() <= 0) {
      showError('서비스와 금액을 선택해주세요.');
      return;
    }

    const now = new Date();
    const totalAmount = getTotalServiceAmount();
    let totalDiscount = 0;

    if (selectedCoupon) {
      totalDiscount += selectedCoupon.discountType === 'percent'
        ? Math.floor(totalAmount * (selectedCoupon.discountValue / 100))
        : selectedCoupon.discountValue;
    }

    totalDiscount += usedPoints;

    const serviceNames = selectedServices.map(s => s.name).join(', ');

    const newSales: SalesData = {
      id: Date.now().toString(),
      originalAmount: totalAmount,
      discountAmount: totalDiscount,
      finalAmount: Math.max(0, totalAmount - totalDiscount),
      description: serviceNames,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0].slice(0, 5),
      paymentMethod,
      customerName: selectedCustomer?.name,
      usedCoupon: selectedCoupon ? {
        name: selectedCoupon.name,
        discountAmount: selectedCoupon.discountType === 'percent'
          ? Math.floor(totalAmount * (selectedCoupon.discountValue / 100))
          : selectedCoupon.discountValue
      } : undefined,
      usedPoints: usedPoints > 0 ? usedPoints : undefined,
    };

    if (editingId) {
      setSalesData(prev => prev.map(item =>
        item.id === editingId ? { ...newSales, id: editingId } : item
      ));
    } else {
      setSalesData(prev => [...prev, newSales]);
    }

    resetModal();
    setModalVisible(false);
  };

  const editSales = (item: SalesData) => {
    setEditingId(item.id);
    setAmount(item.originalAmount.toString());
    setDescription(item.description);
    setPaymentMethod(item.paymentMethod);
    setCustomerName(item.customerName || '');
    setDiscountAmount(item.discountAmount.toString());
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

      {/* 매출 등록 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetModal();
        }}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.modalContent}>
              <ThemedText style={styles.modalTitle}>
                {editingId ? '매출 수정' : '매출 등록'}
              </ThemedText>

              {/* 고객 선택 */}
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>고객 선택</ThemedText>
                <TouchableOpacity
                  style={styles.customerSelectButton}
                  onPress={() => setCustomerSearchVisible(true)}
                >
                  <View style={styles.customerSelectContent}>
                    {selectedCustomer ? (
                      <>
                        <View style={styles.customerInfo}>
                          <ThemedText style={styles.customerName}>{selectedCustomer.name}</ThemedText>
                          <ThemedText style={styles.customerPhone}>{selectedCustomer.phone}</ThemedText>
                        </View>
                        <View style={styles.customerPoints}>
                          <ThemedText style={styles.pointsText}>{selectedCustomer.points.toLocaleString()}P</ThemedText>
                          <ThemedText style={styles.couponsText}>쿠폰 {selectedCustomer.coupons.length}개</ThemedText>
                        </View>
                      </>
                    ) : (
                      <ThemedText style={styles.placeholderText}>고객을 선택하세요</ThemedText>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              {/* 서비스 선택 */}
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>서비스 선택</ThemedText>
                <View style={styles.servicesIconGrid}>
                  {services.map((service) => {
                    const isSelected = selectedServices.some(s => s.id === service.id);
                    return (
                      <TouchableOpacity
                        key={service.id}
                        style={[
                          styles.serviceIconButton,
                          isSelected && styles.selectedServiceIconButton
                        ]}
                        onPress={() => toggleService(service)}
                      >
                        <Ionicons
                          name={service.icon as any}
                          size={20}
                          color={isSelected ? "#ffffff" : "#4A90E2"}
                        />
                        <ThemedText style={[
                          styles.serviceIconText,
                          isSelected && styles.selectedServiceIconText
                        ]}>
                          {service.name}
                        </ThemedText>
                        {isSelected && (
                          <View style={styles.serviceIconBadge}>
                            <Ionicons name="checkmark" size={12} color="#ffffff" />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 금액 조절 */}
              {selectedServices.length > 0 && (
                <View style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>금액 조절</ThemedText>
                  {selectedServices.map((service) => (
                    <View key={service.id} style={styles.serviceAmountCard}>
                      <View style={styles.serviceAmountHeader}>
                        <View style={styles.serviceAmountInfo}>
                          <Ionicons name={service.icon as any} size={20} color="#4A90E2" />
                          <ThemedText style={styles.serviceAmountName}>{service.name}</ThemedText>
                        </View>
                        <ThemedText style={styles.serviceAmountValue}>
                          {(serviceAmounts[service.id] || service.basePrice).toLocaleString()}원
                        </ThemedText>
                      </View>
                      <View style={styles.amountAdjustContainer}>
                        <TouchableOpacity
                          style={styles.adjustButton}
                          onPress={() => adjustServiceAmount(service.id, -10000)}
                        >
                          <ThemedText style={styles.adjustButtonText}>-10,000</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.adjustButton}
                          onPress={() => adjustServiceAmount(service.id, -1000)}
                        >
                          <ThemedText style={styles.adjustButtonText}>-1,000</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.adjustButton}
                          onPress={() => adjustServiceAmount(service.id, 1000)}
                        >
                          <ThemedText style={styles.adjustButtonText}>+1,000</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.adjustButton}
                          onPress={() => adjustServiceAmount(service.id, 10000)}
                        >
                          <ThemedText style={styles.adjustButtonText}>+10,000</ThemedText>
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        style={styles.amountInput}
                        value={(serviceAmounts[service.id] || service.basePrice).toString()}
                        onChangeText={(text) => {
                          const num = parseInt(text) || 0;
                          setServiceAmount(service.id, num);
                        }}
                        placeholder="직접 입력"
                        keyboardType="numeric"
                      />
                    </View>
                  ))}
                  <View style={styles.totalAmountDisplay}>
                    <ThemedText style={styles.totalAmountLabel}>총 서비스 금액</ThemedText>
                    <ThemedText style={styles.totalAmountValue}>{getTotalServiceAmount().toLocaleString()}원</ThemedText>
                  </View>
                </View>
              )}

              {/* 쿠폰 및 포인트 */}
              {selectedCustomer && (
                <View style={styles.inputContainer}>
                  <ThemedText style={styles.inputLabel}>할인 혜택</ThemedText>

                  {selectedCustomer.coupons.length > 0 && (
                    <View style={styles.couponSection}>
                      <ThemedText style={styles.sectionSubtitle}>쿠폰 사용</ThemedText>
                      {selectedCustomer.coupons.map((coupon) => (
                        <TouchableOpacity
                          key={coupon.id}
                          style={[
                            styles.couponItem,
                            selectedCoupon?.id === coupon.id && styles.selectedCouponItem
                          ]}
                          onPress={() => setSelectedCoupon(selectedCoupon?.id === coupon.id ? null : coupon)}
                        >
                          <ThemedText style={styles.couponName}>{coupon.name}</ThemedText>
                          <ThemedText style={styles.couponValue}>
                            {coupon.discountType === 'percent'
                              ? `${coupon.discountValue}% 할인`
                              : `${coupon.discountValue.toLocaleString()}원 할인`
                            }
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <View style={styles.pointsSection}>
                    <ThemedText style={styles.sectionSubtitle}>포인트 사용 (보유: {selectedCustomer.points.toLocaleString()}P)</ThemedText>
                    <View style={styles.pointsInputContainer}>
                      <TextInput
                        style={styles.pointsInput}
                        value={usedPoints.toString()}
                        onChangeText={(text) => {
                          const totalAmount = getTotalServiceAmount();
                          const points = Math.min(parseInt(text) || 0, selectedCustomer.points, totalAmount);
                          setUsedPoints(points);
                        }}
                        placeholder="사용할 포인트"
                        keyboardType="numeric"
                      />
                      <TouchableOpacity
                        style={styles.maxPointsButton}
                        onPress={() => {
                          const totalAmount = getTotalServiceAmount();
                          setUsedPoints(Math.min(selectedCustomer.points, totalAmount));
                        }}
                      >
                        <ThemedText style={styles.maxPointsText}>전체</ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {/* 결제 방식 */}
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>결제 방식</ThemedText>
                <View style={styles.paymentToggle}>
                  <TouchableOpacity
                    style={[styles.paymentButton, paymentMethod === 'card' && styles.activePayment]}
                    onPress={() => setPaymentMethod('card')}
                  >
                    <ThemedText style={[styles.paymentText, paymentMethod === 'card' && styles.activePaymentText]}>카드</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.paymentButton, paymentMethod === 'cash' && styles.activePayment]}
                    onPress={() => setPaymentMethod('cash')}
                  >
                    <ThemedText style={[styles.paymentText, paymentMethod === 'cash' && styles.activePaymentText]}>현금</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 결제 요약 */}
              {selectedServices.length > 0 && (
                <View style={styles.paymentSummary}>
                  <View style={styles.summaryRow}>
                    <ThemedText style={styles.summaryLabel}>서비스 금액</ThemedText>
                    <ThemedText style={styles.summaryValue}>{getTotalServiceAmount().toLocaleString()}원</ThemedText>
                  </View>
                  {(selectedCoupon || usedPoints > 0) && (
                    <View style={styles.summaryRow}>
                      <ThemedText style={styles.summaryLabel}>할인</ThemedText>
                      <ThemedText style={styles.discountValue}>-{(
                        (selectedCoupon ?
                          (selectedCoupon.discountType === 'percent'
                            ? Math.floor(getTotalServiceAmount() * (selectedCoupon.discountValue / 100))
                            : selectedCoupon.discountValue)
                          : 0) + usedPoints
                      ).toLocaleString()}원</ThemedText>
                    </View>
                  )}
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <ThemedText style={styles.totalLabel}>최종 결제</ThemedText>
                    <ThemedText style={styles.totalValue}>{calculateFinalAmount().toLocaleString()}원</ThemedText>
                  </View>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setModalVisible(false);
                    resetModal();
                  }}
                >
                  <ThemedText style={styles.cancelButtonText}>취소</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={addSales}
                >
                  <ThemedText style={styles.confirmButtonText}>
                    {editingId ? '수정' : '등록'}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* 매출 상세 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            <View style={styles.detailHeader}>
              <ThemedText style={styles.detailTitle}>매출 상세</ThemedText>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setDetailModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {selectedSale && (
              <View style={styles.detailContent}>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>서비스</ThemedText>
                  <ThemedText style={styles.detailValue}>{selectedSale.description}</ThemedText>
                </View>

                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>원래 금액</ThemedText>
                  <ThemedText style={styles.detailValue}>{selectedSale.originalAmount.toLocaleString()}원</ThemedText>
                </View>

                {selectedSale.discountAmount > 0 && (
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>할인 금액</ThemedText>
                    <ThemedText style={styles.discountAmount}>-{selectedSale.discountAmount.toLocaleString()}원</ThemedText>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>최종 결제</ThemedText>
                  <ThemedText style={styles.detailAmount}>{selectedSale.finalAmount.toLocaleString()}원</ThemedText>
                </View>

                {selectedSale.usedCoupon && (
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>사용 쿠폰</ThemedText>
                    <View style={styles.couponInfo}>
                      <ThemedText style={styles.couponName}>{selectedSale.usedCoupon.name}</ThemedText>
                      <ThemedText style={styles.couponDiscount}>-{selectedSale.usedCoupon.discountAmount.toLocaleString()}원</ThemedText>
                    </View>
                  </View>
                )}

                {selectedSale.usedPoints && (
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>사용 포인트</ThemedText>
                    <ThemedText style={styles.pointsUsed}>{selectedSale.usedPoints.toLocaleString()}P</ThemedText>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>결제 방식</ThemedText>
                  <View style={styles.paymentBadge}>
                    <Ionicons
                      name={selectedSale.paymentMethod === 'card' ? 'card' : 'cash'}
                      size={16}
                      color={selectedSale.paymentMethod === 'card' ? '#007AFF' : '#34C759'}
                    />
                    <ThemedText style={[styles.paymentBadgeText,
                    { color: selectedSale.paymentMethod === 'card' ? '#007AFF' : '#34C759' }]}>
                      {selectedSale.paymentMethod === 'card' ? '카드' : '현금'}
                    </ThemedText>
                  </View>
                </View>

                {selectedSale.customerName && (
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>고객명</ThemedText>
                    <ThemedText style={styles.detailValue}>{selectedSale.customerName}</ThemedText>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>일시</ThemedText>
                  <ThemedText style={styles.detailValue}>{selectedSale.date} {selectedSale.time}</ThemedText>
                </View>

                <View style={styles.detailActions}>
                  <TouchableOpacity
                    style={styles.detailEditButton}
                    onPress={() => editSales(selectedSale)}
                  >
                    <Ionicons name="create-outline" size={20} color="#007AFF" />
                    <ThemedText style={styles.detailEditText}>수정</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.detailDeleteButton}
                    onPress={() => {
                      setDetailModalVisible(false);
                      deleteSales(selectedSale.id);
                    }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    <ThemedText style={styles.detailDeleteText}>삭제</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <CalendarModal
        visible={calendarVisible}
        currentDate={selectedDate}
        onClose={() => setCalendarVisible(false)}
        onSelect={(dateString) => {
          setSelectedDate(dateString);
          setCalendarVisible(false);
        }}
      />

      {/* 고객 검색 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={customerSearchVisible}
        onRequestClose={() => setCustomerSearchVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.searchModal}>
            <View style={styles.searchHeader}>
              <ThemedText style={styles.searchTitle}>고객 검색</ThemedText>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCustomerSearchVisible(false)}
              >
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContent}>
              <TextInput
                style={styles.searchInput}
                value={customerSearchText}
                onChangeText={setCustomerSearchText}
                placeholder="이름 또는 전화번호로 검색"
                autoFocus
              />

              <ScrollView style={styles.customerList}>
                {filteredCustomers.map((customer) => (
                  <TouchableOpacity
                    key={customer.id}
                    style={styles.customerItem}
                    onPress={() => selectCustomer(customer)}
                  >
                    <View style={styles.customerItemInfo}>
                      <ThemedText style={styles.customerItemName}>{customer.name}</ThemedText>
                      <ThemedText style={styles.customerItemPhone}>{customer.phone}</ThemedText>
                    </View>
                    <View style={styles.customerItemMeta}>
                      <ThemedText style={styles.customerItemPoints}>{customer.points.toLocaleString()}P</ThemedText>
                      <ThemedText style={styles.customerItemCoupons}>쿠폰 {customer.coupons.length}개</ThemedText>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  summaryCount: {
    fontSize: 12,
    color: '#6c757d',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  chartToggle: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#4A90E2',
  },
  toggleText: {
    fontSize: 14,
    color: '#6c757d',
  },
  activeToggleText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  listContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
  salesItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  salesInfo: {
    flex: 1,
  },
  salesAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  salesDescription: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  salesDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  salesActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentToggle: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 2,
  },
  paymentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activePayment: {
    backgroundColor: '#4A90E2',
  },
  paymentText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  activePaymentText: {
    color: '#ffffff',
  },
  detailModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 0,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  detailLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
  },
  detailAmount: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  paymentBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  detailEditButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  detailEditText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  detailDeleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F0',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  detailDeleteText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  originalAmount: {
    fontSize: 14,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  discountAmount: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  couponInfo: {
    alignItems: 'flex-end',
  },
  couponName: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  couponDiscount: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
    marginTop: 2,
  },
  pointsUsed: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  dateNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 180,
    justifyContent: 'center',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectedDateMain: {
    fontSize: 17,
    fontWeight: '600',
    color: '#212529',
    letterSpacing: 0.3,
  },
  todayBadge: {
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: '#007AFF',
  },
  todayText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  calendarModal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 0,
    width: '90%',
    maxWidth: 400,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  calendarContent: {
    padding: 20,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 20,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  todayDay: {
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#212529',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  todayDayText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  otherMonthText: {
    color: '#c6c6c6',
  },
  salesDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#34C759',
  },
  dayStats: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  dayStatsText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  salesMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  salesTime: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  customerName: {
    fontSize: 14,
    color: '#6c757d',
  },
  paymentBadgeSmall: {
    marginLeft: 8,
    padding: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  showMoreText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginRight: 6,
  },
  chartTitleContainer: {
    alignItems: 'flex-start',
  },
  chartDateRange: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  chartHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 4,
  },
  chartHintText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    alignSelf: 'center',
  },
  tooltipContent: {
    alignItems: 'center',
  },
  tooltipTitle: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 2,
  },
  tooltipAmount: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 1,
  },
  tooltipCount: {
    fontSize: 11,
    color: '#cccccc',
  },
  dateRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rangeInstruction: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 16,
  },
  selectedRangeInfo: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedRangeText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  rangeDay: {
    backgroundColor: '#e3f2fd',
  },
  rangeStartDay: {
    backgroundColor: '#007AFF',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  rangeEndDay: {
    backgroundColor: '#007AFF',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  rangeDayText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalScrollView: {
    maxHeight: '90%',
    width: '100%',
  },
  customerSelectButton: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  customerSelectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerInfo: {
    flex: 1,
  },
  customerPoints: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  couponsText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  customerPhone: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  placeholderText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  serviceSelectButton: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  selectedServiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  servicePrice: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  amountAdjustContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  adjustButton: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  amountDisplay: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  currentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  couponSection: {
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  couponItem: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  selectedCouponItem: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  couponValue: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
    marginTop: 4,
  },
  pointsSection: {
    marginTop: 8,
  },
  pointsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  maxPointsButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  maxPointsText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  paymentSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValueLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  summaryValue: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '600',
  },
  discountValue: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    color: '#212529',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  searchModal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 0,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  searchContent: {
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  customerList: {
    maxHeight: 300,
  },
  customerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  customerItemInfo: {
    flex: 1,
  },
  customerItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  customerItemPhone: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  customerItemMeta: {
    alignItems: 'flex-end',
  },
  customerItemPoints: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  customerItemCoupons: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  serviceCard: {
    width: '30%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 8,
    position: 'relative',
  },
  serviceCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceCardName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
    textAlign: 'center',
  },
  serviceCardPrice: {
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
  },
  selectedServiceCard: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  selectedServiceCardIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedServiceCardName: {
    color: '#ffffff',
  },
  selectedServiceCardPrice: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceAmountCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  serviceAmountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceAmountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceAmountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  serviceAmountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  totalAmountDisplay: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalAmountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  totalAmountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  servicesList: {
    gap: 8,
  },
  serviceListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedServiceListItem: {
    backgroundColor: '#f0f8ff',
    borderColor: '#4A90E2',
  },
  serviceListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceListIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedServiceListIcon: {
    backgroundColor: '#4A90E2',
  },
  serviceListInfo: {
    flex: 1,
  },
  serviceListName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  selectedServiceListName: {
    color: '#4A90E2',
  },
  serviceListPrice: {
    fontSize: 12,
    color: '#8E8E93',
  },
  selectedServiceListPrice: {
    color: '#4A90E2',
  },
  serviceCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedServiceCheckbox: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  servicesIconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceIconButton: {
    width: 80,
    height: 65,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  selectedServiceIconButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  serviceIconText: {
    fontSize: 11,
    color: '#6c757d',
    marginTop: 3,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedServiceIconText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  serviceIconBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
});