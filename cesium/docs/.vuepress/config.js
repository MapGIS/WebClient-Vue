// const demoCode = require("vuepress-plugin-demo-code");

module.exports = {
  title: "VueCesium",
  dest: "dist-docs",

  /*   evergreen: true,
  serviceWorker: true, */

  locales: {
    "/": {
      lang: "zh-CN",
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
              ["/guide/wms&map&doc.md", "子图层控制"]
            ]
          },
          {
            title: "API",
            collapsable: false,
            children: [
              ["/api/", "地图场景"],
              ["/api/datasource/geojson.md", "GeoJSON"],
              ["/api/layer/IGServer/IgsVectorLayer.md", "IGS-二维矢量"],
              ["/api/layer/IGServer/IgsDocLayer.md", "IGS-Doc"],
              ["/api/layer/IGServer/IgsTileLayer.md", "IGS-Tile"],
              ["/api/layer/ArcGISServer/ArcGISMapLayer.md", "ArcGIS-Map"],
              ["/api/layer/ArcGISServer/ArcGISTileLayer.md", "ArcGIS-Tile"],
              ["/api/layer/OGC/CesiumOgcWmsLayer.md", "WMS"],
              ["/api/layer/OGC/CesiumOgcWmtsLayer.md", "WMTS"],
              ["/api/layer/vectortile/vectortile.md", "矢量瓦片"],
              ["/api/m3d/m3d.md", "M3D"],
              ["/api/analysis/Viewshed.md", "可视域分析"],
              ["/api/analysis/Sightline.md", "通视分析"],
              ["/api/analysis/Flood.md", "洪水淹没分析"],
              ["/api/ui/popup.md", "气泡"],
              ["/api/ui/compare.md", "卷帘"],
              ["/api/ui/link.md", "多屏联动"],
              ["/api/ui/legend.md", "图例"],
              ["/api/ui/table.md", "表格"],
              ["/api/ui/draw.md", "绘制"],
              ["/api/ui/measure.md", "量算"],
              ["/api/Overlay/Echarts.md", "Echarts"],
              ["/api/Overlay/Mapv.md", "MapV"],
              ["/api/provider/igsterrain.md", "IGS地形"]
            ]
          },
          {
            title: "组件开发",
            collapsable: false,
            children: [
              ["/plugin_components/", "使用组件"],
              [
                "/plugin_components/plugin_components_development.md",
                "创建组件"
              ]
            ]
          },
          {
            title: "版本",
            collapsable: false,
            children: [["/version/diff.md", "版本对比"]]
          }
        ]
      }
    }
  },
  serviceWorker: true,
  head: [
    [
      "script",
      {
        src:
          "https://cdn.jsdelivr.net/npm/react@16.6.3/umd/react.production.min.js"
      }
    ],
    [
      "script",
      {
        src:
          "https://cdn.jsdelivr.net/npm/react-dom@16.6.3/umd/react-dom.production.min.js"
      }
    ],
    ["script", { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js" }],
    [
      "script",
      { src: "https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js" }
    ],
    [
      "script",
      { src: "https://cdn.jsdelivr.net/npm/numerify/lib/index.umd.min.js" }
    ],
    [
      "link",
      {
        href:
          "http://develop.smaryun.com/static/libs/cdn/zondyclient/npm/webclient-vue-cesium.css",
        rel: "stylesheet",
        type: "text/css"
      }
    ],
    [
      "script",
      {
        src:
          "http://develop.smaryun.com/static/libs/cdn/zondyclient/npm/webclient-vue-cesium.umd.js"
      }
    ]
  ],
  plugins: [
    [
      "demo-block",
      {
        settings: {
          jsLibs: [],
          cssLibs: [],
          jsfiddle: true, // 是否显示 jsfiddle 链接
          codepen: true, // 是否显示 codepen 链接
          horizontal: false // 是否展示为横向样式
        }
      }
    ]
  ]
};
