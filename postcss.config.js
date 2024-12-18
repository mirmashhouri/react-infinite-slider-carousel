module.exports = {
  plugins: [
    require('postcss-flexbugs-fixes'),
    [
      require('postcss-preset-env'),
      {
        autoprefixer: {
          grid: true,
          flexbox: 'no-2009',
        },
        stage: 3,
      },
    ],
  ],
};
