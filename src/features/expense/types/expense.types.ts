// Expense Feature Types

// 지출 카테고리 타입
export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// 실제 저장용 Expense 타입
export interface Expense {
  memo: string;
  expenseDate: string;
  categoryId: string;
  categoryName: string;
  amount: number;
}

// View 데이터 타입
export interface ExpenseData {
  id: number;
  amount: number;
  memo: string;
  date: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
}

// Modal Props Types
export interface ExpenseRegisterModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    category: ExpenseCategory;
    amount: number;
    memo: string;
    expenseDate: string;
  }) => Promise<void>;
}

export interface ExpenseDetailModalProps {
  visible: boolean;
  expense: ExpenseData | null;
  onClose: () => void;
  onDelete: (id: number) => void;
}

// API 응답 타입들
export interface ExpenseSummaryResponse {
  today: {
    amount: number;
    count: number;
  };
  month: {
    amount: number;
    count: number;
  };
}

export interface ExpenseChartResponse {
  data: number[];
  dates: string[];
  counts: number[];
}

export interface ExpenseListResponse {
  expenses: ExpenseData[];
  pagination: {
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface ExpenseListParams {
  date: string;
  page?: number;
  limit?: number;
}

export interface ChartDataParams {
  type: 'daily' | 'monthly';
  startDate: string;
  endDate: string;
}

// useExpenseData 훅 관련 타입들
export interface LoadingState {
  summary: boolean;
  chart: boolean;
  list: boolean;
  loadMore: boolean;
}

export interface ExpenseDataState {
  summary: ExpenseSummaryResponse | null;
  chart: {
    daily: ExpenseChartResponse | null;
    monthly: ExpenseChartResponse | null;
  };
  expenseList: {
    [date: string]: {
      data: ExpenseData[];
      pagination: { page: number; total: number; totalPages: number };
    };
  };
  loading: LoadingState;
}

// 기본 지출 카테고리
export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'rent', name: '임대료', icon: 'home', color: '#FF6B6B' },
  { id: 'utilities', name: '공과금', icon: 'flash', color: '#4ECDC4' },
  { id: 'supplies', name: '소모품', icon: 'cube', color: '#45B7D1' },
  { id: 'equipment', name: '장비', icon: 'construct', color: '#96CEB4' },
  { id: 'marketing', name: '마케팅', icon: 'megaphone', color: '#FFEAA7' },
  { id: 'maintenance', name: '유지보수', icon: 'build', color: '#DDA0DD' },
  { id: 'insurance', name: '보험', icon: 'shield', color: '#98D8C8' },
  { id: 'other', name: '기타', icon: 'ellipsis-horizontal', color: '#F7DC6F' },
];
