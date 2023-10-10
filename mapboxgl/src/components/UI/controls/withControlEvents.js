import MapgisEventBusMapMixin from "../../../lib/eventbus/EventBusMapMixin";

const DrawSources = {
  HOT: "mapbox-gl-draw-hot",
  COLD: "mapbox-gl-draw-cold"
};
export default {
  mixins: [MapgisEventBusMapMixin],

  created() {
    this.$_initMapboxDom();
    this.drawEvents = this.$_initMapboxEvent().draw;
    this.measureEvents = this.$_initMapboxEvent().measure;
    this.editEvents = this.$_initMapboxEvent().edit;
  },

  methods: {
    $_initMapboxDom() {
      window.mapboxDom = {};
      window.mapboxDom.draw = {};
      window.mapboxDom.measure = {};
      window.mapboxDom.edit = {};
      window.mapboxDom.measureCom = {};
      return window.mapboxDom;
    },

    $_initMapboxEvent() {
      window.mapboxEvent = {};
      window.mapboxEvent.draw = [];
      window.mapboxEvent.measure = [];
      window.mapboxEvent.edit = [];
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
      this.$_removeEditControl();
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
      // 当测量组价和draw混用的时候，this.drawEvents为空，不能解绑事件，导致混乱
      window.mapboxEvent.draw = [...this.drawEvents];
    },

    $_unbindDrawEvents() {
      if (!this.map) return;
      if (this.drawEvents.length <= 0 && window.mapboxEvent.draw.length <= 0)
        return;
      if (this.drawEvents.length > 0) {
        this.drawEvents.forEach(e => {
          this.map && this.map.off(e.name, e.callback);
        });
      } else {
        window.mapboxEvent.draw.forEach(e => {
          this.map && this.map.off(e.name, e.callback);
        });
      }
      window.mapboxEvent.draw = [];
      this.drawEvents.length = 0;
      this.emitMapDrawRemove();
    },

    $_addMeasureControl(control, com) {
      if (!control) return;
      this.$_removeDrawControl();
      this.$_removeMeasureControl();
      this.$_removeEditControl();
      window.mapboxDom.measure = control;
      window.mapboxDom.measureCom = com;
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
        window.mapboxDom.measureCom = undefined;
      }
    },

    $_bindMeasureEvents(eventName, eventCallback) {
      if (!this.map) return;
      this.measureEvents.push({
        name: eventName,
        callback: eventCallback
      });
      this.map.on(eventName, eventCallback);
      window.mapboxEvent.measure = [...this.measureEvents];
    },

    $_unbindMeasureEvents() {
      if (!this.map) return;
      if (
        this.measureEvents.length <= 0 &&
        window.mapboxEvent.measure.length <= 0
      )
        return;
      if (this.measureEvents.length > 0) {
        this.measureEvents.forEach(e => {
          this.map && this.map.off(e.name, e.callback);
        });
      } else {
        window.mapboxEvent.measure.forEach(e => {
          this.map && this.map.off(e.name, e.callback);
        });
      }
      window.mapboxEvent.measure = [];
      this.measureEvents.length = 0;
      if (window.mapboxDom.measureCom) {
        window.mapboxDom.measureCom.coordinates = [];
      }
      this.emitMapMeasureRemove();
    },

    $_addEditControl(control) {
      if (!control) return;
      this.$_removeDrawControl();
      this.$_removeMeasureControl();
      this.$_removeEditControl();
      window.mapboxDom.edit = control;
      this.map && this.map.addControl(control);
    },

    $_removeEditControl() {
      this.$_removeSource(DrawSources.HOT);
      this.$_removeSource(DrawSources.COLD);
      if (
        window.mapboxDom.edit &&
        window.mapboxDom.edit.onAdd &&
        window.mapboxDom.edit.onRemove
      ) {
        if (!this.map) return;
        this.map.removeControl(window.mapboxDom.edit);
        window.mapboxDom.edit = undefined;
      }
    },

    $_bindEditEvents(eventName, eventCallback) {
      if (!this.map) return;
      this.editEvents.push({
        name: eventName,
        callback: eventCallback
      });
      this.map.on(eventName, eventCallback);
      window.mapboxEvent.edit = [...this.editEvents];
    },

    $_unbindEditEvents() {
      if (!this.map) return;
      if (this.editEvents.length <= 0 && window.mapboxEvent.edit.length <= 0)
        return;
      if (this.editEvents.length > 0) {
        this.editEvents.forEach(e => {
          this.map && this.map.off(e.name, e.callback);
        });
      } else {
        window.mapboxEvent.edit.forEach(e => {
          this.map && this.map.off(e.name, e.callback);
        });
      }
      window.mapboxEvent.edit = [];
      this.editEvents.length = 0;
      this.emitMapEditRemove();
    }
  }
};
