const path = require('path');

module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
   moduleNameMapper: {
      '^@construct/(.*)$': path.resolve(__dirname, './lib/construct/$1'),
      '^@pattern/(.*)$': path.resolve(__dirname, './lib/pattern/$1'),
      '^@stack/(.*)$': path.resolve(__dirname, './lib/stack/$1'),
      '^@config': path.resolve(__dirname, './config.json'),
   },
};
