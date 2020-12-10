<template>
  <div>
    <slot
      v-if="control"
      v-bind:state="state"
    />
  </div>
</template>

<script>
import { Ellipsoid, Geometry } from "@mapgis/webclient-store";

const { Scale } = Ellipsoid;
const { Lnglat } = Geometry;

const StateEvents = {
  update: "update"
};

export default {
  name: "CesiumStateControl",
  mixins: [],
  inject: ["Cesium", "webGlobe"],
  props: {
    default: {
      type: Boolean,
      default: true
    },
    scale: {
      type: Boolean,
      default: true
    },
    level: {
      type: Boolean,
      default: true
    },
    lng: {
      type: Boolean,
      default: true
    },
    lat: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    state: function () {
      return this.control.value;
    }
  },

  data () {
    return {
      initial: true,
      control: undefined
    };
  },

  created () {
    this.control = new StateControl(this.$props);
    this.control.onAdd(this.webGlobe);
  },

  methods: {
  }
};

class StateControl {
  constructor(option) {
    this.option = option || { level: true, lng: true, lat: true };
    this.value = {
      scale: 0,
      level: 0,
      lng: 0,
      lat: 0
    };
  }

  initDom (dom) {
    dom.className = "mapboxgl-ctrl mapboxgl-state-bar";
    dom.style.display = "flex";

    const controls = ["scale", "level", "lng", "lat"];

    controls.map(c => {
      this[c] = document.createElement("div");
      this[c].id = "mapboxgl-state-bar-" + c;
      this[c].width = "100";

      this[c].style.width = "80px";
      if (c === "scale") this[c].style.width = "120px";
      this[c].style.height = "30px";
      this[c].style.float = "right";
      this[c].style.textOverflow = "ellipsis";
      this[c].style.overflow = "hidden";
      this[c].whiteSpace = "nowrap";

      this[c].style.background = "white";
      this[c].style.boxShadow = "0 3px 4px rgba(0, 0, 0, 0.4)";
      this[c].style.padding = "2px";
      this[c].style.paddingTop = "4px";
      this[c].style.marginRight = "4px";
      this[c].style.textAlign = "center";
      this[c].style.borderRadius = "6px";

      if (this.option[c] && this.option.default) dom.appendChild(this[c]);
    });
  }

  bindEvent () {
    this.handler.setInputAction(this.handleWheel.bind(this), Cesium.ScreenSpaceEventType.WHEEL);
    this.handler.setInputAction(this.handleMouseMove.bind(this), Cesium.ScreenSpaceEventType.LEFT_UP);
  }

  unbindEvent () {
    this.handler.destroy();
  }

  handleMouseMove (e) {
    let rect = this._map.viewer.camera.computeViewRectangle();
    const south = Cesium.Math.toDegrees(rect.south)
    const north = Cesium.Math.toDegrees(rect.north)
    const east = Cesium.Math.toDegrees(rect.east)
    const west = Cesium.Math.toDegrees(rect.west)

    const centerx = (east + west) / 2;
    const centery = (south + north) / 2;

    this.lng.textContent = /* "经度:" + */ centerx;
    this.lat.textContent = /* "纬度:" + */ centery;
    this.value.lng = centerx;
    this.value.lat = centery;
  }

  handleWheel (e) {
    let { target } = e;

    let rect = this._map.viewer.camera.computeViewRectangle();
    const south = Cesium.Math.toDegrees(rect.south)
    const north = Cesium.Math.toDegrees(rect.north)
    const east = Cesium.Math.toDegrees(rect.east)
    const west = Cesium.Math.toDegrees(rect.west)

    let sw = new Lnglat(west, south);
    let ne = new Lnglat(east, north);
    let level =  webGlobe.viewer.scene._globe._surface._tilesToRender[0].level;

    let scale = new Scale().getScaleByLonlat(sw, ne);
    this.level.textContent = "级别:" + level;
    this.scale.textContent = "1 : " + parseInt(scale);

    this.value.scale = scale;
    this.value.level = level;
  }

  onAdd (map) {
    this._map = map;
    this.handler = new window.Cesium.ScreenSpaceEventHandler(map.viewer.scene.canvas);
    this._container = document.createElement("div");
    this._container.className = "cesium-ctrl";
    this.initDom(this._container);
    this.bindEvent();
    return this._container;
  }

  onRemove () {
    this.unbindEvent();
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
</script>
