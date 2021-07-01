export function initManager() {
  window.CesiumZondy = window.CesiumZondy || {};
  window.CesiumZondy.TerrainManager = window.CesiumZondy.TerrainManager || {
    default: []
  };
  window.CesiumZondy.LabelManager = window.CesiumZondy.LabelManager || {
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
  window.CesiumZondy.FloodAnalyseManager =
    window.CesiumZondy.FloodAnalyseManager || new FloodAnalyseManager();
  window.CesiumZondy.OGCWMSManager =
    window.CesiumZondy.OGCWMSManager || new OGCWMSManager();
  window.CesiumZondy.DragEditManager =
    window.CesiumZondy.DragEditManager || new DragEditManager();
  window.CesiumZondy.VectorTileManager =
    window.CesiumZondy.VectorTileManager || new VectorTileManager();
  window.CesiumZondy.AdvancedAnalysisManager =
    window.CesiumZondy.AdvancedAnalysisManager || new AdvancedAnalysisManager();
  window.CesiumZondy.DrawToolManager =
    window.CesiumZondy.DrawToolManager || new DrawToolManager();
  window.CesiumZondy.MeasureToolManager =
    window.CesiumZondy.MeasureToolManager || new MeasureToolManager();
  window.CesiumZondy.EventHandlerManager =
    window.CesiumZondy.EventHandlerManager || new EventHandlerManager();
  window.CesiumZondy.IgsTerrainManager =
    window.CesiumZondy.IgsTerrainManager || new EventHandlerManager();
  window.CesiumZondy.M3DIgsManager =
    window.CesiumZondy.M3DIgsManager || new EventHandlerManager();
  window.CesiumZondy.ArcgisManager =
    window.CesiumZondy.ArcgisManager || new EventHandlerManager();
  window.CesiumZondy.IgsDocLayerManager =
    window.CesiumZondy.IgsDocLayerManager || new IgsDocLayerManager();
  window.CesiumZondy.IgsTilecLayerManager =
    window.CesiumZondy.IgsTilecLayerManager || new IgsTilecLayerManager();
  window.CesiumZondy.IgsserverManager =
    window.CesiumZondy.IgsserverManager || new EventHandlerManager();
  window.CesiumZondy.ExcavateAnalysisManager =
    window.CesiumZondy.ExcavateAnalysisManager || new ExcavateAnalysisManager();
  window.CesiumZondy.AnalysisModelFlattenManager =
    window.CesiumZondy.AnalysisModelFlattenManager ||
    new AnalysisModelFlattenManager();

  //在window.CesiumZondy下添加取得WebGlobe对象的方法
  window.CesiumZondy.getWebGlobe = function(vueKey) {
    if (!vueKey) {
      vueKey = "default";
    }
    let GlobesManager = window.CesiumZondy.GlobesManager,
      webGlobeObj;
    webGlobeObj = GlobesManager[vueKey][0].source;
    return webGlobeObj;
  };

  /**
   * 通过轮询的方式取得webGlobeObj
   * @param callback 回调函数
   * @param vueKey vueKey，唯一标识webscene组件
   * */
  window.CesiumZondy.getWebGlobeByInterval = function(callback, vueKey) {
    if (!vueKey) {
      vueKey = "default";
    }
    let GlobesManager = window.CesiumZondy.GlobesManager,
      webGlobeObj;
    let interval = setInterval(function() {
      if (
        GlobesManager.hasOwnProperty(vueKey) &&
        GlobesManager[vueKey].length > 0
      ) {
        clearInterval(interval);
        webGlobeObj = GlobesManager[vueKey][0].source;
        callback(webGlobeObj);
      }
    }, 50);
  };
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
      parent: vueKey,
      key: vueIndex,
      source: source,
      options: options
    });
  }

  deleteSource(vueKey, vueIndex) {
    let index = -1;
    vueIndex = `${vueIndex}`;
    if (this[vueKey] instanceof Array) {
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

  flatAllSource() {
    let flat = [];
    Object.keys(this).forEach(k => {
      if (k !== "vueKey") {
        flat = flat.concat(this[k]);
      }
    });
    return flat;
  }
}

export class RasterManager extends BaseManager {}
export class GeojsonManager extends BaseManager {}
export class EntityManager extends BaseManager {}
export class DragEditManager extends BaseManager {}
export class PopupManager extends BaseManager {}
export class OGCWMTSManager extends BaseManager {}
export class OGCWMSManager extends BaseManager {}
export class VectorTileManager extends BaseManager {}
export class AdvancedAnalysisManager extends BaseManager {}
export class DrawToolManager extends BaseManager {}
export class MeasureToolManager extends BaseManager {}
export class EventHandlerManager extends BaseManager {}
export class IgsTerrainManager extends BaseManager {}
export class M3DIgsManager extends BaseManager {}
export class ArcgisManager extends BaseManager {}
export class IgsDocLayerManager extends BaseManager {}
export class IgsTilecLayerManager extends BaseManager {}
export class IgsserverManager extends BaseManager {}
export class ExcavateAnalysisManager extends BaseManager {}
export class FloodAnalyseManager extends BaseManager {}
export class AnalysisModelFlattenManager extends BaseManager {}