# MvtStyleLayer

::: tip
Mapbox GL JS Style:  
[Mapbox 矢量瓦片样式 MVT](https://docs.mapbox.com/help/glossary/style/)
:::

## 属性

### `mvtStyle`

- **类型:** `Object | String`
- **侦听属性** watch 属性
- **描述:** Mapbox 矢量瓦片样式.
- **查看:** `Mvt` in [Mapbox Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec)

### `mode`

- **类型:** `String`
- **非侦听属性** 非 watch 属性
- **默认值** `merge`
- **描述:** 样式显示模式 ['merge', 'add', 'set']

  - `merge`-合并. 在当前样式上合并 Mvt 样式，内部会自动对比图层进行覆盖
    ```js
    mergeLayers(olds, news) {
      news = news || [];
      if (!olds) return [].concat(news);
      let merges = olds.map((layer) => {
        let find = news.find((l) => l.id === layer.id);
        return find && find.length > 0 ? find[0] : layer;
      });
      let unmerges = news.filter((layer) => {
        let find = merges.find((l) => l.id === layer.id);
        return find ? false : true;
      });
      return merges.concat(unmerges);
    },
    let mvtStyle = async compareStyle(mvtStyle) {
      let oldStyle = this.map.getStyle();
      let newStyle = await this.$_getStyleObject(mvtStyle);
      let style = {
        version: oldStyle.version || newStyle.version,
        sprite: oldStyle.sprite || newStyle.sprite,
        glyphs: oldStyle.glyphs || newStyle.glyphs,
        sources: { ...oldStyle.sources, ...newStyle.sources },
        layers: this.mergeLayers(oldStyle.layers, newStyle.layers);
      };
      return style;
    },
    this.map.setStyle(mvtStyle, { diff: true });
    ```
  - `add`-追加. 在当前样式上追加 Mvt 样式，内部会自动对比图层进行覆盖

    ```js
    addLayers(olds, news) {
      news = news || [];
      if (!olds) return [].concat(news);
      let filters = olds.filter((layer) => {
        let find = news.find((l) => l.id === layer.id);
        return find ? false : true;
      });
      return filters.concat(news);
    },
    let mvtStyle = async compareStyle(mvtStyle) {
      let oldStyle = this.map.getStyle();
      let newStyle = await this.$_getStyleObject(mvtStyle);
      let style = {
        version: oldStyle.version || newStyle.version,
        sprite: oldStyle.sprite || newStyle.sprite,
        glyphs: oldStyle.glyphs || newStyle.glyphs,
        sources: { ...oldStyle.sources, ...newStyle.sources },
        layers: this.addLayers(oldStyle.layers, newStyle.layers);
      };
      return style;
    },
    this.map.setStyle(mvtStyle, { diff: true });
    ```

  - `set`-覆盖.
    ```js
    this.map.setStyle(mvtStyle, { diff: true });
    ```

## 事件

### `@added`

- **描述:** 在矢量瓦片加载完毕后发送该事件
- **Payload** `{ this }`
- - `this` 当前组件自身引用
