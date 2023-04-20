module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
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
      "@mapgis/mapbox-gl": "@mapgis/mapbox-gl",
      "@mapgis/geojson-vt": "@mapgis/geojson-vt",
      "@mapgis/supercluster": "@mapgis/supercluster",
      "@mapgis/mapbox-gl-draw-static-mode":
        "@mapgis/mapbox-gl-draw-static-mode",
      "@mapgis/mapbox-gl-compare": "@mapgis/mapbox-gl-compare",
      "@mapgis/mapbox-gl-inspect": "@mapgis/mapbox-gl-inspect",
      "@mapgis/webclient-es6-service": "@mapgis/webclient-es6-service",
      "@mapgis/webclient-es6-mapboxgl": "@mapgis/webclient-es6-mapboxgl",
      "@mapgis/webclient-store": "@mapgis/webclient-store",
      "@mapgis/webclient-vue-ui": "@mapgis/webclient-vue-ui",
      "@mapgis/webclient-plot": "@mapgis/webclient-plot",
      "@turf/turf": "@turf/turf",
      echarts: "echarts",
      "file-saver": "file-saver",
      "mapbox-gl-draw-circle": "mapbox-gl-draw-circle",
      mapv: "mapv",
      moment: "moment",
      "postcss-inline-svg": "postcss-inline-svg",
      "resize-detector": "resize-detector",
      vcolorpicker: "vcolorpicker",
      vuepress: "vuepress"
    }
  }
};
