import { Coupon, CouponForm } from '../types';
import { axiosInstance } from '@services/apiClient';

export const couponService = {
  // 고객별 쿠폰 조회
  async getCouponsByCustomer(customerId: string): Promise<Coupon[]> {
    try {
      const response = await axiosInstance.get(`/benefit/coupon/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('쿠폰 조회 실패:', error);
      throw error;
    }
  },

  // 모든 쿠폰 조회
  async getAllCoupons(): Promise<Coupon[]> {
    try {
      const response = await axiosInstance.get('/benefit/coupon/all');
      return response.data;
    } catch (error) {
      console.error('쿠폰 조회 실패:', error);
      throw error;
    }
  },

  // 쿠폰 등록
  async createCoupon(couponData: CouponForm): Promise<Coupon> {
    try {
      const response = await axiosInstance.post('/benefit/coupon', couponData);
      return response.data;
    } catch (error) {
      console.error('쿠폰 등록 실패:', error);
      throw error;
    }
  },

  // 쿠폰 삭제
  async deleteCoupon(couponId: string): Promise<void> {
    try {
      await axiosInstance.delete(`/benefit/coupon/${couponId}`);
    } catch (error) {
      console.error('쿠폰 삭제 실패:', error);
      throw error;
    }
  },

};
