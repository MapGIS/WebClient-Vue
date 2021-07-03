import {
  withKnobs,
  color,
  number,
  array,
  select,
} from "@storybook/addon-knobs";
import { setTheme } from "../ui/src/util/style/theme/set-theme";
import themeFactory from "../ui/src/util/style/theme/theme.json";

export default {
  title: "界面/主题(待完成)",
  decorators: [withKnobs],
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
    setCustomTheme(themeData) {
      setTheme(themeData || { ...this.$props, style: this.defaultStyle });
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
      this.setCustomTheme(themeFactory[1]);
    },
  },
  props: {
    defaultStyle: {
      default: select("defaultStyle", ["light", "dark"], "light"),
    },
    colorGroup: {
      default: array("colorGroup", [
        "rgb(155,91,219)",
        "#e14d57",
        "#6be6c1",
        "#626c91",
        "#a0a7e6",
        "#c4ebad",
      ]),
    },
    background: { default: color("background", "#191515") },
    backgroundLight: { default: color("backgroundLight", "#1f1a1a") },
    backgroundBase: {
      default: color("backgroundBase", "rgba(25, 21, 21, 0.08)"),
    },
    textColor: { default: color("textColor", "#fff") },
    textColorSecondary: {
      default: color("textColorSecondary", "rgba(255, 255, 255, 0.45)"),
    },
    selectedColor: { default: color("selectedColor", "#e14d5726") },
    hoverColor: { default: color("hoverColor", "#e5666f") },
    clickColor: { default: color("clickColor", "#dc333f") },
    successColor: { default: color("successColor", "#2BA250") },
    infoColor: { default: color("infoColor", "#3499E5") },
    warningColor: { default: color("warningColor", "#F0BD3E") },
    dangerColor: { default: color("dangerColor", "#DC5849") },
    iconColorHover: {
      default: color("iconColorHover", "rgba(255, 255, 255, 0.75)"),
    },
    headingColor: {
      default: color("headingColor", "rgba(255, 255, 255, 0.85)"),
    },
    disabledBgColor: {
      default: color("disabledBgColor", "rgba(255, 255, 255, 0.08)"),
    },
    disabledBorderColor: {
      default: color("disabledBorderColor", "rgba(255, 255, 255, 0.08)"),
    },
    disabledTextColor: {
      default: color("disabledTextColor", "rgba(255, 255, 255, 0.25)"),
    },
    placeholderColor: {
      default: color("placeholderColor", "rgba(255, 255, 255, 0.45)"),
    },
    borderColorSplit: {
      default: color("borderColorSplit", "rgba(255, 255, 255, 0.12)"),
    },
    borderColorBase: {
      default: color("borderBaseColor", "rgba(255, 255, 255, 0.15)"),
    },
    shadowColor: { default: color("shadowColor", "rgba(0, 0, 0, 0.35)") },
    buttonBorderDefaultColor: {
      default: color("buttonBorderDefaultColor", "rgba(255, 255, 255, 0.65)"),
    },
    paginationBorderDefaultColor: {
      default: color(
        "paginationBorderDefaultColor",
        "rgba(255, 255, 255, 0.2)"
      ),
    },
    componentBackground: {
      default: color("componentBackground", "rgba(255, 255, 255, 0.04)"),
    },
    selectDropdownBackground: {
      default: color("selectDropdownBackground", "#423939"),
    },
    selectItemHoverBg: {
      default: color("selectItemHoverBg", "rgba(255, 255, 255, 0.08)"),
    },
    switchBackground: {
      default: color("switchBackground", "rgba(255, 255, 255, 0.3)"),
    },
    switchDisabledBgColor: {
      default: color("switchDisabledBgColor", "rgba(255, 255, 255, 0.15)"),
    },
    switchDisabledAfterColor: {
      default: color("switchDisabledAfterColor", "rgba(255, 255, 255, 0.15)"),
    },
    switchDisabledOpacity: { default: number("switchDisabledOpacity", 1) },
    emptyBackground: { default: color("emptyBackground", "#333") },
    avatarBackground: { default: color("avatarBackground", "#ccc") },
    avatarTextColor: { default: color("avatarTextColor", "#fff") },
    tooltipBackground: { default: color("tooltipBackground", "#535353") },
    messageBackground: { default: color("messageBackground", "#535353") },
    modalBackground: { default: color("modalBackground", "#333") },
    radioInnerDisabledBg: {
      default: color("inputSuffixIconHoverColor", "rgba(255, 255, 255, 0.12)"),
    },
    transferItemHoverColor: {
      default: color("transferItemHoverColor", "rgba(255, 255, 255, 0.08)"),
    },
  },
  template: `<div>
    <div style="margin-bottom: 15px;">
      <mapgis-ui-button type="primary" @click="setCustomTheme()">改变主题颜色</mapgis-ui-button>
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
    setTimeout(() => this.setCustomTheme(), 0);
    Object.keys(this.$props).forEach((item) => {
      this.$watch(item, function () {
        this.setCustomTheme();
      });
    });
  },
  beforeDestroy() {
    this.clearStyle();
  },
  destroyed() {
    this.clearStyle();
    console.log("组件销毁");
  },
});

export const CustomTheme = Template.bind({});
