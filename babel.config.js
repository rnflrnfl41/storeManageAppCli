module.exports = {
  presets: ['module:@react-native/babel-preset'],
   plugins: [
    ['module-resolver', {
      root: ['./'],
      alias: {
        '@': './',
        '@screens': './app/screens',
        '@components': './app/components',
        '@features': './app/features',
        '@shared': './app/shared',
        '@store': './app/store',
        '@assets': './assets',
        '@constants': './app/shared/constants',
        '@hooks': './app/hooks',
        '@utils': './app/shared/utils',
        '@types': './app/shared/types',
        '@services': './app/services',
        '@styles': './app/shared/styles',
      }
    }],
  ],
};
