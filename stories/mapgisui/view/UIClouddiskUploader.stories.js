import MapgisUiClouddiskGlobalUploader from "../../../ui/src/view/clouddisk/components/upload/GlobalUploader.vue";
import MapgisUiClouddiskUploaderModal from "../../../ui/src/view/clouddisk/components/upload/UploaderModal.vue";
import MarkDown from "../../../ui/docs/api/upload/Upload.md";

export default {
  title: "界面/业务组件/云盘-上传",
  component: MapgisUiClouddiskUploaderModal,
  argTypes: {
    'v-model': { table: { disable: true } },
    ok: { table: { disable: true } },
    cancel: { table: { disable: true } },
    change: { table: { disable: true } },
    isMapstudio: { table: { disable: true } },
    currentDocument: { table: { disable: true } },
    handleNewDocument: { table: { disable: true } },
    show: { table: { disable: true } }, // 不在表中显示
    defaultPath: {
      description: '选取默认上传路径',
      control: false, // 不可填写
    },
    title: {
      description: '对话框标题',
    },
    width: {
      description: '对话框宽度',
    },
    handleUploaded: {
      description: '上传完成时的回调',
    },
    // moda: {
    //   name: 'modb', // 显示名称
    //   description: '参数', // 描述
    //   type: {
    //     required: true, // 是否必填
    //     summary: 'boolean', // 类型
    //     detail: 'Something really really long' // 补充说明
    //   },
    //   defaultValue: {
    //     summary: 'vertical', // 默认值
    //     detail: 'Something really really long' // 补充说明
    //   },
    //   control: {
    //     type: 'boolean' // 类型
    //   },
    // },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    MapgisUiClouddiskGlobalUploader,
    MapgisUiClouddiskUploaderModal
  },
  data() {
    return {
      show: false,
      uploadCount: 0,
      clouddiskParam: {
        mapgis_clouddisk_http: 'http', // 这些值在实际应用中需要通过调接口的方式获取
        mapgis_clouddisk_ip: '192.168.199.53',
        mapgis_clouddisk_socket: '9011',
        mapgis_clouddisk_group_path: 'f79ae7b1-8dca-4d37-bd87-14834b1cbf2e',
        mapgis_clouddisk_token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjMyOTk0OTUzLCJ1c2VyX0lkIjoiNiJ9.3hH7UDM-T1io9gmKafJAng1o4D2T_L7ainHlJeAIg0hep5V9cn--G0B-xTH6rW9XjLR6h-3dVsu_InccXNW0xA',
        mapgis_clouddisk_id: 6
      }
    };
  },
  methods: {
    openModal () {
      this.show = true
    },
    handleCancel () {
      // 可在此时更新状态
      this.show = false
    },
    handleUploaded () {
      // 本次上传完成，可在此时更新状态
      console.warn('上传完成！')
      this.uploadCount++
    }
  },
  template: `
    <div>
      <keep-alive>
        <mapgis-ui-global-uploader
          :clearParam="true"
          :clouddiskParam="clouddiskParam"/>
      </keep-alive>
      <p>上传个数：{{uploadCount}}</p>
      <mapgis-ui-button @click="openModal">点击打开上传对话框</mapgis-ui-button>
      <mapgis-ui-upload-modal
        :show="show"
        :title="title"
        :width="width"
        :handleUploaded="handleUploaded"
        @cancel="handleCancel"
      >
      </mapgis-ui-upload-modal>
    </div>
  `,
});

export const 基本上传 = Template.bind({});

基本上传.args = {
  title: '通过文件添加',
  width: 800
};

基本上传.parameters = {
  // docs: {
  //   description: {
  //     component: MarkDown,
  //   },
  // },
};
