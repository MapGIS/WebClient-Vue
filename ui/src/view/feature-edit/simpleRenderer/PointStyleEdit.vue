<template>
  <div>
    <template v-if="featureStyleCopy === 'simple-marker'">
      <mapgis-ui-form-item label="填充颜色">
        <mapgis-ui-sketch-color-picker
          :color.sync="pointStyleCopy.color"
          :disableAlpha="false"
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="横轴偏移量">
        <mapgis-ui-input v-model="pointStyleCopy.xoffset"></mapgis-ui-input>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="纵轴偏移量">
        <mapgis-ui-input v-model="pointStyleCopy.yoffset"></mapgis-ui-input>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="半径">
        <mapgis-ui-input v-model="pointStyleCopy.size"></mapgis-ui-input>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="点样式">
        <mapgis-ui-select v-model="pointStyleCopy.style">
          <mapgis-ui-select-option
            v-for="(item, index) in styleList"
            :value="item"
            :key="index"
            >{{ item }}</mapgis-ui-select-option
          >
        </mapgis-ui-select>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="旋转角度">
        <mapgis-ui-input v-model="pointStyleCopy.angle"></mapgis-ui-input>
      </mapgis-ui-form-item>
      <mapgis-ui-collapse :bordered="false">
        <mapgis-ui-collapse-panel
          key="1"
          header="外边线样式"
          :showArrow="false"
        >
          <mapgis-ui-line-style-edit
            :show="true"
            :featureItemCopy.sync="pointStyleCopy.simpleLineStyle"
          />
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>
    </template>
    <template v-if="featureStyleCopy === 'text'">
      <mapgis-ui-form-item label="填充颜色">
        <mapgis-ui-sketch-color-picker
          :color.sync="pointStyleCopy.color"
          :disableAlpha="false"
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="横轴偏移量">
        <mapgis-ui-input v-model="pointStyleCopy.xoffset"></mapgis-ui-input>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="纵轴偏移量">
        <mapgis-ui-input v-model="pointStyleCopy.yoffset"></mapgis-ui-input>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="字体样式">
        <mapgis-ui-input v-model="pointStyleCopy.font"></mapgis-ui-input>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="行高">
        <mapgis-ui-input v-model="pointStyleCopy.lineHeight"></mapgis-ui-input>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item
        label="文本内容"
        v-if="parentClass !== 'uniqueValue'"
      >
        <mapgis-ui-select v-model="pointStyleCopy.text">
          <mapgis-ui-select-option
            v-for="(item, index) in fieldInfo"
            :value="item.name"
            :key="index"
            >{{ item.name }}</mapgis-ui-select-option
          >
        </mapgis-ui-select>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="横轴排列方式">
        <mapgis-ui-select v-model="pointStyleCopy.horizontalAlignment">
          <mapgis-ui-select-option
            v-for="(item, index) in textHorizontalAlignmentList"
            :value="item.value"
            :key="index"
            >{{ item.name }}</mapgis-ui-select-option
          >
        </mapgis-ui-select>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="纵轴排列方式">
        <mapgis-ui-select v-model="pointStyleCopy.verticalAlignment">
          <mapgis-ui-select-option
            v-for="(item, index) in textVerticalAlignmentList"
            :value="item.value"
            :key="index"
            >{{ item.name }}</mapgis-ui-select-option
          >
        </mapgis-ui-select>
      </mapgis-ui-form-item>
    </template>
    <template v-if="featureStyleCopy === 'picture-marker'">
      <mapgis-ui-form-item label="填充颜色">
        <mapgis-ui-sketch-color-picker
          :color.sync="pointStyleCopy.color"
          :disableAlpha="false"
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="横轴偏移量">
        <mapgis-ui-input v-model="pointStyleCopy.xoffset"></mapgis-ui-input>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="纵轴偏移量">
        <mapgis-ui-input v-model="pointStyleCopy.yoffset"></mapgis-ui-input>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="图片宽度">
        <mapgis-ui-input v-model="pointStyleCopy.width"></mapgis-ui-input>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="图片高度">
        <mapgis-ui-input v-model="pointStyleCopy.height"></mapgis-ui-input>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="图片地址">
        <mapgis-ui-input
          v-model="pointStyleCopy.url"
          @change="handleUrlChange"
        ></mapgis-ui-input>
        <mapgis-ui-upload-image
          :uploadUrl="
            `${prefixUrl}/psmap/rest/services/system/ResourceServer/files/pictures`
          "
          :showUploadList="false"
          :baseUrl="prefixUrl"
          :hasPrefix="false"
          @image-url="val => updateImgUrl(val)"
        ></mapgis-ui-upload-image>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="旋转角度">
        <mapgis-ui-input v-model="pointStyleCopy.angle"></mapgis-ui-input>
      </mapgis-ui-form-item>
    </template>
  </div>
</template>

<script>
import MapgisUiLineStyleEdit from "./LineStyleEdit.vue";

export default {
  name: "mapgis-ui-point-style-edit",
  components: {
    MapgisUiLineStyleEdit
  },
  props: {
    featureStyleCopy: {
      type: String,
      default: ""
    },
    featureItemCopy: {
      type: Object,
      default: () => {}
    },
    fieldInfo: {
      type: Array
    },
    parentClass: {
      type: String
    }
  },
  data() {
    return {
      styleList: ["circle", "square", "cross", "x", "diamond", "triangle"],
      textHorizontalAlignmentList: [
        { name: "靠左", value: "left" },
        { name: "居中", value: "center" },
        { name: "靠右", value: "right" }
      ],
      textVerticalAlignmentList: [
        { name: "基准线对齐", value: "baseline" },
        { name: "顶部对齐", value: "top" },
        { name: "居中对齐", value: "middle" },
        { name: "底部对齐", value: "bottom" }
      ],
      timer: undefined
    };
  },
  computed: {
    pointStyleCopy: {
      get() {
        return this.featureItemCopy;
      },
      set(val) {
        this.$emit("update:featureItemCopy", val);
      }
    },
    prefixUrl() {
      return window._CONFIG.domainURL;
    }
  },
  methods: {
    handleUrlChange() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        console.log("xxxx");
      }, 1000);
    },
    updateImgUrl(val) {
      this.pointStyleCopy.url = val;
    }
  }
};
</script>

<style scoped>
::v-deep.mapgis-ui-collapse-item.mapgis-ui-collapse-no-arrow {
  border: none !important;
}
</style>
