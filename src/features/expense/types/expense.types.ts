export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Expense {
  memo: string;
  expenseDate: string;
  categoryId: string;
  categoryName: string;
  amount: number;
}

// 지출 데이터 타입 (서버/클라이언트 공통)
export interface ExpenseData {
  id: number;
  amount: number;
  memo: string;
  expenseDate: string;
  categoryName: string;
}

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

// 지출 목록 응답 타입 (서버/클라이언트 공통)
export interface ExpenseListResponse {
  content: ExpenseData[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
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

export interface UseExpenseDataReturn extends ExpenseDataState {
  loadSummaryData: (date: string) => Promise<void>;
  loadChartData: (params: ChartDataParams) => Promise<void>;
  loadExpenseList: (params: ExpenseListParams) => Promise<void>;
  loadMoreExpenseList: (params: ExpenseListParams) => Promise<void>;
  deleteExpense: (id: number, date: string) => Promise<void>;
  refreshData: (date: string) => Promise<void>;
}

// 기본 카테고리 데이터
export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: '1', name: '임대료', icon: 'home-outline', color: '#FF6B6B' },
  { id: '2', name: '전기세', icon: 'flash-outline', color: '#4ECDC4' },
  { id: '3', name: '가스비', icon: 'flame-outline', color: '#45B7D1' },
  { id: '4', name: '인터넷', icon: 'wifi-outline', color: '#96CEB4' },
  { id: '5', name: '소모품', icon: 'cube-outline', color: '#FFEAA7' },
  { id: '6', name: '수리비', icon: 'construct-outline', color: '#DDA0DD' },
  { id: '7', name: '광고비', icon: 'megaphone-outline', color: '#98D8C8' },
  { id: '8', name: '보험료', icon: 'shield-outline', color: '#F7DC6F' },
  { id: '9', name: '청소용품', icon: 'sparkles-outline', color: '#BB8FCE' },
  { id: '10', name: '사무용품', icon: 'clipboard-outline', color: '#85C1E9' },
  { id: '11', name: '기타', icon: 'ellipsis-horizontal-outline', color: '#AAB7B8' },
];