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
      "@mapgis/geojson-vt": "@mapgis/geojson-vt",
      "@mapgis/mapbox-gl": "@mapgis/mapbox-gl",
      "@mapgis/mapbox-gl-compare": "@mapgis/mapbox-gl-compare",
      "@mapgis/mapbox-gl-draw": "@mapgis/mapbox-gl-draw",
      "@mapgis/mapbox-gl-draw-circle": "@mapgis/mapbox-gl-draw-circle",
      "@mapgis/mapbox-gl-draw-radius": "@mapgis/mapbox-gl-draw-radius",
      "@mapgis/mapbox-gl-draw-static-mode":
        "@mapgis/mapbox-gl-draw-static-mode",
      "@mapgis/mapbox-gl-inspect": "@mapgis/mapbox-gl-inspect",
      "@mapgis/supercluster": "@mapgis/supercluster",
      "@mapgis/webclient-cesium-plugin": "@mapgis/webclient-cesium-plugin",
      "@mapgis/webclient-common": "@mapgis/webclient-common",
      "@mapgis/webclient-es6-mapboxgl": "@mapgis/webclient-es6-mapboxgl",
      "@mapgis/webclient-es6-service": "@mapgis/webclient-es6-service",
      "@mapgis/webclient-plot": "@mapgis/webclient-plot",
      "@mapgis/webclient-store": "@mapgis/webclient-store",
      "@mapgis/webclient-vue-ui": "@mapgis/webclient-vue-ui",
      "@turf/turf": "@turf/turf",
      echarts: "echarts",
      "file-saver": "file-saver",
      "mapbox-gl-draw-circle": "mapbox-gl-draw-circle",
      mapv: "mapv",
      moment: "moment",
      "postcss-inline-svg": "postcss-inline-svg",
      "resize-detector": "resize-detector",
      vcolorpicker: "vcolorpicker",
      vuepress: "vuepress",
    },
  },
};
