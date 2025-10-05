// Features Exports
export * from './auth';
export * from './home';
export * from './expense';
export * from './customer';


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
