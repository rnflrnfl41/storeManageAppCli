import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  cancelButton: {
    fontSize: 16,
    color: '#8E8E93',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  // 카테고리 관련 스타일
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minWidth: (screenWidth - 64) / 2 - 6,
  },
  selectedCategoryItem: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  // 금액 입력 스타일
  amountInput: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    color: '#212529',
  },
  // 금액 증감 버튼 스타일
  amountButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 6,
  },
  amountButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  amountButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
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
  // 상세 설명 입력 스타일
  descriptionInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  // 결제 수단 선택 스타일
  paymentMethodContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedPaymentMethod: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 8,
  },
  selectedPaymentMethodText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  // 날짜 선택 스타일
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
  },
  // 상세 모달 전용 스타일
  // 매출 상세 모달과 비슷한 스타일
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
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  memoText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  dateTimeText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
    marginTop: 20,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
    fontWeight: '600',
  },
  // 모달 오버레이 및 컨테이너 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
});
