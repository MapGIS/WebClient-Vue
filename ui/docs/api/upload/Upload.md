# 云盘上传组件
> mapgis-ui-upload-modal

## 基本使用

``` vue
<template>
  <mapgis-ui-upload-modal
    title="通过文件添加" // 对话框标题
    :width="600"
    :show="visible"
    :confirm-loading="confirmLoading"
    :currentDocument="currentDocument"
    :handleNewDocument="handleNewDocument"
    @ok="handleOk"
    @cancel="handleCancel"
  >
  </mapgis-ui-upload-modal>
</template>

<script>
export default {
  name: "mapgis-modal-add-file",
  data() {
    return {
      visible: false,
      confirmLoading: false,
    };
  },
  watch: {
    "$store.state.modal.addfile": function(visible) {
      this.visible = visible;
    },
  },
  computed: {
    currentDocument () {
      return this.$store.state.document;
    }
  },
  mounted() {},
  methods: {
    handleOk(e) {
      this.closeDialog();
    },
    handleCancel(e) {
      this.closeDialog();
    },
    closeDialog() {
      this.visible = false
    },
    handleNewDocument (payload) {
      // console.warn('得到新document信息：', payload.document)
      this.$store.commit("DOCUMENT_SET_DOCUMENT", payload.document);
    },
  },
};
</script>
```

## LocalStorage 需求
|key|value|备注|
|:---|:---|---|
|mapgis_clouddisk_group_path|f79ae7b1-8dca-4d37-bd87-14834b1cbf2e|云盘的根路径|
|mapgis_clouddisk_token|eyJhbGciOiJIUzUxMiJ9......|用户token|
|mapgis_clouddisk_http|http|上传服务|
|mapgis_clouddisk_ip|192.168.199.53|上传服务|
|mapgis_clouddisk_socket|9011|上传服务|


