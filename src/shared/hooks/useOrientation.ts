import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      const newOrientation = width > height ? 'landscape' : 'portrait';
      
      // 디바운싱: 100ms 지연으로 깜빡임 방지
      setTimeout(() => {
        setOrientation(newOrientation);
      }, 100);
    };

    // 초기 방향 설정
    const { width, height } = Dimensions.get('window');
    setOrientation(width > height ? 'landscape' : 'portrait');

    // 방향 변경 감지
    const subscription = Dimensions.addEventListener('change', updateOrientation);

    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait'
  };
};
