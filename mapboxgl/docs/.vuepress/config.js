module.exports = {
  title: "VueMapbox",
  // description: "Combine powers of Mapbox GL JS and Vue.js",
  dest: "dist-docs",
  // head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  // base: "/vue-mapbox/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "中地数码",
      description: "@mapgis/webclient-vue-mapboxgl"
    }
  },
  themeConfig: {
    locales: {
      "/en": {
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
            link: "/en/guide/"
          },
          {
            text: "API",
            link: "/en/api/"
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
              ["/en/guide/", "Quickstart"],
              ["/en/guide/basemap.md", "Base map"],
              ["/en/guide/composition.md", "Composition"],
              ["/en/guide/controls.md", "Controls"],
              ["/en/guide/markers&popups.md", "Markers and popups"],
              ["/en/guide/layers&sources.md", "Layers and sources"]
            ]
          },
          {
            title: "API",
            collapsable: false,
            children: [
              ["/en/api/", "GlMap"],
              ["/en/api/controls.md", "Controls"],
              ["/en/api/marker.md", "MapMarker"],
              ["/en/api/popup.md", "Popup"],
              ["/en/api/Layers/", "Layer commons"],
              ["/en/api/Layers/geojsonlayer.md", "GeojsonLayer"],
              ["/en/api/Layers/vectorlayer.md", "VectorLayer"],
              ["/en/api/Layers/rasterlayer.md", "RasterLayer"],
              ["/en/api/Layers/imagelayer.md", "ImageLayer"],
              ["/en/api/Layers/videolayer.md", "VideoLayer"],
              ["/en/api/Layers/canvaslayer.md", "CanvasLayer"]
            ]
          },
          {
            title: "Plugin components",
            collapsable: false,
            children: [
              ["/en/plugin_components/", "Using plugin components"],
              [
                "/en/plugin_components/plugin_components_development.md",
                "Create a plugin component"
              ]
            ]
          }
          // ['/plugins/', 'Plugins'],
        ]
        // search: false
      },
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
            link: "http://develop.smaryun.com"
          },
          { text: "开源", link: "https://github.com/MapGIS/WebClient-Vue" }
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
              ["/guide/layers&sources.md", "图层与数据源"],
              ["/guide/wms&map&doc.md", "子图层控制"],
              ["/guide/cartography.md", "制图综合"]
            ]
          },
          {
            title: "样式模板",
            collapsable: false,
            children: [
              ["/template/", "样式模板"],
              ["/template/zondy.md", "通用模板"],
              ["/template/guotu.md", "国土模板"],
              ["/template/militray.md", "军标模板"]
            ]
          },
          {
            title: "API",
            collapsable: false,
            children: [
              ["/api/", "地图对象"],
              ["/api/controls.md", "控制组件"],
              ["/api/marker.md", "标注"],
              ["/api/popup.md", "气泡"],
              ["/api/Layers/", "图层基础属性"],
              ["/api/Layers/geojsonlayer.md", "GeojsonLayer"],
              ["/api/Layers/VectorTile/mvtstyle.md", "MVT样式"],
              ["/api/Layers/vectorlayer.md", "VectorLayer"],
              ["/api/Layers/rasterlayer.md", "RasterLayer"],
              ["/api/Layers/imagelayer.md", "ImageLayer"],
              ["/api/Layers/videolayer.md", "VideoLayer"],
              ["/api/Layers/canvaslayer.md", "CanvasLayer"],
              ["/api/Layers/igserver/igsDocLayer.md", "IgsDocLayer"],
              ["/api/Layers/igserver/igsTileLayer.md", "IgsTileLayer"],
              ["/api/Layers/igserver/igsVectorLayer.md", "IgsVectorLayer"],
              ["/api/Layers/OGC/ogcWmtsLayer.md", "OGC-WMTS"],
              ["/api/Layers/OGC/ogcWmsLayer.md", "OGC-WMS"],
              ["/api/Layers/ArcGISServer/ArcGISMapLayer.md", "ArcGISMapLayer"],
              [
                "/api/Layers/ArcGISServer/ArcGISTileLayer.md",
                "ArcGISTileLayer"
              ],

              ["/api/Layers/Cluster/cluster.md", "聚类"],
              ["/api/Layers/Heater/heater.md", "热力"],
              ["/api/Layers/Building/building.md", "建筑白膜"],
              ["/api/Layers/Tracker/tracker.md", "轨迹跟踪"],

              ["/api/UI/Draw/draw.md", " 绘制"],
              ["/api/UI/Measure/measure.md", "测量"],
              ["/api/UI/Legend/legend.md", "图例"],
              ["/api/UI/Hawkeye/hawkeye.md", "鹰眼"],
              ["/api/UI/Compare/compare.md", "卷帘"],

              ["/api/Overlay/Echarts.md", "Echarts"],
              ["/api/Overlay/Mapv.md", "MapV"],

              ["/api/UI/Table/BaseTable.md", "表格"],
              ["/api/UI/Table/FeatureTable.md", "要素表格"],
              ["/api/map/mixin/FeatureService.md", "要素服务"]
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
          },
          {
            title: "版本",
            collapsable: false,
            children: [["/version/diff.md", "版本对比"]]
          }
          // ['/plugins/', 'Plugins'],
        ]
        // search: false
      }
    }
  }
};
