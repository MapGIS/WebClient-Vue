import bindEvents from "../Base/Cesium/CesiumBindEvent";
import { Events } from "../Base/Cesium/CesiumEvents";

const methods = {
  async mount() {
    const { webGlobe, datasource } = this;
    const { viewer } = webGlobe;
    const { dataSources } = viewer;
    bindEvents.call(this, datasource, Events["datasource-events"], true);
    Events["datasource-property-events"].forEach(eventName => {
      datasource[eventName.name] &&
        bindEvents.call(
          this,
          datasource[eventName.name],
          eventName.events,
          true
        );
    });
    return dataSources && dataSources.add(datasource);
  },
  async unmount() {
    const { dataSources, datasource } = this;
    bindEvents.call(this, datasource, Events["datasource-events"], false);
    Events["datasource-property-events"].forEach(eventName => {
      datasource[eventName.name] &&
        bindEvents.call(
          this,
          datasource[eventName.name],
          eventName.events,
          false
        );
    });
    return dataSources && dataSources.remove(datasource);
  }
};
export default {
  inject: ["Cesium", "webGlobe"],
  methods,
  props: {
    url: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => {
        return {
          markerSize: 48,
          strokeWidth: 2,
          clampToGround: false
        };
      }
    }
  },
  created() {
    this.datasource = this.createCesiumObject();
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  }
};
