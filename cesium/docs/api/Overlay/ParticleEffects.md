> mapgis-3d-particle-effects

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

### `symbolList`

- **类型:** `Array`
- **可选**
- **侦听属性**
- **描述:** 符号库参数配置
- **默认值:** 其中config和iconUrl是非必传参数，config是指当前符号的粒子特效预设参数配置，当初始化生成该符号的粒子特效时使用这套config参数。
      iconUrl是指当前符号对象的iconfont图标的type,若不传则默认图标使用image的png图片。
```
  [
    {
      guid: "C0EA27B2-0365-1F9F-C71A-B0586ADDCA0D",
      name: "火焰",
      image: "./fire.png",
      iconUrl: "mapgis-fire",
      config:{
        emitterType: "圆形放射",
        emissionRate: 13.0,
        imageSize: 5.0,
        minimumParticleLife: 2.0,
        maximumParticleLife: 3.0,
        minimumSpeed: 9.0,
        maximumSpeed: 10.0,
        startScale: 1.0,
        endScale: 4.0
      },
    },
    {
      guid: "B8AF7BAC-082F-14C6-BECD-8F7AB44C5019",
      name: "烟雾",
      image: "./smoke.png",
      iconUrl: "mapgis-smoke",
    }
  ]
```

### `particleList`

- **类型:** `Array`
- **可选**
- **侦听属性**
- **v-model**
- **描述:** 粒子特效参数配置，传入该参数后在场景中自动生成对应的粒子特效，其中参数包括一下值：

  ```
  [{
            guid: "49A834D7-97C6-F452-4611-6F0739809B50",
            name: "粒子名称1",
            param: {
                emitterType: "圆形放射",  //发射类型
                emissionRate: 20.0,     //发射速率
                imageSize: 5.0,         //尺寸
                minimumParticleLife: 2.0,  //粒子最小存在时间
                maximumParticleLife: 3.0,  //粒子最大存在时间
                minimumSpeed: 9.0,         //最小速度
                maximumSpeed: 10.0,        //最大速度
                startScale: 1.0,           //初始比例
                endScale: 4.0,             //结束比例
                symbolGuid: "9D09DB87-7955-9295-2E34-61E83C30D3AA",
                position: {
                    longitude: 115.0352606,
                    latitude: 27.00688591,
                    height: 1
                }
            }
  }]
  ```

  其中数组中每个粒子对象包含下列参数：

  | Name  | Type   | Description      |
  | :---- | :----- | :--------------- |
  | guid  | String | 粒子唯一的 guid  |
  | name  | String | 粒子名称         |
  | param | Object | 粒子特效配置参数 |

其中 param 对象中包含下列参数：

| Name                | Type   | Description                                                              |
| :------------------ | :----- | :----------------------------------------------------------------------- |
| emitterType         | String | 发射类型:可选 '盒状放射', '圆形放射', '锥形放射', '球形放射'             |
| emissionRate        | Number | 发射速率(个/秒)                                                          |
| imageSize           | Number | 尺寸(像素)                                                               |
| minimumParticleLife | Number | 粒子最小存在时间(秒)                                                     |
| maximumParticleLife | Number | 粒子最大存在时间(秒)                                                     |
| minimumSpeed        | Number | 最小速度(个/秒)                                                          |
| maximumSpeed        | Number | 最大速度(个/秒)                                                          |
| startScale          | Number | 初始比例                                                                 |
| endScale            | Number | 结束比例                                                                 |
| symbolGuid          | String | 该粒子特效对应的符号的 guid                                              |
| position            | Object | 该粒子特效生成所在的位置的坐标点，包含参数 longitude、latitude 和 height |

- **默认值:** []

## 方法

### `onCreateParticle`

- **Description:** 添加特效粒子

### `onClearParticle`

- **Description:** 移除粒子特效

### `onEmitterChange`

- **Description:** 切换发射类型，赋值可选 '盒状放射', '圆形放射', '锥形放射', '球形放射'
- **Param:** `{value}`
- `value` 发射类型

### `onChangeEffect`

- **Description:** 动态修改参数，及时响应函数
- **Param:** `{val，key}`
  `val` 修改后的值
  `key` 修改对应的参数名

## 事件

### `@load`

- **Description:** 在 ParticleEffects 加载完毕后发送该事件
- **Payload** ParticleEffects组件 对象

### `@unload`

- **Description:** 关闭 ParticleEffects 组件前发送该事件
- **Payload** ParticleEffects组件对象

### `@changeParticle`

- **Description:**  ParticleEffects 组件 修改或新增、删除粒子列表参数时发送该事件
- **Payload** particleList 数组
## 示例

```vue
<template>
  <mapgis-web-scene :style="{ height: '100vh' }">
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="url"
      :wmtsLayer="layer"
      :tileMatrixSet="tileMatrixSet"
      :format="format"
      :tilingScheme="tilingScheme"
      :token="token"
    ></mapgis-3d-ogc-wmts-layer>
    <mapgis-3d-igs-m3d
      :autoReset="autoReset"
      :maximumScreenSpaceError="maximumScreenSpaceError"
      :url="m3dUrl"
    ></mapgis-3d-igs-m3d>
    <mapgis-ui-card v-if="showParticle" class="storybook-ui-card">
      <mapgis-3d-particle-effects-manager
        :symbolList="symbolList"
        :particleList="particleList"
        @load="load"
      />
    </mapgis-ui-card>
    <mapgis-3d-statebar></mapgis-3d-statebar>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      maximumScreenSpaceError: 8,
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "2ddaabf906d4b5418aed0078e1657029",
      },
      autoReset: true,
      particleEffects: null,
      showParticle: true,
      symbolList: [
        {
          guid: "9D09DB87-7955-9295-2E34-61E83C30D3AA",
          name: "外部火焰",
          image: `http://localhost:8895/img/fire.png`,
          iconUrl: "mapgis-fire",
        },
        {
          guid: "F9FDE880-8F5B-AEDF-CA95-ADC54F02A34F",
          name: "外部烟雾",
          image: `http://localhost:8895/img/smoke.png`,
          iconUrl: "mapgis-smoke",
        },
      ],
      particleList: [
        {
          guid: "49A834D7-97C6-F452-4611-6F0739809B50",
          name: "粒子名称1",
          param: {
            emitterType: "圆形放射", //发射类型
            emissionRate: 20.0, //发射速率
            imageSize: 5.0, //尺寸
            minimumParticleLife: 2.0, //粒子最小存在时间
            maximumParticleLife: 3.0, //粒子最大存在时间
            minimumSpeed: 9.0, //最小速度
            maximumSpeed: 10.0, //最大速度
            startScale: 1.0, //初始比例
            endScale: 4.0, //结束比例
            symbolGuid: "9D09DB87-7955-9295-2E34-61E83C30D3AA",
            position: {
              longitude: 115.0352606,
              latitude: 27.00688591,
              height: 1,
            },
          },
        },
        {
          guid: "36F335E8-1F3C-41E2-40AA-EE950D691761",
          name: "粒子名称2",
          param: {
            emitterType: "球形放射", //发射类型
            emissionRate: 40.0, //发射速率
            imageSize: 6.0, //尺寸
            minimumParticleLife: 2.0, //粒子最小存在时间
            maximumParticleLife: 3.0, //粒子最大存在时间
            minimumSpeed: 9.0, //最小速度
            maximumSpeed: 10.0, //最大速度
            startScale: 1.0, //初始比例
            endScale: 4.0, //结束比例
            symbolGuid: "9D09DB87-7955-9295-2E34-61E83C30D3AA",
            position: {
              longitude: 115.03566638,
              latitude: 27.00743179,
              height: 1,
            },
          },
        },
      ],
    };
  },
  methods: {
    load(particleEffects) {
      this.particleEffects = particleEffects;
    }
  },
};
</script>
```
