<template>
  <div
    :class="{
      'mapgis-ui-toolbar': true,
      sm: size === 'small',
      bordered: bordered
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
import { oneOf } from "../../util/common/common-util";

export default {
  name: "mapgis-ui-toolbar",
  props: {
    /**
     * 大小 `small` 或者 `default`, 默认`default`
     */
    size: {
      type: String,
      default: "default",
      validator(v) {
        return oneOf(v, ["default", "small"]);
      }
    },
    /**
     * 边界线，默认`true`
     */
    bordered: {
      type: Boolean,
      default: true
    }
  }
};
</script>
