> mapgis-3d-ponding-simulation

## 属性

### `pondingTime`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `24`
- **描述:** 积水仿真组件的积水上涨时间，单位为秒。

### `multiSpeed`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `1`
- **描述:** 积水仿真组件倍速播放的倍速大小，默认是 1 倍速播放。

### `rainFallDaily`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `36`
- **描述:** 积水仿真组件的日降雨量，单位毫米，默认是 36，范围 0-2000。

### `pondingPanelShow`

- **类型:** `Boolean`
- **可选**
- **默认值:** `false`
- **描述:** 积水仿真组件面板显隐，默认是 false，默认隐藏。

### `pondingArea`

- **类型:** `Object`
- **可选**
- **默认值:**
- **描述:** 积水仿真组件的模拟仿真区域，由坐标参数传入。

### `drainageVolOfArea`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `0`
- **描述:** 积水仿真组件区域排水体积(m³)，默认是 0，范围 0-100。

### `rainAngle`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `30`
- **描述:** 积水仿真组件降雨角度，默认是 30。

## 事件

### `@loaded`

- **Description:** 在 积水仿真组件 加载完毕后发送该事件
- **Payload** 积水仿真组件对象

### `@unload`

- **Description:** 在 积水仿真组件 销毁时发送该事件
- **Payload** 积水仿真组件对象

### `@isPonding`

- **Description:** 在 积水仿真状态切换（开始积水仿真、停止积水仿真）时发送该事件
- **Payload** 积水仿真状态（是否在进行积水仿真） 布尔值

# 积水仿真时间轴

> mapgis-3d-ponding-simulation-timeline

<font style="color:red;fontsize=5px;"> 注意：</font>由于三维底层支持原因，目前不支持积水仿真在分析过程中的停止功能。

## 属性

### `value`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值:** `0`
- **描述:** 积水仿真时间轴组件滑动条数值的大小。

### `isPlaying`

- **类型:** `Boolean`
- **可选**
- **侦听属性**
- **默认值:** `false`
- **描述:** 积水仿真时间轴组件的播放状态。

### `width`

- **类型:** `Number`
- **可选**
- **默认值:** `560`
- **描述:** 积水仿真时间轴组件的宽度，单位为 px。

### `resetSpeedVal`

- **类型:** `Number`
- **可选**
- **默认值:** `1`
- **描述:** 积水仿真时间轴组件点击重置按钮后的倍速值。

### `speedStep`

- **类型:** `Number`
- **可选**
- **默认值:** `1`
- **描述:** 积水仿真时间轴组件倍速的步长值。

## 事件

### `@updateSpeed`

- **Description:** 在 积水仿真时间轴组件的倍速选项被更改时 发送该事件
- **Payload** 当前积水仿真时间轴组件的倍速数值大小

### `@updateTime`

- **Description:** 在 积水仿真时间轴组件改变了积水上涨的时间时 发送该事件
- **Payload** 当前积水仿真时间轴组件更改的积水上涨时间的大小（秒）

### `@play`

- **Description:** 在 积水仿真时间轴组件点击播放按钮时 发送该事件

## 示例

```vue
<template>
  <mapgis-web-scene style="height: 100vh" v-on:load="handleLoad">
    <mapgis-3d-raster-layer :url="rasterUrl" />
    <mapgis-3d-igs-terrain :url="terrainUrl" />
    <mapgis-3d-ponding-simulation
      ref="simulation"
      @isPonding="
        (e) => {
          pond = e;
        }
      "
      @updateValue="
        (e) => {
          sliderValue = e;
        }
      "
      :pondingTime="time"
      :multiSpeed="mltSpeed"
      style="position: absolute; top: 10px; left: 10px;background:#fff"
    />
    <mapgis-3d-ponding-simulation-timeline
      :value="sliderValue"
      :pond="pond"
      @updateTime="
        (e) => {
          time = e;
        }
      "
      @updateSpeed="
        (e) => {
          mltSpeed = e;
        }
      "
      @play="addSimulation"
      style="position: absolute;bottom: 30px; right: 50%;margin-right:-280px;"
    />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      terrainUrl: "http://192.168.21.191:6163/igs/rest/g3d/武汉地形",
      rasterUrl:
        "http://t4.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}&tk=2ddaabf906d4b5418aed0078e1657029",
      maximumScreenSpaceError: 8,

      //ponding-simulation
      time: undefined,
      pond: undefined,
      sliderValue: undefined,
      mltSpeed: undefined,
    };
  },
  methods: {
    addSimulation() {
      this.$refs.simulation.addSimulation();
    },
  },
};
</script>
```
