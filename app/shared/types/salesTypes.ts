export interface Coupon {
  id: string;
  name: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
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