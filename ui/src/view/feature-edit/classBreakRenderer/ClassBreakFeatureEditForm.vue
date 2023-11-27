<template>
  <div>
    <mapgis-ui-setting-form layout="vertical" size="default">
      <mapgis-ui-form-item label="分段字段">
        <mapgis-ui-select v-model="groupField" @change="handleChange">
          <mapgis-ui-select-option
            v-for="(item, index) in fieldInfoMap"
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
      <mapgis-ui-form-item>
        <template v-slot:label>
          <mapgis-ui-row type="flex" justify="space-between">
            <mapgis-ui-col style="width:40px">表格</mapgis-ui-col>
            <mapgis-ui-col style="flex:1"
              ><mapgis-ui-slider-color-picker :color.sync="color"
            /></mapgis-ui-col>
          </mapgis-ui-row>
        </template>
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
              :class="getClass(record.sample.style, featureType)"
              :style="getSampleColor(record.sample)"
            ></span>
          </template>
          <template slot="max" slot-scope="text, record, index">
            <div class="max">
              <mapgis-ui-input-number
                v-model="record.min"
                size="small"
              />~<mapgis-ui-input-number
                v-model="record.max"
                size="small"
                @change="changeMax(record, index)"
              />
            </div>
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
            <mapgis-ui-tooltip placement="top" title="向下插入一行">
              <mapgis-ui-iconfont
                type="mapgis-plus"
                @click="add(index)"
              ></mapgis-ui-iconfont>
            </mapgis-ui-tooltip>
          </template>
        </mapgis-ui-table>
      </mapgis-ui-form-item>
    </mapgis-ui-setting-form>
    <mapgis-ui-modal
      :visible="isEdit"
      :mask="false"
      :title="title"
      :footer="null"
      @cancel="modalCancel"
    >
      <mapgis-ui-feature-edit-form
        :featureItem.sync="featureItem"
        :featureType="featureType"
        :featureStyle="featureStyleCopy"
        :fieldInfo="fieldInfo"
        :showSeletion="false"
      ></mapgis-ui-feature-edit-form>
    </mapgis-ui-modal>
  </div>
</template>

<script>
import { ClassBreakRenderer } from "@mapgis/webclient-common";
import getSymbolMixin from "../mixin/GetSymbol.js";
import featureEdit from "../mixin/featureEdit";
import {
  defaultSimpleMarkerStyle,
  defaultTextStyle,
  defaultPictureMarkerStyle,
  defaultSimpleLineStyle,
  defaultSimpleFillStyle
} from "../simpleRenderer/defaultStyle";
import { uuid } from "../../../util/common/util";

export default {
  name: "mapgis-ui-feature-edit-class-break-form",
  mixins: [getSymbolMixin, featureEdit],
  data() {
    return {
      tableColumns: [
        {
          title: "图例",
          dataIndex: "sample",
          align: "center",
          scopedSlots: { customRender: "sample" }
          // width: 50
        },
        {
          title: "分段范围",
          dataIndex: "max",
          align: "center",
          scopedSlots: { customRender: "max" }
          // width: 170
        },
        {
          title: "操作",
          align: "center",
          scopedSlots: { customRender: "operation" }
          // width: 80
        }
      ],
      pointFeatureStyleList: [
        { name: "常规点图形", value: "simple-marker" },
        // { name: "简单图文标注", value: "text" },
        { name: "简单图片标签", value: "picture-marker" }
      ],
      type: "classBreak"
    };
  },
  computed: {
    // 剔除掉属性值数组当中类型为string的项
    fieldInfoMap() {
      return this.fieldInfo.filter(item => item.type !== "string");
    }
  },
  methods: {
    // 根据不同图层类型点、线、区组装不同tableData
    init(val) {
      this.tableData = [];
      this.max = val[1];
      this.min = val[0];
      let deafultStyle;
      switch (this.featureType) {
        case "Pnt": {
          if (this.featureStyleCopy == "simple-marker") {
            deafultStyle = defaultSimpleMarkerStyle;
          } else if (this.featureStyleCopy == "text") {
            deafultStyle = defaultTextStyle;
          } else if (this.featureStyleCopy == "picture-marker") {
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
      const deafultStyle1 = JSON.parse(JSON.stringify(deafultStyle));
      const deafultStyle2 = JSON.parse(JSON.stringify(deafultStyle));
      deafultStyle1.color = `rgba(${this.colorRgb[0]},${this.colorRgb[1]},${this.colorRgb[2]},1)`;
      deafultStyle2.color = `rgba(${this.colorRgb[0]},${this.colorRgb[1]},${this.colorRgb[2]},0.5)`;
      const node1 = {
        sample: deafultStyle1,
        key: uuid(),
        min: this.min,
        max: (this.max + this.min) / 2
      };
      const node2 = {
        sample: deafultStyle2,
        key: uuid(),
        min: (this.max + this.min) / 2,
        max: this.max
      };
      this.tableData.push(node1, node2);
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
    /**
     * 添加，向下插入一行，把该行的最大最小值的间隔一分为二
     */
    add(index) {
      const length = this.tableData.length;
      if (index === length - 1) return;
      const { min, max } = this.tableData[index];
      const num = (max + min) / 2;
      this.tableData[index].max = num;
      let deafultStyle;
      switch (this.featureType) {
        case "Pnt": {
          if (this.featureStyleCopy == "simple-marker") {
            deafultStyle = defaultSimpleMarkerStyle;
          } else if (this.featureStyleCopy == "text") {
            deafultStyle = defaultTextStyle;
          } else if (this.featureStyleCopy == "picture-marker") {
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
      const node = {
        sample: JSON.parse(JSON.stringify(deafultStyle)),
        key: uuid(),
        min: num,
        max
      };
      this.tableData.splice(index + 1, 0, node);
    },
    edit(index) {
      this.isEdit = true;
      this.featureItem = this.tableData[index].sample;
    },
    /**
     * 标准化render并传出
     */
    formatRender() {
      if (this.tableData.length > 0) {
        const classBreakInfos = [];
        this.tableData.forEach(item => {
          let symbol;
          switch (this.featureType) {
            case "Pnt": {
              if (this.featureStyleCopy == "simple-marker") {
                symbol = this.getSimpleMarkerSymbol(item.sample);
              } else if (this.featureStyleCopy == "text") {
                symbol = this.getTextSymbol(item.sample);
              } else if (this.featureStyleCopy == "picture-marker") {
                symbol = this.getPictureMarkerSymbol(item.sample);
              }
              break;
            }
            case "Lin": {
              symbol = this.getSimpleLineSymbol(item.sample);
              this.featureStyleCopy = "simple-line";
              break;
            }
            case "Reg": {
              symbol = this.getSimpleFillSymbol(item.sample);
              this.featureStyleCopy = "simple-fill";
              break;
            }
            default: {
              break;
            }
          }
          const classBreakInfo = {
            maxValue: item.max,
            minValue: item.min,
            symbol
          };
          classBreakInfos.push(classBreakInfo);
        });
        const classBreakRenderer = new ClassBreakRenderer({
          field: this.statisticsField,
          defaultSymbol: undefined,
          classBreakInfos
        });
        const classBreakRendererJSON = classBreakRenderer.toJSON();
        this.$emit(
          "get-renderer",
          classBreakRendererJSON,
          this.featureStyleCopy
        );
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
  border-style: solid;
  border-color: transparent transparent var(--color) transparent;
  border-width: 0 8px 8px 8px;
  width: 12px;
  box-sizing: content-box;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 8px;
    left: -9px;
    border-style: solid;
    border-color: var(--color) transparent transparent transparent;
    border-width: 12px 13px 0 13px;
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
