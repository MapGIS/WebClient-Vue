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
            <img
              :src="getUrl(record.sample.url)"
              alt=""
              class="img"
              v-if="featureStyleCopy == 'picture-marker'"
            />

            <span
              :class="getClass(record.sample.style, featureType)"
              :style="getSampleColor(record.sample)"
              v-else
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
        parentClass="uniqueValue"
      ></mapgis-ui-feature-edit-form>
    </mapgis-ui-modal>
  </div>
</template>

<script>
import { UniqueValueRenderer } from "@mapgis/webclient-common";
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
  name: "mapgis-ui-feature-edit-unique-value-form",
  mixins: [getSymbolMixin, featureEdit],
  data() {
    return {
      type: "uniqueValue"
    };
  },
  computed: {
    tableColumns() {
      if (this.featureType == "Pnt" && this.featureStyleCopy == "text") {
        return [
          {
            title: "分类",
            dataIndex: "class",
            align: "center",
            scopedSlots: { customRender: "class" }
            // width: 150
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
            scopedSlots: { customRender: "sample" }
            // width: 50
          },
          {
            title: "分类",
            dataIndex: "class",
            align: "center",
            scopedSlots: { customRender: "class" }
            // width: 150
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
    getUrl(url) {
      return `${window.origin}${window._CONFIG.domainURL}${url}`;
    },

    // 根据不同图层类型点、线、区组装不同tableData
    init(val) {
      this.tableData = [];
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
      const dataLength = val.length;
      const step = 1 / dataLength;
      for (let i = 0; i < dataLength; i++) {
        deafultStyle.color = `rgba(${this.colorRgb[0]},${this.colorRgb[1]},${
          this.colorRgb[2]
        },${1 - step * i})`;
        const node = {
          sample: JSON.parse(JSON.stringify(deafultStyle)),
          key: uuid(),
          class: val[i]
        };
        this.tableData.push(node);
      }
    },
    /**
     * 删除，删除后，前一行和后一行要衔接上
     */
    remove(index) {
      this.tableData.splice(index, 1);
    },
    /**
     * 编辑当前项
     */
    edit(index) {
      this.isEdit = true;
      this.featureItem = this.tableData[index].sample;
    },
    /**
     * 标准化render并传出
     */
    formatRender() {
      if (this.tableData.length > 0) {
        const uniqueValueInfos = [];
        this.tableData.forEach(item => {
          let symbol;
          switch (this.featureType) {
            case "Pnt": {
              if (this.featureStyleCopy == "simple-marker") {
                symbol = this.getSimpleMarkerSymbol(item.sample);
              } else if (this.featureStyleCopy == "text") {
                item.sample.text = item.class;
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
        this.$emit("get-renderer", uniqueRenderJSON, this.featureStyleCopy);
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
.img {
  width: 20px;
}
</style>
