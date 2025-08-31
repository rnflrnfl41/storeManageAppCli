import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabParamList } from '@types';
import { ThemedText } from '@components/ThemedText';

import HomeScreen from '@screens/HomeScreen';
import SalesScreen from '@screens/SalesScreen';
import ExpenseScreen from '@screens/ExpenseScreen';
import CustomerScreen from '@screens/CustomerScreen';
import CouponScreen from '@screens/CouponScreen';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const Tab = createMaterialTopTabNavigator<TabParamList>();

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'white',
      paddingVertical: isTablet ? 20 : 16,
      paddingBottom: isTablet ? 24 : 20,
      borderTopWidth: 1,
      borderTopColor: '#F0F0F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: string;
        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Sales':
            iconName = 'trending-up';
            break;
          case 'Expense':
            iconName = 'trending-down';
            break;
          case 'Customer':
            iconName = 'people';
            break;
          case 'Coupon':
            iconName = 'pricetag';
            break;
          default:
            iconName = 'home';
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={{
              alignItems: 'center',
              flex: 1,
              paddingVertical: isTablet ? 12 : 10,
            }}
            onPress={onPress}
          >
            <Ionicons 
              name={iconName} 
              size={isTablet ? 28 : 24} 
              color={isFocused ? '#007AFF' : '#8E8E93'} 
            />
            <ThemedText style={{
              fontSize: isTablet ? 14 : 12,
              fontWeight: '500',
              textAlign: 'center',
              marginTop: isTablet ? 8 : 6,
              color: isFocused ? '#007AFF' : '#8E8E93'
            }}>
              {label === 'Sales' ? '매출' : 
               label === 'Expense' ? '지출' : 
               label === 'Customer' ? '고객' : 
               label === 'Coupon' ? '쿠폰' : '홈'}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
      }}
      initialLayout={{ width: Dimensions.get('window').width }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Expense" component={ExpenseScreen} />
      <Tab.Screen name="Customer" component={CustomerScreen} />
      <Tab.Screen name="Coupon" component={CouponScreen} />
    </Tab.Navigator>
  );
}