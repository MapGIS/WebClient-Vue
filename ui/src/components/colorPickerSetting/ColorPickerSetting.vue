<template>
  <mapgis-ui-row>
    <mapgis-ui-col :span="4">
      填充颜色
    </mapgis-ui-col>
    <mapgis-ui-col :span="20">
      <mapgis-ui-dropdown
          :placement="placement"
      >
        <div class="mapgis-ui-color-picker-dropdown-link" @click="e => e.preventDefault()"></div>
        <mapgis-ui-menu slot="overlay">
          <mapgis-ui-menu-item>
            <mapgis-ui-command-card :box-shadow="true" title="颜色设置" :tools="tools">
              <mapgis-ui-table
                  bordered
                  :pagination="false"
                  :columns="tableColumns"
                  :data-source="tableData"
              >
                <template slot="color" slot-scope="text, record">
                  <mapgis-ui-sketch-color-picker-confirm
                      v-model="record.color"
                      :border-radius="false"
                      class="color-picker-confirm"
                  />
                </template>
                <template slot="percent" slot-scope="text, record">
                  <mapgis-ui-input-number
                      v-model="record.percent"
                      :min="0"
                      :max="100"
                      :precision="0"
                      :formatter="value => `${value}%`"
                      :parser="value => value.replace('%', '')"
                  />
                </template>
                <template slot="operation" slot-scope="text, record, index">
                  <mapgis-ui-iconfont type="mapgis-delete" @click="removeRow(index)" />
                </template>
              </mapgis-ui-table>
            </mapgis-ui-command-card>
          </mapgis-ui-menu-item>
        </mapgis-ui-menu>
      </mapgis-ui-dropdown>
    </mapgis-ui-col>
  </mapgis-ui-row>
</template>

<script>
export default {
  name: "mapgis-ui-color-picker-setting",
  props: {
    value: {
      type: Object,
      default(){
        return {
          '0.25': 'rgb(0,0,255)',
          '0.55': 'rgb(0,255,0)',
          '0.85': 'rgb(241,241,15)',
          '1.0': 'rgb(255,0,0)'
        }
      }
    }
  },
  data(){
    return{
      placement: "bottomRight",
      dropdownVisible: true,
      showDropdown: undefined,
      tools: [
        {
          title: '新增',
          icon: 'mapgis-plus',
        },
        {
          title: '批量删除',
          icon: 'mapgis-delete',
        },
        {
          title: '确认',
          icon: 'mapgis-check',
        },
        {
          title: '关闭',
          icon: 'mapgis-close',
        }
      ],
      selectChange: undefined,
      selectedRowKeys: undefined,
      tableColumns: [
        {
          title: '颜色',
          dataIndex: 'color',
          align: 'center',
          scopedSlots: { customRender: 'color' }
        },
        {
          title: '占比',
          dataIndex: 'percent',
          scopedSlots: { customRender: 'percent' }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      tableData: undefined,
      background: undefined
    }
  },
  mounted(){
    console.log("-----------------------====")
    this.initTableData();
  },
  methods: {
    initTableData(){
      if (!this.value || Object.keys(this.value).some(n => isNaN(Number(n)))) {
        return
      }
      this.tableData = Object.entries(this.value).map(([percent, color]) => ({
        color,
        // key: UUID.uuid(),
        key: percent * 100,
        percent: percent * 100
      }));
      console.log("this.tableData",this.tableData)
    },
    removeRow: function () {
      
    }
  }
}
</script>

<style scoped>
.mapgis-ui-color-picker-dropdown-link{
  width: 88px;
  height: 32px;
  line-height: 32px;
  display: inline-block;
  vertical-align: middle;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  background: linear-gradient(to right, rgb(0, 0, 255) 25%, rgb(0, 255, 0) 55%, rgb(241, 241, 15) 85%, rgb(255, 0, 0) 100%);
}
</style>