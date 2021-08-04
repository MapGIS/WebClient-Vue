<template>
  <div class="mapgis-ui-portal-dataresource">
    <mapgis-ui-table
      :columns="columns"
      :data-source="resourceData"
      :pagination="pagination"
      :loading="loading"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
      size="small"
      @change="handleTableChange"
    >
    </mapgis-ui-table>
    <mapgis-ui-clouddisk-transform ref="layerTransform" :selectLists="selectLists" :currentDocument="currentDocument" :handleNewDocument="handleNewDocument" @closeDialog="closeDialog"/>
  </div>
</template>

<script>
import MapgisUiClouddiskTransform from "../../../clouddisk/components/select/LayerTransform";
import { getPortalData } from "../../../clouddisk/axios/portal";

const columns = [
  {
    title: '数据名称',
    dataIndex: 'title',
    width: '40%',
    ellipsis: true,
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
  },
  {
    title: '来源',
    dataIndex: 'ownerName',
  },
]

export default {
  name: "mapgis-ui-portal-dataresource",
  components: {
    MapgisUiClouddiskTransform
  },
  data() {
    return {
      resourceData: [],
      pagination: {
        current: 1,
        pageSize: 5
      },
      loading: false,
      columns,
      selectedRowKeys: [],
      selectLists: []
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentDocument: {
      type: Object,
      default: () => {
        return {}
      }
    },
    handleNewDocument: Function
  },
  watch: {
    visible (next) {
      if (next) {
        this.queryData(this.pagination)
      }
    }
  },
  mounted() {
    this.queryData(this.pagination)
  },
  methods: {
    queryData (pagination) {
      console.warn('当前分页数据', pagination)
      let vm = this
      this.loading = true
      getPortalData(1, pagination.current - 1, pagination.pageSize)
        .then(res => {
          if (res.status === 200) {
            let result = res.data
            const pagination = { ...vm.pagination }
            // pagination.total = 20
            pagination.total = result.total
            vm.pagination = pagination
            let resultData = result.list
            resultData.forEach(item => {
              item.createTime = vm.formatTime(item.createTime)
              item.key = item.id
            })
            vm.resourceData = resultData
            vm.loading = false
          }
        })
        .catch(error => {
          vm.$notification.error({ message: "网络异常,请检查链接", description: error })
          vm.loading = false
        })
    },
    handleTableChange(pagination) {
      console.log(pagination)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.queryData({
        pageSize: pagination.pageSize,
        current: pagination.current,
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.warn('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
      this.selectedRowKeys = selectedRowKeys
      let tmpSelect = []
      selectedRows.forEach(item => {
        tmpSelect.push(item.detail)
      })
      console.warn('选择列表', tmpSelect)
      this.selectLists = tmpSelect
    },
    handleAddDataresource () { // 改函数名
      this.$refs.layerTransform.addLayer()
    },
    formatTime (timestamp) {
      let time = new Date(timestamp)
      let dateTime
      let yy = time.getFullYear()
      let mm = parseInt(time.getMonth()) + 1 < 10 ? '0' + parseInt(time.getMonth() + 1) : parseInt(time.getMonth()) + 1
      let dd = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
      let hh = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
      let mf = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
      let ss = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
      // let ms = time.getMilliseconds() < 100 ? '000' : time.getMilliseconds()
      // dateTime = yy + '' + mm + '' + dd + '' + hh + '' + mf + '' + ss + '' + ms
      dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      return dateTime
    },
    closeDialog () {
      this.$emit('closeDialog') // 关闭从门户选择数据的对话框
    }
  }
};
</script>

<style>
.mapgis-ui-portal-dataresource {
}
</style>
