module.exports = {
  title: "VueMapbox",
  // description: "Combine powers of Mapbox GL JS and Vue.js",
  dest: "dist/docs",
  // head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  // base: "/vue-mapbox/",

  locales: {
    "/": {
      lang: "en-US", // 将会被设置为 <html> 的 lang 属性
      title: "MapGIS",
      description: "@mapgis/webclient-vue-mapboxgl"
    },
    "/zh/": {
      lang: "zh-CN", // 将会被设置为 <html> 的 lang 属性
      title: "中地数码",
      description: "@mapgis/webclient-vue-mapboxgl"
    }
  },
  themeConfig: {
    locales: {
      "/": {
        selectText: "Languages",
        label: "English",
        ariaLabel: "Languages",
        editLinkText: "Edit this page on GitHub",
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh"
          }
        },
        algolia: {},
        nav: [
          {
            text: "Guide",
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
          { text: "Github", link: "https://github.com/soal/vue-mapbox" }
          /* {
            text: "map-promisified",
            link: "https://github.com/soal/map-promisified"
          } */
        ],

        sidebar: [
          {
            title: "Guide",
            collapsable: false,
            children: [
              ["/guide/", "Quickstart"],
              ["/guide/basemap.md", "Base map"],
              ["/guide/composition.md", "Composition"],
              ["/guide/controls.md", "Controls"],
              ["/guide/markers&popups.md", "Markers and popups"],
              ["/guide/layers&sources.md", "Layers and sources"]
            ]
          },
          {
            title: "API",
            collapsable: false,
            children: [
              ["/api/", "GlMap"],
              ["/api/controls.md", "Controls"],
              ["/api/marker.md", "MapMarker"],
              ["/api/popup.md", "Popup"],
              ["/api/Layers/", "Layer commons"],
              ["/api/Layers/geojsonlayer.md", "GeojsonLayer"],
              ["/api/Layers/vectorlayer.md", "VectorLayer"],
              ["/api/Layers/rasterlayer.md", "RasterLayer"],
              ["/api/Layers/imagelayer.md", "ImageLayer"],
              ["/api/Layers/videolayer.md", "VideoLayer"],
              ["/api/Layers/canvaslayer.md", "CanvasLayer"]
            ]
          },
          {
            title: "Plugin components",
            collapsable: false,
            children: [
              ["/plugin_components/", "Using plugin components"],
              [
                "/plugin_components/plugin_components_development.md",
                "Create a plugin component"
              ]
            ]
          }
          // ['/plugins/', 'Plugins'],
        ]
        // search: false
      },
      "/zh/": {
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
            link: "/zh/guide/"
          },
          {
            text: "API",
            link: "/zh/api/"
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
              ["/zh/guide/", "快速上手"],
              ["/zh/guide/basemap.md", "基础地图"],
              ["/zh/guide/composition.md", "结构"],
              ["/zh/guide/controls.md", "控制视图"],
              ["/zh/guide/markers&popups.md", "注记视图"],
              ["/zh/guide/draw.md", "绘制视图"],
              ["/zh/guide/layers&sources.md", "图层与数据源"]
            ]
          },
          {
            title: "样式模板",
            collapsable: false,
            children: [
              ["/zh/template/", "样式模板"],
              ["/zh/template/zondy.md", "通用模板"],
              ["/zh/template/guotu.md", "国土模板"],
              ["/zh/template/militray.md", "军标模板"]
            ]
          },
          {
            title: "API",
            collapsable: false,
            children: [
              ["/zh/api/", "GlMap"],
              ["/zh/api/controls.md", "Controls"],
              ["/zh/api/marker.md", "MapMarker"],
              ["/zh/api/popup.md", "Popup"],
              ["/zh/api/Layers/", "Layer commons"],
              ["/zh/api/Layers/geojsonlayer.md", "GeojsonLayer"],
              ["/zh/api/Layers/vectorlayer.md", "VectorLayer"],
              ["/zh/api/Layers/rasterlayer.md", "RasterLayer"],
              ["/zh/api/Layers/imagelayer.md", "ImageLayer"],
              ["/zh/api/Layers/videolayer.md", "VideoLayer"],
              ["/zh/api/Layers/canvaslayer.md", "CanvasLayer"],
              ["/zh/api/Layers/igserver/igsDocLayer.md", "IgsDocLayer"],
              ["/zh/api/Layers/igserver/igsTileLayer.md", "IgsTileLayer"],
              ["/zh/api/Layers/igserver/igsVectorLayer.md", "IgsVectorLayer"],
              ["/zh/api/Layers/igserver/igsWmsLayer.md", "IgsWmsLayer"],
              ["/zh/api/Layers/igserver/igsWmtsLayer.md", "IgsWmtsLayer"],
              ["/zh/api/Layers/igserver/igsTdtLayer.md", "IgsTdtLayer"],
              ["/zh/api/UI/Measure/measure.md", "Measure"],
              ["/zh/api/UI/Legend/legend.md", "Legend"],
              ["/zh/api/UI/Hawkeye/hawkeye.md", "Hawkeye"],
              [
                "/zh/api/Layers/ArcGISServer/ArcGISMapLayer.md",
                "ArcGISMapLayer"
              ],
              [
                "/zh/api/Layers/ArcGISServer/ArcGISTileLayer.md",
                "ArcGISTileLayer"
              ],
              ["/zh/api/Overlay/Echarts.md", "Echarts"]
            ]
          },
          {
            title: "源码分析",
            collapsable: true,
            children: [
              ["/zh/code/basemap.md", "基础地图"],
              ["/zh/code/controls.md", "控制视图"],
              ["/zh/code/markers&popups.md", "注记视图"],
              ["/zh/code/layers&sources.md", "图层与数据源"]
            ]
          },
          {
            title: "插件组件",
            collapsable: false,
            children: [
              ["/zh/plugin_components/", "使用插件组件"],
              [
                "/zh/plugin_components/plugin_components_development.md",
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
