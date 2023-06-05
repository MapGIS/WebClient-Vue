<template>
  <div class="mapgis-ui-switch-panel">
    <mapgis-ui-group-tab
      v-if="showLabel"
      :title="label"
      :isTitleBold="isTitleBold"
      :hasTopMargin="hasTopMargin"
      :hasBottomMargin="hasBottomMargin"
    >
      <mapgis-ui-switch
        slot="handle"
        class="mapgis-ui-switch-panel-switch"
        checked-children="开启"
        un-checked-children="关闭"
        v-model="innerChecked"
        @change="changeChecked"
        v-if="size === 'default'"
      >
      </mapgis-ui-switch>
      <mapgis-ui-switch
        slot="handle"
        class="mapgis-ui-switch-panel-switch-sm"
        v-model="innerChecked"
        @change="changeChecked"
        size="small"
        v-else
      >
      </mapgis-ui-switch>
    </mapgis-ui-group-tab>
    <mapgis-ui-group-tab
      v-if="!showLabel"
      title=""
      :hasTopMargin="hasTopMargin"
      :hasBottomMargin="hasBottomMargin"
    >
      <mapgis-ui-switch
        slot="front"
        class="mapgis-ui-switch-panel-switch"
        checked-children="开启"
        un-checked-children="关闭"
        v-model="innerChecked"
        @change="changeChecked"
        v-if="size === 'default'"
      >
      </mapgis-ui-switch>
      <mapgis-ui-switch
        slot="front"
        class="mapgis-ui-switch-panel-switch-sm"
        v-model="innerChecked"
        @change="changeChecked"
        size="small"
        v-else
      >
      </mapgis-ui-switch>
    </mapgis-ui-group-tab>
    <mapgis-ui-form-model
      :layout="layout"
      v-bind="formItemLayout"
      labelAlign="left"
      class="formStyle"
      :colon="false"
    >
      <div
        :class="{
          'mapgis-ui-switch-panel-parameter': true,
          'mapgis-ui-switch-panel-parameter-transparent': transparent
        }"
        :style="{ maxHeight: maxHeight }"
      >
        <slot />
      </div>
    </mapgis-ui-form-model>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-switch-panel",
  props: {
    label: {
      type: String,
      default: "标题"
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    checked: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: "vertical" // 'horizontal' 'vertical' 'inline'
    },
    height: {
      type: String,
      default: "fit-content"
    },
    labelCol: {
      type: Object,
      default: () => {
        return { span: 7 };
      }
    },
    wrapperCol: {
      type: Object,
      default: () => {
        return { span: 17 };
      }
    },
    size: {
      type: String,
      default: "default" //default small
    },
    transparent: {
      type: Boolean,
      default: false
    },
    isTitleBold: {
      type: Boolean,
      default: true
    },
    hasTopMargin: {
      type: Boolean,
      default: true
    },
    hasBottomMargin: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: "checked",
    event: "changeChecked"
  },
  data() {
    return {
      maxHeight: 40,
      innerChecked: this.checked
    };
  },
  watch: {
    checked: {
      handler(next) {
        this.innerChecked = next;
        this.changeChecked(next);
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    const { height = "fit-content" } = this;
    if (this.checked) {
      this.maxHeight = height;
    }
  },
  computed: {
    formItemLayout({ layout }) {
      const { labelCol, wrapperCol } = this;
      return layout === "horizontal"
        ? {
            labelCol,
            wrapperCol
          }
        : {};
    }
  },
  methods: {
    changeChecked(e) {
      let vm = this;
      const { height = "fit-content" } = this;

      if (vm.innerChecked) {
        this.maxHeight = height;
      } else {
        this.maxHeight = "0px";
      }

      this.$emit("changeChecked", e);
    }
  }
};
</script>
