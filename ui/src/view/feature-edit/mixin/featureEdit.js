import MapgisUiFeatureEditForm from "../simpleRenderer/FeatureEditForm.vue";

export default {
  components: {
    MapgisUiFeatureEditForm,
  },
  props: {
    // 属性值数组
    fieldInfo: {
      type: Array,
      default: () => [],
    },
    // 要素类型
    featureType: {
      type: String,
    },
    featureStyle: {
      type: String,
    },
    featureItemArr: {
      type: [Object, Array],
    },
  },
  data() {
    return {
      featureStyleCopy: this.featureStyle,
      groupField: undefined,
      statisticsField: undefined,
      isEdit: false,
      pointFeatureStyleList: [
        { name: "常规点图形", value: "simple-marker" },
        { name: "简单图文标注", value: "text" },
        { name: "简单图片标签", value: "picture-marker" },
      ],
      tableData: [],
      featureItem: {},
      color: "rgba(102,255,252,1)",
    };
  },
  watch: {
    featureItemArr: {
      immediate: true,
      handler() {
        if (
          Object.prototype.toString.call(this.featureItemArr) ==
          "[object Object]"
        ) {
          this.tableData = [];
        } else {
          this.tableData = this.featureItemArr;
        }
      },
    },
    color() {
      const dataLength = this.tableData.length;
      const step = 1 / dataLength;
      for (let i = 0; i < dataLength; i++) {
        this.tableData[i].sample.color = `rgba(${this.colorRgb[0]},${
          this.colorRgb[1]
        },${this.colorRgb[2]},${1 - step * i})`;
      }
    },
  },
  computed: {
    title() {
      const map = {
        Pnt: "点",
        Lin: "线",
        Reg: "区",
      };
      return `${map[this.featureType]}样式`;
    },
    colorRgb() {
      const str = this.color.slice("rgba(".length, this.color.length - 1);
      const strArr = str.split(",");
      return strArr;
    },
  },
  methods: {
    modalCancel() {
      this.isEdit = false;
    },
    /**
     * 组装请求数据并传出
     */
    handleChange() {
      let check;
      switch (this.featureType) {
        case "Pnt":
          check =
            this.groupField && this.statisticsField && this.featureStyleCopy;
          break;
        case "Lin":
        case "Reg":
          check = this.groupField && this.statisticsField;
          break;
        default:
          break;
      }
      if (check) {
        const statisticsField = {
          type: this.fieldInfo.filter(
            (item) => item.name == this.statisticsField
          )[0].type,
          label: this.statisticsField,
          value: this.statisticsField,
        };
        const groupField = {
          type: this.fieldInfo.filter((item) => item.name == this.groupField)[0]
            .type,
          label: this.groupField,
          value: this.groupField,
        };
        this.$emit(
          "feature-edit-change",
          this.type,
          { statisticsField: [statisticsField], groupField },
          this.init
        );
      }
    },
    getSampleColor({ style, border, color }) {
      const formatStyle = {
        "--color": color,
      };
      switch (style) {
        case "diamond": {
        }
        case "circle": {
        }
        case "square": {
        }
        case "cross": {
        }
        case "x": {
        }
        case "triangle": {
        }
        default:
          break;
      }

      return formatStyle;
    },
  },
};
