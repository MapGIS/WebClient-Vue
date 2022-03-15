> mapgis-3d-projector-setting

## 属性

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:** mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `(Math.random() * 100000000).toFixed(0)`随机计算值
- **描述:** 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。

### `modelUrl`

- **类型:** `String`
- **必选**
- **侦听属性**
- **描述:** 相机模型路径
- **默认值:**

### `modelOffset`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 相机模型朝向偏移量
- **默认值:** { headingOffset: -90, pitchOffset: 0, rollOffset: 0 }

### `modelScale`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **描述:** 相机模型尺寸比例
- **默认值:** 1

### `hideVPInvisible`

- **类型:** `Boolean`
- **可选**
- **侦听属性**
- **描述:** 当摄像头不在当前视图范围内，隐藏投影；参数设置后，对新投放或者重新投放的对象有效，对于已经投放的对象无效
- **默认值:** false

### `settings`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 投放视频参数对象
- **默认值:**

```
{
    id: "987-765-543-124",
    name: "testProjector3",
    description: "",
    isProjected: false,
    params: {
      projectorType: "video",
      imgUrl: "",
      videoSource: {
        protocol: "m3u8",
        videoUrl: "http://192.168.91.123:10008/record/video3/20211221/out.m3u8",
      },
      cameraPosition: {
        x: 114.4006886798949,
        y: 30.467287432107295,
        z: 85.46751512564336,
      },
      orientation: {
        heading: 271.628505216584,
        pitch: -78.4,
        roll: 359.3,
      },
      hFOV: 32.5,
      vFOV: 19,
      hintLineVisible: true,
    }
}
```

## 方法

### `putProjector`

- **Description:** 投放视频
- **Param:** `projector` 投放视频参数对象

### `cancelPutProjector`

- **Description:** 取消投放
- **Param:** `id` 要取消投放视频的 id

onChangeSetting(val, tag)

### `onChangeSetting`

- **Description:** 实时修改视频投放参数(朝向，视角和视锥线显示)
- **Param:** `val` 要修改的值
- **Param:** `tag` 要修改的值对应的 key 值

## 事件

### `@load`

- **Description:** 在 ProjectorSetting 组件 加载完毕后发送该事件
- **Payload** ProjectorSetting 组件对象

### `@unload`

- **Description:** 在 ProjectorSetting 组件 销毁前发送该事件
- **Payload** ProjectorSetting 组件对象

### `@update-settings`

- **Description:** 在 修改配置点击确定按钮 时发送该事件
- **Payload** 更新后的 settings

### `@cancel`

- **Description:** 在 点击取消按钮 时发送该事件

## 插槽

### imgUpload

- **Description:** 图片上传按钮插槽
- **Param:** click {Function} 主要用来回传上传后图片路径。

```vue
<template slot="imgUpload" slot-scope="{ click }">
  <mp-upload-image
    :uploadUrl="`${baseUrl}/api/local-storage/pictures`"
    :click="click"
  ></mp-upload-image>
</template>
```

## 示例

```vue
<template>
  <mapgis-web-scene style="height: 95vh" v-on:load="handleLoad">
    <mapgis-3d-m3d-layer
      :autoReset="autoReset"
      :maximumScreenSpaceError="maximumScreenSpaceError"
      :url="m3dUrl"
    ></mapgis-3d-m3d-layer>
    <mapgis-ui-card
      v-if="isM3DLoaded"
      class="storybook-ui-card"
      style="max-height:500px;overflow-y:auto"
    >
      <mapgis-3d-projector-setting
        :settings="settings"
        :modelUrl="modelUrl"
        :modelOffset="modelOffset"
        :hideVPInvisible="hideVPInvisible"
      ></mapgis-3d-projector-setting>
    </mapgis-ui-card>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      m3dUrl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
      autoReset: true,
      maximumScreenSpaceError: 8,
      isM3DLoaded: false,
      modelUrl: "./CesiumModels/Cesium_Camera.glb",
      modelOffset: { headingOffset: -90, pitchOffset: 0, rollOffset: 0 },
      hideVPInvisible: false,
      settings: {
        id: "987-765-543-124",
        name: "testProjector3",
        description: "",
        isProjected: false,
        params: {
          projectorType: "video",
          imgUrl: "",
          videoSource: {
            protocol: "m3u8",
            videoUrl:
              "http://192.168.91.123:10008/record/video3/20211221/out.m3u8",
          },
          cameraPosition: {
            x: 114.4006886798949,
            y: 30.467287432107295,
            z: 85.46751512564336,
          },
          orientation: {
            heading: 271.628505216584,
            pitch: -78.4,
            roll: 359.3,
          },
          hFOV: 32.5,
          vFOV: 19,
          hintLineVisible: true,
        },
      },
    };
  },
  methods: {
    handleLoad(e) {
      setTimeout(() => {
        //增加延时，确保模型已加载
        this.isM3DLoaded = true;
      }, 5000);
    },
  },
};
</script>
```
