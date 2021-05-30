export const RasterLayerNames = [
  "mapgis-arcgis-map-layer",
  "mapgis-arcgis-tile-layer",
  "mapgis-igs-doc-layer",
  "mapgis-igs-tile-layer",
  "mapgis-ogc-wmts-layer",
  "mapgis-ogc-wms-layer"
];

export const LayerComNames = [].concat(RasterLayerNames);

export const LayerType = {
  Raster: [
    "mapgis-arcgis-map-layer",
    "mapgis-arcgis-tile-layer",
    "mapgis-igs-doc-layer",
    "mapgis-igs-tile-layer",
    "mapgis-ogc-wmts-layer",
    "mapgis-ogc-wms-layer"
  ]
};

export class DocumentUtil {
  constructor(map) {
    this.map = map;
  }

  flatLayers(layers, filterGroup = true) {
    // LayerComNames
  }

  getLayerType(name) {
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

  getLayerMapInfo(layerId) {
    const { map } = this;
    if (!map) return;
    const layer = map.getLayer(layerId);
    return layer;
  }
}

export default DocumentUtil;
