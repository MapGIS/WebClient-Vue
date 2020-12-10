/* const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); */

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
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
    ]
  }
};
