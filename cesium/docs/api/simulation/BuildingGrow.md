> mapgis-3d-building-grow

## 属性

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:** mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，同时 mapgis-web-scene
  插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `(Math.random() * 100000000).toFixed(0)`随机计算值
- **描述:** 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。

### `width`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:** 播放条面板的宽度
- **默认值:** 500

### `enableSteps`

- **类型:** `Boolean`
- **非侦听属性**
- **描述:** 是否开启以均匀步长进行生长播放，开启则根据参数 steps(默认为 2 天)为步长，不开启则以建筑物数据中的建筑时间为节点进行生长播放
- **默认值:** false

### `steps`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **描述:** 播放步长，单位：天，仅当 enableSteps 为 true 时有效。
- **默认值:** 1

### `isVisibleBeforeGrowing`

- **类型:** `Boolean`
- **可选**
- **侦听属性**
- **描述:** 开始点击单体生长时间轴前是否隐藏整个模型，即单体建筑生长组件加载成功后，是否隐藏 m3d 模型，默认为不隐藏。
- **默认值:** false

## 方法

### `startGrow`

- **Description:** 开启建筑生长播放

### `stopGrow`

- **Description:** 暂停城市生长

## 事件

### `loaded`

- **Description:** 在 单体建筑生长 加载完毕后发送该事件
- **Payload** { component }
- 1. component 组件的 this 环境，this 句柄

## 示例

```vue
<mapgis-web-scene style="height:95vh">
<mapgis-ui-button type="primary" @click="getTree" :style="{position: 'absolute', zIndex:3000,top:0px}">
  开启单体化生长播放条
</mapgis-ui-button>
<mapgis-rastertile-layer v-if="false" layerId="tdt"
                         url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"/>
<mapgis-3d-m3d-layer
    :url="m3d" vueIndex="test_building_layer"/>
<mapgis-3d-building-grow 
        vueIndex="test_building_layer"
        :enableSteps='true'
        :steps="steps"
        v-if="loadedM3d"/>
</mapgis-web-scene>
<script>
export default {
  data() {
    return {
      loadedM3d: false,
      steps: 3,
      m3d: "http://192.168.88.204:8089/M3D/2.0/BIM%E6%A8%A1%E5%9E%8B%E7%94%9F%E9%95%BFtime/BIM%E6%A8%A1%E5%9E%8B%E7%94%9F%E9%95%BFtime.mcj",
    };
  },
  methods: {
    getTree() {
      this.loadedM3d = true;
    },
  },
};
</script>
```
