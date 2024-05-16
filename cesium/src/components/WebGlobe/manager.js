import { SymbolManager } from "@mapgis/webclient-es6-service";

export function initManager() {
  window.vueCesium = window.vueCesium || {};
}

export function initVueCesium() {
  window.vueCesium = window.vueCesium || {};
  window.vueCesium.G3DManager = window.vueCesium.G3DManager || new G3DManager();
  window.vueCesium.ViewerManager =
    window.vueCesium.ViewerManager || new ViewerManager();
  window.vueCesium.HighlightManager =
    window.vueCesium.HighlightManager || new HighlightManager();
  window.vueCesium.RasterManager =
    window.vueCesium.RasterManager || new RasterManager();
  window.vueCesium.GeojsonManager =
    window.vueCesium.GeojsonManager || new GeojsonManager();
  window.vueCesium.KmlManager = window.vueCesium.KmlManager || new KmlManager();
  window.vueCesium.CzmlManager =
    window.vueCesium.CzmlManager || new CzmlManager();
  window.vueCesium.PopupManager =
    window.vueCesium.PopupManager || new PopupManager();
  window.vueCesium.ExplosionManager =
    window.vueCesium.ExplosionManager || new ExplosionManager();
  window.vueCesium.BloomEffectManager =
    window.vueCesium.BloomEffectManager || new BloomEffectManager();
  window.vueCesium.DynamicLightLineManager =
    window.vueCesium.DynamicLightLineManager || new DynamicLightLineManager();
  window.vueCesium.SearchLightManager =
    window.vueCesium.SearchLightManager || new SearchLightManager();
  window.vueCesium.IgsFeatureManager =
    window.vueCesium.IgsFeatureManager || new IgsFeatureManager();
  window.vueCesium.DynamicSectionAnalysisManager =
    window.vueCesium.DynamicSectionAnalysisManager ||
    new DynamicSectionAnalysisManager();
  window.vueCesium.HeightLimitedAnalysisManager =
    window.vueCesium.HeightLimitedAnalysisManager ||
    new HeightLimitedAnalysisManager();

  window.vueCesium.GlobesManager =
    window.vueCesium.GlobesManager || new BaseManager();

  window.vueCesium.Tileset3DManager =
    window.vueCesium.Tileset3DManager || new BaseManager();
  window.vueCesium.EntityManager =
    window.vueCesium.EntityManager || new EntityManager();
  window.vueCesium.MarkerManager =
    window.vueCesium.MarkerManager || new MarkerManager();
  window.vueCesium.OGCWMTSManager =
    window.vueCesium.OGCWMTSManager || new OGCWMTSManager();
  window.vueCesium.FloodAnalysisManager =
    window.vueCesium.FloodAnalysisManager || new FloodAnalysisManager();
  window.vueCesium.OGCWMSManager =
    window.vueCesium.OGCWMSManager || new OGCWMSManager();
  window.vueCesium.OGCWFSManager =
    window.vueCesium.OGCWFSManager || new OGCWFSManager();
  window.vueCesium.DragEditManager =
    window.vueCesium.DragEditManager || new DragEditManager();
  window.vueCesium.VectorTileManager =
    window.vueCesium.VectorTileManager || new VectorTileManager();
  window.vueCesium.AdvancedAnalysisManager =
    window.vueCesium.AdvancedAnalysisManager || new AdvancedAnalysisManager();
  window.vueCesium.DrawToolManager =
    window.vueCesium.DrawToolManager || new DrawToolManager();
  window.vueCesium.MeasureToolManager =
    window.vueCesium.MeasureToolManager || new MeasureToolManager();
  window.vueCesium.EventHandlerManager =
    window.vueCesium.EventHandlerManager || new EventHandlerManager();
  window.vueCesium.IgsTerrainManager =
    window.vueCesium.IgsTerrainManager || new IgsTerrainManager();
  window.vueCesium.TerrainManager =
    window.vueCesium.TerrainManager || new TerrainManager();
  window.vueCesium.M3DIgsManager =
    window.vueCesium.M3DIgsManager || new EventHandlerManager();
  window.vueCesium.ArcgisManager =
    window.vueCesium.ArcgisManager || new EventHandlerManager();
  window.vueCesium.WebTileManager =
    window.vueCesium.WebTileManager || new EventHandlerManager();
  window.vueCesium.IgsDocLayerManager =
    window.vueCesium.IgsDocLayerManager || new IgsDocLayerManager();
  window.vueCesium.IgsTilecLayerManager =
    window.vueCesium.IgsTilecLayerManager || new IgsTilecLayerManager();
  window.vueCesium.IgsserverManager =
    window.vueCesium.IgsserverManager || new EventHandlerManager();
  window.vueCesium.ExcavateAnalysisManager =
    window.vueCesium.ExcavateAnalysisManager || new ExcavateAnalysisManager();
  window.vueCesium.AnalysisModelFlattenManager =
    window.vueCesium.AnalysisModelFlattenManager ||
    new AnalysisModelFlattenManager();
  window.vueCesium.DynamicCuttingManager =
    window.vueCesium.DynamicCuttingManager || new DynamicCuttingManager();
  window.vueCesium.AnalysisManager =
    window.vueCesium.AnalysisManager || new AnalysisManager();
  window.vueCesium.shadowAnalysisManager =
    window.vueCesium.shadowAnalysisManager || new shadowAnalysisManager();
  window.vueCesium.AspectAnalysisManager =
    window.vueCesium.AspectAnalysisManager || new AspectAnalysisManager();
  window.vueCesium.SlopeAnalysisManager =
    window.vueCesium.SlopeAnalysisManager || new SlopeAnalysisManager();
  window.vueCesium.AspectAnalysisManager || new AspectAnalysisManager();
  window.vueCesium.AspectSlopeAnalysisManager =
    window.vueCesium.AspectSlopeAnalysisManager ||
    new AspectSlopeAnalysisManager();
  window.vueCesium.SkyLineAnalysisManager =
    window.vueCesium.SkyLineAnalysisManager || new SkyLineAnalysisManager();
  window.vueCesium.ContourAnalysisManager =
    window.vueCesium.ContourAnalysisManager || new ContourAnalysisManager();
  window.vueCesium.StratifiedHousehouldManager =
    window.vueCesium.StratifiedHousehouldManager ||
    new StratifiedHousehouldManager();
  window.vueCesium.ViewshedAnalysisManager =
    window.vueCesium.ViewshedAnalysisManager || new ViewshedAnalysisManager();
  window.vueCesium.VisiblityAnalysisManager =
    window.vueCesium.VisiblityAnalysisManager || new VisiblityAnalysisManager();
  window.vueCesium.CutFillAnalysisManager =
    window.vueCesium.CutFillAnalysisManager || new CutFillAnalysisManager();
  window.vueCesium.ProfileAnalysisManager =
    window.vueCesium.ProfileAnalysisManager || new ProfileAnalysisManager();
  window.vueCesium.DataFlowManager =
    window.vueCesium.DataFlowManager || new DataFlowManager();
  window.vueCesium.SettingToolManager =
    window.vueCesium.SettingToolManager || new SettingToolManager();
  window.vueCesium.MapStoryManager =
    window.vueCesium.MapStoryManager || new MapStoryManager();
  window.vueCesium.PondingSimulationManager =
    window.vueCesium.PondingSimulationManager || new PondingSimulationManager();
  window.vueCesium.GraphicsLayerManager =
    window.vueCesium.GraphicsLayerManager || new GraphicsLayerManager();
  window.vueCesium.BimManager = window.vueCesium.BimManager || new BimManager();
  window.vueCesium.RotateManager =
    window.vueCesium.RotateManager || new RotateManager();
  window.vueCesium.PlotLayerManager =
    window.vueCesium.PlotLayerManager || new PlotLayerManager();
  window.vueCesium.PlotLayerGroupManager =
    window.vueCesium.PlotLayerGroupManager || new PlotLayerGroupManager();
  window.vueCesium.PlotLayerData =
    window.vueCesium.PlotLayerData || new PlotLayerData();
  window.vueCesium.PlotManager =
    window.vueCesium.PlotManager || new PlotManager();
  window.vueCesium.OneSymbolManager =
    window.vueCesium.OneSymbolManager || new OneSymbolManager();
  window.vueCesium.PlotAnimationManager =
    window.vueCesium.PlotAnimationManager || new PlotAnimationManager();
  window.vueCesium.PlotSymbolManager =
    window.vueCesium.PlotSymbolManager || new PlotSymbolManager();
  window.vueCesium.M3DSubSectionManager =
    window.vueCesium.M3DSubSectionManager || new M3DSubSectionManager();
  window.vueCesium.CompareManager =
    window.vueCesium.CompareManager || new CompareManager();

  //在window.vueCesium下添加取得WebGlobe对象的方法
  window.vueCesium.getViewer = function (vueKey) {
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
  window.vueCesium.getViewerByInterval = function (callback, vueKey) {
    if (!vueKey) {
      vueKey = "default";
    }
    let ViewerManager = window.vueCesium.ViewerManager,
      viewer;
    let interval = setInterval(function () {
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
    vueIndex = vueIndex || vueIndex == 0 ? vueIndex : this.vueIndex;
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
    vueIndex = vueIndex || vueIndex == 0 ? vueIndex : this.vueIndex;
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

    if (source) {
      find.source = source;
    }
    return find;
  }

  changeOptions(vueKey, vueIndex, key, value) {
    vueKey = vueKey ? vueKey : this.vueKey;
    vueIndex = vueIndex || vueIndex == 0 ? vueIndex : this.vueIndex;
    vueIndex = `${vueIndex}`;
    let index = -1;
    let findSource = undefined;
    if (!this[vueKey] || this[vueKey].length == 0) return findSource;

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
    vueIndex = vueIndex || vueIndex == 0 ? vueIndex : this.vueIndex;
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
    Object.keys(this).forEach((k) => {
      if (k !== "vueKey") {
        flat = flat.concat(this[k]);
      }
    });
    return flat;
  }
}

export class RasterManager extends BaseManager {}
export class GeojsonManager extends BaseManager {}
export class KmlManager extends BaseManager {}
export class CzmlManager extends BaseManager {}
export class EntityManager extends BaseManager {}
export class DragEditManager extends BaseManager {}
export class PopupManager extends BaseManager {}
export class OGCWMTSManager extends BaseManager {}
export class OGCWMSManager extends BaseManager {}
export class OGCWFSManager extends BaseManager {}
export class VectorTileManager extends BaseManager {}
export class AdvancedAnalysisManager extends BaseManager {}
export class DrawToolManager extends BaseManager {}
export class MeasureToolManager extends BaseManager {}
export class EventHandlerManager extends BaseManager {}
export class IgsTerrainManager extends BaseManager {}
export class TerrainManager extends BaseManager {}
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
export class StratifiedHousehouldManager extends BaseManager {}
export class ViewshedAnalysisManager extends BaseManager {}
export class VisiblityAnalysisManager extends BaseManager {}
export class CutFillAnalysisManager extends BaseManager {}
export class ProfileAnalysisManager extends BaseManager {}
export class DataFlowManager extends BaseManager {}
export class ExplosionManager extends BaseManager {}
export class BloomEffectManager extends BaseManager {}
export class DynamicLightLineManager extends BaseManager {}
export class SettingToolManager extends BaseManager {}
export class SearchLightManager extends BaseManager {}
export class Tileset3DManager extends BaseManager {}
export class MapStoryManager extends BaseManager {}
export class PondingSimulationManager extends BaseManager {}
export class GraphicsLayerManager extends BaseManager {}
export class BimManager extends BaseManager {}
export class AspectSlopeAnalysisManager extends BaseManager {}
export class RotateManager extends BaseManager {}
export class PlotLayerManager extends BaseManager {}
export class PlotLayerGroupManager extends BaseManager {}
export class PlotLayerData extends BaseManager {}
export class PlotManager extends BaseManager {}
export class OneSymbolManager extends BaseManager {}
export class PlotAnimationManager extends BaseManager {}
export class PlotSymbolManager extends BaseManager {}
export class M3DSubSectionManager extends BaseManager {}
export class CompareManager extends BaseManager {}
