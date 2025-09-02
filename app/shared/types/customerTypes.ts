export interface CustomerBasic {
  id: string;
  name: string;
  phone: string;
  lastVisit: string | null;
}

export interface ServiceHistory {
  id: string;
  date: string;
  service: string;
  amount: number;
}

export interface Coupon {
  id: string;
  name: string;
  amount: number;
  type: 'percent' | 'fixed';
  createdDate: string;
  expiryDate: string;
  isUsed: boolean;
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