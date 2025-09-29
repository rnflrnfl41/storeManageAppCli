export interface Coupon {
  id: string;
  name: string;
  amount: number;
  type: 'percent' | 'fixed';
  createdDate: string;
  expiryDate: string;
  used: boolean;
  usedDate?: string;
  customerId: number;
  customerName: string;
}

export interface CouponForm {
  name: string;
  amount: number;
  type: 'percent' | 'fixed';
  expiryDate: string;
  customerId: number;
  customerName: string;
}

export interface CouponFilter {
  status: 'all' | 'active' | 'used' | 'expired';
  customerId: number;
}

export interface CouponModalProps {
  visible: boolean;
  customerId: number;
  customerName: string;
  onClose: () => void;
  onSave: (coupon: CouponForm) => Promise<boolean>;
}

export interface CouponCardProps {
  coupon: Coupon;
  onDelete: (couponId: string) => void;
  onUse: (couponId: string) => void;
}
