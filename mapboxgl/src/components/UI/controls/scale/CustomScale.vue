<template>
  <div class="mapgis-custom-scale" id="mapgis-legend-rule" :style="outStyle">
    <div :style="{ width: width + 'px' }">
      <strong class="mapgis-custom-scale-number">{{ scaleLabel }}</strong>
      <div class="mapgis-custom-scale-ruler">
        <div class="mapgis-custom-scale-ruler-block upper_firstpiece" />
        <div class="mapgis-custom-scale-ruler-block upper_secondpiece" />
        <div class="mapgis-custom-scale-ruler-block lower_firstpiece" />
        <div class="mapgis-custom-scale-ruler-block lower_secondpiece" />
      </div>
      <div class="mapgis-custom-scale-label-div">
        <div
          class="mapgis-custom-scale-label"
          style="
             {
              left: '-3%';
            }
          "
        >
          0
        </div>
        <div class="mapgis-custom-scale-label mapgis-custom-scale-first-number">
          {{ midLabel }}
        </div>
        <div
          class="mapgis-custom-scale-label mapgis-custom-scale-second-number"
        >
          {{ endLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { point, distance } from "@turf/turf";
import debounce from "lodash/debounce";

export default {
  name: "mapgis-custom-scale",
  inject: ["map", "mapbox"],
  props: {
    outStyle: {
      type: Object,
      default: () => {
        return {
          left: "10px",
          top: "10px",
        };
      },
    },
  },
  data() {
    return {
      scaleLabel: "比例尺",
      midLabel: "",
      endLabel: "",
      width: 200,
    };
  },
  mounted() {
    const vm = this;
    let interval = window.setInterval(() => {
      const { map } = vm;
      if (map) {
        vm.bindEvent();
        window.clearInterval(interval);
      }
    }, 500);
  },
  beforeDestroy() {
    this.unbindEvent();
  },
  methods: {
    bindEvent() {
      const vm = this;
      const { map } = vm;
      this.moveEvent = debounce(
        () => {
          vm.update();
        },
        100,
        { leading: true }
      );
      map.on("move", this.moveEvent);
    },
    unbindEvent() {
      const { map } = this;
      map && map.off("move", this.moveEvent);
    },
    fixlonlat(lonlat) {
      if (!lonlat) return { lng: 0, lat: 0 };
      if (lonlat.lng > 180) {
        lonlat.lng = 179.9999;
      } else if (lonlat.lng < -180) {
        lonlat.lng = -179.9999;
      } else if (lonlat.lat > 90) {
        lonlat.lat = 89.9999;
      } else if (lonlat.lat < -90) {
        lonlat.lat = -89.9999;
      }
      return lonlat;
    },
    getScaleByLonlat(lonlat1, lonlat2) {
      lonlat1 = this.fixlonlat(lonlat1);
      lonlat2 = this.fixlonlat(lonlat2);

      let from = point([lonlat1.lng, lonlat1.lat]);
      let to = point([lonlat2.lng, lonlat2.lat]);

      let maxMeters = distance(from, to, { units: "meters" });

      return maxMeters;
    },

    getRoundNum(num) {
      let pow10 = Math.pow(10, (Math.floor(num) + "").length - 1),
        d = num / pow10;

      d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;

      return pow10 * d;
    },

    getShowScale(scale) {
      return this.getRoundNum(scale);
    },

    getShowLabel(meters) {
      let label = meters < 1000 ? meters + " m" : meters / 1000 + " km";
      return label;
    },

    getScaleWidth(showScale, trueScale) {
      trueScale = trueScale <= 0 ? 1 : trueScale;
      let { width } = this;
      if (!width) width = 200;
      let radio = showScale / trueScale;
      return Math.round(width * radio);
    },

    update() {
      const { map } = this;
      if (!map) return;

      let y = map.getContainer().clientHeight / 2;
      let x = 200 || map.getContainer().clientWidth / 2;

      if (typeof x != "number" || typeof y != "number") return;

      let point1 = map.unproject([0, y]);
      let point2 = map.unproject([x, y]);

      let scale = this.getScaleByLonlat(point1, point2);

      let showScale = this.getShowScale(scale);
      let mid = showScale / 2;
      this.midLabel = mid < 1000 ? mid : mid / 1000;
      this.endLabel = this.getShowLabel(showScale);
      // this.width = this.getScaleWidth(showScale, scale);
      this.scaleLabel = "1: " + scale.toFixed(0);
    },
  },
};
</script>

<style scoped>
.mapgis-custom-scale-number {
  color: #666666;
}
.mapgis-custom-scale {
  z-index: 30;
  position: absolute;
  width: fit-content;
  padding: 0px 12px;
  padding-right: 28px;
  height: 50px;
}

.mapgis-custom-scale-ruler {
  /* overflow     : hidden; */
  position: relative;
  width: 100%;
  height: 10px;
  background-color: White;
  border: 1px solid #444444;
}

.upper_firstpiece {
  top: 0%;
  left: -0.5%;
  width: 26%;
}

.upper_secondpiece {
  top: 0%;
  left: 50%;
  width: 25%;
}

.lower_firstpiece {
  top: 50%;
  left: 25%;
  width: 25%;
}

.lower_secondpiece {
  top: 50%;
  left: 75%;
  width: 25.5%;
}

.mapgis-custom-scale-ruler-block {
  overflow: hidden;
  position: absolute;
  height: 55%;
  background-color: #444444;
}

.mapgis-custom-scale-label-div {
  position: relative;
  width: 100%;
  height: 5px;
}

.mapgis-custom-scale-label {
  font-size: 11px;
  position: absolute;
  width: 10%;
  text-align: center;
  color: #666666;
  font: Verdana;
  font-weight: bolder;
  height: 5px;
  top: -1px;
}

.mapgis-custom-scale-first-number {
  left: 45%;
}

.mapgis-custom-scale-second-number {
  left: 95%;
  white-space: nowrap;
}
</style>
