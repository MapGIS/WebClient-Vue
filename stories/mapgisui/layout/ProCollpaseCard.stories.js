import MapgisUiCollapseCard from "../../../ui/src/components/collapse-card/CollapseCard.vue";
import Markdown from "../../../ui/docs/api/panel/tab.md";

export default {
  title: "界面/Pro/面板/收缩面板",
  component: MapgisUiCollapseCard,
  argTypes: {
    position: "top-left",
    outStyle: {
      position: "absolute",
      zIndex: 1000,
      padding: "0px",
      margin: "0px",
      height: "450px",
      width: "270px",
      top: "0px",
      left: "0px",
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiCollapseCard },
  data() {
    return {
      value: 0,
      cloudsduration: 0,
    };
  },
  mounted() {},
  methods: {
    handleMenu() {
      this.$refs.card && this.$refs.card.hide();
    },
    togglePanel() {
      this.$refs.card && this.$refs.card.togglePanel();
    },
    toggleMain() {
      this.$refs.card && this.$refs.card.toggleMain();
    },
  },
  template: `<div :style="{background: '#000', padding: '10px', height: '95vh'}">
    <mapgis-ui-collapse-card v-bind="$props" ref="card" >
      <mapgis-ui-iconfont type="mapgis-layer1" slot="icon-hiden" />
      <span slot="title">标题内容</span>
      <mapgis-ui-space slot="extra" >
      <mapgis-ui-tooltip>
        <template slot="title">自定义按钮</template>
          <mapgis-ui-iconfont type="mapgis-setting"/>
        </mapgis-ui-tooltip>
        <mapgis-ui-tooltip>
          <template slot="title">收缩</template>
          <mapgis-ui-iconfont type="mapgis-eye-close" @click="handleMenu" />
        </mapgis-ui-tooltip>
      </mapgis-ui-space>
      <div>
        <mapgis-ui-divider>
          一级菜单
        </mapgis-ui-divider>
        <mapgis-ui-button :style="{width: '100%'}" autoWidth type="primary" @click="togglePanel">
          进入二级子菜单
        </mapgis-ui-button>
      </div>
      <div slot="panel">
        <mapgis-ui-divider>
          二级菜单
        </mapgis-ui-divider>
        <mapgis-ui-button :style="{width: '100%'}" autoWidth type="primary" @click="toggleMain">
          返回一级子菜单
        </mapgis-ui-button>
      </div>
    </mapgis-ui-collapse-card>    
  </div>`,
});

export const 收缩面板 = Template.bind({});
收缩面板.args = {
  position: "top-left",
  outStyle: {
    position: "absolute",
    zIndex: 1000,
    padding: "0px",
    margin: "0px",
    height: "450px",
    width: "270px",
    top: "30px",
    left: "30px",
  },
};

收缩面板.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
