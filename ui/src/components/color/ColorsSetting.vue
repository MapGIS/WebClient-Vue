<template>
  <div class="mapgis-ui-colors-setting">
    <mapgis-ui-table
      bordered
      size="small"
      :pagination="false"
      :columns="tableColumns"
      :data-source="tableData"
      :scroll="{ y: 350 }"
    >
      <template slot="color" slot-scope="text, record">
        <mapgis-ui-sketch-color-picker
          :color.sync="record.color"
          :disableAlpha="false"
        ></mapgis-ui-sketch-color-picker>
      </template>
      <template slot="max" slot-scope="text, record, index">
        <mapgis-ui-input
          v-model="record.max"
          size="small"
          :min="record.min"
          :max="getMax(index)"
          :prefix="`${record.min}~`"
          @change="changeMax(record, index)"
          type="number"
        />
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <mapgis-ui-tooltip placement="top" title="删除">
          <mapgis-ui-iconfont
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
  </div>
</template>

<script>
import { uuid } from "../../util/common/util";

export default {
  name: "mapgis-ui-colors-setting",
  props: {
    // [{ min: 0, max: 60, color: 'rgba(244, 67, 54, 0.5)' }...]
    value: { type: Array },
    rangeField: { type: String, default: "角度范围" }
  },
  data() {
    return {
      defaultColor: "rgb(64,169,255,0.5)",
      dropdownVisible: false,
      tableColumns: [
        {
          title: "颜色",
          dataIndex: "color",
          align: "center",
          scopedSlots: { customRender: "color" }
        },
        {
          title: this.rangeField,
          dataIndex: "max",
          scopedSlots: { customRender: "max" }
        },
        {
          title: "操作",
          align: "center",
          scopedSlots: { customRender: "operation" }
        }
      ],
      tableData: [],
      emitValue: []
    };
  },
  watch: {
    value: {
      handler: function() {
        if (JSON.stringify(this.value) !== JSON.stringify(this.emitValue)) {
          this.initTableData();
        }
      },
      immediate: true,
      deep: true
    },
    tableData: {
      handler: function() {
        this.emitValue = this.tableData.map(({ min, max, color }) => ({
          min,
          max,
          color
        }));
        this.$emit("input", this.emitValue);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    /**
     * 修改选中行的最大值，后面一行的最小值同步变化
     */
    changeMax(record, index) {
      // console.log(record, index)
      if (record.max > this.tableData[index + 1].max) {
        record.max = this.tableData[index + 1].max;
      }
      if (index < this.tableData.length - 1) {
        this.tableData[index + 1].min = record.max;
      }
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
     * 初始化列表数据
     */
    initTableData() {
      if (!this.value || this.value.length === 0) {
        return;
      }
      this.tableData = this.value.map(({ min, max, color }) => ({
        key: uuid(),
        min,
        max,
        color
      }));
    },

    /**
     * 删除，删除后，前一行和后一行要衔接上
     */
    remove(index) {
      const length = this.tableData.length;
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
      const { min, max } = this.tableData[index];
      const num = Math.ceil((max + min) / 2);
      this.tableData[index].max = num;
      const node = {
        key: uuid(),
        color: this.defaultColor,
        min: num,
        max
      };
      this.tableData.splice(index + 1, 0, node);
    }
  }
};
</script>
