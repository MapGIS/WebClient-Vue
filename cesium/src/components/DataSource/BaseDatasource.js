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
    /**
     * @type String
     * @description 该key的主要作用市用来记录Cesium的Source,primitive,
     * entity的内存中的引用数组的引用，从而避免vue对cesium的内存劫持
     */
    vueKey: { typs: String, default: "default" },
    /**
     * @type String
     * @description 该key的主要作用市用来记录Cesium的Source,primitive,
     * entity的内存中的引用数组的下标，从而避免vue对cesium的内存劫持
     */
    vueIndex: {
      typs: [String, Number],
      default: (Math.random() * 10000).toFixed(0)
    },
    url: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => {
        return {};
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
