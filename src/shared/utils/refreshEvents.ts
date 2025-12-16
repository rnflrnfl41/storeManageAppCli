type RefreshEventType = 'expense' | 'sales' | 'customer' | 'coupon' | 'all';

class RefreshEventEmitter {
  private listeners: Map<RefreshEventType, Set<() => void>> = new Map();

  subscribe(eventType: RefreshEventType, callback: () => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // 구독 해제 함수 반환
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  emit(eventType: RefreshEventType) {
    // 해당 이벤트 타입의 모든 리스너 호출
    this.listeners.get(eventType)?.forEach(callback => callback());
    
    // 'all' 이벤트도 호출
    if (eventType !== 'all') {
      this.listeners.get('all')?.forEach(callback => callback());
    }
  }
}

export const refreshEvents = new RefreshEventEmitter();

