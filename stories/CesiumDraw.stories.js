import Mapgis3dPopup from "../cesium/src/components/UI/Popup/Popup.vue";

export default {
  title: "三维/绘制",
  component: Mapgis3dPopup,
  argTypes: {
    position: {
      longitude: 110,
      latitude: 30,
      height: 0,
    },
    showed: true,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dPopup },
  template: `<mapgis-web-scene>
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-draw ref="drawref" v-on:load="handleDrawLoad" v-on:drawcreate="handleCreate">
      <div style="position: absolute;z-index: 9999;display: inline-flex;overflow-x: hidden;overflow-y: visible;top: 20px;left: 20px;">
        <div style="background: #ffffff;border: 1px dashed #666666;text-align: center;font-size: 20px;line-height: 20px;height: fit-content;padding: 6px 16px;cursor: pointer;" v-on:click="toggleRect">点</div>
        <div style="background: #ffffff;border: 1px dashed #666666;text-align: center;font-size: 20px;line-height: 20px;height: fit-content;padding: 6px 16px;cursor: pointer;" v-on:click="toggleRect">线</div>
        <div style="background: #ffffff;border: 1px dashed #666666;text-align: center;font-size: 20px;line-height: 20px;height: fit-content;padding: 6px 16px;cursor: pointer;" v-on:click="toggleRect">多边形</div>
        <div style="background: #ffffff;border: 1px dashed #666666;text-align: center;font-size: 20px;line-height: 20px;height: fit-content;padding: 6px 16px;cursor: pointer;" v-on:click="toggleRect">矩形</div>
        <div style="background: #ffffff;border: 1px dashed #666666;text-align: center;font-size: 20px;line-height: 20px;height: fit-content;padding: 6px 16px;cursor: pointer;" v-on:click="toggleRect">删除</div>
      </div>
    </mapgis-3d-draw>
  </mapgis-web-scene>`,
  methods:{
    handleDrawLoad(drawer) {
      this.drawer = drawer;
    },
    handleCreate(cartesian3, lnglat) {
      console.log('create', cartesian3, lnglat);
    },
    togglePoint() {
      this.drawer && this.drawer.enableDrawPoint();
    },
    togglePolyline() {
      this.drawer && this.drawer.enableDrawLine();
    },
    togglePolygon() {
      this.drawer && this.drawer.enableDrawPolygon();
    },
    toggleRect() {
      this.drawer && this.drawer.enableDrawRectangle();
    },
    toggleDelete() {
      this.drawer && this.drawer.removeEntities();
    }
  }
});

export const draw = Template.bind({});
draw.args = {
  position: {
    longitude: 110,
    latitude: 30,
    height: 0,
  },
  showed: true,
};

