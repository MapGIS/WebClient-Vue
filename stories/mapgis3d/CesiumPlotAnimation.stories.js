import Mapgis3dPlotAnimation from "../../cesium/src/components/Layer/3DPlot/PlotAnimation.vue";
import Mapgis3dPlotLayer from "../../cesium/src/components/Layer/3DPlot/PlotLayer.vue";
import Markdown from "../../cesium/docs/api/layer/3DPlot/PlotAnimation.md";
import "../style/card.css";
import * as axios from "axios";

export default {
  title: "三维/三维标绘/行业标绘",
  component: Mapgis3dPlotAnimation,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dPlotAnimation, Mapgis3dPlotLayer },
  template: `<mapgis-web-scene style="height:95vh">
        <mapgis-3d-plot-layer @loaded="handleLoaded"
                              :isSetPick="false"
                              :dataSource="$props.jsonUrl" :symbolUrl="$props.symbolUrl" v-if="manager"></mapgis-3d-plot-layer>
        <mapgis-3d-plot-animation :data="dataSource" :vueIndex="vueIndex1" :vueKey="vueKey1" v-if="vueIndex1"  ref="animation" />
        <mapgis-3d-plot v-show="false" :symbolUrl="$props.symbolUrl" :vueIndex="vueIndex1" :vueKey="vueKey1" 
          class="storybook-ui-card" 
          @loaded="manager=true"
          :isSetPick="false"
        />
        <mapgis-ui-space :size="8"  style="top:10px;right:10px;position:absolute;background:#fff"  v-if="vueIndex1 && vueKey1">
          <mapgis-ui-iconfont type="mapgis-daoru" @click="importClick"/>
          <input
              type="file"
              ref="importFile"
              v-show="false"
              @change="selectFile"
          />
        </mapgis-ui-space>
  </mapgis-web-scene>`,
  data() {
    return {
      vueIndex1: undefined,
      vueKey1: undefined,
      manager: undefined,
      dataSource: undefined,
    };
  },
  methods: {
    importClick() {
      this.$refs.importFile.click();
    },
    selectFile(e) {
      const vm = this;
      let reader = new FileReader();
      reader.readAsText(e.target.files[0], "UTF-8");
      reader.onload = function (res) {
        let jsonData = JSON.parse(res.target.result);
        let layer = vm.getLayer();
        layer && layer.fromJSON(jsonData);
      };
    },
    handleLoaded(e) {
      const vm = this;
      axios.get(vm.$props.dataUrl).then((res) => {
        vm.dataSource = res.data;
        vm.vueIndex1 = e.vueIndex;
        vm.vueKey1 = e.vueKey;
        e.vm.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(117.7646, 33.0881, 210000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: 0,
          },
          duration: 1,
        });
      });
    },
    getLayer() {
      let vueCesium = this.vueCesium || window.vueCesium;
      if (!vueCesium) return;
      let layerManager = window.vueCesium.PlotLayerManager.findSource(
        this.vueKey1,
        this.vueIndex1
      );
      return layerManager && layerManager.source;
    },
  },
});

export const 态势推演 = Template.bind({});
态势推演.args = {
  jsonUrl: `http://${window.webclient.ip}:8086/storybook/标绘/test.json`,
  symbolUrl: `${window.domain}/标绘/symbols.json`,
  dataUrl: `${window.domain}/标绘/animation.json`,
};

态势推演.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
