const demoCode = require("vuepress-plugin-demo-code");

module.exports = {
  title: "VueCesium",
  // description: "Combine powers of Mapbox GL JS and Vue.js",
  dest: "dist/docs",
  // head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  // base: "/vue-mapbox/",
  evergreen: true,
  serviceWorker: true,

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
              ["/guide/basemap.md", "基础地图"]
            ]
          }
        ]
      }
    }
  },
  plugins: [
    ["demo-code"],  
    [
      /*       demoCode,
      {
        jsLibs: [
          // umd
          "http://develop.smaryun.com:8899/static/libs/cdn/zondyclient/vue/webclient-vue-mapboxgl.umd.min.js"
        ],
        cssLibs: ["https://unpkg.com/animate.css@3.7.0/animate.min.css"],
        showText: "show code",
        hideText: "hide",
        styleStr: "text-decoration: underline;",
        minHeight: 200,
        onlineBtns: {
          codepen: true,
          jsfiddle: true,
          codesandbox: true
        },
        codesandbox: {
          deps: { lodash: "latest" },
          json: "",
          query: "",
          embed: ""
        },
        demoCodeMark: "demo-code"
      }
 */
    ],

  ]
};
