import MapgisUiColorPickPanel from "../../../ui/src/layout/panel/ColorPickPanel.vue";

export default {
  title: "界面/Pro/面板/颜色面板",
  component: MapgisUiColorPickPanel,
  argTypes: {
    label:"光照颜色", 
    colorStyle:{description:"颜色面板的样式"},
    labelCol:{
      description:"标题所占的格数，一行一共是24格"
    },
    wrapperCol:{
      description:"颜色面板所占的格数，一行一共是24格"
    }
  },
};

const Template = (args, { argTypes }) => ({
  components: { MapgisUiColorPickPanel },
  data() {
    return {
      lightColor: 'rgba(255,255,255,255)',
    };
  },
  mounted() {
    /* setTheme("technology"); */
  },
  template: `<div>
      <mapgis-ui-color-pick-panel v-bind:label="'光照颜色'" v-bind:disableAlpha="false" v-bind:color="lightColor" @input="inputChange">
      </mapgis-ui-color-pick-panel>
      <br>
      <mapgis-ui-color-pick-panel labelCol="12" wrapperCol="12">
      </mapgis-ui-color-pick-panel>
      <br>
      <mapgis-ui-color-pick-panel label="持续时间（毫秒）" :colorStyle="{width:'300px',background:'rgba(0,0,0,.5)'}">
      </mapgis-ui-color-pick-panel>
  </div>`,
  methods:{
    inputChange(val){
      this.lightColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`,
      console.log("lightColor",lightColor);
    }
  }
});

export const 颜色面板 = Template.bind({});
颜色面板.args = {
  label:"光照颜色", 
  disableAlpha:false
};