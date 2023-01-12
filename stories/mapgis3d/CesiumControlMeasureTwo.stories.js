export default {
  title: "三维/通用工具/量测",
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `
    <div>
    <mapgis-web-scene
        :vueKey="vueKey"
        :animation="false"
        :timeline="false">
      <mapgis-3d-m3d-layer :url="$props.m3durl"> </mapgis-3d-m3d-layer>
      <mapgis-3d-measure
          :vueKey="vueKey"
          @load="handleLoad"
          @measured="measured"
      >
        <div style="position: absolute;z-index: 9999;display: inline-flex;overflow-x: hidden;overflow-y: visible;top: 20px;left: 20px;" id="toolbar-wrapper">
          <div style="background: #ffffff;border: 1px dashed #666666;text-align: center;font-size: 20px;line-height: 20px;height: fit-content;padding: 6px 16px;cursor: pointer;" v-on:click="measureLength">直线测量</div>
          <div style="background: #ffffff;border: 1px dashed #666666;text-align: center;font-size: 20px;line-height: 20px;height: fit-content;padding: 6px 16px;cursor: pointer;" v-on:click="measureArea">面积测量</div>
          <div style="background: #ffffff;border: 1px dashed #666666;text-align: center;font-size: 20px;line-height: 20px;height: fit-content;padding: 6px 16px;cursor: pointer;" v-on:click="measureTriangle">三角测量</div>
          <div style="background: #ffffff;border: 1px dashed #666666;text-align: center;font-size: 20px;line-height: 20px;height: fit-content;padding: 6px 16px;cursor: pointer;" v-on:click="measureSlope">坡度测量</div>
          <div style="background: #ffffff;border: 1px dashed #666666;text-align: center;font-size: 20px;line-height: 20px;height: fit-content;padding: 6px 16px;cursor: pointer;" v-on:click="deleteMeasure">删除</div>
        </div>
      </mapgis-3d-measure>
    </mapgis-web-scene>
    <mapgis-web-scene
        :animation="false"
        :timeline="false"></mapgis-web-scene>
    </div>
  `,
  data() {
    return {
      vueKey: "scene"
    }
  },
  methods: {
    handleLoad(measure) {
      console.log('地图加初始化完毕！', measure);
      this.measure = measure;
    },
    measured(result) {
      console.log("result", result)
    },
    measureLength() {
      this.measure && this.measure.enableMeasureLength();
    },
    measureArea() {
      this.measure && this.measure.enableMeasureArea();
    },
    measureTriangle() {
      this.measure && this.measure.enableMeasureTriangle();
    },
    measureSlope() {
      this.measure && this.measure.enableMeasureSlope();
    },
    deleteMeasure() {
      this.measure && this.measure.deleteMeasure();
    }
  }
});

export const 多屏量测 = Template.bind({});
多屏量测.args = {
  m3durl: `http://${window.webclient.igsIp}:${window.webclient.filePort}/3DData/ModelCache/M3D/1.0/ZondyFaceModels/ZondyFaceModels.mcj`
};

