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
      '@src': path.resolve(__dirname, 'src'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@assets': path.resolve(__dirname, 'assets'),
      '@config': path.resolve(__dirname, 'src/shared/config'),
      '@components': path.resolve(__dirname, 'src/shared/components'),
      '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
      '@utils': path.resolve(__dirname, 'src/shared/utils'),
      '@types': path.resolve(__dirname, 'src/shared/types'),
      '@services': path.resolve(__dirname, 'src/shared/services'),
      '@styles': path.resolve(__dirname, 'src/shared/styles'),
    },
  },
  server: { port: 8081 },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
