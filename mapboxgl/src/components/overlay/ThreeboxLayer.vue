<template>
  <span />
</template>

<script>
var THREE = require("./threebox/three");
import Threebox from "./threebox";
export default {
  name: "mapgis-threebox-layer",
  inject: ["mapbox", "map"],
  props: {
    layerId: {
      type: String,
      default: () => "threebox_layer_" + (Math.random() * 100000000).toFixed(0)
    },
    height: {
      type: Number,
      default: 200
    },
    precision: {
      type: Number,
      default: 0.1
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.mount();
  },
  beforeDestroy() {
    this.unmout();
  },
  methods: {
    mount() {
      const { map, layerId, precision, height } = this;

      var lines = new Array();
      var arcSegments = 25;
      var lineQuantity = 50;
      var tb, lineMesh;
      var colors = [
        "#f5222d",
        "#fa541c",
        "#a0d911",
        "#ffec3d",
        "#52c41a",
        "#13c2c2",
        "#1890ff",
        "#2f54eb",
        "#722ed1",
        "#eb2f96"
      ];
      var destination = [113.146912299762903, 22.9996541000567163];

      for (var i = 0; i < lineQuantity; i++) {
        var line = new Array();

        var maxElevation = height;
        let offsetX, offsetY;
        let random = Math.random();
        if (Math.random() > 0.5) {
          offsetX = (precision / arcSegments) * random;
        } else {
          offsetX = -(precision / arcSegments) * random;
        }
        random = Math.random();
        if (Math.random() > 0.5) {
          offsetY = (precision / arcSegments) * random;
        } else {
          offsetY = -(precision / arcSegments) * random;
        }

        var increment = [destination[0] + offsetX, destination[1] + offsetY];
        let stepsX = offsetX / arcSegments;
        let stepsY = offsetY / arcSegments;

        for (var l = 0; l <= arcSegments; l++) {
          var waypoint = [
            destination[0] + stepsX * l,
            destination[1] + stepsY * l
          ];

          var waypointElevation =
            Math.sin((Math.PI * l) / arcSegments) * maxElevation;

          waypoint.push(waypointElevation);
          line.push(waypoint);
        }

        lines.push(line);
      }

      console.log("THREE", THREE.VertexColors, THREE);

      map.addLayer({
        id: layerId,
        type: "custom",
        renderingMode: '3d',
        onAdd: function(map, mbxContext) {
          tb = new Threebox(map, mbxContext, { defaultLights: true });

          for (let i = 0; i < lines.length; i++) {
            var line = lines[i];
            var lineOptions = {
              geometry: line,
              color: colors[i % colors.length],
              width: 10,
            };

            lineMesh = tb.line(lineOptions);

            tb.add(lineMesh);
          }
        },

        render: function(gl, matrix) {
          tb.update();
        }
      });
    },
    unmout() {
      const { map, layerId } = this;
      map.removeLayer(layerId);
    }
  }
};
</script>
