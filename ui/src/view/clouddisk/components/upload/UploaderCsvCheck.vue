<template>
  <div style="text-align:center;">
    <mapgis-ui-spin :spinning="spinning" tip="Loading..." style="">
      <span v-if="!spinning && !isUploadComplete">{{uploadErrorMsgText}}</span>
      <div v-if="!spinning && isUploadComplete" style="text-align:left;">
        <mapgis-ui-form-model layout="inline" :model="formCheck" style="margin-bottom: 10px;">
          <mapgis-ui-form-model-item label="坐标系">
            <!-- <mapgis-ui-input v-model="formCheck.sref" placeholder="请选择源文件坐标" /> -->
            <mapgis-ui-select v-model="formCheck.sref" placeholder="请选择源文件坐标" style="width: 155px">
              <mapgis-ui-select-option value="EPSG:4326">
                经纬度
              </mapgis-ui-select-option>
              <mapgis-ui-select-option value="EPSG:3857">
                Web墨卡托
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-form-model-item>
          <mapgis-ui-form-model-item label="经度字段(X)">
            <!-- <mapgis-ui-input v-model="formCheck.xfield" placeholder="请选择经度字段" /> -->
            <mapgis-ui-select v-model="formCheck.xfield" placeholder="请选择经度字段" style="width: 155px">
              <mapgis-ui-select-option v-for="field in columns" :key="field.dataIndex" :value="field.title" >
                {{field.title}}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-form-model-item>
          <mapgis-ui-form-model-item label="纬度字段(Y)">
            <!-- <mapgis-ui-input v-model="formCheck.yfield" placeholder="请选择纬度字段" /> -->
            <mapgis-ui-select v-model="formCheck.yfield" placeholder="请选择纬度字段" style="width: 155px">
              <mapgis-ui-select-option v-for="field in columns" :key="field.dataIndex" :value="field.title" >
                {{field.title}}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-form-model-item>
          <mapgis-ui-form-model-item label="文件编码格式">
            <!-- <mapgis-ui-input v-model="formCheck.charset" placeholder="请选择编码格式" /> -->
            <mapgis-ui-select v-model="formCheck.charset" placeholder="请选择编码格式" style="width: 155px">
              <mapgis-ui-select-option value="GBK">
                GBK
              </mapgis-ui-select-option>
              <mapgis-ui-select-option value="UTF-8">
                UTF-8
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-form-model-item>
          <mapgis-ui-form-model-item label="分隔符">
            <!-- <mapgis-ui-input v-model="formCheck.separator" placeholder="请输入分隔符" style="width: 155px"/> -->
            <mapgis-ui-select v-model="formCheck.separator" placeholder="请选择分隔符" style="width: 155px">
              <mapgis-ui-select-option value="44">
                逗号
              </mapgis-ui-select-option>
              <mapgis-ui-select-option value="9">
                水平制表符
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-form-model-item>
        </mapgis-ui-form-model>
        <p style="color:#999999;">若表格显示异常（乱码或格式不对），请调整编码格式和分隔符</p>
        <mapgis-ui-table :columns="columns" :data-source="tableData" bordered :scroll="{ x: 1500, y: 300 }" :pagination="false">
        </mapgis-ui-table>
      </div>
    </mapgis-ui-spin>
  </div>
</template>

<script>
import { getCSVTableData } from "../../axios/files";
import { uuid } from '../../util/uuid';
import UploadMixin from "../../../../mixin/UploaderMixin";
import { changeUploadWebsocketTaskId } from "../../../../util/emit/upload";



export default {
  name: 'importCSVCheck',
  mixins: [UploadMixin],
  props: {
    curImportUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      spinning: true,
      srcUrl: '',
      formCheck: {
        sref: 'EPSG:4326',
        xfield: '',
        yfield: '',
        charset: 'GBK',
        separator: '44'
      },
      columns: [],
      tableData: [],
      isUploadComplete: true,
      uploadErrorMsgText: ''
    }
  },
  watch: {
    csvUploadComplete(next) {
      if (next) {
        this.srcUrl = this.curImportUrl + '/' + this.fileName
        this.getTableData(this.srcUrl)
        this.spinning = false
      }
    },
    'formCheck.charset': function () {
      this.getTableData()
    },
    'formCheck.separator': function () {
      this.getTableData()
    },
    uploadError(next) {
      if (next) {
        this.isUploadComplete = false
        this.uploadErrorMsgText = '文件上传失败！' + this.uploadErrorMsg
        this.spinning = false
      }
    }
    // formCheck: {
    //   deep: true,
    //   handler () {
    //   }
    // }
  },
  mounted () {
    // this.getTableData()
  },
  computed: {
  },
  methods: {
    getTableData (url) {
      url = url || this.srcUrl
      // let srcUrl = '88da6297-1449-4099-aa6e-3dda06c10881/ws/csv测试/测试1带坐标.csv'
      let charset = this.formCheck.charset
      let separator = this.formCheck.separator
      getCSVTableData(url, charset, separator)
        .then(res => {
          if (res.status === 200) {
            let result = res.data
            let { errorCode, msg } = result
            if (errorCode < 0) {
              this.$Notice.error({ title: errorCode, desc: msg })
            } else {
              // console.warn('获取结果', result)
              let csvHeader = result.data.header
              let csvData = result.data.data
              if (csvHeader.length > 0) {
                this.setColumns(csvHeader)
                this.setTableData(csvData)
              }
              this.spinning = false
            }
          }
        })
        .catch(error => {
          this.$Notice.error({ title: '网络异常,请检查链接', desc: error })
        })
    },
    setColumns (header) {
      let csvColumns = []
      for (let i = 0; i < header.length; i++) {
        let field = {
          dataIndex: 'Field' + i, // 统一用Field+数字表示key值
          title: header[i],
          width: 150
        }
        csvColumns.push(field)
      }
      // console.warn('最后打印csvColumns', csvColumns)
      this.columns = csvColumns
    },
    setTableData (data) {
      let csvTableData = []
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          // console.warn('打印data[i]', data[i])
          let fieldDatas = data[i]
          let fieldData = {
            key: '' + i
          }
          for (let j = 0; j < fieldDatas.length; j++) {
            let tmp = 'Field' + j // 统一用Field+数字表示key值
            fieldData[tmp] = fieldDatas[j]
          }
          // console.warn('打印fieldData', fieldData)
          csvTableData.push(fieldData)
        }
        // console.warn('最后打印csvTableData', csvTableData)
        this.tableData = csvTableData
      }
    },
    getCsvParams () {
      let taskid = uuid()
      let result = this.formCheck
      result.srcUrl = this.srcUrl
      result.destPath = this.curImportUrl
      result.taskid = taskid
      // this.$store.commit('handleWebSocketTaskId', {
      //   webSocketTaskId: taskid
      // })
      changeUploadWebsocketTaskId({
        webSocketTaskId: taskid // 维护最新的taskid
      })
      console.log('【本次导入对应taskid】', taskid)
      return result
    }
  },
  destroyed () {
  }
}
</script>

<style scoped>
/* .spin-content {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 30px;
} */

.path {
  width: 45vw;
  height: 40px;
  background: #F2F5FA;
  margin:0 auto;
}
.path-text {
  display: inline-block;
  max-width: calc(45vw - 150px);
  line-height:40px;
  margin-left: 10px; 
  color:#3D4757;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.upload-progress {
  margin: 40px 0 66px 0;
}
</style>