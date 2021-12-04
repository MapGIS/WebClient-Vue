/* const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); */

module.exports = {
  productionSourceMap: false,
  outputDir: "dist-libs",
  configureWebpack: {
    externals: {
      vue: {
        commonjs: "vue",
        commonjs2: "vue",
        amd: "vue",
        root: "vue",
      },
    },
    plugins: [
      /* new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: productionGzipExtensions,
        threshold: 2048,
        minRatio: 0.8
      }), */
      /* new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          }
        },
        parallel: true
      }) */
    ],
  },
};
