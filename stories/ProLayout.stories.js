import MapgisUI from "../ui/src/index";
import MapgisUiLayoutPro from "../ui/src/layout/base/BaseLayout.vue";

import "./style/pro.css";

export default {
  title: "Pro/布局-基础风格",
  component: MapgisUiLayoutPro,
  argTypes: {
    mode: "admin",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiLayoutPro },
  data() {
    return {
      value: 0,
      ribbons: [
        {
          title: "地图文档",
          children: [
            {
              title: "地图工程",
              type: "mapgis-ui-ribbon-group",
              children: [
                {
                  title: "打开工程",
                  type: "mapgis-ui-ribbon-command",
                  icon: "mapgis-daoru",
                  enable: true,
                  action: "DOCUMENT_FROM_IMPORT",
                },
                {
                  title: "导出工程",
                  type: "mapgis-ui-ribbon-command",
                  icon: "mapgis-daochu",
                  enable: true,
                  action: "DOCUMENT_FROM_EXPORT",
                },
              ],
            },
            {
              title: "地图资源",
              type: "mapgis-ui-ribbon-group",
              children: [
                {
                  title: "从文件添加",
                  type: "mapgis-ui-ribbon-command",
                  icon: "mapgis-tianjiawenjian",
                  enable: true,
                  action: "ADD_FROM_FILE",
                },
                {
                  title: "从云盘添加",
                  type: "mapgis-ui-ribbon-command",
                  icon: "mapgis-dianyunfenxi",
                  enable: true,
                  action: "ADD_FROM_CLOUDDISK",
                },
                {
                  title: "从门户添加",
                  type: "mapgis-ui-ribbon-command",
                  icon: "mapgis-tianjiafuwutuceng",
                  enable: true,
                  action: "ADD_FROM_PORTAL",
                },
              ],
            },
          ],
        },
        {
          title: "打印设置",
          children: [
            {
              title: "地图工程",
              type: "mapgis-ui-ribbon-group",
              children: [
                {
                  title: "打印出图",
                  type: "mapgis-ui-ribbon-command",
                  icon: "mapgis-dayinP",
                  enable: true,
                  action: "DOCUMENT_FROM_IMPORT",
                },
              ],
            },
          ],
        },
      ],
      navs: [
        {
          title: "图层测试",
          icon: "mapgis-tucengjiancheng",
          action: "layers",
          position: "start",
        },
        {
          title: "打印面板",
          icon: "mapgis-dayinP",
          action: "print",
          position: "start",
        },
        {
          title: "用户信息",
          icon: "mapgis-yonghuguanli",
          action: "user",
          position: "end",
        },
      ],
      active: "图层",
    };
  },
  mounted() {
    MapgisUI.setLayout(this.mode);
  },
  template: `<mapgis-ui-layout-pro>
      <template slot="header">
        <div class="logo" />
        <mapgis-ui-menu
          theme="light"
          mode="horizontal"
          :default-selected-keys="['2']"
          :style="{ lineHeight: '64px' }"
        >
          <mapgis-ui-menu-item key="1">
            nav 1
          </mapgis-ui-menu-item>
          <mapgis-ui-menu-item key="2">
            nav 2
          </mapgis-ui-menu-item>
          <mapgis-ui-menu-item key="3">
          <mapgis-ui-iconfont type="mapgis-daoru" /> 
          nav 3
          </mapgis-ui-menu-item>
        </mapgis-ui-menu>
      </template>
      <template slot="ribbon" class="mapgis-pro-ribbon">
        <mapgis-ui-tabs size="small">
          <mapgis-ui-tab-pane
            :key="i"
            :tab="r.title"
            v-for="(r, i) in ribbons"
            class="mapgis-ui-ribbon-multi-group"
          >
            <mapgis-ui-ribbon-group
              v-for="(g, j) in r.children"
              :key="j"
              :title="g.title"
            >
              <template v-for="(c, k) in g.children">
                <component :is="c.type" v-bind="c" :key="k" />
              </template>
            </mapgis-ui-ribbon-group>
          </mapgis-ui-tab-pane>
        </mapgis-ui-tabs>
      </template>
      <template slot="content-left" class="mapgis-pro-centent">
        <mapgis-ui-nav-panel v-model="active">
          <mapgis-ui-nav-bar slot="action-bar">
            <mapgis-ui-nav-bar-item
              v-for="(nav, i) in navs"
              :key="i"
              :title="nav.title"
              :icon="nav.icon"
              :value="nav.action"
              :position="nav.position"
            >
            </mapgis-ui-nav-bar-item>
          </mapgis-ui-nav-bar>
          <mapgis-ui-nav-content
            v-for="(nav, i) in navs"
            :key="i"
            :value="nav.action"
          >
            <div :style="{width: '200px'}">{{nav.title}}</div>
          </mapgis-ui-nav-content>
        </mapgis-ui-nav-panel>
      </template>
    </mapgis-ui-layout-pro>`,
});

export const 基础使用 = Template.bind({});
基础使用.args = {
  mode: "admin",
};
