# DynamicCutting

## 属性

### `startDistance`

- **类型:** `Number`
- **可选**
- **默认值:** `0`
- **侦听属性**
- **描述:** 动态剖切的起始距离

### `currentDistance`

- **类型:** `Number`
- **可选**
- **默认值:** `0`
- **侦听属性**
- **描述:** 当前切割面所在位置，通过改变这个值来修改剖切面位置

### `endDistance`

- **类型:** `Number`
- **可选**
- **默认值:** `0`
- **侦听属性**
- **描述:** 动态剖切的结束距离，不传时，偶人取模型外包盒的距离

### `direction`

- **类型:** `String`
- **可选**
- **默认值:** `left`
- **侦听属性**
- **描述:** 动态剖切的切割面朝向，方向分为left、right、forward、back、top、bottom

### `color`

- **类型:** `String`
- **可选**
- **默认值:** `#00FFFF`
- **侦听属性**
- **描述:** 动态剖切的剖切面颜色，与css的color属性一致，使用16进制颜色

### `opacity`

- **类型:** `Number`
- **可选**
- **默认值:** `0.7`
- **侦听属性**
- **描述:** 填挖方墙体透明度，与css的opacity属性一致

### `defaultCutIndex`

- **类型:** `Number`
- **可选**
- **默认值:** `第一个输入的vueIndex`
- **侦听属性**
- **描述:** 当有多个模型要进行剖切时，要选择一个剖切的主体模型，迫切面会绑定在这个模型上

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**

```
mapgis-web-scene组件的ID，当使用多个mapgis-web-scene组件时，需要指定该值，来唯一标识mapgis-web-scene组件，
同时mapgis-web-scene插槽中的组件也需要传入相同的vueKey，让组件知道应该作用于哪一个mapgis-web-scene。
```

### `vueIndex`

- **类型:** `Number或Array`
- **必传:**
- **侦听属性**
- **描述:** 通过vueIndex将剖切面绑定在模型上，当只剖切一个模型时，传一个vueIndex即可，当要通视对多个模型进行剖切时，传入一个[vueIndex]数组即可

## 事件

### `@loaded`

- **Description:** 动态剖切加载完毕事件
- **Param:** `{DynamicCutting}`
- `DynamicCutting` 动态剖切对象

## 插槽

### `default`

- **Description:** 覆盖插槽即可重写界面

## 动态剖切使用方法

```vue

<template>
  <mapgis-web-scene
      libPath="cesium/Cesium.js"
      pluginPath="cesium/webclient-cesium-plugin.min.js">
    <mapgis-3d-igs-m3d :vueIndex="vueIndex2" :url="url"></mapgis-3d-igs-m3d>
    <mapgis-3d-igs-m3d :vueIndex="vueIndex" :url="url2"></mapgis-3d-igs-m3d>
    <mapgis-3d-dynamic-cutting
        :vueIndex="vueIndex"
        :startDistance="distance"
        :currentDistance="currentDistance"
        :defaultCutIndex="defaultCutIndex"
        :color="color"
        :opacity="opacity"
        :direction="direction"
    ></mapgis-3d-dynamic-cutting>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      url: 'http://develop.smaryun.com:6163/igs/rest/g3d/钻孔_2_钻孔模型s',
      url2: 'http://develop.smaryun.com:6163/igs/rest/g3d/钻孔分层点_Sur_000_Ent',
      vueIndex: 1,
      vueIndex2: 2,
      distance: -1000,
      direction: "right",
      defaultCutIndex: 2,
      color: "#ff0000",
      opacity: 0.3,
      currentDistance: 2000
    };
  },
  methods: {}
};
</script>
```

## 动态剖切 - 同时剖切多个模型

```vue

<template>
  <mapgis-web-scene
      libPath="cesium/Cesium.js"
      pluginPath="cesium/webclient-cesium-plugin.min.js">
    <mapgis-3d-igs-m3d :vueIndex="vueIndex2" :url="url"></mapgis-3d-igs-m3d>
    <mapgis-3d-igs-m3d :vueIndex="vueIndex" :url="url2"></mapgis-3d-igs-m3d>
    <mapgis-3d-dynamic-cutting
        :vueIndex="vueIndexArr"
        :startDistance="distance"
        :currentDistance="currentDistance"
        :defaultCutIndex="defaultCutIndex"
        :color="color"
        :opacity="opacity"
        :direction="direction"
    ></mapgis-3d-dynamic-cutting>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      url: 'http://develop.smaryun.com:6163/igs/rest/g3d/钻孔_2_钻孔模型s',
      url2: 'http://develop.smaryun.com:6163/igs/rest/g3d/钻孔分层点_Sur_000_Ent',
      vueIndex: 1,
      vueIndex2: 2,
      //同时剖切多个模型时，传入一串要切割的模型的vueIndex即可
      vueIndexArr: [1, 2],
      distance: -1000,
      direction: "right",
      defaultCutIndex: 2,
      color: "#ff0000",
      opacity: 0.3,
      currentDistance: 2000
    };
  },
  methods: {}
};
</script>
```

## 自定义界面-插槽方式

```vue

<template>
  <mapgis-web-scene
      libPath="cesium/Cesium.js"
      pluginPath="cesium/webclient-cesium-plugin.min.js">
    <mapgis-3d-igs-m3d :vueIndex="vueIndex2" :url="url"></mapgis-3d-igs-m3d>
    <mapgis-3d-igs-m3d :vueIndex="vueIndex" :url="url2"></mapgis-3d-igs-m3d>
    <mapgis-3d-dynamic-cutting
        :vueIndex="vueIndexArr"
        :startDistance="distance"
        :currentDistance="currentDistance"
        :defaultCutIndex="defaultCutIndex"
        :color="color"
        :opacity="opacity"
        :direction="direction"
        @loaded="loaded"
    >
      <div>
        <!--自定义您的界面-->
        自定义您的界面
        <button @click="change">动态剖切</button>
      </div>
    </mapgis-3d-dynamic-cutting>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      url: 'http://develop.smaryun.com:6163/igs/rest/g3d/钻孔_2_钻孔模型s',
      url2: 'http://develop.smaryun.com:6163/igs/rest/g3d/钻孔分层点_Sur_000_Ent',
      vueIndex: 1,
      vueIndex2: 2,
      //同时剖切多个模型时，传入一串要切割的模型的vueIndex即可
      vueIndexArr: [1, 2],
      distance: -1000,
      direction: "right",
      defaultCutIndex: 2,
      color: "#ff0000",
      opacity: 0.3,
      currentDistance: 2000,
      DynamicCutting: undefined
    };
  },
  methods: {
    loaded(DynamicCutting){
      //在这里拿到DynamicCutting组件对象
      this.DynamicCutting = DynamicCutting;
    },
    change(){
      //通过改变currentDistance的值，来改变剖切距离
      this.DynamicCutting.currentDistance = 1500;
    }
  }
};
</script>
```
