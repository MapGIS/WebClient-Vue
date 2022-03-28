# 标记点

> mapgis-3d-Marker

## 属性

| 名称               | 类型   | 默认值    | 描述                                                                                                                                                                                                                          | 是否监听 |
| ------------------ | ------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| longitude **必传** | Number |           | 经度                                                                                                                                                                                                                          | 是       |
| latitude **必传**  | Number |           | 纬度                                                                                                                                                                                                                          | 是       |
| height **必传**    | Number |           | 高度                                                                                                                                                                                                                          | 是       |
| iconUrl **必传**   | String |           | 图标的 url 地址                                                                                                                                                                                                               | 是       |
| iconWidth          | Number | 50        | 图标的宽度                                                                                                                                                                                                                    | 是       |
| iconHeight         | Number | 50        | 图标的高度                                                                                                                                                                                                                    | 是       |
| text               | String |           | 标记点的标题文字                                                                                                                                                                                                              | 是       |
| fontSize           | String | '16px'    | 字体大小                                                                                                                                                                                                                      | 是       |
| fontFamily         | String | '宋体'    | 字体                                                                                                                                                                                                                          | 是       |
| color              | String | '#000000' | 文字颜色，十六进制颜色                                                                                                                                                                                                        | 是       |
| heightReference    | String | 'clamped' | 图标相对地形的位置 <br/>clamped: 图标完全贴合在地形上</br> absolute: 自己定义图标高度</br>above: 图标永远在地形之上                                                                                                           | 是       |
| vueKey             | String | default   | mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，<br/>同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。 | 否       |
| vueIndex           | Number |           | 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。                                                                                                                 | 否       |

## 槽

### `default`

- **描述** Popup 的自定义槽的实现，可以自定义各类视图

## 事件

### `@load`

- **描述** 在 Popup 加载完毕后发送该事件
- **Payload** `{ popup }`
- `popup` Popup 对象

### `@mouseEnter`

- **描述** Popup 的鼠标移入事件
- **Payload** `{ options, longitude, latitude, height }`
- `options` Popup 的初始化参数
- `longitude` Popup 的经度坐标
- `latitude` Popup 的纬度坐标
- `height` Popup 的高度坐标

### `@mouseLeave`

- **描述** Popup 的鼠标移出事件
- **Payload** `{ options, longitude, latitude, height }`
- `options` Popup 的初始化参数
- `longitude` Popup 的经度坐标
- `latitude` Popup 的纬度坐标
- `height` Popup 的高度坐标
