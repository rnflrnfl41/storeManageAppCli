import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { ThemedText } from '@components/ThemedText';
import { RootState } from '@store';
import { logout } from '@store/authSlice';
import { cardStyles } from '@styles';
import { router } from '@utils/navigation';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // 인증 상태 체크
  useEffect(() => {
    if (!userInfo) {
      console.log('인증되지 않은 사용자, 로그인 화면으로 이동');
      router.replace('Login');
    }
  }, [userInfo, router]);

  // 인증되지 않은 사용자는 로딩 표시
  if (!userInfo) {
    return null; // 또는 로딩 스피너 표시
  }

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            router.replace("Login");
          }
        }
      ]
    );
  };

  const handleFeaturePress = (feature: string) => {
    // TODO: 각 기능별 네비게이션 구현
    console.log(`${feature} 기능 선택됨`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 헤더 영역 */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <ThemedText type="title" style={styles.welcomeText}>
              안녕하세요, {userInfo?.userName || '사용자'}님!
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              오늘도 좋은 하루 되세요 ✨
            </ThemedText>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* 요약 정보 카드 */}
        <View style={[cardStyles.container, cardStyles.elevated, styles.summaryCard]}>
          <View style={cardStyles.header}>
            <ThemedText style={cardStyles.title}>📊 오늘 요약</ThemedText>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryValue}>₩0</ThemedText>
              <ThemedText style={styles.summaryLabel}>오늘 매출</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryValue}>₩0</ThemedText>
              <ThemedText style={styles.summaryLabel}>오늘 지출</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryValue}>0</ThemedText>
              <ThemedText style={styles.summaryLabel}>신규 고객</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryValue}>0</ThemedText>
              <ThemedText style={styles.summaryLabel}>사용된 쿠폰</ThemedText>
            </View>
          </View>
        </View>

        {/* 주요 기능 카드들 */}
        <View style={styles.featuresSection}>
          <ThemedText style={styles.sectionTitle}>주요 기능</ThemedText>

          <TouchableOpacity
            style={[cardStyles.container, cardStyles.interactive, styles.featureCardContainer]}
            onPress={() => handleFeaturePress('매출 등록')}
          >
            <View style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="trending-up" size={24} color="white" />
              </View>
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>매출 등록</ThemedText>
                <ThemedText style={styles.featureDescription}>
                  새로운 매출을 등록하고 관리합니다
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[cardStyles.container, cardStyles.interactive, styles.featureCardContainer]}
            onPress={() => handleFeaturePress('지출 등록')}
          >
            <View style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#F44336' }]}>
                <Ionicons name="trending-down" size={24} color="white" />
              </View>
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>지출 등록</ThemedText>
                <ThemedText style={styles.featureDescription}>
                  비용과 지출을 등록하고 추적합니다
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[cardStyles.container, cardStyles.interactive, styles.featureCardContainer]}
            onPress={() => handleFeaturePress('고객 관리')}
          >
            <View style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#2196F3' }]}>
                <Ionicons name="people" size={24} color="white" />
              </View>
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>고객 관리</ThemedText>
                <ThemedText style={styles.featureDescription}>
                  고객 정보를 등록하고 관리합니다
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[cardStyles.container, cardStyles.interactive, styles.featureCardContainer]}
            onPress={() => handleFeaturePress('쿠폰 등록')}
          >
            <View style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#FF9800' }]}>
                <Ionicons name="pricetag" size={24} color="white" />
              </View>
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>쿠폰 등록</ThemedText>
                <ThemedText style={styles.featureDescription}>
                  할인 쿠폰을 생성하고 관리합니다
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 최근 활동 카드 */}
        <View style={[cardStyles.container, cardStyles.outlined, styles.recentActivityCard]}>
          <View style={cardStyles.header}>
            <ThemedText style={cardStyles.title}>📅 최근 활동</ThemedText>
          </View>
          <View style={styles.recentActivity}>
            <ThemedText style={styles.noActivityText}>
              아직 활동 내역이 없습니다
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCard: {
    margin: 20,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1F2937',
  },
  featureCardContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  featureContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  recentActivityCard: {
    margin: 20,
    marginTop: 8,
    marginBottom: 30,
    backgroundColor: 'white',
  },
  recentActivity: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  noActivityText: {
    fontSize: 15,
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});
