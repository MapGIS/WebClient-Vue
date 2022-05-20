<template>
  <mapgis-ui-tooltip :key="title" placement="top" :title="title">
    <div
      v-if="icon.startsWith('<svg')"
      :class="{
        'mapgis-ui-toolbar-command': true,
        active: active,
        disabled: disabled,
        'hover-bordered': hoverBordered,
        [`mapgis-ui-toolbar-command-${size}`]: !!size
      }"
      class="mapgis-ui-toolbar-command"
      @click="onClick"
    >
      <mapgis-ui-icon :icon="icon" />
    </div>
    <mapgis-ui-iconfont
      v-else
      :class="{
        'mapgis-ui-toolbar-command': true,
        active: active,
        disabled: disabled,
        'hover-bordered': hoverBordered,
        [`mapgis-ui-toolbar-command-${size}`]: !!size
      }"
      @click="onClick"
      :type="icon"
    />
  </mapgis-ui-tooltip>
</template>

<script>
import { oneOf } from "../../util/common/common-util";

export default {
  name: "mapgis-ui-toolbar-command",
  props: {
    /**
     * 标题
     */
    title: {
      type: String,
      required: true
    },
    /**
     * 图片内容  svg
     */
    icon: {
      type: String,
      required: true
    },
    /**
     * 激活状态，默认 `false`
     */
    active: {
      type: Boolean,
      default: false
    },
    /**
     * 禁止激活, 默认`false`
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 鼠标移入是否显示边界, 默认 `true`
     */
    hoverBordered: {
      type: Boolean,
      default: false
    },
    /**
     * 大小， 可选`large` , `small`
     */
    size: {
      type: String,
      validator(v) {
        return oneOf(v, ["large", "small"]);
      }
    }
  },
  methods: {
    onClick() {
      this.$emit("click");
    }
  }
};
</script>
