import promisify from "map-promisified";

export default {
  created() {
    this.actions = {};
  },

  methods: {
    /**
     * @description 提供了一种同步调用地图行为的能力，采用promise方式封装
     * @example const actions = promisify(map); await actions.flyTo([10, 20])
     * @list {setCenter, panBy, panTo, setZoom, zoomTo, zoomIn, zoomOut, setBearing, rotateTo, resetNorth, snapToNorth, setPitch, fitBounds, fitScreenCoordinates, jumpTo, easeTo, flyTo}
     * @param {*} map mapboxgl.Map
     * @return { stop, setCenter, panBy, panTo, setZoom, zoomTo, zoomIn, zoomOut, setBearing, rotateTo, resetNorth, snapToNorth, setPitch, fitBounds, fitScreenCoordinates, jumpTo, easeTo, flyTo}
     */
    $_registerAsyncActions(map) {
      this.actions = {
        ...promisify(map),
        stop() {
          this.map.stop();
          const updatedProps = {
            pitch: this.map.getPitch(),
            zoom: this.map.getZoom(),
            bearing: this.map.getBearing(),
            center: this.map.getCenter()
          };
          Object.entries(updatedProps).forEach(prop => {
            this.$_updateSyncedPropsFabric(prop[0], prop[1])();
          });

          return Promise.resolve(updatedProps);
        }
      };
    }
  }
};
