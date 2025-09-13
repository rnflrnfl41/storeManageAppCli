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

// 실제 저장용 Sales 타입
export interface Sales {
  memo: string;
  visit_date: string;
  customer_id: number;
  total_service_amount: number;
  discount_amount: number;
  final_service_amount: number;
  service: {
    service_name: string;
    price: number;
  }[];
  paymentMethod: string;
  usedPoint: number;
  usedCouponId: string;
}

// View용 Mock 데이터 타입 (기존 SalesData)
export interface SalesData {
  id: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
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
  }) => void;
}

export interface SalesDetailModalProps {
  visible: boolean;
  sale: SalesData | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export interface CustomerSearchModalProps {
  visible: boolean;
  onSelectCustomer: (customer: Customer) => void;
  onSelectGuestCustomer: () => void;
  onClose: () => void;
}