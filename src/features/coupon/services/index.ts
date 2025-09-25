import { Coupon, CouponForm } from '../types';
// import apiClient from '@shared/services/apiClient';

// 임시 데이터 (실제로는 API에서 가져와야 함)
const mockCoupons: Coupon[] = [
  {
    id: '1',
    name: '신규 고객 할인',
    amount: 20,
    type: 'percent',
    createdDate: '2025-01-15',
    expiryDate: '2025-12-31',
    used: false,
    customerId: '1',
    customerName: '김철수',
  },
  {
    id: '2',
    name: '5만원 할인',
    amount: 50000,
    type: 'fixed',
    createdDate: '2025-01-10',
    expiryDate: '2025-06-30',
    used: true,
    usedDate: '2025-02-15',
    customerId: '1',
    customerName: '김철수',
  },
  {
    id: '3',
    name: '10% 할인',
    amount: 10,
    type: 'percent',
    createdDate: '2025-01-20',
    expiryDate: '2025-03-31',
    used: false,
    customerId: '2',
    customerName: '이영희',
  },
  {
    id: '4',
    name: '3만원 할인',
    amount: 30000,
    type: 'fixed',
    createdDate: '2025-01-25',
    expiryDate: '2025-08-31',
    used: false,
    customerId: '1',
    customerName: '김철수',
  },
  {
    id: '5',
    name: '15% 할인',
    amount: 15,
    type: 'percent',
    createdDate: '2025-01-28',
    expiryDate: '2025-05-31',
    used: false,
    customerId: '2',
    customerName: '이영희',
  },
  {
    id: '6',
    name: '2만원 할인',
    amount: 20000,
    type: 'fixed',
    createdDate: '2025-01-30',
    expiryDate: '2025-07-31',
    used: false,
    customerId: '3',
    customerName: '박민수',
  },
  {
    id: '7',
    name: '25% 할인',
    amount: 25,
    type: 'percent',
    createdDate: '2025-02-01',
    expiryDate: '2025-09-30',
    used: false,
    customerId: '2',
    customerName: '이영희',
  },
  {
    id: '8',
    name: '1만원 할인',
    amount: 10000,
    type: 'fixed',
    createdDate: '2025-02-03',
    expiryDate: '2025-04-30',
    used: true,
    usedDate: '2025-02-10',
    customerId: '3',
    customerName: '박민수',
  },
  {
    id: '9',
    name: '30% 할인',
    amount: 30,
    type: 'percent',
    createdDate: '2025-02-05',
    expiryDate: '2025-06-30',
    used: false,
    customerId: '1',
    customerName: '김철수',
  },
  {
    id: '10',
    name: '4만원 할인',
    amount: 40000,
    type: 'fixed',
    createdDate: '2025-02-08',
    expiryDate: '2025-10-31',
    used: false,
    customerId: '3',
    customerName: '박민수',
  },
  {
    id: '11',
    name: '5% 할인',
    amount: 5,
    type: 'percent',
    createdDate: '2025-01-12',
    expiryDate: '2025-02-28',
    used: false,
    customerId: '2',
    customerName: '이영희',
  },
  {
    id: '12',
    name: 'VIP 할인',
    amount: 50000,
    type: 'fixed',
    createdDate: '2025-02-10',
    expiryDate: '2025-12-31',
    used: false,
    customerId: '1',
    customerName: '김철수',
  },
];

export const couponService = {
  // 고객별 쿠폰 조회
  async getCouponsByCustomer(customerId: string): Promise<Coupon[]> {
    try {
      // 실제 API 호출
      // const response = await apiClient.get(`/customers/${customerId}/coupons`);
      // return response.data;
      
      // 임시로 mock 데이터 반환
      return mockCoupons.filter(coupon => coupon.customerId === customerId);
    } catch (error) {
      console.error('쿠폰 조회 실패:', error);
      throw error;
    }
  },

  // 모든 쿠폰 조회
  async getAllCoupons(): Promise<Coupon[]> {
    try {
      // 실제 API 호출
      // const response = await apiClient.get('/coupons');
      // return response.data;
      
      // 임시로 mock 데이터 반환
      return mockCoupons;
    } catch (error) {
      console.error('쿠폰 조회 실패:', error);
      throw error;
    }
  },

  // 쿠폰 등록
  async createCoupon(couponData: CouponForm): Promise<Coupon> {
    try {
      // 실제 API 호출
      // const response = await apiClient.post('/coupons', couponData);
      // return response.data;
      
      // 임시로 mock 데이터 생성
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        ...couponData,
        createdDate: new Date().toISOString().split('T')[0],
        used: false,
        customerName: '고객명', // 실제로는 customerId로 조회해야 함
      };
      
      mockCoupons.push(newCoupon);
      return newCoupon;
    } catch (error) {
      console.error('쿠폰 등록 실패:', error);
      throw error;
    }
  },

  // 쿠폰 삭제
  async deleteCoupon(couponId: string): Promise<void> {
    try {
      // 실제 API 호출
      // await apiClient.delete(`/coupons/${couponId}`);
      
      // 임시로 mock 데이터에서 삭제
      const index = mockCoupons.findIndex(coupon => coupon.id === couponId);
      if (index > -1) {
        mockCoupons.splice(index, 1);
      }
    } catch (error) {
      console.error('쿠폰 삭제 실패:', error);
      throw error;
    }
  },

  // 쿠폰 사용
  async useCoupon(couponId: string): Promise<void> {
    try {
      // 실제 API 호출
      // await apiClient.put(`/coupons/${couponId}/use`);
      
      // 임시로 mock 데이터 업데이트
      const coupon = mockCoupons.find(c => c.id === couponId);
      if (coupon) {
        coupon.used = true;
        coupon.usedDate = new Date().toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('쿠폰 사용 실패:', error);
      throw error;
    }
  },
};
