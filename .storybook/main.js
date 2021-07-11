module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
    "../stories/**/**/*.stories.@(js|jsx|ts|tsx)",    
    "../stories/pro/layout/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/preset-scss",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    '@storybook/addon-knobs',
  ],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.less$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
      ],
    });

    // If you wish to use `scss` file
    // Keep in mind to install `sass` which I don't see it as apart of your deps
    // npm i -D sass
    /* config.module.rules.push({
      // this is for both less and scss
      test: /.*\.(?:sc|c)ss$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: false,
          },
        },
        "sass-loader",
      ],
    }); */

    // I don't think you need this anymore since `style-loader` is being used
    // config.plugins.push(new MiniCssExtractPlugin({
    //   filename: '[name]-[contenthash].css',
    //   chunkFilename: '[id]-[contenthash].css',
    // }));

    return config;
  },
};
