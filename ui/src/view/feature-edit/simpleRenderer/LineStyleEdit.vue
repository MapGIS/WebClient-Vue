<template>
  <div v-if="featureType === 'Lin' || show">
    <mapgis-ui-form-item label="线宽">
      <mapgis-ui-input v-model="simpleLineStyleCopy.width"></mapgis-ui-input>
    </mapgis-ui-form-item>
    <mapgis-ui-form-item label="颜色">
      <mapgis-ui-sketch-color-picker
        :color.sync="simpleLineStyleCopy.color"
        :disableAlpha="false"
      ></mapgis-ui-sketch-color-picker>
    </mapgis-ui-form-item>
    <mapgis-ui-form-item label="线首尾角样式">
      <mapgis-ui-select v-model="simpleLineStyleCopy.cap">
        <mapgis-ui-select-option
          v-for="(item, index) in lineCapList"
          :value="item.value"
          :key="index"
          >{{ item.name }}</mapgis-ui-select-option
        >
      </mapgis-ui-select>
    </mapgis-ui-form-item>
    <mapgis-ui-form-item label="线接角样式">
      <mapgis-ui-select v-model="simpleLineStyleCopy.join">
        <mapgis-ui-select-option
          v-for="(item, index) in lineJoinList"
          :value="item.value"
          :key="index"
          >{{ item.name }}</mapgis-ui-select-option
        >
      </mapgis-ui-select>
    </mapgis-ui-form-item>
    <mapgis-ui-form-item label="斜接宽度与线宽最大允许比率">
      <mapgis-ui-input
        v-model="simpleLineStyleCopy.miterLimit"
      ></mapgis-ui-input>
    </mapgis-ui-form-item>
    <mapgis-ui-form-item label="线体样式">
      <mapgis-ui-select v-model="simpleLineStyleCopy.style">
        <mapgis-ui-select-option
          v-for="(item, index) in lineStyleList"
          :value="item.value"
          :key="index"
          >{{ item.name }}</mapgis-ui-select-option
        >
      </mapgis-ui-select>
    </mapgis-ui-form-item>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-line-style-edit",
  props: {
    featureStyleCopy: {
      type: String,
      default: ""
    },
    show: {
      type: Boolean,
      default: false
    },
    featureItemCopy: {
      type: Object,
      default: () => {}
    },
    featureType: {
      type: String
    }
  },
  data() {
    return {
      lineCapList: [
        {
          name: "直角",
          value: "butt"
        },
        {
          name: "圆角",
          value: "round"
        },
        {
          name: "矩形",
          value: "square"
        }
      ],
      lineJoinList: [
        {
          name: "直角",
          value: "miter"
        },
        {
          name: "圆角",
          value: "round"
        },
        {
          name: "斜角",
          value: "bevel"
        }
      ],
      lineStyleList: [
        {
          name: "虚线",
          value: "dash"
        },
        {
          name: "虚线点",
          value: "dash-dot"
        },
        {
          name: "点",
          value: "dot"
        },
        {
          name: "长虚线",
          value: "long-dash"
        },
        {
          name: "长虚线点",
          value: "long-dash-dot"
        },
        {
          name: "长点虚线点",
          value: "long-dash-dot-dot"
        },
        {
          name: "无",
          value: "none"
        },
        {
          name: "短虚线",
          value: "short-dash"
        },
        {
          name: "短虚线点",
          value: "short-dash-dot"
        },
        {
          name: "短点虚线点",
          value: "short-dash-dot-dot"
        },
        {
          name: "短点",
          value: "short-dot"
        },
        {
          name: "实线",
          value: "solid"
        }
      ]
    };
  },
  computed: {
    simpleLineStyleCopy: {
      get() {
        return this.featureItemCopy;
      },
      set(val) {
        this.$emit("update:featureItemCopy", val);
      }
    }
  }
};
</script>
