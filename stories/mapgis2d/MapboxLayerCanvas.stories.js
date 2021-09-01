import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisRasterLayer from "../../mapboxgl/src/components/layer/RasterLayer.js";
import MapgisCanvasLayer from "../../mapboxgl/src/components/layer/CanvasLayer.js";

export default {
  title: "二维/图层/画布",
  component: MapgisCanvasLayer,
  // english Our exports that end in "Data" are not stories.
  // 中文 Data后缀的内容不是故事，而是Vue组件的方法
  excludeStories: /.*Data$/,
  argTypes: {
    delay: true,
    layer: {},
    layerId: "canvas_layer_id",
    source: {},
    sourceId: "canvas_source_id",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisRasterLayer, MapgisCanvasLayer },
  methods: actionsData,
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.3, 40.5]" :zoom="5" style="height:60vh">
    <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <canvas id="canvasID" width="400" height="400">Canvas not supported</canvas>
    <mapgis-canvas-layer v-bind="$props" @added="handCanvasLoad" />
  </mapgis-web-map>`,
});

export const Canvas = Template.bind({});
Canvas.args = {
  delay: true,
  layer: {
    source: "canvas_source_id",
    type: "raster",
  },
  layerId: "canvas_layer_id",
  source: {
    type: "canvas",
    canvas: "canvasID",
    coordinates: [
      [108.7381, 45.6339],
      [126.0011, 45.6339],
      [126.0011, 34.2583],
      [108.7381, 34.2583],
    ],
    animate: true,
  },
  sourceId: "canvas_source_id",
};

export const actionsData = {
  handCanvasLoad: (e) => {
    window.setTimeout(() => {
      e.component.$_delayAddLayer();
      let canvas = document.getElementById("canvasID");
      let ctx = canvas.getContext("2d");
      let circles = [];
      let radius = 20;

      function Circle(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.draw = function () {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          ctx.strokeStyle = color;
          ctx.stroke();
        };
        this.update = function () {
          if (this.x + this.radius > 400 || this.x - this.radius < 0) {
            this.dx = -this.dx;
          }
          if (this.y + this.radius > 400 || this.y - this.radius < 0) {
            this.dy = -this.dy;
          }
          this.x += this.dx;
          this.y += this.dy;
          this.draw();
        };
      }
      for (let i = 0; i < 25; i++) {
        let color =
          "#" +
          (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
        let x = Math.random() * (400 - radius * 2) + radius;
        let y = Math.random() * (400 - radius * 2) + radius;
        let dx = (Math.random() - 0.5) * 2;
        let dy = (Math.random() - 0.5) * 2;
        circles.push(new Circle(x, y, dx, dy, radius, color));
      }
      function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, 400, 400);
        for (let r = 0; r < 25; r++) {
          circles[r].update();
        }
      }
      animate();
    }, 1000);
  },
};
