import EventBus from "./EventBusMap";

export const emitMapChangeStyle = mvtStyle => {
  EventBus.$options.mapaction.eventBusMvtStyle = mvtStyle;
  EventBus.$emit("map-change-style", mvtStyle);
};

export const emitMapAddLayer = () => {
  let count = ++EventBus.$options.mapaction.count;
  EventBus.$emit("map-add-layer", count);
};

export const emitMapRemoveLayer = () => {
  let count = ++EventBus.$options.mapaction.count;
  EventBus.$emit("map-remove-layer", count);
};

export const emitMapSetLayerPaint = () => {
  let count = --EventBus.$options.upload.count;
  EventBus.$emit("map-set-layer-paint", count);
};

export const emitMapSetLayerLayout = () => {
  let count = --EventBus.$options.upload.count;
  EventBus.$emit("map-set-layer-layout", count);
};

export const emitMapSetLayerFilter = () => {
  let count = --EventBus.$options.upload.count;
  EventBus.$emit("map-set-layer-filter", count);
};

export const emitMapSetLayerMinzoom = () => {
  let count = --EventBus.$options.upload.count;
  EventBus.$emit("map-set-layer-minzoom", count);
};

export const emitMapSetLayerMaxzoom = () => {
  let count = --EventBus.$options.upload.count;
  EventBus.$emit("map-set-layer-maxzoom", count);
};

export const emitMapActiveThemeLayer = payload => {
  EventBus.$emit("map-active-theme-layer", payload);
};

export const emitMapInactiveThemeLayer = payload => {
  EventBus.$emit("map-inactive-theme-layer", payload);
};

export default {
  emitMapChangeStyle,
  emitMapAddLayer,
  emitMapRemoveLayer,
  emitMapSetLayerPaint,
  emitMapSetLayerLayout,
  emitMapSetLayerFilter,
  emitMapSetLayerMinzoom,
  emitMapSetLayerMaxzoom,
  emitMapActiveThemeLayer,
  emitMapInactiveThemeLayer
};
