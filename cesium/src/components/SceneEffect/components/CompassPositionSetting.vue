<template>
  <mapgis-ui-form
    v-if="compassPosition"
    ref="form"
    :model="compassPosition"
    :labelCol="{ lg: { span: 8 }, sm: { span: 8 } }"
    :wrapperCol="{ lg: { span: 16 }, sm: { span: 16 } }"
  >
    <mapgis-ui-form-item label="罗盘位置" prop="anchor" class="form-item">
      <mapgis-ui-select
        v-model="compassPosition.anchor"
        placeholder="请选择"
        @change="changePosition"
      >
        <mapgis-ui-select-option value="top-left">左上</mapgis-ui-select-option>
        <mapgis-ui-select-option value="top-right"
          >右上</mapgis-ui-select-option
        >
        <mapgis-ui-select-option value="bottom-left"
          >左下</mapgis-ui-select-option
        >
        <mapgis-ui-select-option value="bottom-right"
          >右下</mapgis-ui-select-option
        >
      </mapgis-ui-select>
    </mapgis-ui-form-item>
    <mapgis-ui-form-item
      v-if="
        compassPosition.anchor === 'top-left' ||
        compassPosition.anchor === 'bottom-left'
      "
      prop="horizontalOffset"
      label="左边框距离"
      class="form-item"
    >
      <mapgis-ui-input-number-addon
        v-model.number="compassPosition.horizontalOffset"
        addon-after="px"
        :min="0"
        :step="1"
        @change="changePosition"
      />
    </mapgis-ui-form-item>
    <mapgis-ui-form-item
      v-if="
        compassPosition.anchor === 'top-right' ||
        compassPosition.anchor === 'bottom-right'
      "
      prop="horizontalOffset"
      label="右边框距离"
      class="form-item"
    >
      <mapgis-ui-input-number-addon
        v-model="compassPosition.horizontalOffset"
        addon-after="px"
        :min="0"
        :step="1"
        @change="changePosition"
      />
    </mapgis-ui-form-item>
    <mapgis-ui-form-item
      v-if="
        compassPosition.anchor === 'top-left' ||
        compassPosition.anchor === 'top-right'
      "
      prop="verticalOffset"
      label="上边框距离"
      class="form-item"
    >
      <mapgis-ui-input-number-addon
        v-model="compassPosition.verticalOffset"
        addon-after="px"
        :min="0"
        :step="1"
        @change="changePosition"
      />
    </mapgis-ui-form-item>
    <mapgis-ui-form-item
      v-if="
        compassPosition.anchor === 'bottom-left' ||
        compassPosition.anchor === 'bottom-right'
      "
      prop="verticalOffset"
      label="下边框距离"
      class="form-item"
    >
      <mapgis-ui-input-number-addon
        v-model="compassPosition.verticalOffset"
        addon-after="px"
        :min="0"
        :step="1"
        @change="changePosition"
      />
    </mapgis-ui-form-item>
  </mapgis-ui-form>
</template>

<script>
export default {
  name: "CompassPositionSetting",
  props: {
    // 位置信息
    position: {
      type: Object,
      default: () => {
        return {
          anchor: "top-left",
          horizontalOffset: 10,
          verticalOffset: 36,
        };
      },
    },
  },
  watch: {
    position: {
      handler(e) {
        this.compassPosition = this.position;
        this.changePosition();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      rules: {},
      compassPosition: {
        anchor: "top-left",
        horizontalOffset: 10,
        verticalOffset: 36,
      },
    };
  },
  methods: {
    changePosition() {
      const compassDiv = document.querySelector(".compass");
      if (compassDiv) {
        const { anchor, horizontalOffset, verticalOffset } =
          this.compassPosition;
        switch (anchor) {
          case "top-left":
            compassDiv.style.left = `${horizontalOffset}px`;
            compassDiv.style.top = `${verticalOffset}px`;
            compassDiv.style.right = "unset";
            compassDiv.style.bottom = "unset";
            break;
          case "top-right":
            compassDiv.style.left = "unset";
            compassDiv.style.top = `${verticalOffset}px`;
            compassDiv.style.right = `${horizontalOffset}px`;
            compassDiv.style.bottom = "unset";
            break;
          case "bottom-left":
            compassDiv.style.left = `${horizontalOffset}px`;
            compassDiv.style.top = "unset";
            compassDiv.style.right = "unset";
            compassDiv.style.bottom = `${verticalOffset}px`;
            break;
          case "bottom-right":
            compassDiv.style.left = "unset";
            compassDiv.style.top = "unset";
            compassDiv.style.right = `${horizontalOffset}px`;
            compassDiv.style.bottom = `${verticalOffset}px`;
            break;
        }
        this.$emit("updateCompassPosition", this.compassPosition);
      }
    },
  },
};
</script>

<style scoped>
.form-item {
  margin-bottom: 0px;
}
</style>
