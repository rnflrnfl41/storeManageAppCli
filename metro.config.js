const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
    platforms: ['ios', 'android', 'native', 'web'],
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
    alias: {
      '@': path.resolve(__dirname),
      '@config': path.resolve(__dirname, 'app/config'),
      '@screens': path.resolve(__dirname, 'app/screens'),
      '@components': path.resolve(__dirname, 'app/components'),
      '@features': path.resolve(__dirname, 'app/features'),
      '@shared': path.resolve(__dirname, 'app/shared'),
      '@store': path.resolve(__dirname, 'app/store'),
      '@assets': path.resolve(__dirname, 'assets'),
      '@constants': path.resolve(__dirname, 'app/shared/constants'),
      '@hooks': path.resolve(__dirname, 'app/hooks'),
      '@utils': path.resolve(__dirname, 'app/shared/utils'),
      '@types': path.resolve(__dirname, 'app/shared/types'),
      '@services': path.resolve(__dirname, 'app/services'),
      '@styles': path.resolve(__dirname, 'app/shared/styles'),
    },
  },
  server: { port: 8081 },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
