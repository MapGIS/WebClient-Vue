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
  pluginOptions: {
    /* webpackBundleAnalyzer: {
      openAnalyzer: false
    } */
  },
  configureWebpack: {
    externals: {
      vue: "vue",
      "@mapgis/mapbox-gl-draw": "@mapgis/mapbox-gl-draw",
      "@mapgis/mapbox-gl-draw-static-mode":
        "@mapgis/mapbox-gl-draw-static-mode",
      "@mapgis/mapbox-gl": "@mapgis/mapbox-gl",
      "@mapgis/mapbox-gl-compare": "@mapgis/mapbox-gl-compare",
      "@mapgis/mapbox-gl-draw-circle": "@mapgis/mapbox-gl-draw-circle",
      "@mapgis/mapbox-gl-draw-radius": "@mapgis/mapbox-gl-draw-radius",
      "@mapgis/mapbox-gl-inspect": "@mapgis/mapbox-gl-inspect",
      "@mapgis/webclient-es6-service": "@mapgis/webclient-es6-service",
      "@mapgis/webclient-es6-mapboxgl": "@mapgis/webclient-es6-mapboxgl",
      "@mapgis/webclient-store": "@mapgis/webclient-store",
      "@mapgis/webclient-vue-ui": "@mapgis/webclient-vue-ui",
      "@mapgis/webclient-plot": "@mapgis/webclient-plot",
      "@turf/turf": "@turf/turf",
      echarts: "echarts",
      "file-saver": "file-saver",
      html2canvas: "html2canvas",
      "map-promisified": "map-promisified",
      "mapbox-gl": "mapbox-gl",
      "mapbox-gl-draw-circle": "mapbox-gl-draw-circle",
      "mapbox-gl-draw-rectangle-mode": "mapbox-gl-draw-rectangle-mode",
      mapv: "mapv",
      moment: "moment",
      "node-sql-parser": "node-sql-parser",
      "postcss-inline-svg": "postcss-inline-svg",
      "resize-detector": "resize-detector",
      "v-contextmenu": "v-contextmenu",
      "v-jsoneditor": "v-jsoneditor",
      vcolorpicker: "vcolorpicker",
      "vue-runtime-helpers": "vue-runtime-helpers",
      vuepress: "vuepress",
    },
  },
};
