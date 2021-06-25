# 矢量瓦片

> mapgis-3d-vectortile-layer

## 属性

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

### `headers`

- **类型**: `Object`
- **必传**
- **非侦听属性** 非 watch 属性
- **默认值**
  ```js
  {
     'szvsud-license-key': '3AE2IROq5nGn5K/+zQlUxSoHoNdjCoS1l5'
  }
  ```
- - **描述** 瓦片服务头文件属性

### `mvtStyle`

- **Type**: `[String, Object]`
- **伪侦听属性** 伪 watch 属性,当且仅当 mvtStyle 是生成新的 Object 对象的时候才生效
- - **描述** 样式 json 文件路径或者 MVT-JSON 对象，当为 String / url 时等于 styleUrl；当为 Object /mvt style 等于 vectortilejson

### `styleUrl`

- **类型**: `String`
- **非侦听属性** 非 watch 属性
- - **描述** 样式 json 文件路径,有 styleUrl 就可以直接读取 styleUrl 里的信息;不然就是加载中地发布的矢量瓦片，使用 ip，port 和 layerName 先拼接 styleUrl 路径再进行查询。
- **示例**

```js
<mapgis-web-scene>
  <mapgis-3d-vectortile-layer styleUrl="http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/styles/蓝色-墨卡托.json" />
</mapgis-web-scene>
```

### `vectortilejson`

- **类型**: `Object`
- **侦听属性** watch 属性
- - **描述** 矢量瓦片 json 对象,直接取 json 对象，不需要再去请求。

### `tilingScheme`

- **类型**: `[String, Cesium.TilingScheme]`
- **非侦听属性** 非 watch 属性
- - **描述** 矢量瓦片瓦片切分规则：经纬度还是墨卡托

### `token`

- **类型**: `String`
- **非侦听属性** 非 watch 属性
- - **描述** 第三方需要的 token，比如 mapbox

### `show`

- **类型**: `Boolean`
- **非侦听属性** 非 watch 属性
- - **描述** 是否可见

## 事件

### `@load`

- **描述** 在矢量瓦片加载完毕后发送该事件
- **Payload** `{ this }`
- - `this` 当前组件自身引用
