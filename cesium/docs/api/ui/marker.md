# 标记点

> mapgis-3d-marker

## 属性

### `longitude`

- **类型:** `Number`
- **必填**
- **侦听属性**
- **描述:** 经度

### `latitude`

- **类型:** `Number`
- **必填**
- **侦听属性**
- **描述:** 纬度

### `height`

- **类型:** `Number`
- **必填**
- **侦听属性**
- **描述:** 高度

### `iconUrl`

- **类型:** `String`
- **必填**
- **侦听属性**
- **描述:** 图标的 url 地址

### `iconWidth`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值** `50`
- **描述:** 图标的宽度

### `iconHeight`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **默认值** `50`
- **描述:** 图标的高度

### `text`

- **类型:** `String`
- **可选**
- **侦听属性**
- **描述:** 标记点的标题文字

### `fontSize`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值** `16px`
- **描述:** 字体大小

### `fontFamily`

- **类型**: `String`
- **可选**
- **侦听属性**
- **默认值** `宋体`
- **描述** 字体

### `color`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值** `#000000`
- **描述:** 文字颜色，十六进制颜色

### `heightReference`

- **类型:** `String`
- **可选**
- **侦听属性**
- **默认值** `clamped`
- **描述:** 图标相对地形的位置 <br/>
  > clamped: 图标完全贴合在地形上
  > absolute: 自己定义图标高度
  > above: 图标永远在地形之上

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**
  > mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件， <br/>
  > 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**
  > 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。

## 槽

### `default`

- **描述** Popup 的自定义槽的实现，可以自定义各类视图

## 事件

### `@load`

- **描述** 在 Popup 加载完毕后发送该事件
- **Payload** `{ popup }`
- `popup` Popup 对象

### `@mouseOver`

- **描述** Popup的鼠标移入事件
- **Payload** `{ options, longitude, latitude, height }`
- `options` Popup的初始化参数
- `longitude` Popup的经度坐标
- `latitude` Popup的纬度坐标
- `height` Popup的高度坐标

### `@mouseOut`

- **描述** Popup的鼠标移出事件
- **Payload** `{ options, longitude, latitude, height }`
- `options` Popup的初始化参数
- `longitude` Popup的经度坐标
- `latitude` Popup的纬度坐标
- `height` Popup的高度坐标
