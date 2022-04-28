<template>
  <span />
</template>

<script>
import { DataSet } from "mapv";
import { MapvLayer } from "./mapv/MapvLayer";

export default {
  name: "mapgis-stream-layer",
  inject: ["leaflet", "map"],
  props: {
    features: {
      type: Array,
      default: () => [],
    },
    countField: {
      type: String,
      default: "count",
    },
    icons: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      state: "init", // init load loading loaded update destory
      innerfeatures: [],
    };
  },
  watch: {
    features: function (next, old) {
      this.innerfeatures = next;
      if (old == undefined && next != undefined) {
        this.state = "load";
      }
    },

    state: {
      deep: true,
      handler(next, old) {
        if (next == "load") {
          this.initIcons();
        }
      },
    },
  },

  mounted() {
    this.layers = [];
  },
  methods: {
    initData(features) {
      let vm = this;
      let data = [];
      this.innerfeatures = features;
      if (!features || features.length == 0) return;
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const fType = feature.geometry.type;
        const coordinates = feature.geometry.coordinates;
        let countValue = feature.properties[this.countField];
        if (countValue) {
          countValue = vm.isNumber(countValue) ? count : Number(countValue);
        } else {
          countValue = 30 * Math.random();
        }
        let timeValue = feature.properties.time;
        if (timeValue) {
          timeValue = vm.isNumber(timeValue) ? timeValue : Number(timeValue);
        } else {
          timeValue = 100 * Math.random();
        }
        if (fType === "Point") {
          let obj = Object.assign(
            {
              geometry: {
                type: "Point",
                coordinates: coordinates,
              },
              count: countValue,
              time: timeValue,
            },
            feature.properties
          );
          data.push(obj);
        }
      }
      let dataSet = new DataSet(data);
      return dataSet;
    },
    isNumber(obj) {
      typeof obj === "number" && !isNaN(obj);
    },
    initIcons() {
      this.imgs = [];
      const vm = this;
      var promises = this.icons.map(
        (icon, index) =>
          new Promise((res, rej) => {
            var img = new Image();
            img.src = icon;
            img.onload = function () {
              vm.imgs.push({ image: img, index: index });
              res();
            };
          })
      );
      Promise.all(promises).then((res) => {
        vm.imgs.sort((a, b) => {
          return a.index - b.index;
        });
        vm.initLayers();
      });
    },
    initLayers() {
      const vm = this;
      const { imgs, icons, innerfeatures } = this;
      this.innerfeatures = innerfeatures.map((f, i) => {
        var icon_index = i % imgs.length;
        f.icon = imgs[icon_index].image;
        f.deg = 360 * Math.random();
        return f;
      });
      icons.forEach((icon, i) => {
        vm.drawLayer(i);
      });
      vm.startAnimate();
    },
    drawLayer(index) {
      const { map, imgs, innerfeatures } = this;
      var datafilter = innerfeatures.filter(
        (d, i) => i % imgs.length === index
      );
      var dataSet = new DataSet(datafilter);
      var height = 32,
        width = 32;
      switch (index) {
        case 0:
          height = 16;
          width = 16;
          break;
        case 1:
          height = 40;
          width = 50;
          break;
        case 2:
          height = 20;
          width = 120;
          break;
        case 3:
          height = 60;
          width = 100;
          break;
        case 4:
          height = 60;
          width = 60;
          break;
        case 5:
          height = 60;
          width = 90;
          break;
        case 6:
          height = 55;
          width = 84;
          break;
        case 7:
          height = 65;
          width = 95;
          break;
      }
      var options = {
        draw: "icon",
        height: height / 4,
        width: width / 4,
      };
      var layer = new MapvLayer(map, dataSet, options).addTo(map);
      this.layers.push(layer);
    },
    updateLayers() {},
    animateLayer() {
      const { imgs, layers, innerfeatures } = this;
      var random = Math.random() * 0.005;
      this.innerfeatures.forEach((d) => {
        d.geometry.coordinates[0] += random;
        d.geometry.coordinates[1] -= random;
      });

      layers.forEach((layer, index) => {
        var datafilter = innerfeatures.filter(
          (d, i) => i % imgs.length === index
        );
        layer.updateData(datafilter);
      });
    },

    startAnimate() {
      const vm = this;
      var clock = window.setInterval(() => {
        vm.animateLayer();
      }, 1 * 1000);
    },
  },
};
</script>