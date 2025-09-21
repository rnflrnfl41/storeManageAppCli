import type { RootState } from '@store/index';
import { globalSpinnerStyles } from '@styles';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, Modal } from 'react-native';
import { useSelector } from 'react-redux';

const GlobalSpinner = () => {
  const loading = useSelector((state: RootState) => state.loading);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      // 스피너 회전 애니메이션
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
    } else {
      spinValue.setValue(0);
    }
  }, [loading, spinValue]);

  if (!loading) return null;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={loading}
      transparent={true}
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}
    >
      <View style={globalSpinnerStyles.overlay}>
        <View style={globalSpinnerStyles.spinnerContainer}>
          <View style={globalSpinnerStyles.spinnerOuter}>
            <Animated.View 
              style={[
                globalSpinnerStyles.spinnerInner,
                { transform: [{ rotate: spin }] }
              ]} 
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export { GlobalSpinner };
