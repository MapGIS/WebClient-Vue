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
              ["/guide/introduction.md", "产品介绍"],
              ["/guide/basemap.md", "基础地图"],
              ["/guide/wms&map&doc.md", "子图层控制"]
            ]
          },
          {
            title: "组件",
            collapsable: false,
            children: [
              {
                title: "场景",
                collapsable: false,
              },
              ["/api/", "地图场景"],

              {
                title: "场景子组件",
                collapsable: false,
              },
              ["/api/ui/popup.md", "气泡"],
              ["/api/ui/marker.md", "标记点"],
              ["/api/ui/compare.md", "卷帘"],
              ["/api/ui/link.md", "多屏联动"],
              ["/api/ui/legend.md", "图例"],
              ["/api/ui/table.md", "表格"],
              ["/api/ui/draw.md", "绘制"],
              ["/api/ui/measure.md", "量测"],

              {
                title: "图层",
                collapsable: false,
              },
              ["/api/layer/IGServer/IgsVectorLayer.md", "IGS二维矢量"],
              ["/api/layer/IGServer/IgsDocLayer.md", "IGS地图文档"],
              ["/api/layer/IGServer/IgsTileLayer.md", "IGS瓦片"],
              ["/api/provider/igsterrain.md", "IGS地形"],

              ["/api/layer/ArcGISServer/ArcGISMapLayer.md", "ArcGIS地图"],
              ["/api/layer/ArcGISServer/ArcGISTileLayer.md", "ArcGIS瓦片"],

              ["/api/layer/OGC/CesiumOgcWmsLayer.md", "WMS"],
              ["/api/layer/OGC/CesiumOgcWmtsLayer.md", "WMTS"],

              ["/api/layer/vectortile/vectortile.md", "矢量瓦片"],

              ["/api/m3d/m3d.md", "M3D"],

              ["/api/datasource/geojson.md", "GeoJSON"],
              ["/api/layer/marker/DynamicMarker.md", "动态注记"],

              {
                title: "可视化",
                collapsable: false,
              },
              ["/api/Overlay/Echarts.md", "Echarts"],
              ["/api/Overlay/Mapv.md", "MapV"],

              {
                title: "空间分析",
                collapsable: false,
              },
              ["/api/analysis/Viewshed.md", "可视域分析"],
              ["/api/analysis/Sightline.md", "通视分析"],
              ["/api/analysis/Flood.md", "洪水淹没分析"],
              ["/api/analysis/DynamicCutting.md", "动态剖切"],
              ["/api/analysis/Excavate.md", "开挖分析"],
              // ["/api/analysis/Fill.md", "填挖方分析"],
              ["/api/analysis/HeightLimited.md", "限高分析"],
              ["/api/analysis/Shadow.md", "阴影分析"],
              ["/api/analysis/Skyline.md", "天际线分析"],
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
              ],
              ["/plugin_components/create_storybook.md", "创建Storybook示例"],
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
