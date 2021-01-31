import Vue from 'vue';

import '@mapgis/mapbox-gl/dist/mapbox-gl.css';
import ZondyMapboxComponents from '../mapboxgl/src';

Vue.use(ZondyMapboxComponents, {});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}