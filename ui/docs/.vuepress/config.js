// const demoCode = require("vuepress-plugin-demo-code");

module.exports = {
  title: "VueUI",
  dest: "dist-docs",

  /*   evergreen: true,
  serviceWorker: true, */

  locales: {
    "/": {
      lang: "zh-CN",
      title: "中地数码",
      description: "@mapgis/webclient-vue-ui"
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
              ["/guide/base.md", "基础组件"],
              ["/guide/dev.md", "本地link部署包方式"]
            ]
          },
          {
            title: "API",
            collapsable: false,
            children: [
              ["/api/iconfont/IconFont.md", "图标"],
              ["/api/div/Div.md", "区块"],
              ["/api/collapsecard/CollapseCard.md", "收缩卡片"],
              ["/api/sprite/Sprite.md", "符号库"],
              ["/api/upload/Upload.md", "上传"]
            ]
          }
          /* {
            title: "组件开发",
            collapsable: false,
            children: [
              ["/plugin_components/", "使用组件"],
              [
                "/plugin_components/plugin_components_development.md",
                "封装组件"
              ]
            ]
          }, */
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
