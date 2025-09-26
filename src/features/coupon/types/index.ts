export interface Coupon {
  id: string;
  name: string;
  amount: number;
  type: 'percent' | 'fixed';
  createdDate: string;
  expiryDate: string;
  isUsed: boolean;
  usedDate?: string;
  customerId: string;
  customerName: string;
}

export interface CouponForm {
  name: string;
  amount: number;
  type: 'percent' | 'fixed';
  expiryDate: string;
  customerId: string;
}

export interface CouponFilter {
  status: 'all' | 'active' | 'used' | 'expired';
  customerId?: string;
}

export interface CouponModalProps {
  visible: boolean;
  customerId?: string;
  customerName?: string;
  onClose: () => void;
  onSave: (coupon: CouponForm) => Promise<boolean>;
}

export interface CouponCardProps {
  coupon: Coupon;
  onDelete: (couponId: string) => void;
  onUse: (couponId: string) => void;
}
