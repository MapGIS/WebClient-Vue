const path = require("path");
const { IgnorePlugin } = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

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
      // new BundleAnalyzerPlugin(),
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
      "mapbox-gl": {
        commonjs: "mapbox-gl",
        commonjs2: "mapbox-gl",
        amd: "mapbox-gl",
        root: "mapbox-gl"
      },
      vue: {
        commonjs: "vue",
        commonjs2: "vue",
        amd: "vue",
        root: "vue"
      },
      "map-promisified": {
        commonjs: "map-promisified",
        commonjs2: "map-promisified",
        amd: "map-promisified",
        root: "map-promisified"
      }
    }
  }
};
