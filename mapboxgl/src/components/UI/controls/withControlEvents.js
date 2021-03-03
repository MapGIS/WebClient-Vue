const DrawSources = {
  HOT: "mapbox-gl-draw-hot",
  COLD: "mapbox-gl-draw-cold"
};
export default {
  created() {
    this.$_initMapboxDom();
    this.drawEvents = this.$_initMapboxEvent().draw;
    this.measureEvents = this.$_initMapboxEvent().measure;
  },

  methods: {
    $_initMapboxDom() {
      window.mapboxDom = window.mapboxDom || {};
      window.mapboxDom.draw = window.mapboxDom.draw || {};
      window.mapboxDom.measure = window.mapboxDom.measure || {};
      return window.mapboxDom;
    },

    $_initMapboxEvent() {
      window.mapboxEvent = window.mapboxEvent || {};
      window.mapboxEvent.draw = window.mapboxEvent.draw || [];
      window.mapboxEvent.measure = window.mapboxEvent.measure || [];
      return window.mapboxEvent;
    },

    $_removeSource(source) {
      if (!this.map) return;
      if (this.map.getSource(source)) {
        const { layers } = this.map.getStyle();

        if (layers) {
          layers
            .filter(layer => layer.source === source)
            .forEach(layer => this.map.removeLayer(layer.id));
        }
        this.map.removeSource(source);
      }
    },

    $_addDrawControl(control) {
      if (!control) return;
      this.$_removeDrawControl();
      this.$_removeMeasureControl();
      window.mapboxDom.draw = control;
      this.map && this.map.addControl(control);
    },

    $_removeDrawControl() {
      this.$_removeSource(DrawSources.HOT);
      this.$_removeSource(DrawSources.COLD);
      if (
        window.mapboxDom.draw &&
        window.mapboxDom.draw.onAdd &&
        window.mapboxDom.draw.onRemove
      ) {
        if (!this.map) return;
        this.map.removeControl(window.mapboxDom.draw);
        window.mapboxDom.draw = undefined;
      }
    },

    $_bindDrawEvents(eventName, eventCallback) {
      if (!this.map) return;
      this.drawEvents.push({
        name: eventName,
        callback: eventCallback
      });
      this.map.on(eventName, eventCallback);
    },

    $_unbindDrawEvents() {
      if (!this.map) return;
      if (this.drawEvents.length <= 0) return;
      this.drawEvents.forEach(e => {
        this.map && this.map.off(e.name, e.callback);
      });
      this.drawEvents.length = 0;
    },

    $_addMeasureControl(control) {
      if (!control) return;
      this.$_removeDrawControl();
      this.$_removeMeasureControl();
      window.mapboxDom.measure = control;
      this.map && this.map.addControl(control);
    },

    $_removeMeasureControl() {
      this.$_removeSource(DrawSources.HOT);
      this.$_removeSource(DrawSources.COLD);

      if (
        window.mapboxDom.measure &&
        window.mapboxDom.measure.onAdd &&
        window.mapboxDom.measure.onRemove
      ) {
        if (!this.map) return;

        this.map.removeControl(window.mapboxDom.measure);
        window.mapboxDom.measure = undefined;
      }
    },

    $_bindMeasureEvents(eventName, eventCallback) {
      if (!this.map) return;
      this.measureEvents.push({
        name: eventName,
        callback: eventCallback
      });
      this.map.on(eventName, eventCallback);
    },

    $_unbindMeasureEvents() {
      if (!this.map) return;
      if (this.measureEvents.length <= 0) return;
      this.measureEvents.forEach(e => {
        this.map && this.map.off(e.name, e.callback);
      });
      this.measureEvents.length = 0;
    }
  }
};
