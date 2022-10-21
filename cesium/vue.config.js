/* const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); */

module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  productionSourceMap: false,
  outputDir: "dist-libs",
  configureWebpack: {
    externals: {
      "vue": "vue",
      "@antv/g6": "@antv/g6",
      "@antv/hierarchy": "@antv/hierarchy",
      "@mapbox/mapbox-gl-style-spec": "@mapbox/mapbox-gl-style-spec",
      "@mapgis/webclient-es6-service": "@mapgis/webclient-es6-service",
      "@mapgis/cesium": "@mapgis/cesium",
      "@mapgis/webclient-plot": "@mapgis/webclient-plot",
      "@mapgis/webclient-store": "@mapgis/webclient-store",
      "@mapgis/webclient-vue-ui": "@mapgis/webclient-vue-ui",
      "@turf/turf": "@turf/turf",
      "@vuepress/plugin-active-header-links": "@vuepress/plugin-active-header-links",
      "@vuepress/plugin-nprogress": "@vuepress/plugin-nprogress",
      "compression-webpack-plugin": "compression-webpack-plugin",
      "core-js": "core-js",
      "echarts": "echarts",
      "echarts-gl": "echarts-gl",
      "file-saver": "file-saver",
      "html2canvas": "html2canvas",
      "jspdf": "jspdf",
      "mapv": "mapv",
      "moment": "moment",
      "ol": "ol",
      "tiptap": "tiptap",
      "tiptap-extensions": "tiptap-extensions",
      "uglifyjs-webpack-plugin": "uglifyjs-webpack-plugin",
      "vcolorpicker": "vcolorpicker",
      "vuepress": "vuepress",
      "wangeditor-antd": "wangeditor-antd",
      "webfont-matcher": "webfont-matcher",
      "less": "less",
      "less-loader": "less-loader",
      "sass-loader": "sass-loader",
      "node-sass": "node-sass"
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
