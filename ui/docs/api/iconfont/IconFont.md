# 图标

> mapgis-ui-iconfont

## 属性

### `type`

- **类型:** `String`
- **非侦听属性**
- **描述:** iconfont 官方网站上对应的图标名称
- **示例:** "mapgis-jiamixian1"

![IconFont](../../assets/images/iconfont-simple.png)

```vue
<mapgis-ui-iconfont type="mapgis-jiamixian1" />
```

## 组合使用

```vue
<template>
  <mapgis-web-map :accessToken="accessToken">
    <mapgis-igs-tdt-layer
      :token="token"
      :baseURL="baseURL"
      :crs="crs"
      :layerId="layerId"
      :sourceId="sourceId"
    >
    </mapgis-igs-tdt-layer>
    <mapgis-draw
      class="custom-draw-wrapper"
      position="bottom-left"
      @added="handleAdded"
      @drawCreate="handleCreate"
      ref="drawref"
    >
      <mapgis-ui-button-group class="mapgis-2d-draw-wrapper">
        <mapgis-ui-tooltip
          v-for="(item, i) in buttons"
          :key="i"
          placement="bottom"
        >
          <template slot="title">
            <span>{{ item.tip }}</span>
          </template>
          <mapgis-ui-button
            circle
            size="small"
            :type="item.type"
            @click="item.click"
          >
            <mapgis-ui-iconfont :type="item.icon" />
          </mapgis-ui-button>
        </mapgis-ui-tooltip>
      </mapgis-ui-button-group>
    </mapgis-draw>
  </mapgis-web-map>
</template>
<style>
.custom-draw-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}
</style>
<script>
export default {
  name: "CustomDraw",
  props: {},
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoibHZ4aW5nZGV0dXppIiwiYSI6ImNrcmJkb3dwMDIycnkycXIyYW96ejQ5czcifQ.RftxemAeBo-0pa-FZqm5vw",
      token: "3af3270f5f558ed33dcf9aacfb7a01b5",
      baseURL: "http://t0.tianditu.gov.cn/img_w/wmts",
      crs: "EPSG:3857",
      layerId: "tdt",
      sourceId: "tdt",
      buttons: [
        {
          icon: "mapgis-erweidian",
          type: "default",
          tip: "点选几何,按住shift可以框选",
          click: this.toggleSimple
        },
        {
          icon: "mapgis-erweidian",
          type: "primary",
          tip: "画点",
          click: this.togglePoint
        },
        {
          icon: "mapgis-erweixian",
          type: "primary",
          tip: "画线",
          click: this.togglePolyline
        },
        {
          icon: "mapgis-erweiqu",
          type: "primary",
          tip: "画矩形",
          click: this.toggleRect
        },
        {
          icon: "mapgis-erweiqu",
          type: "primary",
          tip: "画多边形",
          click: this.togglePolygon
        },
        {
          icon: "mapgis-yuan1",
          type: "primary",
          tip: "画圆",
          click: this.toggleCircle
        },
        {
          icon: "mapgis-yuanxinbanjingyuan1",
          type: "primary",
          tip: "画半径",
          click: this.toggleRadius
        },
        {
          icon: "mapgis-shanchudangqianziceng",
          type: "primary",
          tip: "删除选中图元",
          click: this.toggleDelete
        },
        {
          icon: "mapgis-shanchudangqianziceng",
          type: "primary",
          tip: "删除全部",
          click: this.toggleDeleteAll
        },
        {
          icon: "mapgis-juxing1",
          type: "default",
          tip: "矩形查询",
          click: this.toggleQueryByRect
        },
        {
          icon: "mapgis-pinghangsibianxing1",
          type: "default",
          tip: "多边形查询",
          click: this.toggleQueryByPolygon
        }
      ]
    };
  },
  methods: {
    enableDrawer() {
      const component = this.$refs.drawref;
      if (component) {
        component.enableDrawer();
      }
    },
    handleAdded(e, data) {
      let { drawer, map } = e;
      this.drawer = drawer;
    },
    handleCreate(e) {
      if (this.mode == "QueryByRect" || this.mode == "QueryByPolygon") {
        this.drawer.delete(e.features[0].id);
        // 执行查询操作
      }
    },
    toggleSimple(e) {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("simple_select");
    },
    toggleDirect(e) {
      this.drawer &&
        this.drawer.changeMode("direct_select", {
          featureId: "" // The id of the feature that will be directly selected (required)
        });
    },
    togglePoint(e) {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_point");
    },
    togglePolyline() {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_line_string");
    },
    toggleRect() {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_rectangle");
    },
    togglePolygon() {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_polygon");
    },
    toggleCircle() {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_circle");
    },
    toggleRadius() {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_radius");
    },
    toggleCombine() {},
    toggleUncombine() {},
    toggleDelete() {
      this.drawer && this.drawer.trash();
    },
    toggleDeleteAll() {
      this.drawer && this.drawer.deleteAll();
    },
    toggleQueryByRect(e) {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_rectangle");
      this.mode = "QueryByRect";
    },
    toggleQueryByPolygon(e) {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_polygon");
      this.mode = "QueryByPolygon";
    }
  }
};
</script>
```

### 显示效果:

![组合显示1](../../assets/images/combine-1.png);

![组合显示2](../../assets/images/combine-2.png);

## IconFont 网站定制

> 使用 iconfont.cn

::: tip
对于使用 [iconfont.cn](https://www.iconfont.cn/) 的用户，通过设置 createFromIconfontCN 方法参数对象中的 scriptUrl 字段， 即可轻松地使用已有项目中的图标。
:::

### 全局引入

``` js
import MapgisUi, { MapgisUiIconFont } from "@mapgis/webclient-vue-ui";

MapgisUiIconFont.createFromIconfontCN({
  scriptUrl: "./icon/studio.js", // 支持js文件或iconfont.cn在线地址
});
```

若希望修改名称，可仿照以下示例：

``` js
import MapgisUi, { MapgisUiIconFont } from "@mapgis/webclient-vue-ui";

const IconFont = MapgisUiIconFont.createFromIconfontCN({
  scriptUrl: "./icon/studio.js",
});
Vue.component("mapgis-ui-iconfont-NewName", IconFont);
```

### storybook引入（针对开发人员）

> 若使用的是现有的"WebClient-Vue-Icon"图标库中的图标，则无需手动注入，忽略本节内容即可。

::: tip
需要手动注入的情形：假如开发人员最近添加了若干个图标到"WebClient-Vue-Icon"图标库，为方便立即在storybook上看到效果，可通过以下方式在ui.js文件（路径：`.storybook\components\ui.js`）中注入：
:::

``` js
import MapgisUiIconFont from "../../ui/src/components/iconfont/Icon.vue";

MapgisUiIconFont.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_2749943_69c9cshqtiv.js", // 从iconfont.cn网站复制最新的在线地址
});
```

> 注 ："WebClient-Vue-Icon"图标库更新后请联系相关人员及时更新UI代码。


### 单个引入

``` vue
<template>
  <div class="icons-list">
    <icon-font type="icon-tuichu" />
    <icon-font type="icon-facebook" />
    <icon-font type="icon-twitter" />
  </div>
</template>
<script>
import { MapgisUiIconFont } from "@mapgis/webclient-vue-ui";

const IconFont = MapgisUiIconFont.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});
export default {
  components: {
    IconFont,
  },
};
</script>
<style scoped>
.icons-list >>> .anticon {
  margin-right: 6px;
  font-size: 24px;
}
</style>
```
