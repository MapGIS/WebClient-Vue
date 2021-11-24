> mapgis-3d-skyline

## 属性
### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**

```
mapgis-web-scene组件的ID，当使用多个mapgis-web-scene组件时，需要指定该值，来唯一标识mapgis-web-scene组件，
同时mapgis-web-scene插槽中的组件也需要传入相同的vueKey，让组件知道应该作用于哪一个mapgis-web-scene。
```

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**

```
当mapgis-web-scene插槽中使用了多个相同组件时，例如多个mapgis-3d-igs-doc-layer组件，用来区分组件的标识符。
```

### `skylineWidth`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** 2
- **描述:** 天际线宽度

### `skylineColor`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值:** rgb(255,0,0)
- **描述:** 天际线颜色


## 事件

### `@load`

- **Description:** 在 Skyline组件 加载完毕后发送该事件
- **Payload** 天际线分析对象


### `@success`

- **Description:** 在天际线分析结束后发送该事件

### `@showAnalysis2d`

- **Description:** 在点击二维天际线echarts图表分析后 发送该事件
- **Payload** 二维天际线图表echarts对象

### `@remove`

- **Description:** 在移除分析对象和分析结果后，发送该事件

### `@unload`

- **Description:** 在销毁组件后，发送该事件


## 示例

```vue
<template>
  <mapgis-web-scene style="height:95vh">
    <mapgis-3d-raster-layer :url="url"/>
    <mapgis-3d-igs-m3d :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl"/>
    <mapgis-ui-card customPosition="top-left">
      <mapgis-3d-skyline
          :skylineWidth='skylineWidth'
          :skylineColor='skylineColor'
          @load='load'
          @remove='remove'
          @showAnalysis2d='showAnalysis2d'>
      </mapgis-3d-skyline>
    </mapgis-ui-card>
    <!--      <mapgis-window-wrapper :visible='skyline2dVisible'>-->
    <mapgis-ui-window
        @window-size='onSkyline2dWindowSize'
        :visible.sync='skyline2dVisible'
        :min-width='300'
        :max-height='300'
        anchor='bottom-left'
        title='二维天际线'
    >
      <div ref='skyline2dChart'>
        <div id='skyline-2d-chart' style="width:300px;height:230px"/>
      </div>
    </mapgis-ui-window>
    <!--      </mapgis-window-wrapper>-->
  </mapgis-web-scene>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "cesiumSkyline.vue",
  data() {
    return {
      url: "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
      m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      autoReset: true,
      maximumScreenSpaceError: 8,
      skyline2dChart: null,
      skyline2dVisible: false,
      skyLineAnalysis: null,
      skylineWidth: 2,
      skylineColor: "rgb(255,0,0)",
    };
  },
  methods: {
    /**
     * 二维天际线图表弹框size变化
     * @param mode
     */
    onSkyline2dWindowSize(mode) {
      this.$nextTick(() => {
        if (this.skyline2dChart) {
          const width =
              mode === "max" ? this.$refs.skyline2dChart.clientWidth : 300;
          this.skyline2dChart.resize({ width });
        }
      });
    },
    remove() {
      this.hideAnalysis2d();
    },

    load(skyLineAnalysis) {
      this.skyLineAnalysis = skyLineAnalysis;
    },

    /**
     * 展示二维天际线
     * todo 绘制完成回调添加二维坐标点 #143
     */
    showAnalysis2d(skyline2dChart) {
      this.skyline2dVisible = true;
      this.skyline2dChart = skyline2dChart;
    },

    /**
     * 隐藏二维天际线
     */
    hideAnalysis2d() {
      this.skyline2dVisible = false;
    },
  },
};
</script>

<style scoped>
.storybook-ui-card {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}
#skyline-2d-chart {
  height: 300px;
  width: 230px;
}
</style>
```
