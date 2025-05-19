<template>
  <div class="mapgis-ui-directions-setting">
    <mapgis-ui-table
      bordered
      size="small"
      :pagination="false"
      :columns="tableColumns"
      :data-source="tableData"
      :scroll="{ y: 350 }"
    >
      <template slot="direction" slot-scope="text, record">
        <mapgis-ui-input v-model="record.direction"> </mapgis-ui-input>
      </template>
      <template
        slot="end"
        slot-scope="text, record"
        v-if="rangeFieldMode === 'range'"
      >
        <div style="display: flex">
          <span>[{{ record.start }}~</span>
          <mapgis-ui-input-number-addon
            v-model="record.end"
            size="small"
            :min="record.start"
          />
          <span>{{ record.end === rangeMaxValue ? ']' : ')' }}</span>
        </div>
      </template>
      <template
        slot="value"
        slot-scope="text, record"
        v-if="rangeFieldMode === 'unique'"
      >
        <mapgis-ui-input v-model="record.value"></mapgis-ui-input>
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
import { v4 as uuid } from 'uuid'
import { width } from '../../../Base/Cesium/CesiumMixinProps'

export default {
  name: 'directions-setting',
  props: {
    // 单值[{value:2, direction: '0, 1000, 0' }...]或者分段值[{ start: 0, end: 60, direction: '0, 1000, 0' }...]
    value: { type: Array },
    rangeField: { type: String, default: '值' },
    // 表格的数值栏取范围还是取单值  range/unique
    rangeFieldMode: {
      type: String,
      default: 'range'
    },
    // 分段中的最大值
    rangeMaxValue: { type: Number }
  },
  model: {
    props: 'value',
    event: 'change'
  },
  data() {
    return {
      tableColumns: [
        {
          title: '平移向量',
          dataIndex: 'direction',
          align: 'center',
          scopedSlots: { customRender: 'direction' }
        },
        {
          title: this.rangeField,
          dataIndex: 'value',
          align: 'center',
          scopedSlots: { customRender: 'value' }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
          width: 50
        }
      ],
      tableData: [],
      emitValue: []
    }
  },
  computed: {
    showAddBtn: ({ rangeFieldMode, tableData }) => {
      return (index) => {
        if (rangeFieldMode === 'unique') {
          return index !== tableData.length - 1
        } else {
          return true
        }
      }
    },
    showRemoveBtn: ({ rangeFieldMode, tableData }) => {
      return (index) => {
        if (rangeFieldMode === 'unique') {
          return index !== 0 && index !== tableData.length - 1
        } else {
          return true
        }
      }
    }
  },
  watch: {
    value: {
      handler: function () {
        if (JSON.stringify(this.value) !== JSON.stringify(this.emitValue)) {
          this.initTableData()
          this.$emit('change', this.value)
        }
      },
      immediate: true,
      deep: true
    },
    tableData: {
      handler: function () {
        const vm = this
        if (this.rangeFieldMode === 'unique') {
          this.emitValue = this.tableData.map(({ value, direction }) => ({
            value,
            direction
          }))
        } else {
          this.emitValue = this.tableData.map(({ start, end, direction }) => ({
            start,
            end,
            direction
          }))
        }

        this.$emit('change', this.emitValue)
        this.$emit('input', this.emitValue)
      },
      immediate: true,
      deep: true
    },
    rangeFieldMode: {
      handler() {
        this.changeTableColumns()
      },
      immediate: true
    },
    rangeField: {
      handler() {
        this.changeTableColumns()
      }
    }
  },
  methods: {
    changeTableColumns() {
      if (this.rangeFieldMode === 'unique') {
        this.tableColumns.splice(1, 1, {
          title: this.rangeField,
          dataIndex: 'value',
          align: 'center',
          scopedSlots: { customRender: 'value' }
        })
      } else {
        this.tableColumns.splice(1, 1, {
          title: this.rangeField,
          dataIndex: 'end',
          align: 'center',
          scopedSlots: { customRender: 'end' }
        })
      }
    },
    /**
     * 初始化列表数据
     */
    initTableData() {
      this.tableData = []
      if (!this.value || this.value.length === 0) {
        return
      }
      if (this.rangeFieldMode === 'unique') {
        this.tableData = this.value.map(({ direction, value }) => ({
          key: uuid(),
          direction,
          value
        }))
      } else {
        this.tableData = this.value.map(({ start, end, direction }) => ({
          key: uuid(),
          start,
          end,
          direction
        }))
      }
    },

    /**
     * 删除
     */
    remove(index) {
      this.tableData.splice(index, 1)
    },

    /**
     * 添加，向下插入一行
     */
    add(index) {
      if (this.rangeFieldMode === 'unique') {
        const { value, direction } = this.tableData[index]
        const node = {
          key: uuid(),
          direction,
          value
        }
        this.tableData.splice(index + 1, 0, node)
      } else {
        const length = this.tableData.length
        const { start, end, direction } = this.tableData[index]
        const node = {
          key: uuid(),
          direction,
          start,
          end
        }
        this.tableData.splice(index + 1, 0, node)
      }
    }
  }
}
</script>
