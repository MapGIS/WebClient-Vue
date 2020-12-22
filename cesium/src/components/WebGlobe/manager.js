export function initManager() {
  window.CesiumZondy = window.CesiumZondy || {};
  window.CesiumZondy.TerrainManager = window.CesiumZondy.TerrainManager || {
    default: []
  };
  window.CesiumZondy.RasterManager = window.CesiumZondy.RasterManager || {
    default: []
  };
  window.CesiumZondy.LabelManager = window.CesiumZondy.LabelManager || {
    default: []
  };

  window.CesiumZondy.M3DIgsManager = window.CesiumZondy.M3DIgsManager || {
    default: []
  };
  window.CesiumZondy.M3DFileManager = window.CesiumZondy.M3DFileManager || {
    default: []
  };

  window.CesiumZondy.GlobesManager =
    window.CesiumZondy.GlobesManager || new BaseManager();

  window.CesiumZondy.Tileset3DManager =
    window.CesiumZondy.Tileset3DManager || new BaseManager();

  window.CesiumZondy.EntityManager =
    window.CesiumZondy.EntityManager || new EntityManager();
  window.CesiumZondy.GeojsonManager =
    window.CesiumZondy.GeojsonManager || new GeojsonManager();
  window.CesiumZondy.PopupManager =
    window.CesiumZondy.PopupManager || new PopupManager();
  window.CesiumZondy.OGCWMTSManager =
    window.CesiumZondy.OGCWMTSManager || new OGCWMTSManager();
  window.CesiumZondy.DragEditManager =
    window.CesiumZondy.DragEditManager || new DragEditManager();
  window.CesiumZondy.VectorTileManager =
    window.CesiumZondy.VectorTileManager || new VectorTileManager();
}

export class BaseManager {
  constructor(vueKey) {
    this.default = [];
    this.vueKey = vueKey || "default";
  }

  addSource(vueKey, vueIndex, source, options) {
    vueKey = vueKey ? vueKey : this.vueKey;
    vueIndex = vueIndex ? vueIndex : this.vueIndex;
    vueIndex = `${vueIndex}`;
    if (!this[vueKey]) {
      this[vueKey] = [];
    }
    this[vueKey].push({
      key: vueIndex,
      source: source,
      options: options
    });
  }

  deleteSource(vueKey, vueIndex) {
    let index = -1;
    vueIndex = `${vueIndex}`;
    this[vueKey].find((s, i) => {
      let result = false;
      if (s && s.key === vueIndex) {
        index = i;
        result = true;
      }
      return result;
    });
    if (index >= 0) {
      this[vueKey].splice(index, 1);
    }
  }

  findSource(vueKey, vueIndex) {
    vueKey = vueKey ? vueKey : this.vueKey;
    vueIndex = vueIndex ? vueIndex : this.vueIndex;
    vueIndex = `${vueIndex}`;
    let index = -1;
    let findSource = undefined;
    if (!this[vueKey]) return findSource;

    let find = this[vueKey].find((s, i) => {
      let result = false;
      if (s && s.key === vueIndex) {
        index = i;
        result = true;
      }
      return result;
    });
    if (find) {
      findSource = {
        ...find,
        index: index
      };
    }
    return findSource;
  }

  findAllSource(vueKey) {
    vueKey = vueKey ? vueKey : this.vueKey;
    return this[vueKey];
  }
}

export class GeojsonManager extends BaseManager {}
export class EntityManager extends BaseManager {}
export class DragEditManager extends BaseManager {}
export class PopupManager extends BaseManager {}
export class OGCWMTSManager extends BaseManager {}
export class VectorTileManager extends BaseManager {}
