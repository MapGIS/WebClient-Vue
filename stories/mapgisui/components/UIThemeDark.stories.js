import { setTheme } from "../../../ui/src/util/style/theme/set-theme";

export default {
  title: "界面/黑暗主题",
  parameters: {
    viewMode: "story",
    previewTabs: {
      canvas: {
        hidden: false,
      },
    },
  },
};

const Template = (args, { argTypes }) => ({
  data() {
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      mockData.push({
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        disabled: i % 3 < 1,
      });
    }

    const oriTargetKeys = mockData
      .filter((item) => +item.key % 3 > 1)
      .map((item) => item.key);
    return {
      inputValue: 3,
      switch1: true,
      checked1: true,
      select1: "lucy",
      time1: null,
      radio1: "d",
      modalVisible: false,
      mockData,
      targetKeys: oriTargetKeys,
      selectedKeys: ["1", "4"],
    };
  },
  methods: {
    setCustomTheme(theme) {
      this.theme = theme;
      setTheme(theme);
    },
    success() {
      this.$message.success("This is a success message");
    },
    error() {
      this.$message.error("This is an error message");
    },
    warning() {
      this.$message.warning("This is a warning message");
    },
    info() {
      this.$message.info("This is a info message");
    },
    showModal() {
      this.modalVisible = true;
    },
    hideModal() {
      this.modalVisible = false;
    },
    confirm() {
      this.$confirm({
        title: "Confirm",
        content: "Bla bla ...",
        okText: "confirm",
        cancelText: "cancel",
      });
    },
    handleTransferChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys;
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
    },
    clearStyle() {
      if (this.theme !== 'dark') {
        this.setCustomTheme('dark');
      }
    },
  },
  template: `<div>
    <div style="margin-bottom: 15px;">
      <mapgis-ui-button :type="theme === 'dark' ? 'primary' : 'default'" @click="setCustomTheme('dark')">黑暗主题</mapgis-ui-button>
      <mapgis-ui-button :type="theme === 'light' ? 'primary' : 'default'" @click="setCustomTheme('light')">浅色主题</mapgis-ui-button>
    </div>
    <div style="display: flex;flex-direction: column; margin-bottom: 15px;">
      <div style="display: flex; align-items: center; margin-bottom: 15px;"><label style="width: 35%; text-align: right; padding-right: 8px;">{{ ('basicComponent.avatar.title') }}：</label><mapgis-ui-avatar icon="user" /></div>
      <div style="display: flex; align-items: center; margin-bottom: 15px;"><label style="width: 35%; text-align: right; padding-right: 8px;">{{ ('basicComponent.input.title') }}：</label><mapgis-ui-input-search placeholder="input search text" enter-button style="width: 240px;" /></div>
      <div style="display: flex; align-items: center; margin-bottom: 15px;"><label style="width: 35%; text-align: right; padding-right: 8px;">{{ ('basicComponent.inputNumber.title') }}：</label><mapgis-ui-input-number v-model="inputValue" style="margin-right: 3px;"/>台机器 <mapgis-ui-button type="link">链接文字</mapgis-ui-button></div>
      <div style="display: flex; align-items: center; margin-bottom: 15px;"><label style="width: 35%; text-align: right; padding-right: 8px;">{{ ('basicComponent.switch.title') }}：</label><mapgis-ui-switch v-model="switch1" /> <mapgis-ui-checkbox v-model="checked1" style="margin-left: 25px;">Checkbox</mapgis-ui-checkbox></div>
      <div style="display: flex; align-items: center; margin-bottom: 15px;"><label style="width: 35%; text-align: right; padding-right: 8px;">{{ ('basicComponent.select.title') }}：</label><mapgis-ui-select allowClear v-model="select1" style="width: 240px;">
          <mapgis-ui-select-option value="jack1">
            Jack
          </mapgis-ui-select-option>
          <mapgis-ui-select-option value="lucy1">
            Lucy
          </mapgis-ui-select-option>
          <mapgis-ui-select-option value="disabled" disabled>
            Disabled
          </mapgis-ui-select-option>
          <mapgis-ui-select-option value="Yiminghe1">
            yiminghe
          </mapgis-ui-select-option>
        </mapgis-ui-select>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 15px;"><label style="width: 35%; text-align: right; padding-right: 8px;">{{ ('basicComponent.empty.title') }}：</label><mapgis-ui-empty /></div>
      <div style="display: flex; align-items: center; margin-bottom: 15px;"><label style="width: 35%; text-align: right; padding-right: 8px;">{{ ('basicComponent.datePicker.title') }}：</label><mapgis-ui-date-picker placeholder="Select Date" v-model="time1" /></div>
      <div style="display: flex; align-items: center; margin-bottom: 15px;"><label style="width: 35%; text-align: right; padding-right: 8px;">{{ ('basicComponent.radio.title') }}：</label><mapgis-ui-radio-group v-model="radio1">
          <mapgis-ui-radio-button value="a">
            Hangzhou
          </mapgis-ui-radio-button>
          <mapgis-ui-radio-button value="b" disabled>
            Shanghai
          </mapgis-ui-radio-button>
          <mapgis-ui-radio-button value="c">
            Beijing
          </mapgis-ui-radio-button>
          <mapgis-ui-radio-button value="d">
            Chengdu
          </mapgis-ui-radio-button>
        </mapgis-ui-radio-group>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 15px;"><label style="width: 35%; text-align: right; padding-right: 8px;">{{ ('basicComponent.transfer.title') }}：</label><mapgis-ui-transfer :data-source="mockData" :titles="['Source', 'Target']" :target-keys="targetKeys" :selected-keys="selectedKeys" :render="item => item.title" @change="handleTransferChange" @selectChange="handleSelectChange" /></div>
      <div style="display: flex; align-items: center; margin-bottom: 15px;"><label style="width: 35%; text-align: right; padding-right: 8px;">{{ ('basicComponent.tooltip.title') }}：</label><mapgis-ui-tooltip placement="topLeft" title="Prompt Text"><mapgis-ui-button>Align edge / 边缘对齐</mapgis-ui-button></mapgis-ui-tooltip><mapgis-ui-tooltip placement="topLeft" title="Prompt Text" arrow-point-at-center><mapgis-ui-button style="margin-left: 10px;">Arrow points to center / 箭头指向中心</mapgis-ui-button></mapgis-ui-tooltip></div>
      <div style="display: flex; align-items: center; margin-bottom: 15px;"><label style="width: 35%; text-align: right; padding-right: 8px;">{{ ('basicComponent.message.title') }}：</label><mapgis-ui-button @click="success">Success</mapgis-ui-button><mapgis-ui-button style="margin-left: 10px;" @click="error">Error</mapgis-ui-button><mapgis-ui-button style="margin-left: 10px;" @click="warning">Warning</mapgis-ui-button><mapgis-ui-button style="margin-left: 10px;" @click="info">Info</mapgis-ui-button></div>
      <div style="display: flex; align-items: center; margin-bottom: 15px;"><label style="width: 35%; text-align: right; padding-right: 8px;">{{ ('basicComponent.modal.title') }}：</label><mapgis-ui-button type="primary" @click="showModal">Modal</mapgis-ui-button><mapgis-ui-button style="margin-left: 10px;" @click="confirm">Confirm</mapgis-ui-button><mapgis-ui-modal v-model="modalVisible" title="Modal" ok-text="confirm" cancel-text="cancel" @ok="hideModal">
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
        </mapgis-ui-modal>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 15px; padding-left: 8px"><mapgis-ui-button type="primary" shape="round" style="margin-left: 35%; margin-right: 15px;">{{ ('basicComponent.button.confirm') }}</mapgis-ui-button><mapgis-ui-button type="default" shape="round">{{ ('basicComponent.button.cancel') }}</mapgis-ui-button></div>
    </div>
  </div>`,
  created() {
    this.setCustomTheme('dark');
  },
  beforeDestroy() {
    this.clearStyle();
  },
  destroyed() {
    this.clearStyle();
  },
});

export const 黑暗主题 = Template.bind({});
