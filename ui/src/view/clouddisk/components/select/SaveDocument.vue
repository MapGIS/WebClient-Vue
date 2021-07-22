<template>
  <div class="mapgis-ui-clouddisk-save-document">
    <mapgis-ui-row style="margin-bottom:24px;">
      <mapgis-ui-col :span="4">
        <span style="float:right;line-height:32px;">导出路径：</span>
      </mapgis-ui-col>
      <mapgis-ui-col :span="20">
        <mapgis-ui-input-search
          v-model="saveForm.saveUrl"
          read-only
          enter-button
          placeholder="请选择云盘路径"
          @search="handleSaveModal"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row style="margin-bttom:24px;">
      <mapgis-ui-col :span="4">
        <span style="float:right;line-height:32px;">文件名称：</span>
      </mapgis-ui-col>
      <mapgis-ui-col :span="20">
        <mapgis-ui-input :addon-after="fileType" v-model="saveForm.fileName" />
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-modal
      title="选择导出路径"
      class="modal-add-clouddisk"
      :width="800"
      :dialog-style="{ top: '180px' }"
      :visible="saveTree"
      @ok="handleFolderConfirm"
      @cancel="handleFolderCancel"
    >
      <mapgis-ui-clouddisk-layerselect ref="layerselect" :onlyFolder="true" :isLayers="false" @change="handleFolderChange"/>
    </mapgis-ui-modal>
  </div>
</template>

<script>
import {
  saveJsonFile
} from '../../axios/files'

export default {
  name: "mapgis-ui-clouddisk-savedocument",
  components: {
  },
  data() {
    return {
      saveForm: {
        saveUrl: '',
        fileName: ''
      },
      saveTree: false,
      temUrl: ''
      // form: this.$form.createForm(this, { name: 'save' }),
    };
  },
  props: {
    fileType: {
      type: String,
      default: '.style'
    },
    currentDocumentStr: {
      type: String,
      default: ''
    }
    // onlyFolder: {
    //   type: Boolean,
    //   default: false
    // },
    // curTiffUrl: {
    //   type: String,
    //   default: ""
    // },
    // tiffListsObj: {
    //   type: Object,
    //   default: () => {
    //     return {};
    //   }
    // },
    // currentDocument: Object,
    // isLayers: {
    //   type: Boolean,
    //   default: true
    // },
    // handleNewDocument: Function
  },
  watch: {
  },
  methods: {
    handleSaveDocument () {
      if (this.saveForm.saveUrl === '' || this.saveForm.fileName === '') {
        this.$notification.error({ message: '信息未填写完整', description: '请将所有项填写完整' })
        this.$emit('handleLoading', true)
        this.$nextTick(() => {
          this.$emit('handleLoading', false)
        })
      } else {
        let folderDir, fileName
        folderDir = this.saveForm.saveUrl
        fileName = this.saveForm.fileName + this.fileType
        let json = JSON.parse(this.currentDocumentStr)
        saveJsonFile(folderDir, fileName, json) // 自动将最新document以style为类型存回云盘
          .then(res => {
            if (res.status === 200) {
              let result = res.data
              let { errorCode, msg } = result
              if (errorCode < 0) {
                this.$notification.error({ message: errorCode, description: msg })
                this.$emit('handleLoading', true)
                this.$nextTick(() => {
                  this.$emit('handleLoading', false)
                })
              } else {
                this.$notification.success({ message: '保存成功！' })
                this.saveForm = {
                  saveUrl: '',
                  fileName: ''
                }
                this.$emit('closeDialog')
              }
            }
          })
          .catch(error => {
            this.$notification.error({ message: '网络异常,请检查链接', description: error })
            this.$emit('handleLoading', true)
            this.$nextTick(() => {
              this.$emit('handleLoading', false)
            })
          })
      }
    },
    handleSaveModal () {
      this.saveTree = true
    },
    handleFolderChange (url) {
      this.temUrl = url
    },
    handleFolderConfirm () {
      this.saveForm.saveUrl = this.temUrl
      this.saveTree = false
    },
    handleFolderCancel () {
      this.saveTree = false
      // this.saveForm.saveUrl = '' // 这里有待考虑
    }
  }
};
</script>

<style>
</style>
