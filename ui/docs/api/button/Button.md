# 提示按钮

## 属性

### `label`

- **类型:** `[Object, HTMLElement]`
- **非侦听属性**
- **描述:** 传入的SVG、PNG资源
- **示例:** 

### `icon`

- **类型:** `[Object, Object, HTMLElement]`
- **非侦听属性**
- **描述:** 传入的SVG、PNG资源
- **示例:** 
- "icon": `<svg class=\"icon\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\"><defs><style/></defs><path d=\"M64 384h320V64H64v320zM0 0h448v448H0V0zm64 896h320V576H64v320zM0 512h448v448H0V512zm576 64v320h320V576H576zm-64-64h448v448H512V512zm64-448v320h320V64H576zM512 0h448v448H512V0z\"/></svg>`,

### `zIndex`

- **类型:** `[Object, HTMLElement]`
- **非侦听属性**
- **描述:** 传入的SVG、PNG资源
- **示例:** 

``` vue
<template>
    <mapgis-ui-button-tooltip :label="label" :icon="icon" :zIndex="zIndex">
    </mapgis-ui-button-tooltip>
</template>

<script>
export default {
    data() {
    return {
      label: "一张图提示按钮",
      icon:"",
      zIndex: 2000
    };
  },
}
</script>
```
