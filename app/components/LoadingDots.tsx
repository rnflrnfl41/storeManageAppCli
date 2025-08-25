import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface LoadingDotsProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: any;
  speed?: 'slow' | 'normal' | 'fast';
}

//로그인 버튼에 사용되는 . . . 스피너
const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  size = 'medium', 
  color = '#667eea',
  style,
  speed = 'normal'
}) => {
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  const getSpeed = () => {
    switch (speed) {
      case 'slow':
        return 800;
      case 'fast':
        return 400;
      default:
        return 600;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 8, height: 8, margin: 3 };
      case 'large':
        return { width: 16, height: 16, margin: 6 };
      default:
        return { width: 12, height: 12, margin: 4 };
    }
  };

  useEffect(() => {
    const duration = getSpeed();
    
    // 점들 깜빡임 애니메이션
    const dot1Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(dot1Opacity, {
          toValue: 0.3,
          duration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    const dot2Animation = Animated.loop(
      Animated.sequence([
        Animated.delay(duration / 3),
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 0.3,
          duration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    const dot3Animation = Animated.loop(
      Animated.sequence([
        Animated.delay((duration / 3) * 2),
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 0.3,
          duration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    dot1Animation.start();
    dot2Animation.start();
    dot3Animation.start();

    return () => {
      dot1Animation.stop();
      dot2Animation.stop();
      dot3Animation.stop();
    };
  }, [dot1Opacity, dot2Opacity, dot3Opacity, speed]);

  const dotSize = getSize();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.dotsContainer}>
        <Animated.View 
          style={[
            styles.dot,
            {
              width: dotSize.width,
              height: dotSize.height,
              marginHorizontal: dotSize.margin,
              backgroundColor: color,
              opacity: dot1Opacity,
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.dot,
            {
              width: dotSize.width,
              height: dotSize.height,
              marginHorizontal: dotSize.margin,
              backgroundColor: color,
              opacity: dot2Opacity,
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.dot,
            {
              width: dotSize.width,
              height: dotSize.height,
              marginHorizontal: dotSize.margin,
              backgroundColor: color,
              opacity: dot3Opacity,
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    borderRadius: 50,
  },
});

export default LoadingDots;
