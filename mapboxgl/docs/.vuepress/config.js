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
      description: "@mapgis/webclient-vue-mapboxgl",
    },
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
            buttonText: "Refresh",
          },
        },
        algolia: {},
        nav: [
          {
            text: "Guide",
            link: "/en/guide/",
          },
          {
            text: "API",
            link: "/en/api/",
          },
          {
            text: "WebClient",
            link: "http://develop.smaryun.com:8899/#/index",
          },
          { text: "Github", link: "https://github.com/soal/vue-mapbox" },
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
              ["/en/guide/layers&sources.md", "Layers and sources"],
            ],
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
              ["/en/api/Layers/canvaslayer.md", "CanvasLayer"],
            ],
          },
          {
            title: "Plugin components",
            collapsable: false,
            children: [
              ["/en/plugin_components/", "Using plugin components"],
              [
                "/en/plugin_components/plugin_components_development.md",
                "Create a plugin component",
              ],
            ],
          },
          // ['/plugins/', 'Plugins'],
        ],
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
            buttonText: "刷新",
          },
        },
        // 当前 locale 的 algolia docsearch 选项
        algolia: {},
        nav: [
          {
            text: "向导",
            link: "/guide/",
          },
          {
            text: "API",
            link: "/api/",
          },
          {
            text: "WebClient",
            link: "http://develop.smaryun.com",
          },
          { text: "开源", link: "https://github.com/MapGIS/WebClient-Vue" },
        ],
        sidebar: [
          {
            title: "指南",
            collapsable: false,
            children: [
              ["/guide/install", "安装"],
              ["/guide/quickStart", "快速上手"],
              ["/guide/introduction.md", "产品介绍"],
              ["/guide/basemap.md", "注意事项"],
              ["/guide/composition.md", "结构"],
              ["/guide/controls.md", "控制视图"],
              ["/guide/markers&popups.md", "注记视图"],
              ["/guide/draw.md", "绘制视图"],
              ["/guide/layers&sources.md", "图层与数据源"],
              ["/guide/wms&map&doc.md", "子图层控制"],
              ["/guide/cartography.md", "制图综合"],
            ],
          },
          {
            title: "样式模板",
            collapsable: false,
            children: [
              ["/template/", "样式模板"],
              ["/template/zondy.md", "通用模板"],
              ["/template/guotu.md", "国土模板"],
              ["/template/militray.md", "军标模板"],
            ],
          },
          {
            title: "组件",
            collapsable: false,
            children: [
              {
                title: "地图",
                collapsable: false,
              },
              ["/api/", "地图对象"],
              {
                title: "地图子组件",
                collapsable: false,
              },
              ["/api/controls.md", "控制组件"],
              ["/api/marker.md", "标注"],
              ["/api/popup.md", "气泡"],

              ["/api/UI/Scale/scale-mvt.md", "MVT比例尺"],
              ["/api/UI/Legend/legend-mvt.md", "MVT图例"],
              ["/api/UI/Print/print.md", "打印"],

              ["/api/UI/Draw/draw.md", " 绘制"],
              ["/api/UI/Measure/measure.md", "测量"],
              ["/api/UI/Legend/legend.md", "图例"],
              ["/api/UI/Hawkeye/hawkeye.md", "鹰眼"],
              ["/api/UI/Compare/compare.md", "卷帘"],
              ["/api/UI/Zoom/zoom.md", "缩放"],
              ["/api/UI/State/StateBar.md", "状态栏"],

              ["/api/UI/Table/BaseTable.md", "表格"],
              // ["/api/UI/Table/FeatureTable.md", "要素表格"],
              // ["/api/map/mixin/FeatureService.md", "要素服务"],
              {
                title: "图层",
                collapsable: false,
              },
              ["/api/Layers/geojsonlayer.md", "GeoJSON图层"],
              ["/api/Layers/Marker/DynamicMarker.md", "动态注记图层"],
              ["/api/Layers/vectorlayer.md", "矢量图层"],
              ["/api/Layers/rasterlayer.md", "栅格图层/通用瓦片"],
              ["/api/Layers/imagelayer.md", "图像图层"],
              ["/api/Layers/videolayer.md", "视频图层"],
              ["/api/Layers/canvaslayer.md", "画布图层"],
              ["/api/Layers/igserver/igsDocLayer.md", "Igs地图文档"],
              ["/api/Layers/igserver/igsTileLayer.md", "Igs瓦片服务"],
              ["/api/Layers/igserver/igsVectorLayer.md", "Igs矢量图层"],
              ["/api/Layers/OGC/ogcWmtsLayer.md", "OGC-WMTS"],
              ["/api/Layers/OGC/ogcWmsLayer.md", "OGC-WMS"],
              ["/api/Layers/ArcGISServer/ArcGISMapLayer.md", "ArcGIS地图"],
              ["/api/Layers/ArcGISServer/ArcGISTileLayer.md", "ArcGIS瓦片"],
              ["/api/Layers/VectorTile/mvtstyle.md", "MVT样式图层"],
              {
                title: "可视化",
                collapsable: false,
              },
              ["/api/Overlay/Echarts.md", "Echarts"],
              ["/api/Overlay/Mapv.md", "MapV"],
              ["/api/Layers/Cluster/cluster.md", "聚类"],
              ["/api/Layers/Heater/heater.md", "热力"],
              ["/api/Layers/Building/building.md", "建筑白膜"],
              ["/api/Layers/Tracker/tracker.md", "轨迹跟踪"],
              ["/api/Layers/Elasticsearch/elasticsearch.md", "弹性搜索"],
            ],
          },

          // {
          //   title: "源码分析",
          //   collapsable: true,
          //   children: [
          //     ["/code/basemap.md", "基础地图"],
          //     ["/code/controls.md", "控制视图"],
          //     ["/code/markers&popups.md", "注记视图"],
          //     ["/code/layers&sources.md", "图层与数据源"]
          //   ]
          // },
          {
            title: "插件组件",
            collapsable: false,
            children: [
              ["/plugin_components/", "使用插件组件"],
              [
                "/plugin_components/plugin_components_development.md",
                "创建插件组件",
              ],
            ],
          },
          // {
          //   title: "版本",
          //   collapsable: false,
          //   children: [
          //     ["/version/version.md", "更新说明"],
          //     ["/version/diff.md", "版本对比"],
          //   ],
          // },
          // ['/plugins/', 'Plugins'],
        ],
        // search: false
      },
    },
  },
  serviceWorker: true,
  // base: '/vuepress-plugin-demo-block/',
  head: [
    [
      "script",
      {
        src: "https://cdn.jsdelivr.net/npm/react@16.6.3/umd/react.production.min.js",
      },
    ],
    [
      "script",
      {
        src: "https://cdn.jsdelivr.net/npm/react-dom@16.6.3/umd/react-dom.production.min.js",
      },
    ],
    ["script", { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js" }],
    [
      "script",
      { src: "https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js" },
    ],
    [
      "script",
      { src: "https://cdn.jsdelivr.net/npm/numerify/lib/index.umd.min.js" },
    ],
    [
      "link",
      {
        href: "http://localhost:8888/static/libs/cdn/zondyclient/npm/webclient-vue-mapboxgl.css",
        rel: "stylesheet",
        type: "text/css",
      },
    ],
    [
      "script",
      {
        src: "http://localhost:8888/static/libs/cdn/zondyclient/npm/webclient-vue-mapboxgl.umd.js",
      },
    ],
    /* [
      "link",
      {
        href:
          "http://localhost:8888/static/libs/cdn/zondyclient/npm/webclient-vue-ui.css",
        rel: "stylesheet",
        type: "text/css"
      }
    ],
    [
      "script",
      {
        src:
          "http://localhost:8888/static/libs/cdn/zondyclient/npm/webclient-vue-ui.umd.js"
      }
    ] */
  ],
  plugins: [
    [
      "demo-block",
      {
        settings: {
          jsLibs: [
            // "http://localhost:8888/static/libs/cdn/zondyclient/npm/webclient-vue-mapboxgl.umd.js",
          ],
          cssLibs: [
            // "http://localhost:8888/static/libs/cdn/zondyclient/npm/webclient-vue-mapboxgl.css"
          ],
          jsfiddle: true, // 是否显示 jsfiddle 链接
          codepen: true, // 是否显示 codepen 链接
          horizontal: false, // 是否展示为横向样式
        },
      },
    ],
  ],
};
