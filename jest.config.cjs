const expoPreset = require('jest-expo/jest-preset');

module.exports = {
  ...expoPreset,

  // Use Jest's default resolver instead
  resolver: undefined,
};