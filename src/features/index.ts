// Features Exports
export * from './auth';
export * from './home';
export * from './expense';

// Customer exports - exclude Coupon to avoid conflicts
export { CustomerScreen, CustomerDetailModal, CustomerModal } from './customer';
export type { 
  CustomerBasic, 
  Service as CustomerService, 
  ServiceHistory, 
  ServiceHistoryDto, 
  ServiceItemDto, 
  CouponDto, 
  CustomerBenefitResponse, 
  Coupon as CustomerCoupon, 
  CustomerDetail, 
  CustomerModalProps, 
  CustomerDetailModalProps 
} from './customer';

// Coupon exports - exclude Coupon to avoid conflicts  
export { CouponScreen } from './coupon';
export type { 
  Coupon as CouponCoupon, 
  CouponForm, 
  CouponFilter, 
  CouponModalProps, 
  CouponCardProps 
} from './coupon';

// Sales - exclude conflicting types
export { SalesScreen, SalesDetailModal, SalesRegisterModal, CustomerSearchModal, useSalesData } from './sales';
export type { 
  Sales, 
  SalesData, 
  SalesRegisterModalProps, 
  SalesDetailModalProps, 
  CustomerSearchModalProps, 
  SalesListResponse, 
  SalesDataState 
} from './sales';

// Re-export shared types that are used by sales
export type { 
  SummaryResponse as SalesSummaryResponse,
  ChartResponse as SalesChartResponse,
  ListParams as SalesListParams,
  ChartDataParams,
  LoadingState
} from '../shared/types';
