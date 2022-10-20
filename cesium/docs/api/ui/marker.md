# 标记点

> mapgis-3d-Marker

## 属性

| 名称                     | 类型          | 默认值    | 描述                                                                                                                                                                                                                                                              | 是否监听 |
| ------------------------ | ------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| longitude **必传**       | Number        |           | 经度,纬度，usePrimitive 为 false 且 enableCluster 为 false 时必传                                                                                                                                                                                                 | 是       |
| latitude **必传**        | Number        |           | 纬度，usePrimitive 为 false 且 enableCluster 为 false 时必传                                                                                                                                                                                                      | 是       |
| height **必传**          | Number        |           | 高度                                                                                                                                                                                                                                                              | 是       |
| iconUrl **必传**         | String        |           | 图标的 url 地址                                                                                                                                                                                                                                                   | 是       |
| iconWidth                | Number        | 50        | 图标的宽度                                                                                                                                                                                                                                                        | 是       |
| iconHeight               | Number        | 50        | 图标的高度                                                                                                                                                                                                                                                        | 是       |
| text                     | String        |           | 标记点的标题文字                                                                                                                                                                                                                                                  | 是       |
| fontSize                 | String        | '16px'    | 字体大小                                                                                                                                                                                                                                                          | 是       |
| fontFamily               | String        | '宋体'    | 字体                                                                                                                                                                                                                                                              | 是       |
| color                    | String        | '#000000' | 文字颜色，十六进制颜色                                                                                                                                                                                                                                            | 是       |
| heightReference          | String        | 'clamped' | 图标相对地形的位置 <br/>clamped: 图标完全贴合在地形上</br> absolute: 自己定义图标高度</br>above: 图标永远在地形之上                                                                                                                                               | 是       |
| vueKey                   | String        | default   | mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，<br/>同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。                                     | 否       |
| vueIndex                 | Number        |           | 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。                                                                                                                                                     | 否       |
| usePrimitive             | Boolean       | false     | 设置 usePrimitive 为 true，底层将使用 primitive 的方式加载 marker，在数据量大的时候会改善卡顿的现象。                                                                                                                                                             | 否       |
| enableCluster            | Boolean       | false     | 是否开启聚类，可以改善卡顿和图标叠加的现象。                                                                                                                                                                                                                      | 否       |
| geojson                  | Object,String |           | usePrimitive 为 true 或者 enableCluster 时，使用该属性传入加载的 geojson 数据，必传。                                                                                                                                                                             | 否       |
| enableCircle             | Boolean       | false     | 是否开启动态圆特效。                                                                                                                                                                                                                                              | 否       |
| radius                   | Number        | 500000.0  | 动态圆特效的初始半径。                                                                                                                                                                                                                                            | 否       |
| circleColor              | String        | "#FF8C00" | 动态圆特效的颜色。                                                                                                                                                                                                                                                | 否       |
| maxCircleNumber          | Number        | 100       | 允许加载的最大动态圆特效数目，不建议同时加载过多，否则容易卡顿。                                                                                                                                                                                                  | 否       |
| disableDepthTestDistance | Number        | 0         | 设置图标的深度检测。当设置为 10000，表示当相机高度低于 10000 时，图标参与深度检测，当相机高度高于 10000 时，图标不参与深度检测；当设置为 0，表示不管高度为多少，都图标都参与深度检测，当设置为 Number.POSITIVE_INFINITY，表示不管高度为多少，图标都不参与深度检测 | 否       |

## 槽

### `default`

- **描述** Popup 的自定义槽的实现，可以自定义各类视图

## 事件

### `@mouseEnter`

- **描述** marker 的鼠标移入事件
- **Payload** `{ DynamicMarkerLastActive }`
- `DynamicMarkerLastActive` 移入的 marker 信息

### `@mouseLeave`

- **描述** marker 的鼠标移出事件
- **Payload** `{ DynamicMarkerLastActive }`
- `DynamicMarkerLastActive` 移出的 marker 信息

### `@click`

- **描述** marker 的鼠标点击事件
- **Payload** 点击的 marker 信息
