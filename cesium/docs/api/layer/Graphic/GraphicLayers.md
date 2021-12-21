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
- **描述:** 数据源，多个标绘图层数据组成的数组，格式入下：

```javascript
    [{ //一个标绘图层
      name: "",//标绘图层标题
      uuid: "",//标绘图层ID
      dataSource: []//标绘数据
    }]
```
