import MapgisUiUpload from "../../../ui/src/components/upload/Upload.vue";
import '../../style/space.css';

export default {
  title: "界面/通用/普通上传",
  component: MapgisUiUpload,
  argTypes: {
    prefixCls: { table: { disable: true } },
    getPopupContainer: { table: { disable: true } },
    csp: { table: { disable: true } },
    locale: { table: { disable: true } },
    background: { table: { disable: true } },
    textColor: { table: { disable: true } },
    colorGroup: { table: { disable: true } },
    themeStyleChanged: { table: { disable: true } },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiUpload },
  data() {
    return {
      headers: {
        authorization: 'authorization-text',
      },
      fileList: [
        {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-2',
          name: 'yyy.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
    };
  },
  methods: {
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
  },
  template: `
  <div>
    <mapgis-ui-upload
      name="file"
      :multiple="true"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      :headers="headers"
      @change="handleChange"
    >
      <mapgis-ui-button> <mapgis-ui-iconfont type="mapgis-upload" /> Click to Upload </mapgis-ui-button>
    </mapgis-ui-upload>
    <mapgis-ui-upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      list-type="picture"
      :default-file-list="fileList"
    >
      <mapgis-ui-button> <mapgis-ui-iconfont type="mapgis-upload" /> upload </mapgis-ui-button>
    </mapgis-ui-upload>
  </div>`,
});

export const 基础使用 = Template.bind({});
基础使用.args = {};