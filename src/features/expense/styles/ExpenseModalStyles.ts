import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const expenseModalStyles = StyleSheet.create({
  // 공통 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // ExpenseRegisterModal 스타일
  modalContainer: {
    width: '95%',
    maxWidth: 450,
    height: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#ffffff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 24,
    paddingBottom: 20,
  },
  modalContent: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  
  // 카테고리 관련 스타일
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  categoryItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ced4da',
    width: '30%',
    minHeight: 50,
  },
  selectedCategoryItem: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F8FF',
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    color: '#212529',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  
  // 날짜 선택 스타일
  customerSelectButton: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  customerSelectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  
  // 금액 입력 스타일
  amountCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  amountAdjustContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  adjustButton: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  
  // 메모 입력 스타일
  memoInput: {
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: 'top',
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    color: '#212529',
  },
  
  // 하단 버튼 스타일
  bottomButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  cancelButtonBottom: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
  },
  saveButtonBottom: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  
  // ExpenseDetailModal 스타일
  detailModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 0,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    minHeight: 300,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    padding: 20,
    flexGrow: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  detailLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '600',
  },
  detailAmount: {
    fontSize: 18,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    marginTop: 20,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
    fontWeight: '600',
  },
});
