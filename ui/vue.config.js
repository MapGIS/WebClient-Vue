const path = require("path");
const { IgnorePlugin } = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  productionSourceMap: false,
  outputDir: "dist-libs",
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {},
          javascriptEnabled: true,
        },
      },
    },
  },
  configureWebpack: {
    plugins: [
      new CopyPlugin([
        {
          from: "build/webclient-vue-ui.scss",
          to: "webclient-vue-ui.scss",
        },
        {
          from: "build/theme.scss",
          to: "theme.scss",
        },
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
        root: "vue",
      },
      "@ant-design/icons": "@ant-design/icons",
      "@mapgis/webclient-es6-service": "@mapgis/webclient-es6-service",
      "@mapgis/webclient-store": "@mapgis/webclient-store",
      "@mapgis/mapbox-gl": "@mapgis/mapbox-gl",
      "@mapgis/geojson-vt": "@mapgis/geojson-vt",
      "@mapgis/supercluster": "@mapgis/supercluster",
      "@vue/composition-api": "@vue/composition-api",
      "@vuepress/plugin-active-header-links":
        "@vuepress/plugin-active-header-links",
      "@vuepress/plugin-nprogress": "@vuepress/plugin-nprogress",
      "ant-design-vue": "ant-design-vue",
      axios: "axios",
      clone: "clone",
      "core-js": "core-js",
      "css-vars-ponyfill": "css-vars-ponyfill",
      d3: "d3",
      echarts: "echarts",
      "file-saver": "file-saver",
      "js-md5": "js-md5",
      jsoneditor: "jsoneditor",
      lodash: "lodash",
      "lodash.uniqueid": "lodash.uniqueid",
      proj4: "proj4",
      qs: "qs",
      "resize-detector": "resize-detector",
      "simple-uploader.js": "simple-uploader.js",
      "spark-md5": "spark-md5",
      tinycolor2: "tinycolor2",
      vcolorpicker: "vcolorpicker",
      "video.js": "video.js",
      "videojs-contrib-hls": "videojs-contrib-hls",
      "vue-color": "vue-color",
      "vue-infinite-scroll": "vue-infinite-scroll",
      vuepress: "vuepress",
      "vuepress-plugin-demo-block": "vuepress-plugin-demo-block",
      "vuepress-plugin-demo-code": "vuepress-plugin-demo-code",
      less: "less",
      "less-loader": "less-loader",
      "node-sass": "node-sass",
      "sass-loader": "sass-loader",
    },
  },
};
