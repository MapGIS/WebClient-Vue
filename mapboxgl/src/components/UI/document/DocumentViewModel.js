const RasterLayerNames = [
  "mapgis-arcgis-map-layer",
  "mapgis-arcgis-tile-layer",
  "mapgis-igs-doc-layer",
  "mapgis-igs-tile-layer",
  "mapgis-ogc-wmts-layer",
  "mapgis-ogc-wms-layer"
];

const LayerComNames = [].concat(RasterLayerNames);

const LayerType = {
  raster: [
    "mapgis-arcgis-map-layer",
    "mapgis-arcgis-tile-layer",
    "mapgis-igs-doc-layer",
    "mapgis-igs-tile-layer",
    "mapgis-ogc-wmts-layer",
    "mapgis-ogc-wms-layer"
  ]
};

export class Document {
  constructor(options) {
    const { map, layers } = options;
    this.map = map;
    this.layers = layers || [];
  }

  setLayers(layers) {
    this.layers = layers || [];
  }

  flatLayers(layers, filterGroup = true) {
    // LayerComNames
  }

  getLayerComInfo(tag) {
    let layer = {
      icon: "",
      name: ""
    };

    if (tag.match("mapgis-arcgis-map-layer")) {
      layer.icon = "mapgis-yingxiangronghe";
      layer.name = "mapgis-arcgis-map-layer";
    } else if (tag.match("mapgis-arcgis-tile-layer")) {
      layer.icon = "mapgis-yingxiangronghe";
      layer.name = "mapgis-arcgis-tile-layer";
    } else if (tag.match("mapgis-igs-doc-layer")) {
      layer.icon = "mapgis-tianjiaIGServer";
      layer.name = "mapgis-igs-doc-layer";
    } else if (tag.match("mapgis-igs-tile-layer")) {
      layer.icon = "mapgis-tianjiaIGServer";
      layer.name = "mapgis-igs-tile-layer";
    } else if (tag.match("mapgis-ogc-wmts-layer")) {
      layer.icon = "mapgis-shuchuweiWebsuoyonggeshi";
      layer.name = "mapgis-ogc-wmts-layer";
    } else if (tag.match("mapgis-ogc-wms-layer")) {
      layer.icon = "mapgis-shuchuweiWebsuoyonggeshi";
      layer.name = "mapgis-ogc-wms-layer";
    }
    return layer;
  }

  getLayerMapType(name) {
    let types = Object.keys(LayerType);
    for (let i = 0; i < types; i++) {
      const type = types[i];
      const layers = LayerType[type];
      for (let j = 0; j < layers; j++) {
        const layer = layers[j];
        if (layer.match(name)) {
          return type;
        }
      }
    }
    return undefined;
  }

  getLayerMapInfo(layerId) {
    const { map } = this;
    if (!map) return;
    const layer = map.getLayer(layerId);
    return layer;
  }
}

export default Document;
