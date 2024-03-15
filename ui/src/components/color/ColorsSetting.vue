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
          :disableAlpha="disableAlpha"
          :showColorText="false"
        ></mapgis-ui-sketch-color-picker>
      </template>
      <template
        slot="max"
        slot-scope="text, record, index"
        v-if="showNumber && rangeFieldMode === 'range'"
      >
        <mapgis-ui-input-number-addon
          v-model="record.max"
          size="small"
          :min="record.min"
          :max="getMax(index)"
          :prefix="`${record.min}~`"
          @change="changeMax(record, index)"
          v-if="!singleNumber"
        />
        <mapgis-ui-input-number-addon
          v-else
          v-model="record.max"
          size="small"
          :min="record.min"
          :max="getMax(index)"
          @change="changeMax(record, index)"
        />
      </template>
      <template
        slot="num"
        slot-scope="text, record, index"
        v-if="showNumber && rangeFieldMode === 'single'"
      >
        <span v-if="!record.edit" @click="showNumChange(record, index, true)">{{
          record.num
        }}</span>
        <mapgis-ui-input-number
          v-else
          :value="record.num"
          autoFocus
          @blur="showNumChange(record, index, false)"
          @change="
            val => {
              onNumberChange(val, record, index);
            }
          "
        ></mapgis-ui-input-number>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <mapgis-ui-tooltip
          placement="top"
          title="删除"
          v-if="showRemoveBtn(index)"
        >
          <mapgis-ui-iconfont
            class="mapgis-ui-iconfont"
            type="mapgis-delete"
            @click="remove(index)"
          ></mapgis-ui-iconfont>
        </mapgis-ui-tooltip>
        <mapgis-ui-tooltip
          placement="top"
          title="向下插入一行"
          v-if="showAddBtn(index)"
        >
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
import { rgbaToHex } from "../../util/common/color-util.js";

export default {
  name: "mapgis-ui-colors-setting",
  props: {
    // [{ min: 0, max: 60, color: 'rgba(244, 67, 54, 0.5)' }...]
    value: { type: Array },
    rangeField: { type: String, default: "角度范围" },
    singleNumber: { type: Boolean, defalut: false },
    showNumber: { type: Boolean, default: true },
    disableAlpha: { type: Boolean, default: false },
    // 表格的数值栏取范围还是取单值  range/single
    rangeFieldMode: {
      type: String,
      default: "range"
    },
    // 属性最大值
    maxValue: {
      type: Number,
      default: 1000
    },
    // 属性最小值
    minValue: {
      type: Number,
      default: 1
    }
  },
  model: {
    props: "value",
    event: "change"
  },
  data() {
    return {
      defaultColor: "rgb(64,169,255,1)",
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
          align: "center",
          scopedSlots: { customRender: "max" }
        },
        {
          title: "操作",
          align: "center",
          scopedSlots: { customRender: "operation" }
        }
      ],
      tableData: [],
      emitValue: [],
      countMin: 0,
      countMax: 100
    };
  },
  computed: {
    showAddBtn: ({ rangeFieldMode, tableData }) => {
      return index => {
        if (rangeFieldMode === "single") {
          return index !== tableData.length - 1;
        } else {
          return true;
        }
      };
    },
    showRemoveBtn: ({ rangeFieldMode, tableData }) => {
      return index => {
        if (rangeFieldMode === "single") {
          return index !== 0 && index !== tableData.length - 1;
        } else {
          return true;
        }
      };
    }
  },
  watch: {
    value: {
      handler: function() {
        if (JSON.stringify(this.value) !== JSON.stringify(this.emitValue)) {
          this.initTableData();
          this.$emit("change", this.value);
        }
      },
      immediate: true,
      deep: true
    },
    tableData: {
      handler: function() {
        const vm = this;
        if (this.rangeFieldMode === "single") {
          this.emitValue = this.tableData.map(({ num, color }) => ({
            num,
            color
          }));
        } else {
          this.emitValue = this.tableData.map(({ min, max, color }) => ({
            min,
            max,
            color
          }));
          if (
            this.value instanceof Array &&
            typeof this.value[0] === "string"
          ) {
            this.emitValue = [];
            this.tableData.forEach(item => {
              let hex = rgbaToHex(item.color, false);
              vm.emitValue.push(hex);
            });
          }
        }

        this.$emit("change", this.emitValue);
        this.$emit("input", this.emitValue);
      },
      immediate: true,
      deep: true
    },
    singleNumber: {
      handler: function(next) {
        if (next) {
          this.tableColumns.splice(this.tableColumns.length - 1, 1);
        }
      },
      immediate: true
    },
    showNumber: {
      handler: function(next) {
        if (!next) {
          this.tableColumns.splice(1, 1);
        }
      },
      immediate: true
    },
    rangeFieldMode: {
      handler() {
        if (this.rangeFieldMode === "single") {
          this.tableColumns.splice(1, 1, {
            title: this.rangeField,
            dataIndex: "num",
            align: "center",
            scopedSlots: { customRender: "num" }
          });
        }
      },
      immediate: true
    }
  },
  methods: {
    // 改变输入框时对输入值进行限制
    onNumberChange(val, record, index) {
      if (val >= this.countMax) {
        const length = this.tableData.length;
        record.num = index === length - 1 ? this.maxValue : this.countMax - 1;
      } else if (val <= this.countMin) {
        record.num = index === 0 ? this.minValue : this.countMin + 1;
      } else {
        record.num = val;
      }
    },
    // 控制输入框是否显示，同时点击的时候确定输入框的最大最小值
    showNumChange(record, index, val) {
      record.edit = val;
      if (record.edit === true) {
        if (index === 0) {
          this.countMax = this.tableData[index + 1].num;
          this.countMin = this.tableData[index].num;
        } else if (index === this.tableData.length - 1) {
          this.countMax = this.tableData[index].num;
          this.countMin = this.tableData[index - 1].num;
        } else {
          this.countMin = this.tableData[index - 1].num;
          this.countMax = this.tableData[index + 1].num;
        }
      }
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
      const vm = this;
      if (!this.value || this.value.length === 0) {
        return;
      }
      if (this.rangeFieldMode === "single") {
        this.tableData = this.value.map(({ color, num }) => ({
          key: uuid(),
          color,
          num,
          edit: false
        }));
      } else {
        this.tableData = this.value.map(({ min, max, color }) => ({
          key: uuid(),
          min,
          max,
          color
        }));
        if (this.value instanceof Array && typeof this.value[0] === "string") {
          this.tableData = [];
          this.value.forEach(color => {
            vm.tableData.push({
              key: uuid(),
              color: color
            });
          });
        }
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
      if (this.rangeFieldMode === "single") {
      } else {
        if (index === 0) {
          this.tableData[index + 1].min = this.tableData[index].min;
        } else if (index < length - 1) {
          this.tableData[index + 1].min = this.tableData[index].min;
          this.tableData[index - 1].max = this.tableData[index + 1].min;
        } else {
          this.tableData[index - 1].max = this.tableData[index].min;
        }
      }

      this.tableData.splice(index, 1);
    },

    /**
     * 添加，向下插入一行，把该行的最大最小值的间隔一分为二
     */
    add(index) {
      if (this.rangeFieldMode === "single") {
        const min = this.tableData[index].num;
        const max = this.tableData[index + 1].num;
        const num = Math.ceil((max + min) / 2);
        const node = {
          key: uuid(),
          color: this.defaultColor,
          num,
          edit: false
        };
        this.tableData.splice(index + 1, 0, node);
      } else {
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
  }
};
</script>
