export default {
  title: "三维/交互-量测-多屏",
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
      <mapgis-3d-igs-m3d :url="m3durl"> </mapgis-3d-igs-m3d>
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
  data(){
    return {
      m3durl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      vueKey: "scene"
    }
  },
  methods:{
    handleLoad(measure) {
      console.log('地图加初始化完毕！', measure);
      this.measure = measure;
    },
    measured(result){
      console.log("result",result)
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

export const MeasureTool = Template.bind({});
MeasureTool.args = {
};

