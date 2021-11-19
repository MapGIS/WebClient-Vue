<template>
  <div class="mapgis-ui-switch-panel">
    <mapgis-ui-form-model
      :layout="layout"
      v-bind="formItemLayout"
      labelAlign="left"
      class="formStyle"
      :colon="false"
    >
      <div class="mapgis-ui-switch-panel-header">
        <label class="mapgis-ui-switch-panel-label">{{ label }}</label>
        <mapgis-ui-switch
          class="mapgis-ui-switch-panel-switch"
          checked-children="开启"
          un-checked-children="关闭"
          v-model="innerChecked"
          @change="changeChecked"
        >
        </mapgis-ui-switch>
      </div>

      <div
        class="mapgis-ui-switch-panel-parameter"
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
    checked: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
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
    }
  },
  data() {
    return {
      maxHeight: 40,
      innerChecked: this.checked
    };
  },
  watch: {
    checked(next) {
      this.innerChecked = next;
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
