> mapgis-3d-graphic-layers

``` vue
    <mapgis-web-scene style="height:95vh">
      <mapgis-3d-graphic-layers :dataSource="[]"/>
    </mapgis-web-scene>
```

## 属性

### `dataSource`

- **类型:** `Array`
- **侦听属性**
- **必填**
- **描述:** 数据源，多个标绘数据组成的数组，格式入下：

```javascript
    [{标绘一},{标绘二}]
```