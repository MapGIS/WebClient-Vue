<template>
  <div class="mapgis-ui-workflow-wrapper">
    <!-- <mapgis-ui-card
      class="model-params-dialog"
    > -->
      <!-- <p slot="title">
        <IconFont id="iconworkflow"></IconFont>
        {{title}}  
      </p>
      <Tag slot="extra" color="primary">{{id}}</Tag> -->
      <div class="switch-detail" v-show="detailButton">
        <span>显示高级参数</span>
        <mapgis-ui-switch size="small" v-model="isDetail" @change="switchParams" />
      </div>
      <div class="mapgis-ui-workflow-wrapper-modelTask" :style="{height:autoHeight}">
        <div
          v-for="(p, i) in list"
          :key="i"
        >
          <!-- <Col span="7"> -->
          <mapgis-ui-row>
            <!-- <Tag type="border" class="parmsLabel" >{{p.briefDescp}}：</Tag> -->
            <div type="border" class="mapgis-ui-workflow-wrapper-parmsName"  v-if="isDetail || p.need">
              <span v-show="p.need" style="color:red; font-size:15px;">*</span>
              {{handleParmsName(p)}}：
            </div>
          </mapgis-ui-row>
          <!-- </Col> -->
          <!-- <Col class="parmsInput" span="17"> -->
          <mapgis-ui-row>
            <div v-if="(p.dataType === 'GEOMETRY' && (isDetail || p.need) && p.direction.indexOf('IN') >= 0 && p.direction.indexOf('MULTI') < 0) && modelGroup!=='功能服务'">
              <mapgis-ui-input-search
                class="mapgis-ui-workflow-wrapper-parmsInputUrl"
                enter-button
                size="default"
                :value="p.valueShow || ''"
                :title="handleDescp(p)"
                @change="(v)=> handleString(v, i)"
                @search="() => handleTree(p, i)"
                @click="() => handleTree(p, i)"
              />
              <mapgis-ui-button size="default" class="mapgis-ui-workflow-wrapper-parmsButton" type="primary" icon="ellipsis" @click="setInputUrlParams(p, i)"></mapgis-ui-button>
            </div>
            <mapgis-ui-input-search
              class="mapgis-ui-workflow-wrapper-parmsCommon"
              v-else-if="(isTreeFolder(p) && (isDetail || p.need)) || (p.dataType === 'GEOMETRY' && (isDetail || p.need))"
              enter-button
              size="default"
              :value="handleInputTextShow(p)"
              :title="handleDescp(p)"
              @change="(v)=> handleString(v, i)"
              @search="() => handleTree(p, i)"
            />
            <mapgis-ui-select
              class="mapgis-ui-workflow-wrapper-parmsCommon"
              v-else-if="p.dataType === 'STRING' && (isDetail || p.need) && p.name === 'fields'"
              allowClear
              mode="multiple"
              size="default"
              :value="p.valueShow"
              :title="handleDescp(p)"
              @change="(v)=> handleSelectField(v, i)"
            >
              <mapgis-ui-select-option v-for="item in srcFieldsList" :value="item" :key="item">{{ item }}</mapgis-ui-select-option>
            </mapgis-ui-select>
            <mapgis-ui-input
              class="mapgis-ui-workflow-wrapper-parmsCommon"
              v-else-if="p.dataType === 'STRING' && (isDetail || p.need)"
              size="default"
              :value="p.value"
              :title="handleDescp(p)"
              :disabled="isOneMap && p.direction === 'OUT'"
              @change="(v)=> handleString(v, i)"
              @focus="handleShowModal(p, i)"
            />
            <mapgis-ui-select
              class="mapgis-ui-workflow-wrapper-parmsCommon"
              v-else-if="p.dataType === 'ENUM' && (isDetail || p.need)"
              allowClear
              size="default"
              :value="p.value"
              :title="handleDescp(p)"
              @change="(v)=> handleENum(v, i)"
            >
              <mapgis-ui-select-option v-for="item in p.defauleValue.split(',')" :value="item" :key="item">{{ item }}</mapgis-ui-select-option>
            </mapgis-ui-select>
            <mapgis-ui-input-number
              class="mapgis-ui-workflow-wrapper-parmsCommon"
              v-else-if="handleNumType(p) && (isDetail || p.need)"
              size="default"
              :value="getDefaultNumber(p)"
              :title="handleDescp(p)"
              @change="(v)=> handleNumber(v, i)"
            />
            <mapgis-ui-switch
              v-else-if="p.dataType === 'BOOLEAN' && (isDetail || p.need)"
              size="default"
              :checked="p.value"
              @change="(v)=> handleBoolean(v, i)"
            />
          <!-- </Col> -->
          </mapgis-ui-row>
        </div>
      </div>
    <!-- </mapgis-ui-card> -->
    <div style="background:#fff;" :style="buttonPosition">
      <mapgis-ui-button type="primary" style="margin:8px 18px 8px 0px;" :loading="showLoading" @click="() => {this.$emit('handleConfirm')}">执行分析</mapgis-ui-button>
      <mapgis-ui-button style="margin:8px 4px;" @click="() => {this.$emit('handleClearParams')}">清空数据</mapgis-ui-button>
    </div>
    <mapgis-ui-modal
      :closable="false"
      v-model="outputTree"
      width=65
      centered
      @ok="handleFolderConfirm"
      @cancel="handleFolderCancel"
    >
      <slot
        name="outputTree"
        :resetOutput="resetOutput"
        :isMulti="isMulti"
        :onlyFolder="onlyFolder"
        :handleFolderChange="handleFolderChange"
      >此处暂无业务逻辑</slot>
      <!-- <treefolder
        v-if="resetOutput"
        ref="treefolder"
        :isMulti="isMulti"
        :onlyFolder="onlyFolder"
        @change="handleFolderChange"
      /> -->
    </mapgis-ui-modal>
    <mapgis-ui-modal
      :closable="false"
      :maskClosable="false"
      v-model="inputTree"
      width=65
      centered
      destroyOnClose
      :confirmLoading="treeLoading"
      @ok="handleFolderConfirm"
      @cancel="handleFolderCancel"
    >
      <slot
        name="inputTree"
        :resetInput="resetInput"
        :isMulti="isMulti"
        :onlyFolder="onlyFolder"
        :handleFolderChange="handleFolderChange"
        :emitSelect="emitSelect"
        :emitSelectInfo="emitSelectInfo"
      >此处暂无业务逻辑</slot>
      <!-- <treefolder
        v-if="resetInput"
        ref="treefolder"
        :isMulti="isMulti"
        :onlyFolder="onlyFolder"
        @change="handleFolderChange"
        @emitSelect="emitSelect"
        @emitSelectInfo="emitSelectInfo"
      /> -->
      <!-- <div slot="footer" v-if="isMulti">
        <Button type="primary" @click="handleFolderConfirm">确认</Button>
      </div> -->
    </mapgis-ui-modal>
    <!-- <SrcUrlSetting :showParamsSetting="showParamsSetting" :currentUrlParams="currentUrlParams" @updataUrlParams="updataUrlParams" @updataSrcFields="updataSrcFields" @handleUrlClose="handleUrlClose"/> -->
    <!-- <statisticFields :showAddStaticFields="showAddStaticFields" :currentSummaryJson="currentSummaryJson" :currentSelectUrlParam="currentSelectUrlParam" @updataUrlParams="updataUrlParams" @handleClose="handleClose"/>     -->
    <!-- <AddJsonData :showAddJsonData="showAddJsonData" :currentSummaryJson="currentSummaryJson" :currentSelectUrlParam="currentSelectUrlParam" @updataUrlParams="updataUrlParams" @handleClose="handleClose"/> -->
    <!-- <AddExpression :showAddExpression="showAddExpression" :currentSummaryJson="currentSummaryJson" :currentSelectUrlParam="currentSelectUrlParam" @updataUrlParams="updataUrlParams" @handleClose="handleClose"/> -->
    <slot name="srcUrlSetting" :showParamsSetting="showParamsSetting" :currentUrlParams="currentUrlParams" :updataUrlParams="updataUrlParams" :updataSrcFields="updataSrcFields" :handleUrlClose="handleUrlClose"></slot>
    <slot name="statisticFields" :showAddStaticFields="showAddStaticFields" :currentSummaryJson="currentSummaryJson" :currentSelectUrlParam="currentSelectUrlParam" :updataUrlParams="updataUrlParams" :handleClose="handleClose"></slot>
    <slot name="addJsonData" :showAddJsonData="showAddJsonData" :currentSummaryJson="currentSummaryJson" :currentSelectUrlParam="currentSelectUrlParam" :updataUrlParams="updataUrlParams" :handleClose="handleClose"></slot>
    <slot name="addExpression" :showAddExpression="showAddExpression" :currentSummaryJson="currentSummaryJson" :currentSelectUrlParam="currentSelectUrlParam" :updataUrlParams="updataUrlParams" :handleClose="handleClose"></slot>
  </div>
</template>

<script>
// import treefolder from '../../components/treefolder'
// import statisticFields from './statisticFields'
// import AddJsonData from './addJsonData'
// import AddExpression from './addExpression'
// import SrcUrlSetting from './srcUrlSetting'
import { getGeoMetadata } from '../../axios/files.js'
// const EnumType = ['FLOAT', 'STRING', 'INT', 'BOOLEAN']
const EnumTree = ['srcInfo', 'srcInfo1', 'srcInfo2', 'desInfo', 'desInfo1', 'desInfo2']

export default {
  name: 'mapgis-ui-clouddisk-model-fields',
  components: {
    // treefolder
    // statisticFields,
    // AddJsonData,
    // AddExpression,
    // SrcUrlSetting
  },
  props: {
    title: String,
    params: Array,
    modelGroup: {
      type: String,
      default: ''
    },
    modelType: {
      type: String,
      default: ''
    },
    isOneMap: {
      type: Boolean,
      default: false
    },
    showLoading: {
      type: Boolean,
      default: false
    },
    detailButton: {
      type: Boolean,
      default: true
    },
    autoHeight: {
      type: String,
      default: 'calc(100vh - 240px)'
    },
    // oldFileGdbp: {
    //   type: String,
    //   default: ''
    // },
    handleParams: Function,
    getParmsData: Function
  },
  data () {
    return {
      list: this.params,
      inputTree: false,
      outputTree: false,
      resetOutput: false,
      resetInput: false,
      treeLoading: false,
      url: '',
      index: -1,
      temUrl: '',
      onlyFolder: false,
      isMulti: false,
      isDetail: true,
      selectsInfo: {},
      selectsListInfo: [],
      srcUrl: '',
      initSrcUrlParams: {
        srcUrl: null,
        gdbp: null,
        dbUrl: null,
        xmin: null,
        ymin: null,
        xmax: null,
        ymax: null,
        starTime: null,
        endTime: null,
        filter: {
          spatialCondition: {
            geoFormat: 'rect',
            geometry: null
          },
          attributeCondition: null
        },
        fields: null
      },
      tempSrcUrlParams: [], // 包含经修改之后的元数据
      defaultSrcUrlParams: [], // 包含图层原始元数据
      currentUrlParams: {},
      showParamsSetting: false,
      showAddJsonData: false,
      showAddStaticFields: false,
      showAddExpression: false,
      currentSummaryJson: {},
      currentSelectUrlParam: {},
      srcFieldsList: []
    }
  },
  watch: {
    // params (next) {
    //   this.list = next
    // },
    // list (next) {
    //   console.warn('【监控list】')
    // },
    params: {
      handler (next) {
        this.list = next
      },
      deep: true
    },
    // srcFieldsList () {
    //   this.list.forEach(item => {
    //     if (item.name === 'fields') {
    //       this.$set(item, 'value', undefined)
    //       this.$set(item, 'valueShow', [])
    //       this.updateParams()
    //     }
    //   })
    // },
    // modelType (next) {
    //   if (next === 'igs') {
    //     this.isDetail = true
    //   }
    // }
    // oldFileGdbp (next) {
    //   let selectFormat = {
    //     xattrs: {
    //       dataSource: next
    //     }
    //   }
    //   this.selectsInfo = selectFormat
    // }
  },
  mounted () {},
  computed: {
    buttonPosition () {
      if (this.isOneMap) {
        return 'text-align:right'
      }
      return 'text-align:center'
    }
  },
  methods: {
    handleTree (param, index) { // 'IN.URL'或'OUT.URL'或'IN.URL.MULTI'
      this.index = index
      if (param.direction.indexOf('MULTI') >= 0) { // 后台需要对‘多图层合并’和‘镶嵌数据集选择目录’加multi
        this.isMulti = true
      } else {
        this.isMulti = false
      }
      if (param.direction.indexOf('IN') >= 0) {
        this.onlyFolder = false
        this.inputTree = true
        this.resetInput = true
      } else if (param.direction.indexOf('OUT') >= 0) {
        this.onlyFolder = true
        this.outputTree = true
        this.resetOutput = true
      }
    },
    handleInputTextShow (param) {
      console.warn('获取param', param, this.inputTree)
      // if (this.inputTree) this.inputTree = false
      if (this.modelGroup === '功能服务' || this.modelType === 'igs') {
        return param.value
      } else {
        if (param.direction.indexOf('MULTI') < 0) {
          return param.value
        } else return param.valueShow
      }
    },
    isTreeFolder (param) {
      if (EnumTree.indexOf(param.name) >= 0 && !this.isOneMap) {
        return true
      }
      return false
    },
    clearParams () {
      this.list.forEach(l => {
        if (l.dataType === 'BOOLEAN') {
          l.value = false
        } else {
          l.value = ''
          l.valueShow = ''
        }
      })
    },
    updateParams () {
      if (this.handleParams) {
        this.handleParams(this.list)
      }
    },
    getIsDetail () {
      return this.isDetail
    },
    getDefaultNumber (p) {
      if (p.value !== undefined) {
        return p.value
      } else {
        return ''
      }
    },
    handleFolderChange (url) {
      this.temUrl = url
    },
    handleFolderConfirm () {
      if (this.onlyFolder) {
        let maDate = new Date()
        let dateTime
        let yy = maDate.getFullYear()
        let mm = parseInt(maDate.getMonth()) + 1 < 10 ? '0' + parseInt(maDate.getMonth() + 1) : parseInt(maDate.getMonth()) + 1
        let dd = maDate.getDate() < 10 ? '0' + maDate.getDate() : maDate.getDate()
        let hh = maDate.getHours() < 10 ? '0' + maDate.getHours() : maDate.getHours()
        let mf = maDate.getMinutes() < 10 ? '0' + maDate.getMinutes() : maDate.getMinutes()
        let ss = maDate.getSeconds() < 10 ? '0' + maDate.getSeconds() : maDate.getSeconds()
        // let ms = maDate.getMilliseconds() < 100 ? '000' : maDate.getMilliseconds()
        // dateTime = yy + '' + mm + '' + dd + '' + hh + '' + mf + '' + ss + '' + ms
        dateTime = yy + '' + mm + '' + dd + '' + hh + '' + mf + '' + ss
        if (this.temUrl.indexOf('/modelTask_') < 0) {
          this.temUrl = this.temUrl === '' ? '' : this.temUrl + '/modelTask_' + dateTime
        }
        this.list[this.index].value = this.temUrl
        // console.warn('mmmmmmmmm', this.list, this.selectsInfo)
        this.updateParams()
        this.outputTree = false
      } else {
        if (this.modelGroup === '功能服务' || this.modelType === 'igs') { // 镶嵌数据集，主要区分点
          this.list[this.index].value = this.temUrl
          // console.warn('aaaaaa', this.list, this.selectsInfo)
          this.updateParams()
          this.inputTree = false
        } else {
          if (!this.isMulti) { // 常用，单个图层选择
            this.handleInputUrlParams()
          } else { // 用于多图层合并
            // console.warn('多选', this.selectsListInfo)
            this.handleMultiInputUrlParams()
          }
        }
      }
    },
    emitSelectInfo (selects) {
      this.selectsListInfo = selects
      // console.warn('单选或多选时接收', selects)
    },
    handleFolderCancel () {
      this.outputTree = false
      this.inputTree = false
      // this.list[this.index].value = ''
      // this.list[this.index].valueShow = ''
      // this.updateParams()
    },
    handleInputUrlParams () {
      let self = this
      this.treeLoading = true
      if (this.selectsInfo.xattrs === undefined || this.selectsInfo.xattrs.dataSource === undefined || this.selectsInfo.xattrs.dataSource === '') {
        let notification = {
          message: '当前选择的图层文件有误！',
          description: '请重新选择已导入的图层文件！',
          onClick: function () {
            console.warn('错误日志：', notification)
          }
        }
        this.$notification.error(notification)
        this.treeLoading = false
        // this.$nextTick(() => {
        //   this.treeLoading = true
        // })
      } else {
        let gdbp = this.selectsInfo.xattrs.dataSource
        getGeoMetadata(gdbp)
          .then(res => {
            if (res.status === 200) {
              let result = res.data
              // console.warn('result', result)
              let { data, errorCode, msg } = result[0]
              if (errorCode < 0) {
                let notification = {
                  message: errorCode,
                  description: msg + ' 请重新选择已导入的图层文件！',
                  onClick: function () {
                    console.warn('错误日志：', notification)
                  }
                }
                this.$notification.error(notification)
                this.treeLoading = false
                // this.$nextTick(() => {
                //   this.treeLoading = true
                // })
              } else {
                this.list.forEach(l => { // 容差修正
                  if (l.name === 'rongcha') {
                    let rongcha = this.checkCrs(this.selectsInfo)
                    l.value = rongcha
                    this.updateParams()
                  }
                })
                this.srcFieldsList = this.getFieldsList(data.schema.fields)
                this.list.forEach(item => {
                  if (item.name === 'fields') {
                    this.$set(item, 'value', undefined)
                    this.$set(item, 'valueShow', [])
                    this.updateParams()
                  }
                })

                let srcUrlParams = [this.initSrcUrlParams]
                let range = data.geometry.spatialAttr
                srcUrlParams[0].srcUrl = this.selectsInfo.url
                srcUrlParams[0].gdbp = this.selectsInfo.xattrs.dataSource || ''
                srcUrlParams[0].xmin = range.xmin
                srcUrlParams[0].ymin = range.ymin
                srcUrlParams[0].xmax = range.xmax
                srcUrlParams[0].ymax = range.ymax
                srcUrlParams[0].fields = data.schema.fields
                srcUrlParams[0].filter.spatialCondition.geometry = []
                srcUrlParams[0].filter.attributeCondition = ''
                let srcUrlParamsStr = JSON.stringify(srcUrlParams)
                this.list[this.index].value = srcUrlParamsStr
                this.list[this.index].defaultSrcUrlParams = srcUrlParamsStr
                this.list[this.index].valueShow = this.selectsInfo.url
                // console.warn('结果', srcUrlParams, this.index, this.list)
                this.updateParams()
                self.inputTree = false
                self.treeLoading = false
              }
            }
          })
          .catch(error => {
            let notification = {
              message: '网络异常,请检查链接',
              description: error,
              onClick: function () {
                console.warn('错误日志：', error)
              }
            }
            this.$notification.error(notification)
            this.treeLoading = false
            // this.$nextTick(() => {
            //   this.treeLoading = true
            // })
          })
      }
    },
    handleMultiInputUrlParams () {
      this.treeLoading = true
      let flag = this.selectsListInfo.length > 0
      this.selectsListInfo.forEach(item => { // 检查所有勾选图层基本信息是否正确
        if (item.xattrs === undefined || item.xattrs.dataSource === undefined || item.xattrs.dataSource === '') {
          flag = false
        }
      })
      if (flag === false) {
        let notification = {
          message: '当前选择的图层文件有误！',
          description: '请重新选择已导入的图层文件！',
          onClick: function () {
            console.warn('错误日志：', notification)
          }
        }
        this.$notification.error(notification)
        this.treeLoading = false
        // this.$nextTick(() => {
        //   this.treeLoading = true
        // })
      } else {
        // console.warn('多选无误', this.selectsListInfo)
        // let gdbp1 = 'gdbp://cdgis02:cdgis02@cdgis02/cdgis02/sfcls/auto_161779027012'
        // let gdbp1 = this.selectsListInfo[0].xattrs.dataSource
        // let gdbp2 = this.selectsListInfo[1].xattrs.dataSource
        let allPromiseFuns = []
        this.selectsListInfo.forEach(item => {
          let promiseFun = this.getAllMetadata(item.xattrs.dataSource)
          allPromiseFuns.push(promiseFun)
        })
        Promise.all(allPromiseFuns)
          .then(res => {
            // console.warn('返回结果', res)
            let srcUrlParams = this.handleMultiUrl(res)
            // let srcUrlParams = []
            // res.forEach((item, index) => {
            //   let srcUrlParam = this.handleMultiUrl(item, index)
            //   srcUrlParams.push(srcUrlParam)
            // })
            let srcUrlParamsStr = JSON.stringify(srcUrlParams) // 汇总多个请求结果
            this.list[this.index].value = srcUrlParamsStr // 汇总多个请求结果

            let valueShowText = ''
            // console.warn('返回srcUrlParams', srcUrlParams)
            srcUrlParams.forEach(item => {
              valueShowText += item.srcUrl + ','
            })
            valueShowText = valueShowText.slice(0, -1)
            this.list[this.index].valueShow = valueShowText // 汇总多个请求结果

            this.updateParams()
            this.inputTree = false
          })
          .catch(err => {
            let notification = {
              message: '网络异常,请检查链接',
              description: err,
              onClick: function () {
                console.warn('错误日志：', err)
              }
            }
            this.$notification.error(notification)
            this.treeLoading = false
            // this.$nextTick(() => {
            //   this.treeLoading = true
            // })
          })
      }
    },
    getAllMetadata (gdbp) {
      return new Promise((resolve, reject) => {
        getGeoMetadata(gdbp)
          .then(res => {
            if (res.status === 200) {
              let result = res.data
              console.warn('result', result)
              let { data, errorCode, msg } = result[0]
              if (errorCode < 0) {
                let errorText = { title: errorCode, desc: msg + ' 请重新选择已导入的图层文件！' }
                reject(errorText)
              } else {
                resolve(data)
              }
            }
          })
          .catch(err => {
            let errorText = { title: '网络异常,请检查链接', desc: err }
            reject(errorText)
          })
      })
    },
    handleMultiUrl (items) {
      // let defaultUrlParamObj = this.initSrcUrlParams
      if (items.length <= 0) return []
      let result = []
      items.forEach((item, index) => {
        if (item === null) return null
        // console.warn('拿到结果', item, index, this.selectsListInfo)
        let srcUrlRes = {
          srcUrl: null,
          gdbp: null,
          dbUrl: null,
          xmin: null,
          ymin: null,
          xmax: null,
          ymax: null,
          starTime: null,
          endTime: null,
          filter: {
            spatialCondition: {
              geoFormat: 'rect',
              geometry: null
            },
            attributeCondition: null
          },
          fields: null
        }
        let range = item.geometry.spatialAttr
        srcUrlRes.srcUrl = this.selectsListInfo[index].url
        // console.warn('拿到srcUrl', srcUrlRes.srcUrl)
        srcUrlRes.gdbp = this.selectsListInfo[index].xattrs.dataSource || ''
        srcUrlRes.xmin = range.xmin
        srcUrlRes.ymin = range.ymin
        srcUrlRes.xmax = range.xmax
        srcUrlRes.ymax = range.ymax
        srcUrlRes.fields = item.schema.fields
        srcUrlRes.filter.spatialCondition.geometry = []
        srcUrlRes.filter.attributeCondition = ''
        // console.warn('拿到src数组', srcUrlRes)
        // result.push(srcUrlRes)
        result[index] = srcUrlRes
      })
      return result
    },
    setInputUrlParams (params, index) {
      this.index = index
      this.currentUrlParams = params
      // console.warn('AAAA', this.currentUrlParams)
      this.showParamsSetting = this.currentUrlParams.defaultSrcUrlParams !== undefined && this.currentUrlParams.defaultSrcUrlParams !== null
    },
    updataUrlParams (urlParams) {
      this.list[this.index].value = urlParams
      // console.warn('sssssssss', this.list, urlParams)
      this.updateParams()
    },
    updataSrcFields (fields) {
      // console.warn('调子组件获取字段列表', fields)
      this.srcFieldsList = this.getFieldsList(fields)
    },
    // updataGroupFields (value) {
    //   let vm = this
    //   console.warn('获取字段列表1', value)
    //   setTimeout(value => {
    //     console.warn('获取字段列表2', value, vm.list)
    //     let valueShow = value.split(',')
    //     vm.list.forEach(item => {
    //       if (item.name === 'fields') {
    //         console.warn('进来改', value)
    //         vm.$set(item, 'value', value)
    //         vm.$set(item, 'valueShow', valueShow)
    //         vm.updateParams()
    //       }
    //     })
    //   }, 5000, value)
    // },
    handleString (e, index) {
      this.list[index].value = e.target.value
      this.updateParams()
      this.$forceUpdate()
    },
    handleNumber (value, index) {
      this.list[index].value = value
      this.updateParams()
      this.$forceUpdate()
    },
    handleENum (value, index) {
      this.list[index].value = value
      this.updateParams()
      this.$forceUpdate()
    },
    handleSelectField (value, index) {
      if (value.length > 0) {
        let fieldValue = ''
        value.forEach(item => {
          fieldValue += item + ','
        })
        fieldValue = fieldValue.slice(0, -1)
        this.list[index].valueShow = value
        // console.warn('dayin ziduan', value)
        this.list[index].value = fieldValue
        this.updateParams()
      } else {
        this.list[index].valueShow = []
        this.list[index].value = undefined
        this.updateParams()
      }
      this.$forceUpdate()
    },
    handleBoolean (value, index) {
      this.list[index].value = value
      this.updateParams()
      this.$forceUpdate()
    },
    handleParmsName (p) {
      let parmsName = ' '
      parmsName += p.briefDescp === ('' || null) ? p.name : p.briefDescp
      return parmsName
    },
    handleNumType (p) {
      return p.dataType === 'BINARY' || p.dataType === 'BYTE' || p.dataType === 'SHORT' ||
        p.dataType === 'INT' || p.dataType === 'LONG' || p.dataType === 'FLOAT' || p.dataType === 'DOUBLE'
    },
    handleDescp (p) {
      let res = ''
      if (p.descp !== null && p.descp !== '') {
        res = res + '说明：' + p.descp + '\n'
      }
      if (p.example !== null && p.example !== '') {
        res += '示例：' + p.example
      }
      return res
    },
    switchParams () {
      this.updateParams()
    },
    emitSelect (select) {
      this.selectsInfo = select
    },
    checkCrs (selectsInfo) {
      let result = 0.0001
      if (selectsInfo.xattrs && selectsInfo.xattrs.vclsinfo && selectsInfo.xattrs.vclsinfo && selectsInfo.xattrs.vclsinfo.range) {
        let range = selectsInfo.xattrs.vclsinfo.range
        if (range.xmin >= -180 && range.xmax <= 180 && range.ymin >= -90 && range.ymax <= 90) {
          result = 0.000000001
        }
      }
      return result
    },
    handleShowModal (params, index) {
      this.index = index
      this.currentSummaryJson = params
      // console.warn('查看一些值', this.currentSummaryJson)
      let paramsData = {}
      // let url = ''
      if (this.getParmsData) {
        paramsData = this.getParmsData()
        if (params.name === 'summaryJson' || params.name === 'statisticFields' || params.name === 'expression') {
          let urlList = this.getSrcUrlList(paramsData, this.list)
          if (urlList.length > 0) {
            this.currentSelectUrlParam = urlList[urlList.length - 1]
            this.showAddJsonData = params.name === 'summaryJson'
            this.showAddStaticFields = params.name === 'statisticFields'
            this.showAddExpression = params.name === 'expression'
          }
        }
      }
      // if (params.name === 'summaryJson') {
      //   // this.showAddJsonData = true // 等会删掉
      //   let paramsData = {}
      //   // let url = ''
      //   if (this.getParmsData) {
      //     paramsData = this.getParmsData() // 此方法也需要logs.vue传props
      //     let urlList = this.getSrcUrlList(paramsData, this.list)
      //     console.warn('查', urlList)
      //     if (urlList.length > 0) {
      //       this.showAddJsonData = true
      //       this.currentSelectUrlParam = urlList[urlList.length - 1]
      //       console.warn('看', this.currentSelectUrlParam)
      //     }
      //   }
      // }
    },
    getSrcUrlList (inputParams, paramsList) { // 获取当前已填写的输入图层列表
      if (inputParams === {}) {
        return []
      }
      let resultList = []
      let flag = true
      for (let key in inputParams) {
        paramsList.forEach(item => {
          if (key === item.name && item.direction !== null) {
            let index = item.direction.indexOf('IN')
            if (index >= 0) {
              if (inputParams[key] !== undefined && inputParams[key] !== '') {
                let temSrcUrl = {}
                temSrcUrl[key] = inputParams[key]
                resultList.push(temSrcUrl)
              } else {
                let notification = {
                  message: '无法获取图层字段信息！！！',
                  description: '请确认是否填写图层信息',
                  onClick: function () {
                    console.warn('错误日志：', notification)
                  }
                }
                this.$notification.error(notification)
                flag = false
              }
            }
          }
        })
      }
      if (flag) {
        if (resultList.length <= 0) {
          let notification = {
            message: '无法获取图层字段信息！！！',
            description: '请确认是否填写图层信息',
            onClick: function () {
              console.warn('错误日志：', notification)
            }
          }
          this.$notification.error(notification)
        }
        return resultList
      } else return []
    },
    getFieldsList (fields) {
      let result = []
      fields.forEach(item => {
        result.push(item.name)
      })
      return result
    },
    handleClose () {
      this.showAddJsonData = false
      this.showAddStaticFields = false
      this.showAddExpression = false
    },
    handleUrlClose () {
      this.showParamsSetting = false
    }
  }
}
</script>

<!-- <style lang="scss">
.workflow-wrapper {
  text-align: left;
  .mapgis-ui-card-body {
    padding: 0px 16px 10px 16px;
  }
  .switch-detail {
    text-align: right;
    margin: 5px 0px;
  }
  .ivu-tag {
    margin: 0px 4px 4px 0;
  }
}
.parmsName {
 text-align: left;
 width: 100%;
 padding: 5px 0 8px 0;
//  font-weight: bold;
}
.parmsInput {
  padding: 0px 5px;
}
.parmsButton {
  // width: 40px;
  margin-left: 5px; 
  float: left;
}
.parmsInputUrl {
  width: calc(100% - 40px);
  float: left;
}
.parmsCommon {
  width: calc(100% - 4px);
  float: left;
}
.modelTask {
  height: calc(100vh - 240px);
  overflow-y: scroll;
}
</style> -->
