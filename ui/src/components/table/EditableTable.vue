<template>
  <mapgis-ui-command-card
    :size="size"
    :title="title"
    :tools="tableTools"
    :loading="loading"
    :class="prefixCls"
  >
    <mapgis-ui-table
      bordered
      :row-selection="tableRowSelection"
      :columns="tableColumns"
      :data-source="tableData"
      :loading="loading"
      :pagination="false"
      :row-key="rowKey"
      :class="`${prefixCls}-table`"
    >
      <template
        v-for="column in tableColumns"
        :slot="column.scopedSlots.customRender"
        slot-scope="text, record, index"
      >
        <mapgis-ui-editable-table-cell
          v-if="column.dataIndex"
          @change="cellChange($event, column, record)"
          :key="column.dataIndex"
          :column="column"
          :record="record"
          :size="size"
        />
        <span v-else :key="column.dataIndex">
          <slot
            :name="column.scopedSlots.customRender"
            v-bind="{ column, record, index }"
          />
          <mapgis-ui-iconfont type="mapgis-delete" @click="deleteRow(index)" />
        </span>
      </template>
    </mapgis-ui-table>
  </mapgis-ui-command-card>
</template>
<script>
import { oneOf } from "../../util/common/common-util";
import MapgisUiEditableTableCell from "./EditableTableCell.js";

export default {
  name: "mapgis-ui-editable",
  components: {
    MapgisUiEditableTableCell
  },
  props: {
    title: {
      // 标题
      type: String,
      default: "列表"
    },
    size: {
      type: String,
      default: "small",
      validator(v) {
        return oneOf(v, ["large", "default", "small"]);
      }
    },
    tools: {
      // 操作按钮设置: 默认有一个添加按钮
      type: [Array, Function],
      default: () => []
    },
    loading: {
      // 列表加载提示
      type: Boolean,
      default: false
    },
    checkable: {
      // 是否开启批量选择
      type: Boolean,
      default: true
    },
    columns: {
      // 列表列字段配置项
      type: Array,
      default: () => []
    },
    data: {
      // 列表数据
      type: Array,
      default: () => []
    },
    rowKey: {
      // 数据标识
      type: String,
      default: "index"
    }
  },
  data() {
    const prefixCls = "mapgis-ui-editable-table";
    return {
      prefixCls,
      index: 0,
      selectedRowKeys: [],
      tableData: this.data
    };
  },
  computed: {
    // 新增按钮
    addTool() {
      return {
        title: "新增",
        icon: "plus",
        method: this.add
      };
    },
    // 批量删除按钮
    batchDelTool() {
      return {
        title: "批量删除",
        icon: "delete",
        method: this.batchDelete
      };
    },
    // 列表的操作按钮
    tableTools({ tools, addTool, batchDelTool, checkable }) {
      let _tools = tools;
      if (typeof _tools === "function") {
        _tools = _tools(addTool, batchDelTool);
      } else if (!_tools.length) {
        _tools.push(addTool);
        if (checkable) {
          _tools.push(batchDelTool);
        }
      }

      return _tools;
    },
    // 列表多选框
    tableRowSelection() {
      return this.checkable
        ? {
            columnWidth: 32,
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.selectChange
          }
        : false;
    },
    // 操作栏
    tableAction() {
      return this.columns.findIndex(
        ({ scopedSlots: { customRender } }) => customRender === "action"
      ) < 0
        ? {
            title: "操作",
            align: "center",
            width: 50,
            scopedSlots: { customRender: "action" }
          }
        : null;
    },
    // 列表列配置
    tableColumns() {
      const _columns = [
        ...this.columns.map(v => ({
          ...v,
          scopedSlots: {
            customRender: v.dataIndex
          }
        }))
      ];
      if (this.tableAction) {
        _columns.push(this.tableAction);
      }
      return _columns;
    }
  },
  watch: {
    data(nV) {
      if (JSON.stringify(this.tableData) !== JSON.stringify(nV)) {
        this.tableData = nV;
      }
    },
    tableData(nV) {
      this.$emit("change", nV);
      this.$emit("update:data", nV);
    }
  },
  methods: {
    /**
     * 配置列表选择变化
     */
    selectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    /**
     * 表格单元组件变化
     * 优化: 此处$set某行数据并未触发视图的更新, 因为tableData有可能为非响应式数据,
     * 因此需要手动对tableData赋值
     */
    cellChange(value, column, record) {
      this.$set(record, column.dataIndex, value);
      this.tableData = [...this.tableData];
    },
    /**
     * 移除行
     */
    deleteRow(index) {
      this.tableData.splice(index, 1);
      this.index -= 1;
    },
    /**
     * 添加
     */
    add() {
      this.tableData.push(
        this.columns.reduce((obj, { dataIndex }) => {
          if (dataIndex) {
            this.$set(obj, dataIndex, undefined);
            this.$set(obj, "index", this.index);
          }
          return obj;
        }, {})
      );
      this.index += 1;
    },
    /**
     * 批量删除
     */
    batchDelete() {
      if (!this.selectedRowKeys.length) {
        this.$message.warning("请勾选需要删除的数据项");
        return;
      }
      this.selectedRowKeys.forEach(v => {
        this.deleteRow(this.tableData.findIndex(({ index }) => index === v));
      });
      this.selectedRowKeys = [];
    }
  }
};
</script>
