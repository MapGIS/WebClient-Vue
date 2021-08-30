<template>
  <div class="mapgis-ui-pro-layout">
    <mapgis-ui-button
      v-show="!visible"
      size="small"
      :class="{ 'mapgis-ui-pro-layout-setting': true, active: visible }"
      @click="showSetting"
    >
      <mapgis-ui-iconfont type="mapgis-setting" class="setting" />
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
        布局切换
      </mapgis-ui-divider>
      <block-check-box
        class="mapgis-ui-pro-layout-select-setting"
        :list="layouts"
        :value="defaultLayout"
        @change="onLayoutChange"
      />
      <mapgis-ui-divider>
        主题切换
      </mapgis-ui-divider>
      <block-check-box
        class="mapgis-ui-pro-theme-select-setting"
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
import layoutFactory from "../../util/style/layout/layout.json";
import themeFactory from "../../util/style/theme/theme.json";
import { setTheme } from "../../util/style/theme/set-theme";
import { setLayout } from "../../util/emit/layout";
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
      defaultLayout: "admin",
      layouts: [
        {
          key: "admin",
          url: require("./SettingDrawer/style/admin.svg"),
          title: "标准管理后台布局"
        },
        {
          key: "ribbon",
          url: require("./SettingDrawer/style/ribbon.svg"),
          title: "Ribbon布局"
        },
        {
          key: "drawer",
          url: require("./SettingDrawer/style/drawer.svg"),
          title: "抽屉布局"
        },
        {
          key: "standard",
          url: require("./SettingDrawer/style/standard.svg"),
          title: "标准三段式布局"
        },
        {
          key: "noheader",
          url: require("./SettingDrawer/style/no-header.svg"),
          title: "地图预览布局"
        },
        {
          key: "nofooter",
          url: require("./SettingDrawer/style/no-footer.svg"),
          title: "地图预览布局"
        },
        {
          key: "content",
          url: require("./SettingDrawer/style/no-header-footer.svg"),
          title: "空白布局"
        }
      ],
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
        },
        {
          key: "warmGray",
          url: require("./SettingDrawer/style/grey.svg"),
          title: "灰色主题"
        },
        {
          key: "green-g",
          url: require("./SettingDrawer/style/green.svg"),
          title: "绿色渐变"
        },
        {
          key: "blue-g",
          url: require("./SettingDrawer/style/blue.svg"),
          title: "蓝色渐变"
        },
        {
          key: "red-g",
          url: require("./SettingDrawer/style/origin.svg"),
          title: "橙红渐变"
        },
        {
          key: "purple-g",
          url: require("./SettingDrawer/style/purple.svg"),
          title: "紫色渐变"
        },
        {
          key: "bluedark-dark",
          url: require("./SettingDrawer/style/darkblue.svg"),
          title: "深蓝黑色"
        },
        {
          key: "green-dark",
          url: require("./SettingDrawer/style/green.svg"),
          title: "墨绿黑色"
        },
        {
          key: "blue-dark",
          url: require("./SettingDrawer/style/blue-dark.svg"),
          title: "浅蓝黑色"
        },
        {
          key: "grey-dark",
          url: require("./SettingDrawer/style/grey-dark.svg"),
          title: "浅灰黑色"
        },
        {
          key: "purple-dark",
          url: require("./SettingDrawer/style/purple-dark.svg"),
          title: "深紫黑色"
        },
        {
          key: "blue-light",
          url: require("./SettingDrawer/style/blue-light.svg"),
          title: "深蓝白色"
        },
        {
          key: "red-light",
          url: require("./SettingDrawer/style/red-light.svg"),
          title: "深红白色"
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
    onLayoutChange(layoutname) {
      this.defaultLayout = layoutname;
      let layout = layoutFactory.find(t => t.label == layoutname);
      if (layout) {
        setLayout(layout);
      }
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
      let themename = this.defaultTheme;
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
.mapgis-ui-pro-layout-select-setting {
  width: 100%;
  flex-wrap: wrap;
}

.mapgis-ui-pro-theme-select-setting {
  width: 100%;
  flex-wrap: wrap;
}

.active {
  right: 240px;
  visibility: hidden;
}

.setting {
  font-size: 12px;
}
</style>
