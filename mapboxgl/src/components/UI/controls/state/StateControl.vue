<template>
  <div class="mapgis-state-bar">
    <!-- slot for popup -->
    <slot
      v-if="control"
      v-bind:state="state"
    />
  </div>
</template>

<script>
import { point, distance } from "@turf/turf";
import controlMixin from "../controlMixin";

const StateEvents = {
  update: "update"
};

export default {
  name: "mapgis-state",
  mixins: [controlMixin],
  props: {
    /**
     * 是否激活默认界面
     */
    default: {
      type: Boolean,
      default: true
    },
    /**
     * 是否返回比例尺,单位：米
     */
    scale: {
      type: Boolean,
      default: true
    },
    /**
     * 是否返回级别
     */
    level: {
      type: Boolean,
      default: true
    },
    /**
     * 是否返回经度
     */
    lng: {
      type: Boolean,
      default: true
    },
    /**
     * 是否返回纬度
     */
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
    this.$_addControl();
    let events = Object.keys(StateEvents);
    this.$_bindSelfEvents(events, this.control);
  },

  methods: {}
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
    this._map.on("mousemove", this.handleMouseMove.bind(this));
    this._map.on("wheel", this.handleWheel.bind(this));
    /* if (this.option.lng || this.option.lat) {
      this._map.on("mousemove", this.handleMouseMove.bind(this));
    }
    if (this.option.scale || this.option.level) {
      this._map.on("wheel", this.handleWheel.bind(this));
    } */
  }

  unbindEvent () {
    this._map.off("mousemove", this.handleMouseMove.bind(this));
    this._map.off("wheel", this.handleWheel.bind(this));
    /* if (this.option.lng || this.option.lat) {
      this._map.off("mousemove", this.handleMouseMove.bind(this));
    }
    if (this.option.scale || this.option.level) {
      this._map.off("wheel", this.handleWheel.bind(this));
    } */
  }

  handleMouseMove (e) {
    const { lngLat } = e;
    this.lng.textContent = /* "经度:" + */ lngLat.lng;
    this.lat.textContent = /* "纬度:" + */ lngLat.lat;
    this.value.lng = lngLat.lng;
    this.value.lat = lngLat.lat;
  }

  handleWheel (e) {
    let { target } = e;
    if (!this._map) {
      return;
    }

    let bounds = this._map.getBounds();
    if (!bounds) {
      return;
    }

    let from = point([bounds._sw.lng, bounds._sw.lat]);
    let to = point([bounds._ne.lng, bounds._ne.lat]);
    let scale = distance(from, to, { units: "meters" });

    this.level.textContent = "级别:" + target.getZoom().toFixed(2);
    this.scale.textContent = "1 : " + parseInt(scale);

    this.value.scale = scale;
    this.value.level = target.getZoom();
  }

  onAdd (map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl";
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
<style>
.mapgis-state-bar {
  width: 100%;
}
</style>