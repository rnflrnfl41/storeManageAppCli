export interface Coupon {
  id: string;
  name: string;
  type: 'percent' | 'fixed';
  amount: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  points: number;
  coupons: Coupon[];
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
}

//저장용 Sales 타입
export interface Sales {
  memo: string;
  visitDate: string;
  customerId: number;
  totalServiceAmount: number;
  discountAmount: number;
  finalServiceAmount: number;
  serviceList: {
    name: string;
    price: number;
  }[];
  paymentMethod: string;
  usedPoint: number;
  usedCouponId: string;
}

// View 데이터 타입
export interface SalesData {
  id: number;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  memo: string;
  date: string;
  time: string;
  paymentMethod: 'card' | 'cash';
  customerName?: string;
  usedCoupon?: {
    id: string;
    name: string;
    discountAmount: number;
  };
  usedPoints?: number;
}

// Modal Props Types
export interface SalesRegisterModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    customer: Customer | null | 'guest';
    services: Service[];
    serviceAmounts: { [key: string]: number };
    coupon: Coupon | null;
    usedPoints: number;
    paymentMethod: 'card' | 'cash';
    totalAmount: number;
    finalAmount: number;
    visitDate: string;
    visitTime: string;
  }) => Promise<void>;
}

export interface SalesDetailModalProps {
  visible: boolean;
  sale: SalesData | null;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export interface CustomerSearchModalProps {
  visible: boolean;
  onSelectCustomer: (customer: Customer) => void;
  onSelectGuestCustomer: () => void;
  onClose: () => void;
}

// API 응답 타입들
export interface SalesSummaryResponse {
  today: {
    amount: number;
    count: number;
  };
  month: {
    amount: number;
    count: number;
  };
}

export interface SalesChartResponse {
  data: number[];
  dates: string[];
  counts: number[];
}

export interface SalesListResponse {
  sales: SalesData[];
  pagination: {
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface SalesListParams {
  date: string;
  page?: number;
  limit?: number;
}

export interface ChartDataParams {
  type: 'daily' | 'monthly';
  startDate: string;
  endDate: string;
}

// useSalesData 훅 관련 타입들
export interface LoadingState {
  summary: boolean;
  chart: boolean;
  list: boolean;
  loadMore: boolean;
}

export interface SalesDataState {
  summary: SalesSummaryResponse | null;
  chart: {
    daily: SalesChartResponse | null;
    monthly: SalesChartResponse | null;
  };
  salesList: {
    [date: string]: {
      data: SalesData[];
      pagination: { page: number; total: number; totalPages: number };
    };
  };
  loading: LoadingState;
}