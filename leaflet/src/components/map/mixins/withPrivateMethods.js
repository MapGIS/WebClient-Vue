import { map, CRS } from "leaflet";

export default {
  methods: {
    /**
     * @description 在mounted组件里面调用该方法里面的Promise，主要是绑定map以及绑定各种属性以及行为
     */
    $_loadMap() {
      return new Promise((resolve) => {
        let crs = CRS.EPSG3857;
        let epsg = this._props.crs;
        if (typeof epsg === "string") {
          switch (epsg) {
            case "EPSG:3395":
              crs = CRS.EPSG3395;
              break;
            case "EPSG:3857":
              crs = CRS.EPSG3857;
              break;
            case "EPSG:4326":
              crs = CRS.EPSG4326;
              break;
          }
        }
        let props = {
          ...this._props,
          crs: crs,
        };
        const mapinstance = map(this.$refs.container, props);
        resolve(mapinstance);
      });
    },

    /**
     * @description 本质上是把mapbox的map的事件通过vue的emit方式封装发送
     * @param {*} events
     */
    $_bindMapEvents(events) {
      Object.keys(this.$listeners).forEach((eventName) => {
        if (events.includes(eventName)) {
          this.map.on(eventName, this.$_emitMapEvent);
        }
      });
    },

    $_unbindEvents(events) {
      events.forEach((eventName) => {
        this.map.off(eventName, this.$_emitMapEvent);
      });
    },
  },
};
