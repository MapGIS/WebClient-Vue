import MapgisUiClouddiskModelFields from "../../../ui/src/view/clouddisk/components//model/Fields.vue";
import { modelMockData } from "./util/mockData"

export default {
  title: "界面/业务组件/云盘-模型界面",
  component: MapgisUiClouddiskModelFields,
  argTypes: {

  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiClouddiskModelFields },
  data() {
    return {
      open: false,
      modelName: 'createBuffer',
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      params: [],
      modelid: -1,
      modelname: '',
      modelType: '',
      modelGroup: '',
      hackReset: true,
      data: {},
      flag: true, // flag为false时表示必填项未填写完整
      allBlank: true, // allBlank为true时表示一项都没填
    };
  },
  mounted () {
    this.onModelChange()
  },
  methods: {
    onModelChange () {
      console.warn('【打印】', modelMockData)
      this.params = modelMockData[this.modelName].params
      this.modelid = modelMockData[this.modelName].id
      this.modelname = modelMockData[this.modelName].name
      this.modelType = modelMockData[this.modelName].modelType
      this.modelGroup = modelMockData[this.modelName].group
      this.open = true
    },
    handleParams (params) {
      let isDetail = this.$refs.fieldsData.getIsDetail()
      this.allBlank = false
      this.flag = true
      this.data = {}
      if (params.length === 0) {
        this.flag = false
      } else {
        if (!isDetail) {
          params = params.filter(p => {
            if (p.need) {
              return p
            } else if (p.name === 'rtnUrlUserName' || p.name === 'rtnUrlPasswd' || p.name === 'outputurl') {
              p.value = ''
              return p
            }
          })
        }
        params.forEach(p => {
          this.data[p.name] = p.value
          if (p.need && (this.data[p.name] === undefined || this.data[p.name] === null || this.data[p.name] === '')) {
            this.flag = false
          }
        })
      }
    },
    getParmsData () {
      return this.data
    },
    handleConfirm () {
      const { modelid, data, flag, allBlank } = this
      console.warn(modelid, data, flag, allBlank)
    },
    handleClearParams () {
      this.$refs.fieldsData.clearParams()
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
      this.allBlank = true
      this.flag = true
    },
  },
  template: `
  <div>
    <div>
      <mapgis-ui-radio-group v-model="modelName" @change="onModelChange">
        <mapgis-ui-radio :style="radioStyle" :value="'createBuffer'">
          大数据——创建缓冲分析
        </mapgis-ui-radio>
        <mapgis-ui-radio :style="radioStyle" :value="'overlaySummary'">
          大数据——叠加分析
        </mapgis-ui-radio>
        <mapgis-ui-radio :style="radioStyle" :value="'igsBuffer'">
          igs——类缓存分析（单圈）
        </mapgis-ui-radio>
      </mapgis-ui-radio-group>
    </div>
    <div>
      <mapgis-ui-card v-if="open">
        <mapgis-ui-clouddisk-model-fields
          ref="fieldsData"
          v-if="hackReset"
          :title="modelname"
          :id="modelid"
          :params="params"
          :modelGroup="modelGroup"
          :modelType="modelType"
          :handleParams="handleParams"
          :getParmsData="getParmsData"
          @handleConfirm="handleConfirm"
          @handleClearParams="handleClearParams"
        >
        </mapgis-ui-clouddisk-model-fields>
      </mapgis-ui-card>
    </div>
  </div>
  `,
});

export const 模型参数界面 = Template.bind({});
模型参数界面.args = {};
