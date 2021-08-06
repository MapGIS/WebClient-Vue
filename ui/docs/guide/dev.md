# dev引用方式

## 步骤1 本地clone代码

地址：https://github.com/MapGIS/WebClient-Vue

## 步骤2 打包（若已经有包可跳过该步）

0. 进入目录
    ``` sh
    cd /WebClient-Vue/ui
    ```

1. 安装依赖
    ``` sh
    npm install
    # 或者
    yarn
    ```

2. UI组件编译
    ``` sh
    npm run build
    ```

3. 在 “dist-libs” 文件夹下即可看到打包后的文件

## 步骤3 在新项目中link

此时本地已经有了UI组件的包，接下来link到另一个项目

0. 检查package.json文件夹（路径：/WebClient-Vue/ui/package.json）,确保第5-6行如下所示：

    ``` sh
    5   "main": "dist-libs/webclient-vue-ui.umd.min.js",
    6   "module1": "src/index.js",
    ```

1. 回到UI组件目录下，并link
    ``` sh
    cd /WebClient-Vue/ui
    
    npm link
    ```

2. 其他项目link本组件
    ``` sh
    npm link @mapgis/webclient-vue-ui
    ```

## 步骤4 全局引用

全局引用方式与前文一致，下面为示例代码：

``` javascript

  import Vue from "vue";
  import App from "./App.vue";

  import '@mapgis/webclient-vue-ui/dist-libs/webclient-vue-ui.css';
  import MapgisUi from "@mapgis/webclient-vue-ui";

  Vue.config.productionTip = false;

  Vue.use(MapgisUi);

  new Vue({
    render: (h) => h(App),
  }).$mount("#app");

```

