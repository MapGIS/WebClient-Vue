import Vue from 'vue';

import '@mapgis/mapbox-gl/dist/mapbox-gl.css';
import MapgisMapboxComponents from './components/mapbox';
import MapgisCesiumComponents from '../cesium/src/index';

Vue.use(MapgisMapboxComponents, {});
Vue.use(MapgisCesiumComponents, {});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}