> mapgis-3d-scene-setting

## 属性

### `panelStyle`

- **类型:** `Object`
- **可选**
- **非侦听属性**
- **描述:** 场景设置组件的面板的样式。

### `initParams`

- **类型:** `Object`
- **可选**
- **非侦听属性**
- **默认值:** `{}`
- **描述:** 场景设置组件的初始设置值，可从外部传入。
- **示例**

```js
{
  // 基本设置
  "basicSetting": {
    // 是否显示地球
    "earth": true,
    // 是否显示大气层
    "skyAtmosphere": true,
    // 是否开启阴影效果
    "shadow": false,
    // 是否开启地形深度检测
    "depthTest": false,
    // 是否显示帧率
    "FPS": false,
    // 是否显示时间轴
    "timeline": false,
    // 是否显示罗盘控件
    "compass": false,
    // 罗盘控件位置,默认为undefined
    "compassPosition"：{
      // 罗盘控件位置，"top-left","top-right","bottom-left","bottom-right"
      "anchor": "top-left",
      // 水平相对距离，对应left和right
      "horizontalOffset": this.stuffWidth,
      // 垂直相对距离，对应top和bottom
      "verticalOffset": 400,
    },
    // 是否显示缩放控件
    "zoom": false,
    // 是否显示状态栏
    "statebar": true,
    // 是否开启平面模式
    "sceneMode": false,
    // 亮度
    "layerbrightness": 1.0,
    // 对比度
    "layercontrast": 1.0,
    // 色调
    "layerhue": 0.0,
    // 饱和度
    "layersaturation": 1.0
  },
  // 相机设置
  "cameraSetting": {
    // 是否开启地表自适应透明模式
    "selfAdaption": false,
    // 地表自适应透明参数
    "selfAdaptionParams": {
      // 地表自适应透明高度阈值，如果传入的模型包围盒半径小于400Km，则使用传入的半径；反之则使用400Km
      "maxHeigh": 400000
    },
    // 是否开启地下模式
    "undgrd": false,
    // 地下模式参数
    "undgrdParams": {
      // 地表透明度
      "groundAlpha": 0.5,
    },
    // FOV设置
    "fov": 60
  },
  // 光照设置
  "lightSetting": {
    // 是否开启太阳光照
    "sunlight": false,
    // 太阳光照参数
    "sunlightParams": {
      // 光照类型，可设置为"DAYNIGHT_SHADING"太阳光照和"VERTEX_LIGHTING"顶点光照
      "lightingMode": "DAYNIGHT_SHADING"
      // 太阳光照颜色
      "lightColor": "rgba(255,255,255,255)"
    },
    // 模型亮度
    "lightIntensity": 10
  },
  // 天气设置
  "weatherSetting": {
    // 是否显示太阳
    "sun": true,
    // 是否显示月亮
    "moon": true,
    // 是否显示星空
    "sceneSkybox": true,
    // 是否显示天空盒
    "skybox": false,
    // 是否显示云层效果
    "clouds": false,
    // 云层参数
    "cloudsParams": {
      // 云层变化时间间隔
      "cloudsduration": 5
    },
    // 是否显示雨效果
    "rain": false,
    // 雨的参数
    "rainParams": {
      // 下雨速度
      "speed": 18,
      // 雨丝透明度
      "rainOpacity": 0.6,
      // 雨丝的角度
      "angle": -30,
      // 雨丝的附加长度
      "length": 1
    },
    // 是否显示雪效果
    "snow": false,
    // 雪的参数
    "snowParams": {
      // 雪粒大小
      "size": 5,
      // 雪密度
      "density": 5
    },
    // 是否显示雾效果
    "fog": false,
    // 雾参数
    "fogParams": {
      // 雾透明度
      "fogOpacity": 0.5,
      // 雾颜色
      "color": "#FFFFFF"
    },
    // 是否开启雾化效果
    "surficialFog": true,
    // 雾化参数
    "surfFogParams": {
      // 雾密度
      "surfFogDst": 0.0002
    }
  },
  // 特效设置
  "effectSetting": {
    // 是否开启黑白照片效果
    "blckWhite": false,
    // 是否开启夜视效果
    "ntVision": false,
    // 是否开启场景泛光
    "bloom": false,
    // 场景泛光参数
    "bloomParams": {
      // 亮度
      "bloomBrt": -0.3,
      // 对比度
      "bloomCtrst": 128
    }
  }
}
```

### `boundingSphereRadius`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `0`
- **描述:** 模型集最大包围盒半径。用于地表自适应透明度，当相机高度低于这个值，则设置地表透明度。
- **示例**

## 方法

### `togglePanel`

- **Description:** 切换场景设置面板的显示状态

## 事件

### `@loaded`

- **Description:** 在 场景设置组件 加载完毕后发送该事件
- **Payload** 场景设置组件对象

### `@unload`

- **Description:** 在 场景设置组件 销毁时发送该事件
- **Payload** 场景设置组件对象

## 示例

```vue
<template>
  <mapgis-web-scene style="height:95vh">
    <mapgis-3d-scene-layer
      :auto-reset="autoReset"
      :maximum-screen-space-error="maximumScreenSpaceError"
      :url="m3dUrl"
    />
    <mapgis-3d-scene-setting :panelStyle="panelStyle" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      autoReset: true,
      maximumScreenSpaceError: 8,

      panelStyle: {
        position: "absolute",
        top: "10px",
        left: "10px",
        width: "320px",
        background: "#fff"
      }
    };
  }
};
</script>
```
