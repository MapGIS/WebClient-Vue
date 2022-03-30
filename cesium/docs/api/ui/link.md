# 多屏联动

> mapgis-3d-link

## 属性

### `enable`

- **类型:** `Boolean`
- **非侦听属性**
- **默认值:** `false`
- **描述:**

> 这个属性刚开始的时候只能是 false,多个场景的生命周期是不同步的。由于无法获取多个场景最后加载完毕的时刻，因此只能后面手动激活为 true。

### `view`

- **类型:** `Object`
- **伪 V-Model 属性**
- **默认值:** `undefined`
- **描述:**
  > 当前联动的地图场景的视图范围，该属性为伪`v-model`属性，只能场景内部的视图范围带动 vue 组件的的属性更新，不能支持外部的 view 的变化来更新场景的视图范围，该属性是单向的。

1. 3d 属性

```json
{
  "destination": {
    "x": -2357352.339898985,
    "y": 5265849.383811235,
    "z": 3222357.1044067424
  },
  "orientation": {
    "direction": {
      "x": 0.4160883949944302,
      "y": -0.9003657415245255,
      "z": -0.1273262700307768
    },
    "up": {
      "x": 0.07867247478982513,
      "y": -0.10385364386338627,
      "z": 0.9914762036311014
    },
    "heading": 6.251507435365607,
    "pitch": -1.1860759562972296,
    "roll": 6.283171031875163
  }
}
```

2. 2d 属性

```json
{
  "east": 115.90076343423289,
  "north": 31.359409016591904,
  "south": 29.36758036258932,
  "west": 112.18827644621057
}
```

### `includes`

- **类型:** `Array`
- **非侦听属性**
- **默认值:** `[]`
- **描述:**

> 外部指定的`联动`的三维场景的 vueKey 值，如果是空则联动所有的加载的三维场景。否则只联动指定的数组里面的值。
> 请不要将 includes excludes 同时使用

```vue
<mapgis-web-scene vueKey="one" />
<mapgis-web-scene vueKey="two" />
<mapgis-web-scene vueKey="three" />
<mapgis-web-scene vueKey="forth" />

<mapgis-3d-link :includes="['one', 'two']" :enable="enable" />
```

### `timestamp`

- **类型:** `Number`
- **非侦听属性**
- **默认值:** `0`
- **描述:** 视图刷新时间戳间隔，默认 0 时不激活该能力，只有大于 0 的时候才激活时间戳的判断，其意思是每隔 timestamp 毫秒向外面抛出一个更新事件。
- > 当该参数大于 0 的时候下面的`interval`参数无效

### `interval`

- **类型:** `Number`
- **非侦听属性**
- **默认值:** `60`
- **描述:** 视图刷新毫秒间隔，默认 60 帧刷新一次，与 Cesium PostRender 机制保持一致。，其意思是每隔 interval 帧数向外面抛出一个更新事件。

### `excludes`

- **类型:** `Array`
- **非侦听属性**
- **默认值:** `[]`
- **描述:**

> 外部指定`排除联动`的三维场景的 vueKey 值，如果是空则联动所有的加载的三维场景。否则只联动指定的数组里面的值。
> 请不要将 includes excludes 同时使用

```vue
<mapgis-web-scene vueKey="one" />
<mapgis-web-scene vueKey="two" />
<mapgis-web-scene vueKey="three" />
<mapgis-web-scene vueKey="forth" />

<mapgis-3d-link :excludes="['one', 'two']" :enable="enable" />
```

### `screenSpaceEventType`

- **类型:** `Array`
- **可选**
- **非侦听属性**
- **默认值:** ` [ ScreenSpaceEventType.WHEEL, ScreenSpaceEventType.MOUSE_MOVE, ScreenSpaceEventType.LEFT_UP, ScreenSpaceEventType.LEFT_DOWN, ScreenSpaceEventType.RIGHT_UP, ScreenSpaceEventType.RIGHT_DOWN ]`
- **描述:** 触发同步更新的事件，默认是监控滚轮移动、鼠标左键抬起、鼠标右键抬起、鼠标滚动
- 默认策略
- 1. 鼠标左键按下 - 鼠标移动 - 鼠标左键放开
- 2. 鼠标右键按下 - 鼠标移动 - 鼠标右键放开
- 3. 鼠标滚轮缩放

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**
  > mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，<br/>
  > 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**
  > 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。
