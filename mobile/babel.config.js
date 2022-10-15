module.exports = function(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [[
      "module-resolver",
      {
        alias: {
          "core": "../core/src",
          "components": "./src/components",
          "screens": "./src/screens"
        },
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.jsx',
          '.json',
          '.tsx',
          '.ts',
          '.native.js',
        ]
      }
    ],
    "react-native-reanimated/plugin",
  ]
  };
};
