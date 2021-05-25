// const demoCode = require("vuepress-plugin-demo-code");

module.exports = {
  title: "VueCesium",
  dest: "dist/docs",

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
            link: "http://develop.smaryun.com:8899/#/index"
          },
          { text: "开源", link: "https://github.com/soal/vue-mapbox" }
        ],
        sidebar: [
          {
            title: "指南",
            collapsable: false,
            children: [
              ["/guide/", "快速上手"],
              ["/guide/basemap.md", "基础地图"]
            ]
          },
          {
            title: "API",
            collapsable: false,
            children: [
              ["/api/", "地图场景"],
              ["/api/datasource/geojson.md", "GeoJSON"],
              ["/api/layer/OGC/CesiumOgcWmsLayer.md", "WMS"],
              ["/api/layer/OGC/CesiumOgcWmtsLayer.md", "WMTS"],
              ["/api/layer/vectortile/vectortile.md", "矢量瓦片"],
              ["/api/m3d/m3d.md", "M3D"],
              ["/api/ui/popup.md", "气泡"],
              ["/api/ui/compare.md", "卷帘"]
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
  head: [
    [
      "script",
      { src: "https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js" }
    ],
    ["script", { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js" }],
    [
      "script",
      {
        src:
          "http://localhost:8081/static/libs/cdn/zondyclient/webclient-cesium-plugin.min.js"
      }
    ]
  ],
  plugins: [
    [
      "demo-code",
      {
        jsLibs: [
          "https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js",
          "http://localhost:8081/static/libs/cdn/zondyclient/webclient-cesium-plugin.min.js"
        ]
      }
    ]
  ]
};
