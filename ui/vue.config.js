const path = require("path");
const { IgnorePlugin } = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  productionSourceMap: false,
  outputDir: "dist-libs",
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {},
          javascriptEnabled: true
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new CopyPlugin([
        {
          from: "build/webclient-vue-ui.scss",
          to: "webclient-vue-ui.scss"
        }
      ]),
      // new BundleAnalyzerPlugin()
      // new IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    resolve: {
      /* alias: {
        "@ant-design/icons/lib/dist$": path.resolve(
          "./src/components/icons/index.js"
        )
      } */
    },
    externals: {
      vue: {
        commonjs: "vue",
        commonjs2: "vue",
        amd: "vue",
        root: "vue"
      }
    }
  }
};
