> mapgis-ui-pop-jsoneditor-dialog

```vue
<div>
    <mapgis-ui-pop-jsoneditor-dialog
      title="编辑高级属性"
      width="65%"
      :visible="extensionsEditVisible"
      :config="extensionsObject"
      :markdown="markdownText"
      :moreInfoUrl="moreInfoUrl"
      @ok="updateExtensions"
      @cancel="extensionsEditVisible = false"
    >
    </mapgis-ui-pop-jsoneditor-dialog>
</div>
```

## 属性

### `value`

- **类型:** `String|Boolean|Number|Object|Array`
- **描述:** json 数据
- **默认:** `{}`

### `visible`

- **类型:** `Boolean`
- **描述:** 可见性
- **默认:** `false`

### `title`

- **类型:** `Boolean`
- **描述:** 弹框标题

### `width`

- **类型:** `Number|String`
- **描述:** 弹框宽度
- **默认:** `520`

### `markdown`

- **类型:** `String|Object`
- **描述:** 参数说明文档
- **默认:** `''`

### `moreInfoUrl`

- **类型:** `String`
- **描述:** 更多参数说明链接

## 事件

> ok(payload)

1. 载荷 payload 编辑后的 json 数据

> cancel
