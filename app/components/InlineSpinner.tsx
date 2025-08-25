import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface InlineSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: any;
}

//버튼이나 내부 컴포넌트에 사용되는 스피너
const InlineSpinner: React.FC<InlineSpinnerProps> = ({ 
  size = 'medium', 
  color = '#667eea',
  style 
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => {
      spinAnimation.stop();
    };
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 16, height: 16, borderWidth: 2 };
      case 'large':
        return { width: 24, height: 24, borderWidth: 3 };
      default:
        return { width: 20, height: 20, borderWidth: 2.5 };
    }
  };

  const spinnerSize = getSize();

  return (
    <View style={[styles.container, style]}>
      <Animated.View 
        style={[
          styles.spinner,
          {
            width: spinnerSize.width,
            height: spinnerSize.height,
            borderWidth: spinnerSize.borderWidth,
            borderTopColor: color,
            borderRightColor: color,
            transform: [{ rotate: spin }]
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    borderRadius: 50,
    borderColor: 'transparent',
  },
});

export default InlineSpinner;
