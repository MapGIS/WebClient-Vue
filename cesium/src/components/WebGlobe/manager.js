export function initManager() {
  window.CesiumZondy = window.CesiumZondy || {};

  window.CesiumZondy.GlobesManager =
    window.CesiumZondy.GlobesManager || new BaseManager();

  window.CesiumZondy.Tileset3DManager =
    window.CesiumZondy.Tileset3DManager || new BaseManager();
  window.CesiumZondy.EntityManager =
    window.CesiumZondy.EntityManager || new EntityManager();
  window.CesiumZondy.MarkerManager =
    window.CesiumZondy.MarkerManager || new MarkerManager();
  window.CesiumZondy.OGCWMTSManager =
    window.CesiumZondy.OGCWMTSManager || new OGCWMTSManager();
  window.CesiumZondy.FloodAnalysisManager =
    window.CesiumZondy.FloodAnalysisManager || new FloodAnalysisManager();
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
    window.CesiumZondy.IgsTerrainManager || new IgsTerrainManager();
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
  window.CesiumZondy.DynamicCuttingManager =
    window.CesiumZondy.DynamicCuttingManager || new DynamicCuttingManager();
  window.CesiumZondy.AnalysisManager =
    window.CesiumZondy.AnalysisManager || new AnalysisManager();
  window.CesiumZondy.AnalysisManager =
    window.CesiumZondy.AnalysisManager || new AnalysisManager();
  window.CesiumZondy.HeightLimitedAnalysisManager =
    window.CesiumZondy.HeightLimitedAnalysisManager ||
    new HeightLimitedAnalysisManager();
  window.CesiumZondy.shadowAnalysisManager =
    window.CesiumZondy.shadowAnalysisManager || new shadowAnalysisManager();
  window.CesiumZondy.IgsFeatureManager =
    window.CesiumZondy.IgsFeatureManager || new IgsFeatureManager();
  window.CesiumZondy.AspectAnalysisManager =
    window.CesiumZondy.AspectAnalysisManager || new AspectAnalysisManager();
  DynamicSectionAnalysisManager;
  window.CesiumZondy.DynamicSectionAnalysisManager =
    window.CesiumZondy.DynamicSectionAnalysisManager ||
    new DynamicSectionAnalysisManager();
  window.CesiumZondy.SlopeAnalysisManager =
    window.CesiumZondy.SlopeAnalysisManager || new SlopeAnalysisManager();
  window.CesiumZondy.SkyLineAnalysisManager =
    window.CesiumZondy.SkyLineAnalysisManager || new SkyLineAnalysisManager();
  window.CesiumZondy.ContourAnalysisManager =
    window.CesiumZondy.ContourAnalysisManager || new ContourAnalysisManager();
  window.CesiumZondy.ViewshedAnalysisManager =
    window.CesiumZondy.ViewshedAnalysisManager || new ViewshedAnalysisManager();
  window.CesiumZondy.VisiblityAnalysisManager =
    window.CesiumZondy.VisiblityAnalysisManager ||
    new VisiblityAnalysisManager();
  window.CesiumZondy.CutFillAnalysisManager =
    window.CesiumZondy.CutFillAnalysisManager || new CutFillAnalysisManager();
  window.CesiumZondy.ProfileAnalysisManager =
    window.CesiumZondy.ProfileAnalysisManager || new ProfileAnalysisManager();
}

export function initVueCesium() {
  window.vueCesium = window.vueCesium || {};
  window.vueCesium.G3DManager = window.vueCesium.G3DManager || new G3DManager();
  window.vueCesium.ViewerManager =
    window.vueCesium.ViewerManager || new ViewerManager();
  window.vueCesium.HighlightManager =
    window.vueCesium.HighlightManager || new HighlightManager();
  window.vueCesium.GeojsonManager =
    window.vueCesium.GeojsonManager || new GeojsonManager();
  window.vueCesium.PopupManager =
    window.vueCesium.PopupManager || new PopupManager();

  //在window.CesiumZondy下添加取得WebGlobe对象的方法
  window.vueCesium.getViewer = function(vueKey) {
    if (!vueKey) {
      vueKey = "default";
    }
    let ViewerManager = window.vueCesium.ViewerManager,
      viewer;
    viewer = ViewerManager[vueKey][0].source;
    return viewer;
  };

  /**
   * 通过轮询的方式取得webGlobeObj
   * @param callback 回调函数
   * @param vueKey vueKey，唯一标识webscene组件
   * */
  window.vueCesium.getViewerByInterval = function(callback, vueKey) {
    if (!vueKey) {
      vueKey = "default";
    }
    let ViewerManager = window.vueCesium.ViewerManager,
      viewer;
    let interval = setInterval(function() {
      if (
        ViewerManager.hasOwnProperty(vueKey) &&
        ViewerManager[vueKey].length > 0
      ) {
        clearInterval(interval);
        viewer = ViewerManager[vueKey][0].source;
        callback(viewer);
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

  changeSource(vueKey, vueIndex, source) {
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

    if (!source) {
      find.source = source;
    }
    return find;
  }

  changeOptions(vueKey, vueIndex, key, value) {
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
    find.options = find.options || {};
    find.options[key] = value;

    return find;
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
export class G3DManager extends BaseManager {}
export class ViewerManager extends BaseManager {}
export class HighlightManager extends BaseManager {}
export class ArcgisManager extends BaseManager {}
export class IgsDocLayerManager extends BaseManager {}
export class IgsTilecLayerManager extends BaseManager {}
export class IgsserverManager extends BaseManager {}
export class ExcavateAnalysisManager extends BaseManager {}
export class FloodAnalysisManager extends BaseManager {}
export class MarkerManager extends BaseManager {}
export class AnalysisModelFlattenManager extends BaseManager {}
export class DynamicCuttingManager extends BaseManager {}
export class AnalysisManager extends BaseManager {}
export class HeightLimitedAnalysisManager extends BaseManager {}
export class shadowAnalysisManager extends BaseManager {}
export class IgsFeatureManager extends BaseManager {}
export class AspectAnalysisManager extends BaseManager {}
export class DynamicSectionAnalysisManager extends BaseManager {}
export class SlopeAnalysisManager extends BaseManager {}
export class SkyLineAnalysisManager extends BaseManager {}
export class ContourAnalysisManager extends BaseManager {}
export class ViewshedAnalysisManager extends BaseManager {}
export class VisiblityAnalysisManager extends BaseManager {}
export class CutFillAnalysisManager extends BaseManager {}
export class ProfileAnalysisManager extends BaseManager {}
