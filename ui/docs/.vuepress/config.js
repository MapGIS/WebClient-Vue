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
              //   ["/local/yarn.md", "本地开发"],
              //   ["/local/mixlocal.md", "本地/互联网混合开发"],
              ["/guide/", "快速上手"],
              ["/guide/introduction.md", "产品介绍"],
              ["/guide/dev.md", "本地link部署包方式"],
              ["/local/publish.md", "发布流程"],
              // ["/guide/base.md", "基础组件"],
              ["/guide/build.md", "解决打包内存溢出问题"],
              ["/guide/borderBox.md", "解决全局设置为盒模型问题"],
              ["/guide/fontSize.md", "解决字体大小被全局设置的问题"]
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
              ["/api/upload/Upload.md", "上传"],
              ["/api/clouddiskFileSelect/CDFileSelect.md", "从云盘选择"],
              ["/api/saveToClouddisk/SaveToCd.md", "保存至云盘"],
              ["/api/panel/switch.md", "区域-开关"],
              ["/api/panel/inputnumber.md", "区域-数值输入"],
              ["/api/panel/select.md", "区域-选择器"],
              ["/api/panel/select.md", "区域-颜色选取"],
              ["/api/panel/tab.md", "区域-页面切换"],
              ["/api/color/d3color.md", "颜色-D3色板"],
              ["/api/technology/borderbox.md", "科技风-卡片"],
              ["/api/technology/decoration.md", "科技风-装饰"]
            ]
          },
          {
            title: "样式&主题",
            collapsable: false,
            children: [["/style/css/less2scss.md", "Less & Sass"]]
          },
          {
            title: "组件开发",
            collapsable: false,
            children: [["/plugin_components/onemap.md", "移植组件"]]
          },
          {
            title: "版本",
            collapsable: false,
            children: [["/version/version.md", "更新说明"]]
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
    ["script", { src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js" }]
  ],
  plugins: [
    [
      "demo-code",
      {
        jsLibs: ["https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"]
      }
    ]
  ]
};
