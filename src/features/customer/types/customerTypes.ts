export interface CustomerBasic {
  id: number;
  name: string;
  phone: string;
  lastVisit: string | null;
}

export interface Service {
  id: string;
  name: string;
  amount: number;
}

export interface ServiceHistory {
  id: string;
  date: string;
  services: Service[];
  subtotalAmount: number;
  discountAmount: number;
  finalAmount: number;
  memo?: string;
}

export interface ServiceHistoryDto {
  historyId: number;
  date: string;
  services: ServiceItemDto[];
  subtotalAmount: number;
  discountAmount: number;
  finalAmount: number;
  memo?: string;
}

export interface ServiceItemDto {
  serviceId: number;
  name: string;
  price: number;
}

export interface CouponDto {
  id: string;
  name: string;
  amount: string;
  type: string;
  createdDate: string;
  expiryDate: string;
  used: boolean;
  usedDate?: string;
}

export interface CustomerBenefitResponse {
  points: number;
  couponDtoList: CouponDto[];
}

export interface Coupon {
  id: string;
  name: string;
  amount: number;
  type: 'percent' | 'fixed';
  createdDate: string;
  expiryDate: string;
  used: boolean;
  usedDate?: string;
}

export interface CustomerDetail extends CustomerBasic {
  totalSpent: number;
  visitCount: number;
  points: number;
  coupons: Coupon[];
  serviceHistory: ServiceHistory[];
}

export interface CustomerModalProps {
  visible: boolean;
  customer?: CustomerBasic;
  onClose: () => void;
  onSave: (customer: CustomerBasic) => Promise<boolean>;
}

export interface CustomerDetailModalProps {
  visible: boolean;
  customer?: CustomerBasic;
  onClose: () => void;
}
