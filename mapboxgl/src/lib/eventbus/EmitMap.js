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

export const emitMapAddThemeLayer = payload => {
  EventBus.$emit("map-add-theme-layer", payload);
};

export const emitMapEditThemeLayer = payload => {
  EventBus.$emit("map-edit-theme-layer", payload);
};

export const emitMapRemoveThemeLayer = payload => {
  EventBus.$emit("map-remove-theme-layer", payload);
};

export const emitMapOpenTable = payload => {
  EventBus.$emit("map-open-table", payload);
};

export const emitMapPrint = payload => {
  EventBus.$emit("map-print", payload);
};

export const emitDocumentAddThemeLayer = payload => {
  EventBus.$emit("document-add-theme-layer", payload);
};

export const emitDocumentEditThemeLayer = payload => {
  EventBus.$emit("document-edit-theme-layer", payload);
};

export const emitDocumentShowThemeLayer = payload => {
  EventBus.$emit("document-show-theme-layer", payload);
};

export const emitDocumentHideThemeLayer = payload => {
  EventBus.$emit("document-hide-theme-layer", payload);
};

export const emitDocumentRemoveThemeLayer = payload => {
  EventBus.$emit("document-remove-theme-layer", payload);
};

export const emitDocumentSaveThemeLayer = payload => {
  EventBus.$emit("document-save-theme-layer", payload);
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
  emitMapAddThemeLayer,
  emitMapRemoveThemeLayer,
  emitMapOpenTable,
  emitMapPrint,
  emitDocumentAddThemeLayer,
  emitDocumentEditThemeLayer,
  emitDocumentRemoveThemeLayer,
  emitDocumentShowThemeLayer,
  emitDocumentHideThemeLayer,
  emitDocumentSaveThemeLayer
};
