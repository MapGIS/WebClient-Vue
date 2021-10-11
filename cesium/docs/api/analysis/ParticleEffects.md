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

### `emissionRate`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **描述:** 发射速率
- **默认值:** 20.0

### `imageSize`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **描述:** 尺寸
- **默认值:** 5.0

### `minimumParticleLife`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **描述:** 粒子最小存在时间
- **默认值:** 2.0

### `maximumParticleLife`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **描述:** 粒子最大存在时间
- **默认值:** 3.0

### `minimumSpeed`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **描述:** 最小速度
- **默认值:** 9.0

### `maximumSpeed`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **描述:** 最大速度
- **默认值:** 9.5

### `startScale`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **描述:** 初始比例
- **默认值:** 1.0

### `endScale`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **描述:** 初始比例
- **默认值:** 4.0

### `emitterType`

- **类型:** `String`
- **可选**
- **侦听属性**
- **描述:** 发射类型:可选 '盒状放射', '圆形放射', '锥形放射', '球形放射'
- **默认值:** '圆形放射'

### `imgUrl`

- **类型:** `String`
- **必选**
- **非侦听属性**
- **描述:** 显示效果图片路径。<span style="color:red;fontsize=5px;">必传，系统运行后，访问图片对应的相对路径</span>
- **默认值:** ''

## 方法

### `onCreateParticle`

- **Description:** 添加特效粒子

### `onClearParticle`

- **Description:** 移除粒子特效

### `onEmitterChange`

- **Description:** 切换发射类型，赋值可选 '盒状放射', '圆形放射', '锥形放射', '球形放射'
- **parameter** value: 发射类型

### `onChangeEffect`

- **Description:** 动态修改参数，及时响应函数
- **parameter** val: 修改后的值
- **parameter** key: 修改对应的参数名

## 事件

### `@load`

- **Description:** 在 ParticleEffects 加载完毕后发送该事件
- **Payload** ParticleEffects 对象

### `@unload`

- **Description:** 关闭 ParticleEffects 组件前发送该事件
- **Payload** ParticleEffects 对象

## 示例

### 非插槽方式

```vue
<template>
  <mapgis-web-scene style="{height: '100vh'}">
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
    <mapgis-ui-card class="storybook-ui-card">
      <mapgis-ui-toolbar>
        <mapgis-ui-toolbar-command-group>
          <mapgis-ui-toolbar-command
            title="火焰"
            icon="mapgis-fire"
            :active="particleMode === 'fire'"
            @click="onCreateParticle('fire')"
          />
          <mapgis-ui-toolbar-command
            title="烟雾"
            icon="mapgis-smoke"
            :active="particleMode === 'smoke'"
            @click="onCreateParticle('smoke')"
          />
        </mapgis-ui-toolbar-command-group>
        <mapgis-ui-toolbar-space />
        <mapgis-ui-toolbar-command-group>
          <mapgis-ui-toolbar-command
            title="清除"
            icon="mapgis-delete"
            @click="onClearParticle"
          />
        </mapgis-ui-toolbar-command-group>
      </mapgis-ui-toolbar>
      <mapgis-3d-particle-effects
        :emissionRate="emissionRate"
        :imageSize="imageSize"
        :minimumParticleLife="minimumParticleLife"
        :maximumParticleLife="maximumParticleLife"
        :minimumSpeed="minimumSpeed"
        :maximumSpeed="maximumSpeed"
        :startScale="startScale"
        :endScale="endScale"
        :emitterType="emitterType"
        :imgUrl="imgUrl"
        @load="load"
      />
    </mapgis-ui-card>
  </mapgis-web-scene>
</template>

<script>
import fireImg from "../assets/fire.png";
import smokeImg from "../assets/smoke.png";
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
        value: "2ddaabf906d4b5418aed0078e1657029"
      },
      particleMode: "",
      imgUrl: "",
      particleEffects: null,
      emissionRate: 2.0, // 发射速率
      imageSize: 5.0, // 尺寸
      minimumParticleLife: 2.0, // 粒子最小存在时间
      maximumParticleLife: 3.0, //粒子最大存在时间
      minimumSpeed: 9.0, // 最小速度
      maximumSpeed: 9.5, // 最大速度
      startScale: 1.0, // 初始比例
      endScale: 4.0, // 结束比例
      emitterType: "圆形放射"
    };
  },
  methods: {
    load(particleEffects) {
      this.particleEffects = particleEffects;
    },
    onCreateParticle(type) {
      this.particleMode = type;
      this.imgUrl = type === "fire" ? fireImg : smokeImg;
      this.particleEffects.onCreateParticle();
    },
    onClearParticle() {
      this.particleEffects.onClearParticle();
    }
  }
};
</script>
```

## 自定义界面-插槽方式

```vue
<template>
  <mapgis-web-scene style="{height: '100vh'}">
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
    <mapgis-ui-card class="storybook-ui-card">
      <mapgis-ui-toolbar>
        <mapgis-ui-toolbar-command-group>
          <mapgis-ui-toolbar-command
            title="火焰"
            icon="mapgis-fire"
            :active="particleMode === 'fire'"
            @click="onCreateParticle('fire')"
          />
          <mapgis-ui-toolbar-command
            title="烟雾"
            icon="mapgis-smoke"
            :active="particleMode === 'smoke'"
            @click="onCreateParticle('smoke')"
          />
        </mapgis-ui-toolbar-command-group>
        <mapgis-ui-toolbar-space />
        <mapgis-ui-toolbar-command-group>
          <mapgis-ui-toolbar-command
            title="清除"
            icon="mapgis-delete"
            @click="onClearParticle"
          />
        </mapgis-ui-toolbar-command-group>
      </mapgis-ui-toolbar>
      <mapgis-3d-particle-effects
        :emissionRate="emissionRate"
        :imageSize="imageSize"
        :minimumParticleLife="minimumParticleLife"
        :maximumParticleLife="maximumParticleLife"
        :minimumSpeed="minimumSpeed"
        :maximumSpeed="maximumSpeed"
        :startScale="startScale"
        :endScale="endScale"
        :emitterType="emitterType"
        :imgUrl="imgUrl"
        @load="load"
      >
        <!--      这里是自定义的界面-->
        <div class="mapgis-widget-particle-effects">
          <mapgis-ui-setting-form class="particle-effects-setting">
            <mapgis-ui-form-item label="发射速率(个/秒)">
              <mapgis-ui-row>
                <mapgis-ui-col :span="15">
                  <mapgis-ui-slider
                    class="slider-body"
                    v-model="emissionRate"
                    :min="0"
                    :max="100"
                    @change="val => onChangeEffect(val, 'emissionRate')"
                  />
                </mapgis-ui-col>
                <mapgis-ui-col :span="9">
                  <mapgis-ui-input-number
                    class="slider-number"
                    v-model="emissionRate"
                    :min="0"
                    :max="100"
                  />
                </mapgis-ui-col>
              </mapgis-ui-row>
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="尺寸(像素)">
              <mapgis-ui-row>
                <mapgis-ui-col :span="15">
                  <mapgis-ui-slider
                    class="slider-body"
                    v-model="imageSize"
                    :min="2"
                    :max="60"
                    @change="val => onChangeEffect(val, 'imageSize')"
                  />
                </mapgis-ui-col>
                <mapgis-ui-col :span="9">
                  <mapgis-ui-input-number
                    class="slider-number"
                    v-model="imageSize"
                    :min="2"
                    :max="60"
                  />
                </mapgis-ui-col>
              </mapgis-ui-row>
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="最小存在时间">
              <mapgis-ui-row>
                <mapgis-ui-col :span="15">
                  <mapgis-ui-slider
                    class="slider-body"
                    v-model="minimumParticleLife"
                    :min="0.1"
                    :max="30.0"
                    :step="0.1"
                    @change="val => onChangeEffect(val, 'minimumParticleLife')"
                  />
                </mapgis-ui-col>
                <mapgis-ui-col :span="9">
                  <mapgis-ui-input-number
                    class="slider-number"
                    v-model="minimumParticleLife"
                    :min="0.1"
                    :max="30.0"
                    :step="0.1"
                  />
                </mapgis-ui-col>
              </mapgis-ui-row>
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="最大存在时间">
              <mapgis-ui-row>
                <mapgis-ui-col :span="15">
                  <mapgis-ui-slider
                    class="slider-body"
                    v-model="maximumParticleLife"
                    :min="0.1"
                    :max="30.0"
                    :step="0.1"
                    @change="val => onChangeEffect(val, 'maximumParticleLife')"
                  />
                </mapgis-ui-col>
                <mapgis-ui-col :span="9">
                  <mapgis-ui-input-number
                    class="slider-number"
                    v-model="maximumParticleLife"
                    :min="0.1"
                    :max="30.0"
                    :step="0.1"
                  />
                </mapgis-ui-col>
              </mapgis-ui-row>
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="最小速度">
              <mapgis-ui-row>
                <mapgis-ui-col :span="15">
                  <mapgis-ui-slider
                    class="slider-body"
                    v-model="minimumSpeed"
                    :min="0"
                    :max="30"
                    @change="val => onChangeEffect(val, 'minimumSpeed')"
                  />
                </mapgis-ui-col>
                <mapgis-ui-col :span="9">
                  <mapgis-ui-input-number
                    class="slider-number"
                    v-model="minimumSpeed"
                    :min="0"
                    :max="30"
                  />
                </mapgis-ui-col>
              </mapgis-ui-row>
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="最大速度">
              <mapgis-ui-row>
                <mapgis-ui-col :span="15">
                  <mapgis-ui-slider
                    class="slider-body"
                    v-model="maximumSpeed"
                    :min="0"
                    :max="30"
                    @change="val => onChangeEffect(val, 'maximumSpeed')"
                  />
                </mapgis-ui-col>
                <mapgis-ui-col :span="9">
                  <mapgis-ui-input-number
                    class="slider-number"
                    v-model="maximumSpeed"
                    :min="0"
                    :max="30"
                  />
                </mapgis-ui-col>
              </mapgis-ui-row>
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="初始比例">
              <mapgis-ui-row>
                <mapgis-ui-col :span="15">
                  <mapgis-ui-slider
                    class="slider-body"
                    v-model="startScale"
                    :min="0.0"
                    :max="10.0"
                    :step="0.5"
                    @change="val => onChangeEffect(val, 'startScale')"
                  />
                </mapgis-ui-col>
                <mapgis-ui-col :span="9">
                  <mapgis-ui-input-number
                    class="slider-number"
                    v-model="startScale"
                    :min="0.0"
                    :max="10.0"
                    :step="0.5"
                  />
                </mapgis-ui-col>
              </mapgis-ui-row>
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="结束比例">
              <mapgis-ui-row>
                <mapgis-ui-col :span="15">
                  <mapgis-ui-slider
                    class="slider-body"
                    v-model="endScale"
                    :min="0.0"
                    :max="10.0"
                    :step="0.5"
                    @change="val => onChangeEffect(val, 'endScale')"
                  />
                </mapgis-ui-col>
                <mapgis-ui-col :span="9">
                  <mapgis-ui-input-number
                    class="slider-number"
                    v-model="endScale"
                    :min="0.0"
                    :max="10.0"
                    :step="0.5"
                  />
                </mapgis-ui-col>
              </mapgis-ui-row>
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="发射类型">
              <mapgis-ui-select v-model="emitterType" @change="onEmitterChange">
                <mapgis-ui-select-option
                  v-for="item in emitterOptions"
                  :key="item"
                >
                  {{ item }}
                </mapgis-ui-select-option>
              </mapgis-ui-select>
            </mapgis-ui-form-item>
          </mapgis-ui-setting-form>
        </div>
      </mapgis-3d-particle-effects>
    </mapgis-ui-card>
  </mapgis-web-scene>
</template>

<script>
import fireImg from "../assets/fire.png";
import smokeImg from "../assets/smoke.png";
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
        value: "2ddaabf906d4b5418aed0078e1657029"
      },
      particleMode: "",
      imgUrl: "",
      particleEffects: null,
      emissionRate: 2.0, // 发射速率
      imageSize: 5.0, // 尺寸
      minimumParticleLife: 2.0, // 粒子最小存在时间
      maximumParticleLife: 3.0, //粒子最大存在时间
      minimumSpeed: 9.0, // 最小速度
      maximumSpeed: 9.5, // 最大速度
      startScale: 1.0, // 初始比例
      endScale: 4.0, // 结束比例
      emitterType: "圆形放射",
      emitterOptions: ["盒状放射", "圆形放射", "锥形放射", "球形放射"] // 发射类型下拉项
    };
  },
  methods: {
    load(particleEffects) {
      this.particleEffects = particleEffects;
    },
    onCreateParticle(type) {
      this.particleMode = type;
      this.imgUrl = type === "fire" ? fireImg : smokeImg;
      this.particleEffects.onCreateParticle();
    },
    onClearParticle() {
      this.particleEffects.onClearParticle();
    },
    onChangeEffect(val, key) {
      this.particleEffects.onChangeEffect(val, key);
    },
    onEmitterChange(val) {
      this.particleEffects.onEmitterChange(val);
    }
  }
};
</script>
```
