<template>
  <div>
    <mapgis-ui-button
      v-show="!visible"
      size="small"
      :class="{ 'mapgis-ui-setting-pro': true, active: visible }"
      @click="showSetting"
    >
      <mapgis-ui-iconfont type="mapgis-jieshutiaozheng" class="setting" />
    </mapgis-ui-button>
    <mapgis-ui-drawer
      class="mapgis-ui-pro-setting-drawer"
      title="设置工具"
      :placement="placement"
      :closable="false"
      :visible="visible"
      @close="hideSetting"
    >
      <mapgis-ui-divider>
        主题切换
      </mapgis-ui-divider>
      <block-check-box
        :list="themes"
        :value="defaultTheme"
        @change="onThemeChange"
      />
      <mapgis-ui-divider>
        颜色切换
      </mapgis-ui-divider>
      <mapgs-ui-color-simple-picker @change="onColorChange" />
    </mapgis-ui-drawer>
  </div>
</template>

<script>
import themeFactory from "../../util/style/theme/theme.json";
import { setTheme } from "../../util/style/theme/set-theme";
import BlockCheckBox from "./SettingDrawer/BlockCheckbox";

export default {
  name: "mapgis-ui-layout-pro-setting",
  components: { BlockCheckBox },
  props: {
    headStyle: { padding: "0px" },
    contentStyle: { padding: "0px", height: "100vh" },
    footerStyle: { padding: "0px" }
  },
  data() {
    return {
      visible: false,
      placement: "right",
      defaultTheme: "light",
      themes: [
        {
          key: "light",
          url: require("./SettingDrawer/style/light.svg"),
          title: "浅色主题"
        },
        {
          key: "dark",
          url: require("./SettingDrawer/style/dark.svg"),
          title: "黑暗主题"
        }
      ]
    };
  },
  methods: {
    showSetting() {
      this.visible = true;
    },
    hideSetting() {
      this.visible = false;
    },
    onThemeChange(themename) {
      this.defaultTheme = themename;
      let theme = themeFactory.find(t => t.label == themename);
      if (theme) {
        setTheme(theme);
      }
    },
    onColorChange(payload) {
      const { color, colors } = payload;
      let themename = this.defaultTheme
      let theme = themeFactory.find(t => t.label == themename);
      if (theme) {
        theme.colorGroup = colors;
        setTheme(theme);
      }
    }
  }
};
</script>

<style scoped>
.mapgis-ui-setting-pro {
  position: absolute;
  z-index: 9999;
  right: 0px;
  top: 40vh;
  width: 36px;
  height: 36px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}

.active {
  right: 240px;
  visibility: hidden;
}

.setting {
  font-size: 18px;
}
</style>
