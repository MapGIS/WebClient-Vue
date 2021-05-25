# MvtStyleLayer

::: tip
Mapbox GL JS Style:  
[Mapbox矢量瓦片样式MVT](https://docs.mapbox.com/help/glossary/style/)
:::

## 属性

### `mvtStyle`

- **类型:** `Object | String`
- **Synced** watch属性
- **描述:** Mapbox矢量瓦片样式.
- **See:** `Mvt` in [Mapbox Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec)

### `mode`

- **类型:** `String`
- **Non-Synced** 非watch属性
- **描述:** 样式显示模式 
  - add-追加. 在当前样式上追加Mvt样式，内部会自动对比图层进行覆盖
    ``` js
    let mvtStyle = async compareStyle(mvtStyle) {
      let oldStyle = this.map.getStyle();
      let newStyle = await this.$_getStyleObject(mvtStyle);
      let style = {
        version: oldStyle.version || newStyle.version,
        sprite: oldStyle.sprite || newStyle.sprite,
        glyphs: oldStyle.glyphs || newStyle.glyphs,
        sources: { ...oldStyle.sources, ...newStyle.sources },
        layers: this.mergeLayers(oldStyle.layers, newStyle.layers)
      };
      return style;
    },
    this.map.setStyle(mvtStyle, { diff: true });
    ```
  - set-覆盖.
    ``` js
    this.map.setStyle(mvtStyle, { diff: true });
    ```

## 事件 

### `@added`

- **描述:** 在矢量瓦片加载完毕后发送该事件
- **Payload** `{ this }`
- - `this` 当前组件自身引用