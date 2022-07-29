> mapgis-ui-color-pick-panel

``` vue
    <div>
        <mapgis-ui-color-pick-panel 
            v-bind:label="'光照颜色'" 
            v-bind:disableAlpha="false" 
            v-bind:color="lightColor" 
            v-bind:showColorText="true"
            @input="inputChange"
        >
        </mapgis-ui-color-pick-panel>
    </div>
```

## 属性

### `label`

- **类型:** `String`
- **非侦听属性**
- **描述:** 标题

### `color`

- **类型:** `String`
- **描述:** 选取的颜色
- **默认:** `'rgb(255,255,102)'`

### `disableAlpha`

- **类型:** `Boolean`
- **描述:** 控制是否可以调节透明度
- **默认:** `true`

### `labelCol`

- **类型:** `Number`
- **非侦听属性**
- **描述:** 当布局layout是horizontal才生效，表示左侧标题的比例，采取24空格比例

### `wrapperCol`

- **类型:** `Number`
- **非侦听属性**
- **描述:** 当布局layout是horizontal才生效，表示右侧颜色面板的比例，采取24空格比例

### `showColorText`

- **类型:** `Boolean`
- **非侦听属性**
- **描述:** 是否在输入框中展示颜色值文本
- **默认:** `true`

## 事件

> input(payload)

1. 载荷 payload 选取的颜色对象

