# SVG/PNG 图标

## 属性

### `icon`

- **类型:** `[Object, HTMLElement]`
- **非侦听属性**
- **描述:** 传入的SVG、PNG资源
- **示例:** 

``` vue
<template>
    <mapgis-ui-icon :icon="png">
    </mapgis-ui-icon>
</template>

<script>
import Svg from "../../assets/direction.svg";
import Png from "../../assets/svg_global_select.png";

export default {
    data() {
    return {
      svg: Svg,
      png: Png
    };
  },
}
</script>
```

