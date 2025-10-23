> mapgis-ui-jsoneditor-textarea

```vue
<div>
    <mapgis-ui-jsoneditor-textarea
        :visible="visible"
        v-model="realConfig"
    />
</div>
```

## 属性

### `value`

- **类型:** `String|Boolean|Number|Object|Array`
- **描述:** json 数据

### `visible`

- **类型:** `Boolean`
- **描述:** 可见性

## 事件

> input(payload)

1. 载荷 payload 编辑后的 json 数据

> changed(payload)

1. 载荷 payload 编辑后的 json 数据
