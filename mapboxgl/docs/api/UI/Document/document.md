# 地图文档

> 目前该组件只支持作为<mapgis-web-map />的子组件使用，暂时不支持脱离于<mapgis-web-map />独立使用。

```html
<mapgis-web-map @load="handleMapLoad">
  <mapgis-igs-doc-layer v-bind="igsdoc" />
  <mapgis-igs-tile-layer v-bind="igstile" />
  <mapgis-document />
</mapgis-web-map>
```

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `wrapperStyle`

- **类型:** `String`
- **Non-Synced**
- **描述:** 外部传入样式，用来自定义样式
- **默认值**
  ```json
  {
    "position": "absolute",
    "background": "#ffffff",
    "top": "20px",
    "left": "20px",
    "zIndex": 10,
    "borderRadius": "6px"
  }
  ```

## Provide

### `document`

> 方法

1. `setLayers` 设置或者更新当前图层的信息，特别注意，此处的 layers 不是[mapboxgl-style](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)中的图层而是图层组件的数据，用来获取对应的图层组件信息
2. `getLayerComInfo` 模糊查找获取图层组件的组件 name 以及对应的图标等组件信息，此处返回的的 webclient-vue-mapboxgl 的封装组件信息
3. `getLayerMapType` 获取图层组件实际对应的 mapbox 的图层类型，此处返回的是 mapboxgl 的原生类型 [MapboxGL 图层信息](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)
4. `getLayerMapInfo` 根据 LayerId 获取实际 mapbox 渲染图层的信息，此处返回的是 mapboxgl 的原生对象 [MapboxGL 图层信息](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/)

> 使用场景
> 提供给槽或者子组件的地图文档，主要是用来获取当前地图的地图状态

1. 提供给右键菜单获取对应的地图文档信息
   ```js
   // 右键菜单按钮
   <template>
        <contextmenu-item :autoHide="false">
            <mapgis-iconfont type="mapgis-bilichi" />级别控制
            <a-slider range v-model="zoom" :min="minzoom" :max="maxzoom" />
        </contextmenu-item>
   </template>
   <script>
   {
    methods: {
        resetLayerInfo(layerId) {
            let { document } = this;
            const layer = document.getLayerMapInfo(layerId);
            let { minzoom, maxzoom } = layer;
            minzoom = minzoom || 0;
            maxzoom = maxzoom || 24;
            this.zoom = [minzoom, maxzoom];
        }
    }
   </script>
   ```
2. 提供给子组件获取对应的地图文档信息，和上面类似，此处的 layers 是图层组件的数组而不是 mapboxgl-style 返回的 layers,需要特别注意

## 自定义/封装 Document

默认提供的地图文档一般都无法满足对应的业务需求，

1. 定义自定义的地图文档

   ```vue
   <template>
     <div>
       <mapgis-document />
     </div>
   </template>

   <script>
   export default {
     name: "custom-mapgis-document"
   };
   </script>

   <style></style>
   ```

2. 使用封装的地图文档组件

   ```vue
   <template>
     <div class="hello">
       <mapgis-web-map @load="handleMapLoad">
         <mapgis-arcgis-tile-layer v-bind="arcgistile" />
         <mapgis-arcgis-map-layer v-bind="arcgismap" />

         <mapgis-igs-doc-layer v-bind="igsdoc" />
         <mapgis-igs-tile-layer v-bind="igstile" />

         <mapgis-ogc-wmts-layer v-bind="ogcwmts" />
         <mapgis-ogc-wms-layer v-bind="ogcwms" />
         <!-- <mapgis-document /> -->
         <custom-document />
       </mapgis-web-map>
     </div>
   </template>

   <script>
   export default {
     name: "custom-mapgis-2d-wrapper"
   };
   </script>
   ```
