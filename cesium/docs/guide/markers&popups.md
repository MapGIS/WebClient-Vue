# Popups

::: warning
~ 快速提示，Cesium 本身是不支持 Popup 机制的，该机制由 MapGIS 内部实现。
:::

## Popup

Popup 组件你可以直接 HTML 设置 popup 的内部的样式.

```vue
<template>
  <cesium-web-globe
    libPath="statics/cesium/Cesium.js"
    pluginPath="statics/cesium/webclient-cesium-plugin.min.js"
  >
    <cesium-popup
      :position="{ longitude: 110, latitude: 30 }"
      container="<div>123</div>"
    >
    </cesium-popup>
  </cesium-web-globe>
</template>

<script>
import { CesiumWebGlobe, CesiumPopup } from "@mapgis/webclient-vue-cesium";

export default {
  components: {
    CesiumWebGlobe,
    CesiumPopup,
  },
};
</script>
```

如果你设置 `onlyText` 属性为 `true`, 内容被统一当做文本处理. 一般用于从一个不信任的数据源获取对应的显示 html 内容，防止注入。

通常 Popup 被添加到地图上是默认隐藏的，如果你想加载的时候立即展示，你需要设置`showed` 属性为 `true`。

### 属性

- `position {Object}` 提供三种不同的方式实现对应的位置的传参方式
  - `entity`, 传入任意一个 Cesiumd 的 Entity 实体，然后根据该实体的中心点 position 显示对应的 popup
  - `cartesian`, 传入一个 cartesian3 的坐标点{x,y,z},然后将 popup 显示在此处
  - `longitude`/`latitude`/`height`,传入经纬度以及高度，内部转换成 cartesian3 的坐标点{x,y,z}，然后将 popup 显示在此处
- `options {Boolean}`

  - `popupId` 外部传入 id，用来指定特殊的 id，用于外部获取该 DOM 事件/样式个性化定制
  - `popupContentId` 外部传入 id，用来指定特殊的 id，用于外部获取该 DOM 事件/样式个性化定制
  - `postRender` 关闭此参数会提升性能，但是会减少视觉效果
  - `showClose` 一旦上面采取非 entiy 的方式创建 Popup,一旦关闭后无法通过交互激活 Popup,只能通过对应的代码对象的`popup.show()`方法重新激活。

- `container {String}` 外部传递 htmlString 给 popup 的内部 content 的 DIV 内容进行填充，一般这个都在配合 echarts 时同步使用，主要是让外部的 echart 或者其他需要主动操作 dom 的元素进行初始化操作。

完整的参数列表请看 [API](/api/popup.md#props)

### 绑定实体 Entity

```vue
<template>
  <cesium-web-globe
    libPath="statics/cesium/Cesium.js"
    pluginPath="statics/cesium/webclient-cesium-plugin.min.js"
    @load="handleLoad"
  >
    <cesium-popup
      v-if="entity"
      :position="{ entity: entity }"
      container="<div>123</div>"
    >
    </cesium-popup>
  </cesium-web-globe>
</template>

<script>
import { CesiumWebGlobe, CesiumPopup } from "@mapgis/webclient-vue-cesium";

export default {
  components: {
    CesiumWebGlobe,
    CesiumPopup,
  },
  data() {
    return {
      entity: undefined,
    };
  },
  methods: {
    handleLoad(payload) {
      const { webGlobe, Cesium } = payload;
      this.webGlobe = webGlobe;
      this.Cesium = Cesium;
      this.addEntity();
    },
    addEntity() {
      const { Cesium, webGlobe } = this;
      var entity = webGlobe.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(103.0, 40.0),
        name: "Red ellipse on surface",
        ellipse: {
          semiMinorAxis: 250000.0,
          semiMajorAxis: 400000.0,
          material: Cesium.Color.RED.withAlpha(0.5),
        },
      });
      this.entity = entity;
    },
  },
};
</script>
```

### 绑定笛卡尔坐标 Cartesian

```vue
<template>
  <cesium-web-globe
    libPath="statics/cesium/Cesium.js"
    pluginPath="statics/cesium/webclient-cesium-plugin.min.js"
  >
    <cesium-popup
      :position="{ cartesian: cartesian }"
      container="<div>123</div>"
    >
    </cesium-popup>
  </cesium-web-globe>
</template>

<script>
import {
  CesiumWebGlobe,
  CesiumPopup,
} from '@mapgis/webclient-vue-cesium';

export default {
  components: {
    CesiumWebGlobe,
    CesiumPopup,
  },
  data() {
    return {
      cartesian: Cesium.Cartesian3.fromDegrees(90.108861, 37.871516, 0);
    }
  }
};
</script>
```

### 绑定经纬度

```vue
<template>
  <cesium-web-globe
    libPath="statics/cesium/Cesium.js"
    pluginPath="statics/cesium/webclient-cesium-plugin.min.js"
  >
    <cesium-popup
      :position="{ longitude: 110, latitude: 30 }"
      container="<div>123</div>"
    >
    </cesium-popup>
  </cesium-web-globe>
</template>

<script>
import { CesiumWebGlobe, CesiumPopup } from "@mapgis/webclient-vue-cesium";

export default {
  components: {
    CesiumWebGlobe,
    CesiumPopup,
  },
};
</script>
```
