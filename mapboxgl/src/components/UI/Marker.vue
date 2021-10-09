<template>
  <div style="display: none">
    <!-- slot for custom marker -->
    <slot name="marker" />
    <!-- slot for popup -->
    <slot v-if="marker" />
  </div>
</template>

<script>
// 这两行 = this.$emit(markerEvents, data)
import withEvents from "../../lib/withEvents";
import withSelfEvents from "./withSelfEvents";

const markerEvents = {
  drag: "drag",
  dragstart: "dragstart",
  dragend: "dragend"
};

const markerDOMEvents = {
  click: "click",
  mouseenter: "mouseenter",
  mouseleave: "mouseleave"
};

export default {
  name: "mapgis-marker",
  mixins: [withEvents, withSelfEvents],

  //@see https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5
  inject: ["mapbox", "map"],

  provide () {
    const self = this;
    return {
      get marker () {
        // 提供marker给子组件popup或者插槽槽
        return self.marker;
      }
    };
  },

  props: {
    // mapbox marker options
    id: {
      type: String
    },
    offset: {
      type: [Object, Array],
      default: () => [0, 0]
    },
    coordinates: {
      type: Array,
      required: true
    },
    color: {
      type: String
    },
    anchor: {
      type: String,
      default: "center"
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      initial: true,
      marker: undefined
    };
  },

  watch: {
    coordinates (lngLat) {
      if (this.initial) return;
      this.marker.setLngLat(lngLat);
    },
    draggable (next) {
      if (this.initial) return;
      this.marker.setDraggable(next);
    }
  },

  mounted () {
    const markerOptions = {
      ...this.$props
    };
    if (this.$slots.marker) {
      markerOptions.element = this.$slots.marker[0].elm;
    }
    this.marker = new this.mapbox.Marker(markerOptions);

    if (this.$listeners["update:coordinates"]) {
      this.marker.on("dragend", event => {
        let newCoordinates;
        if (this.coordinates instanceof Array) {
          newCoordinates = [event.target._lngLat.lng, event.target._lngLat.lat];
        } else {
          newCoordinates = event.target._lngLat;
        }
        this.$emit("update:coordinates", newCoordinates);
      });
    }

    const eventNames = Object.keys(markerEvents);
    this.$_bindSelfEvents(eventNames, this.marker);

    this.initial = false;
    this.$_addMarker();
  },

  beforeDestroy () {
    if (this.map !== undefined && this.marker !== undefined) {
      this.marker.remove();
    }
  },

  methods: {
    $_addMarker () {
      this.marker.setLngLat(this.coordinates).addTo(this.map);
      this.$_bindMarkerDOMEvents();
      this.$_emitEvent("added", { marker: this.marker });
    },

    $_emitSelfEvent (event) {
      this.$_emitMapEvent(event, { marker: this.marker });
    },

    $_bindMarkerDOMEvents () {
      Object.keys(this.$listeners).forEach(key => {
        if (Object.values(markerDOMEvents).includes(key)) {
          this.marker._element.addEventListener(key, event => {
            this.$_emitSelfEvent(event);
          });
        }
      });
    },

    remove () {
      this.marker.remove();
      this.$_emitEvent("removed");
    },

    togglePopup () {
      return this.marker.togglePopup();
    }
  }
};
</script>
