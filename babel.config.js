module.exports = {
  presets: ['module:@react-native/babel-preset'],
   plugins: [
    ['module-resolver', {
      root: ['./'],
        alias: {
          '@': './',
          '@src': './src',
          '@features': './src/features',
          '@shared': './src/shared',
          '@store': './src/store',
          '@assets': './assets',
          '@config': './src/shared/config',
          '@components': './src/shared/components',
          '@hooks': './src/shared/hooks',
          '@utils': './src/shared/utils',
          '@types': './src/shared/types',
          '@services': './src/shared/services',
          '@styles': './src/shared/styles',
        }
    }],
  ],
};
