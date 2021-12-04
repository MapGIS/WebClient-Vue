> mapgis-ui-select-panel

``` vue
      <div>
          <mapgis-ui-select-panel
              v-bind="$props"
              @change="onEmitterChange">
          </mapgis-ui-select-panel>
          <mapgis-ui-select-panel
              v-bind="$props"
              :labelCol="12" :wrapperCol="12"
              @change="onEmitterChange">
          </mapgis-ui-select-panel>
      </div>
```

## 属性

### `value`

- **类型:** `Number`
- **v-model属性**
- **描述:** 当前编辑的数值

### `label`

- **类型:** `String`
- **非侦听属性**
- **描述:** 标题

### `selectOptions`

- **类型:** `Array`
- **非侦听属性**
- **描述:** 选择列表内容数组
- **默认:** `[]`

### `labelCol`

- **类型:** `Number`
- **非侦听属性**
- **描述:** 当布局layout是horizontal才生效，表示左侧标题的比例，采取24空格比例

### `wrapperCol`

- **类型:** `Number`
- **非侦听属性**
- **描述:** 当布局layout是horizontal才生效，表示右侧内容的比例，采取24空格比例

## 事件

> change(payload)

1. 载荷 payload 修改后的数值

