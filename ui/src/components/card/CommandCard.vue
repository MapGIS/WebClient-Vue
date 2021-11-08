<template>
  <mapgis-ui-card
    :size="size"
    :bordered="bordered"
    :loading="loading"
    :class="cardCls"
  >
    <slot name="title">
      <span slot="title">{{ title }}</span>
    </slot>
    <template #extra>
      <slot name="extra">
        <mapgis-ui-toolbar-command-group>
          <mapgis-ui-toolbar-command
            v-for="item in tools"
            :key="item.title"
            :title="item.title"
            :icon="item.icon"
            :size="size"
            @click="item.method()"
          />
        </mapgis-ui-toolbar-command-group>
      </slot>
    </template>
    <slot></slot>
  </mapgis-ui-card>
</template>
<script>
import { oneOf } from "../../util/common/common-util";

const prefixCls = "mapgis-ui-command-card";

export default {
  name: "mapgis-ui-command-card",
  props: {
    /**
     * 标题
     */
    title: {
      type: String,
      default: ""
    },
    /**
     * 工具栏 []
     */
    tools: {
      type: Array,
      default: () => []
    },
    /**
     * 默认大小
     */
    size: {
      type: String,
      validator(v) {
        return oneOf(v, ["large", "small"]);
      }
    },
    /**
     * 盒子阴影
     */
    boxShadow: {
      type: Boolean,
      default: false
    },
    /**
     * 是否有边框
     */
    bordered: {
      type: Boolean,
      default: false
    },
    /**
     * 加载状态
     */
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cardCls({ size, boxShadow }) {
      return [
        prefixCls,
        {
          [`${prefixCls}-box-shadow`]: !!boxShadow
        }
      ];
    }
  }
};
</script>
