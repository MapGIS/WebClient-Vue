module.exports = {
  stories: [
    "../stories/**/*.stories.@(mdx|js)",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
    "../stories/**/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/preset-scss",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    // "@storybook/addon-knobs",
    "@storybook/addon-a11y",
    {
      name: '@storybook/addon-storysource',
      options: {
        loaderOptions: {
          prettierConfig: { printWidth: 80, singleQuote: false },
        },
      },
    },
    {
      name: '@storybook/addon-docs',
      options: {
        sourceLoaderOptions: {
          injectStoryParameters: false,
        },
      },
    },
  ],
  webpackFinal: async (config, { configType }) => {
    config.node = {
      fs: "empty",
    };
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
