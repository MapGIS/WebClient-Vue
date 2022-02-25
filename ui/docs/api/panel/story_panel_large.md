> mapgis-ui-story-panel-large

```vue
<div>
        <mapgis-ui-story-panel-large
            v-bind:dataSource="[]" 
            v-bind:height="900" 
            v-bind:width="400" 
            v-bind:showPlay="true" 
            v-bind:showArrow="true" 
            v-bind:enableFullScreen="true" 
            @input="inputChange"
        >
        </mapgis-ui-story-panel-large>
    </div>
```

## 属性

### `dataSource`

- **类型:** `Array`
- **侦听属性**
- **必填**
- **描述:** 数据源，格式入下：

```javascript
[
  {
    title: "", //标题
    content: "", //内容
    images: ["image1", "image2"] //图片数组
  }
];
```

### `height`

- **类型:** `Number`
- **侦听属性**
- **描述:** 面板高度
- **默认:** `900`

### `width`

- **类型:** `Number`
- **非侦听属性**
- **描述:** 面板宽度
- **默认:** `400`

### `showPlay`

- **类型:** `Boolean`
- **非侦听属性**
- **描述:** 是否显示播放按钮
- **默认:** `true`

### `showArrow`

- **类型:** `Boolean`
- **非侦听属性**
- **描述:** 是否显示前进、后退按钮
- **默认:** `true`

### `enableFullScreen`

- **类型:** `Boolean`
- **非侦听属性**
- **描述:** 是否显示全屏按钮
- **默认:** `true`

## 事件

> play

开始播放

> flyTo(camera)

视角飞到 Cesium 球体摸出

1 camera Object 相机视角

> closePanel

关闭面板
