# GeoJSON 图层

> mapgis-3d-geojson-layer

## 属性

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

### `baseUrl`

- **类型:** `Object | String`
- **非侦听属性** 必传项
- **描述:** GeoJSON 对象或者 GeoJSON 数据的 url

### `layerId`

- **类型:** `String`
- **非侦听属性** 必传项
- **描述:** 图层的 id 值

### `enablePopup`

- **类型:** `Boolean`
- **非侦听属性**
- **描述:** 是否开启 popup 弹窗

### `popupOptions`

- **类型:** `Object`
- **非侦听属性**
- **描述:** popup 弹窗时的配置参数,popupOptions 对象中 title 指弹窗的标题，展示 geojson 数据中的某一个字段属性，fields 展示列表，由传参者决定展示哪些字段值
- **格式:**
  ```bash
  eg:
  popupOptions: {
  title: "name",
  fields: ["acroutes", "adcode"]
  }
  ```

### `enableTips`

- **类型:** `Boolean`
- **非侦听属性**
- **描述:** 是否开启 tooltip 弹窗

### `tipsOptions`

- **类型:** `Object`
- **非侦听属性**
- **描述:** tooltip 弹窗时的配置参数，tipsOptions 对象中 title 指弹窗的标题，展示 geojson 数据中的某一个字段属性，fields 展示列表，由传参者决定展示哪些字段值
- **格式:**

  ```bash
  eg:
  tipsOptions: {
  title: "name",
  fields: ["acroutes", "adcode"]
  }
  ```  

### `customPopup`

- ![自定义Popup](./GeojsonLayer/custom_popup_list.png)
- **类型:** `Function`
- **描述:** JSX 风格的自定义 popup 样式内容, (features) => {}, features 为选中或者点击的样式
- 详情请看下面的示例
- **示例**

```vue
<template>
  <mapgis-web-scene>
    <mapgis-geojson-layer v-bind="{ ...geojson }" />
  </mapgis-web-map>
</template>

<script>
export default {
  name: "custom-popup",
  props: {
    msg: String
  },
  watch: {
    center: function(next) {
      this.rightmap && this.rightmap.setCenter(next);
    }
  },
  data() {
    return {
      geojson: {
        baseUrl: `http://develop.smaryun.com/static/data/geojson/省会城市.geojson`,
        enablePopup: true,
        enableTips: true,
        layerStyle: new PointStyle({
          radius: 25000,
          color: "#ffff00",
          outlineColor: "#ff0000",
          outlineWidth: 2.5,
        }),
        highlightStyle: {
          point: new PointStyle({
            radius: 45000,
            color: "#ff0000",
            outlineColor: "#ffffff",
            outlineWidth: 2.5,
          }),
          line: new LineStyle({
            width: 6,
            color: "#000000",
            shadow: new Shadow({ blur: 6, color: "#ff0000" }),
            outlineColor: "#ff0000",
            outlineWidth: 8,
          }),
          polygon: new FillStyle({ color: "#ff0000", opacity: 0.7 }),
        },
        customPopup: (features) => (
          <mapgis-ui-list class="jsx-custom-popup" item-layout="horizontal">
            {features.map((feature) => {
              return (
                <mapgis-ui-list-item>
                  <mapgis-ui-div
                    title={feature.title}
                    style={{ width: "100%" }}
                  >
                    {Object.keys(feature.properties).map((p) => {
                      return (
                        <mapgis-ui-row>
                          <mapgis-ui-col span={8}>{p}</mapgis-ui-col>
                          <mapgis-ui-col span={16}>
                            {feature.properties[p]}
                          </mapgis-ui-col>
                        </mapgis-ui-row>
                      );
                    })}
                  </mapgis-ui-div>
                </mapgis-ui-list-item>
              );
            })}
          </mapgis-ui-list>
        ),
        customTips: features => {
          if (features.length <= 0) {
            return <div class="custom-tips">未选中</div>;
          } else {
            return (
              <mapgis-ui-div class="custom-tips" title={features[0]}>
                {Object.keys(features[0].properties).map(p => {
                  return (
                    <mapgis-ui-row>
                      <mapgis-ui-col span={8}>{p}</mapgis-ui-col>
                      <mapgis-ui-col span={16}>
                        {features[0].properties[p]}
                      </mapgis-ui-col>
                    </mapgis-ui-row>
                  );
                })}
              </mapgis-ui-div>
            );
          }
        }
      }
    };
  },
  methods: {
    handleRightMap(e) {
      console.log("e", e);
      this.rightmap = e.map;
    }
  }
};
</script>

<style>
.map {
  height: 100vh;
  width: 100vw;
}
.custom-popup {
  position: absolute;
  z-index: 2000;
  height: 240px;
  overflow-y: scroll;
}
</style>
```

### `customTips`

- ![自定义Popup](./GeojsonLayer/custom_popup_tips.png)
- **类型:** `Function`
- **描述:** JSX 风格的自定义 tips 样式内容, (features) => {}, features 为选中或者点击的样式
- 详情请看下面的示例
- **示例**
  
```vue
<template>
  <mapgis-web-scene>
    <mapgis-geojson-layer v-bind="{ ...geojson }" />
  </mapgis-web-map>
</template>

<script>
export default {
  name: "custom-popup",
  props: {
    msg: String
  },
  watch: {
    center: function(next) {
      this.rightmap && this.rightmap.setCenter(next);
    }
  },
  data() {
    return {
      geojson: {
        baseUrl: `http://develop.smaryun.com/static/data/geojson/省会城市.geojson`,
        enablePopup: true,
        enableTips: true,
        layerStyle: new PointStyle({
          radius: 25000,
          color: "#ffff00",
          outlineColor: "#ff0000",
          outlineWidth: 2.5,
        }),
        highlightStyle: {
          point: new PointStyle({
            radius: 45000,
            color: "#ff0000",
            outlineColor: "#ffffff",
            outlineWidth: 2.5,
          }),
          line: new LineStyle({
            width: 6,
            color: "#000000",
            shadow: new Shadow({ blur: 6, color: "#ff0000" }),
            outlineColor: "#ff0000",
            outlineWidth: 8,
          }),
          polygon: new FillStyle({ color: "#ff0000", opacity: 0.7 }),
        },
        customPopup: (features) => (
          <mapgis-ui-list class="jsx-custom-popup" item-layout="horizontal">
            {features.map((feature) => {
              return (
                <mapgis-ui-list-item>
                  <mapgis-ui-div
                    title={feature.title}
                    style={{ width: "100%" }}
                  >
                    {Object.keys(feature.properties).map((p) => {
                      return (
                        <mapgis-ui-row>
                          <mapgis-ui-col span={8}>{p}</mapgis-ui-col>
                          <mapgis-ui-col span={16}>
                            {feature.properties[p]}
                          </mapgis-ui-col>
                        </mapgis-ui-row>
                      );
                    })}
                  </mapgis-ui-div>
                </mapgis-ui-list-item>
              );
            })}
          </mapgis-ui-list>
        ),
        customTips: features => {
          if (features.length <= 0) {
            return <div class="custom-tips">未选中</div>;
          } else {
            return (
              <mapgis-ui-div class="custom-tips" title={features[0]}>
                {Object.keys(features[0].properties).map(p => {
                  return (
                    <mapgis-ui-row>
                      <mapgis-ui-col span={8}>{p}</mapgis-ui-col>
                      <mapgis-ui-col span={16}>
                        {features[0].properties[p]}
                      </mapgis-ui-col>
                    </mapgis-ui-row>
                  );
                })}
              </mapgis-ui-div>
            );
          }
        }
      }
    };
  },
  methods: {
    handleRightMap(e) {
      console.log("e", e);
      this.rightmap = e.map;
    }
  }
};
</script>

<style>
.map {
  height: 100vh;
  width: 100vw;
}
.custom-popup {
  position: absolute;
  z-index: 2000;
  height: 240px;
  overflow-y: scroll;
}
</style>
```

### `layerStyle`
- **类型:** `Object`
- **非侦听属性**
- **描述:** 当前图层的显示样式
- **默认值**
  ``` javascript
  import { Style } from "@mapgis/webclient-es6-service";
  const { MarkerStyle, LineStyle, PointStyle, FillStyle } = Style;
  ```

### `layerStyle`
- **类型:** `Object`
- **非侦听属性**
- **描述:** 当前图层的显示样式
- **默认值**
  ``` javascript
  import { Style } from "@mapgis/webclient-es6-service";
  const { MarkerStyle, LineStyle, PointStyle, FillStyle } = Style;
  let highlightStyle = {
    point: new PointStyle(),
    line: new LineStyle(),
    polygon: new FillStyle()
  };
  ```