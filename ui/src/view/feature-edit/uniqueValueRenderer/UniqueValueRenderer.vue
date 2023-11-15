<template>
  <div>
    <mapgis-ui-setting-form layout="vertical" size="default">
      <mapgis-ui-form-item label="分类字段">
        <mapgis-ui-select v-model="groupField" @change="handleChange">
          <mapgis-ui-select-option
            v-for="(item, index) in fieldInfo"
            :key="index"
            :value="item.name"
            >{{ item.name }}</mapgis-ui-select-option
          >
        </mapgis-ui-select>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="统计字段">
        <mapgis-ui-select v-model="statisticsField" @change="handleChange">
          <mapgis-ui-select-option
            v-for="(item, index) in fieldInfo"
            :key="index"
            :value="item.name"
            >{{ item.name }}</mapgis-ui-select-option
          >
        </mapgis-ui-select>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="要素样式" v-if="featureType == 'Pnt'">
        <mapgis-ui-select v-model="featureStyleCopy" @change="handleChange">
          <mapgis-ui-select-option
            v-for="(item, index) in pointFeatureStyleList"
            :key="index"
            :value="item.value"
            >{{ item.name }}</mapgis-ui-select-option
          >
        </mapgis-ui-select>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="表格">
        <mapgis-ui-table
          :columns="tableColumns"
          :data-source="tableData"
          bordered
          size="small"
          :pagination="false"
          :scroll="{ y: 230 }"
          ref="table"
        >
          <template slot="sample" slot-scope="text, record">
            <span
              :class="`${record.sample.style}-${featureType}`"
              :style="getSampleColor(record.sample)"
            ></span>
          </template>
          <template slot="class" slot-scope="text">
            <span>
              {{ text }}
            </span>
          </template>
          <template slot="operation" slot-scope="text, record, index">
            <mapgis-ui-tooltip placement="top" title="编辑">
              <mapgis-ui-iconfont
                class="mapgis-ui-iconfont"
                type="mapgis-edit"
                @click="edit(index)"
              ></mapgis-ui-iconfont>
            </mapgis-ui-tooltip>
            <mapgis-ui-tooltip placement="top" title="删除">
              <mapgis-ui-iconfont
                class="mapgis-ui-iconfont"
                type="mapgis-delete"
                @click="remove(index)"
              ></mapgis-ui-iconfont>
            </mapgis-ui-tooltip>
          </template>
        </mapgis-ui-table>
      </mapgis-ui-form-item>
    </mapgis-ui-setting-form>
    <mp-window-wrapper>
      <mp-window
        :title="title"
        :visible.sync="isEdit"
        :width="350"
        :horizontalOffset="350"
        :verticalOffset="50"
      >
        <mapgis-ui-feature-edit-form
          :featureItem.sync="featureItem"
          :featureType="featureType"
          :featureStyle="featureStyleCopy"
          :fieldInfo="fieldInfo"
          :showSeletion="false"
          parentClass="uniqueValue"
        ></mapgis-ui-feature-edit-form>
      </mp-window>
    </mp-window-wrapper>
  </div>
</template>

<script>
import { uuid } from "../../../util/common/util";
import { UniqueValueRenderer } from "@mapgis/webclient-common";
import MapgisUiFeatureEditForm from "../simpleRenderer/FeatureEditForm.vue";
import {
  defaultSimpleMarkerStyle,
  defaultTextStyle,
  defaultPictureMarkerStyle,
  defaultSimpleLineStyle,
  defaultSimpleFillStyle
} from "../simpleRenderer/defaultStyle.js";
import getSymbolMixin from "../mixin/GetSymbol.js";

export default {
  name: "mapgis-ui-feature-edit-unique-value-form",
  mixins: [getSymbolMixin],
  components: {
    MapgisUiFeatureEditForm
  },
  props: {
    // 属性值数组
    fieldInfo: {
      type: Array,
      default: () => []
    },
    // 要素类型
    featureType: {
      type: String
    },
    featureStyle: {
      type: String
    }
  },
  data() {
    return {
      featureStyleCopy: this.featureStyle,
      groupField: undefined,
      statisticsField: undefined,
      isEdit: false,
      pointFeatureStyleList: [
        { name: "常规点图形", value: "simpleMarkerSymbol" },
        { name: "简单图文标注", value: "textSymbol" },
        { name: "简单图片标签", value: "pictureMarkerSymbol" }
      ],
      tableData: [],
      featureItem: {}
    };
  },
  mounted() {},
  computed: {
    title() {
      const map = {
        Pnt: "点",
        Lin: "线",
        Reg: "区"
      };
      return `${map[this.featureType]}样式`;
    },
    tableColumns() {
      if (this.featureType == "Pnt" && this.featureStyleCopy == "textSymbol") {
        return [
          {
            title: "分类",
            dataIndex: "class",
            align: "center",
            scopedSlots: { customRender: "class" },
            width: 150
          },
          {
            title: "操作",
            align: "center",
            scopedSlots: { customRender: "operation" }
          }
        ];
      } else {
        return [
          {
            title: "图例",
            dataIndex: "sample",
            align: "center",
            scopedSlots: { customRender: "sample" },
            width: 50
          },
          {
            title: "分类",
            dataIndex: "class",
            align: "center",
            scopedSlots: { customRender: "class" },
            width: 150
          },
          {
            title: "操作",
            align: "center",
            scopedSlots: { customRender: "operation" }
          }
        ];
      }
    }
  },
  methods: {
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
            item => item.name == this.statisticsField
          )[0].type,
          label: this.statisticsField,
          value: this.statisticsField
        };
        const groupField = {
          type: this.fieldInfo.filter(item => item.name == this.groupField)[0]
            .type,
          label: this.groupField,
          value: this.groupField
        };
        this.$emit(
          "feature-edit-change",
          "uniqueValue",
          { statisticsField: [statisticsField], groupField },
          this.init
        );
      }
    },
    // 根据不同图层类型点、线、区组装不同tableData
    init(val) {
      this.tableData = [];
      let deafultStyle;
      switch (this.featureType) {
        case "Pnt": {
          if (this.featureStyleCopy == "simpleMarkerSymbol") {
            deafultStyle = defaultSimpleMarkerStyle;
          } else if (this.featureStyleCopy == "textSymbol") {
            deafultStyle = defaultTextStyle;
          } else if (this.featureStyleCopy == "pictureMarkerSymbol") {
            deafultStyle = defaultPictureMarkerStyle;
          }
          break;
        }
        case "Lin": {
          deafultStyle = defaultSimpleLineStyle;
          break;
        }
        case "Reg": {
          deafultStyle = defaultSimpleFillStyle;
          break;
        }
        default: {
          break;
        }
      }
      val.forEach(item => {
        const node = {
          sample: JSON.parse(JSON.stringify(deafultStyle)),
          key: uuid(),
          class: item
        };
        this.tableData.push(node);
      });
    },
    getSampleColor({ style, border, color }) {
      const formatStyle = {
        "--color": color
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
    /**
     * 获取每行的可输入最大值（就是后一行的最大值）
     */
    getMax(index) {
      return index < this.tableData.length - 1
        ? this.tableData[index + 1].max
        : this.tableData[this.tableData.length - 1].max;
    },
    /**
     * 修改选中行的最大值，后面一行的最小值同步变化
     */
    changeMax(record, index) {
      if (record.max > this.tableData[index + 1].max) {
        record.max = this.tableData[index + 1].max;
      }
      if (index < this.tableData.length - 1) {
        this.tableData[index + 1].min = record.max;
      }
    },
    /**
     * 删除，删除后，前一行和后一行要衔接上
     */
    remove(index) {
      const length = this.tableData.length;
      // 传入的值只有颜色没有最大最小值时，如['rgba(222,222,222,0.2)]
      if (this.value instanceof Array && typeof this.value[0] === "string") {
        this.tableData.splice(index, 1);
        return;
      }
      if (index === 0) {
        this.tableData[index + 1].min = this.tableData[index].min;
      } else if (index < length - 1) {
        this.tableData[index + 1].min = this.tableData[index].min;
        this.tableData[index - 1].max = this.tableData[index + 1].min;
      } else {
        this.tableData[index - 1].max = this.tableData[index].min;
      }
      this.tableData.splice(index, 1);
    },
    edit(index) {
      this.isEdit = true;
      this.featureItem = this.tableData[index].sample;
    },
    formatRender() {
      if (this.tableData.length > 0) {
        const uniqueValueInfos = [];
        this.tableData.forEach(item => {
          let symbol;
          switch (this.featureType) {
            case "Pnt": {
              if (this.featureStyleCopy == "simpleMarkerSymbol") {
                symbol = this.getSimpleMarkerSymbol(item.sample);
              } else if (this.featureStyleCopy == "textSymbol") {
                item.sample.text = item.class;
                symbol = this.getTextSymbol(item.sample);
              } else if (this.featureStyleCopy == "pictureMarkerSymbol") {
                symbol = this.getPictureMarkerSymbol(item.sample);
              }
              break;
            }
            case "Lin": {
              symbol = this.getSimpleLineSymbol(item.sample);
              break;
            }
            case "Reg": {
              symbol = this.getSimpleFillSymbol(item.sample);
              break;
            }
            default: {
              break;
            }
          }
          const uniqueValueInfo = {
            value: item.class,
            symbol
          };
          uniqueValueInfos.push(uniqueValueInfo);
        });
        const uniqueRender = new UniqueValueRenderer({
          field: this.groupField,
          uniqueValueInfos,
          defaultSymbol: undefined
        });
        const uniqueRenderJSON = uniqueRender.toJSON();
        this.$emit("get-renderer", uniqueRenderJSON);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.circle-Pnt {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: var(--color);
  border-radius: 50%;
  //   border: 1px dashed seagreen;
}
.square-Pnt {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: var(--color);
}
.diamond-Pnt {
  display: inline-block;
  scale: 0.2;
  border-style: solid;
  border-color: transparent transparent var(--color) transparent;
  border-width: 0 25px 25px 25px;
  width: 50px;
  box-sizing: content-box;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 25px;
    left: -25px;
    border-style: solid;
    border-color: var(--color) transparent transparent transparent;
    border-width: 70px 50px 0 50px;
  }
}
.cross-Pnt {
  display: inline-block;
  background: var(--color);
  width: 5px;
  height: 20px;
  position: relative;
  &::after {
    background: var(--color);
    content: "";
    width: 20px;
    height: 5px;
    position: absolute;
    left: -8px;
    top: 8px;
  }
}
.x-Pnt {
  display: inline-block;
  background: var(--color);
  transform: rotate(45deg);
  width: 5px;
  height: 20px;
  position: relative;
  &::after {
    background: var(--color);
    content: "";
    width: 20px;
    height: 5px;
    position: absolute;
    left: -8px;
    top: 8px;
  }
}
.triangle-Pnt {
  display: inline-block;
  width: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 20px solid var(--color);
}
.solid-Lin {
  display: inline-block;
  width: 35px;
  height: 3px;
  background: var(--color);
}
.solid-Reg {
  display: inline-block;
  width: 30px;
  height: 0;
  border-right: 8px solid transparent;
  border-bottom: 18px solid var(--color);
}
.max {
  display: flex;
  justify-content: space-between;
}
</style>
