const env = process.env.NODE_ENV;
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    env === 'production' && 'transform-remove-console',
    ['module:react-native-dotenv'],
  ].filter(Boolean),
};
