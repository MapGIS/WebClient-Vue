<template>
  <div class="mapgis-ui-portal-serviceresource">
    <!-- <mapgis-ui-table
      :columns="columns"
      :data-source="resourceData"
      :pagination="pagination"
      :loading="loading"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
      size="small"
      @change="handleTableChange"
    >
    </mapgis-ui-table> -->
    <p>未完成</p>
  </div>
</template>

<script>
// import { getPortalResource } from "../../../clouddisk/axios/portal";

// const columns = [
//   {
//     title: '数据名称',
//     dataIndex: 'title',
//     width: '40%',
//     ellipsis: true,
//   },
//   {
//     title: '发布时间',
//     dataIndex: 'createTime',
//   },
//   {
//     title: '来源',
//     dataIndex: 'ownerName',
//   },
// ]

export default {
  name: "mapgis-ui-portal-serviceresource",
  components: {
  },
  data() {
    return {
      // resourceData: [],
      // pagination: {
      //   current: 1,
      //   pageSize: 5
      // },
      // loading: false,
      // columns,
      // selectedRowKeys: [],
      // selectLists: []
    };
  },
  props: {
    // visible: {
    //   type: Boolean,
    //   default: false
    // },
    // currentDocument: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // },
    // handleNewDocument: Function
  },
  watch: {
    // visible (next) {
    //   if (next) {
    //     this.queryData(this.pagination)
    //   }
    // }
  },
  mounted() {
    // this.queryData(this.pagination)
  },
  methods: {
  }
};
</script>

<style>
.mapgis-ui-portal-serviceresource {
}
</style>
