module.exports = {
  title: "VueMapbox",
  // description: "Combine powers of Mapbox GL JS and Vue.js",
  dest: "dist/docs",
  // head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  // base: "/vue-mapbox/",

  locales: {
    "/": {
      lang: "zh-CN", // 将会被设置为 <html> 的 lang 属性
      title: "中地数码",
      description: "@mapgis/webclient-vue-cesium"
    }
  },
  themeConfig: {
    locales: {
      "/": {
        // 多语言下拉菜单的标题
        selectText: "选择语言",
        // 该语言在下拉菜单中的标签
        label: "简体中文",
        // 编辑链接文字
        editLinkText: "在 GitHub 上编辑此页",
        // Service Worker 的配置
        serviceWorker: {
          updatePopup: {
            message: "发现新内容可用.",
            buttonText: "刷新"
          }
        },
        // 当前 locale 的 algolia docsearch 选项
        algolia: {},
        nav: [
          {
            text: "向导",
            link: "/guide/"
          },
          {
            text: "API",
            link: "/api/"
          },
          {
            text: "WebClient",
            link: "http://develop.smaryun.com:8899/#/index"
          },
          { text: "开源", link: "https://github.com/soal/vue-mapbox" }
          /* {
            text: "map-promisified",
            link: "https://github.com/soal/map-promisified"
          } */
        ],
        sidebar: [
          {
            title: "指南",
            collapsable: false,
            children: [
              ["/guide/", "快速上手"],
              ["/guide/basemap.md", "基础地图"],
              ["/guide/composition.md", "结构"],
              ["/guide/controls.md", "控制视图"],
              ["/guide/markers&popups.md", "注记视图"],
              ["/guide/draw.md", "绘制视图"],
              ["/guide/layers&sources.md", "图层与数据源"]
            ]
          },
          {
            title: "API",
            collapsable: false,
            children: [
              ["/api/", "WebGlobe"],
              /* ["/api/controls.md", "Controls"], */
              ["/api/popup.md", "Popup"],
/*               ["/api/Layers/", "Layer commons"],
              ["/api/Layers/geojsonlayer.md", "GeojsonLayer"],
              ["/api/Layers/vectorlayer.md", "VectorLayer"],
              ["/api/Layers/rasterlayer.md", "RasterLayer"],
              ["/api/Layers/imagelayer.md", "ImageLayer"],
              ["/api/Layers/videolayer.md", "VideoLayer"],
              ["/api/Layers/canvaslayer.md", "CanvasLayer"],
              ["/api/Layers/igserver/igsDocLayer.md", "IgsDocLayer"],
              ["/api/Layers/igserver/igsTileLayer.md", "IgsTileLayer"],
              ["/api/Layers/igserver/igsVectorLayer.md", "IgsVectorLayer"],
              ["/api/Layers/igserver/igsWmsLayer.md", "IgsWmsLayer"],
              ["/api/Layers/igserver/igsWmtsLayer.md", "IgsWmtsLayer"],
              ["/api/Layers/igserver/igsTdtLayer.md", "IgsTdtLayer"],
              ["/api/Measure/measure.md", "Measure"] */
            ]
          },
          {
            title: "源码分析",
            collapsable: true,
            children: [
              ["/code/basemap.md", "基础地图"],
              ["/code/controls.md", "控制视图"],
              ["/code/markers&popups.md", "注记视图"],
              ["/code/layers&sources.md", "图层与数据源"]
            ]
          },
          {
            title: "插件组件",
            collapsable: false,
            children: [
              ["/plugin_components/", "使用插件组件"],
              [
                "/plugin_components/plugin_components_development.md",
                "创建插件组件"
              ]
            ]
          }
          // ['/plugins/', 'Plugins'],
        ]
        // search: false
      }
    }
  }
};
