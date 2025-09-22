import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabParamList } from '@types';
import { ThemedText } from '@components/ThemedText';

import { HomeScreen } from '@features/home';
import { SalesScreen } from '@features/sales';
import { ExpenseScreen } from '@features/expense';
import { CustomerScreen } from '@features/customer';
import { CouponScreen } from '@features/coupon';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const Tab = createBottomTabNavigator<TabParamList>();

// 아이콘 매핑 - 모던한 아이콘들
const getIconName = (routeName: string): string => {
  const iconMap: Record<string, string> = {
    'Home': 'home-outline',
    'Sales': 'analytics-outline',
    'Expense': 'wallet-outline',
    'Customer': 'person-outline',
    'Coupon': 'gift-outline',
  };
  return iconMap[routeName] || 'home-outline';
};

// 라벨 매핑
const getLabel = (routeName: string): string => {
  const labelMap: Record<string, string> = {
    'Home': '홈',
    'Sales': '매출',
    'Expense': '지출',
    'Customer': '고객',
    'Coupon': '쿠폰',
  };
  return labelMap[routeName] || routeName;
};

// 탭 아이템 컴포넌트
interface TabItemProps {
  route: any;
  index: number;
  isFocused: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ route, index, isFocused, onPress }) => {
  const iconName = getIconName(route.name);
  const label = getLabel(route.name);

  return (
    <TouchableOpacity
      key={route.key}
      style={{
        alignItems: 'center',
        flex: 1,
        paddingVertical: isTablet ? 12 : 10,
        paddingHorizontal: isTablet ? 16 : 12,
        borderRadius: 12,
        backgroundColor: 'transparent',
        minHeight: isTablet ? 72 : 64,
        justifyContent: 'center',
      }}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: isTablet ? 8 : 6,
        }}>
          <Ionicons 
            name={iconName} 
            size={isTablet ? 24 : 22} 
            color={isFocused ? '#007AFF' : '#6B7280'} 
          />
        </View>
        <ThemedText style={{
          fontSize: isTablet ? 14 : 12,
          fontWeight: isFocused ? '700' : '400',
          textAlign: 'center',
          color: isFocused ? '#007AFF' : '#6B7280',
          letterSpacing: 0.1,
          transform: [{ scale: isFocused ? 1.05 : 1 }],
        }}>
          {label}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

// 탭 순서 정의
const TAB_ORDER = ['Sales', 'Expense', 'Home', 'Customer', 'Coupon'];

// 탭 프레스 핸들러
const createTabPressHandler = (navigation: any, route: any, isFocused: boolean) => {
  return () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  // 탭 순서에 따라 정렬된 라우트 생성
  const orderedRoutes = TAB_ORDER.map(routeName => 
    state.routes.find((route: any) => route.name === routeName)
  ).filter(Boolean);

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#FFFFFF',
      paddingVertical: isTablet ? 20 : 16,
      paddingBottom: isTablet ? 24 : 20,
      paddingHorizontal: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 8,
      borderTopWidth: 0.5,
      borderTopColor: '#F0F0F0',
    }}>
      {orderedRoutes.map((route: any, index: number) => {
        const isFocused = state.index === state.routes.findIndex((r: any) => r.key === route.key);
        const onPress = createTabPressHandler(navigation, route, isFocused);

        return (
          <TabItem
            key={route.key}
            route={route}
            index={index}
            isFocused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true, // 지연 로딩 활성화
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
        }}
      />
      <Tab.Screen 
        name="Sales" 
        component={SalesScreen}
        options={{
          tabBarLabel: '매출',
        }}
      />
      <Tab.Screen 
        name="Expense" 
        component={ExpenseScreen}
        options={{
          tabBarLabel: '지출',
        }}
      />
      <Tab.Screen 
        name="Customer" 
        component={CustomerScreen}
        options={{
          tabBarLabel: '고객',
        }}
      />
      <Tab.Screen 
        name="Coupon" 
        component={CouponScreen}
        options={{
          tabBarLabel: '쿠폰',
        }}
      />
    </Tab.Navigator>
  );
}