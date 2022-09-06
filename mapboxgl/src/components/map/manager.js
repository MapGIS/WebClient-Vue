import { SymbolManager } from "@mapgis/webclient-es6-service";

export function initManager() {
  window.vueMap = window.vueMap || {};
}

export function initVueMap() {
  window.vueMap = window.vueMap || {};
  window.vueMap.MapManager = window.vueMap.MapManager || new MapManager();
  window.vueMap.PlotLayerManager =
    window.vueMap.PlotLayerManager || new PlotLayerManager();
  window.vueMap.PlotLayerGroupManager =
    window.vueMap.PlotLayerGroupManager || new PlotLayerGroupManager();
  window.vueMap.PlotLayerData =
    window.vueMap.PlotLayerData || new PlotLayerData();
  window.vueMap.PlotManager = window.vueMap.PlotManager || new PlotManager();
  window.vueMap.OneSymbolManager =
    window.vueMap.OneSymbolManager || new OneSymbolManager();
  window.vueMap.PlotAnimationManager =
    window.vueMap.PlotAnimationManager || new PlotAnimationManager();
  window.vueMap.PlotSymbolManager =
    window.vueMap.PlotSymbolManager || new PlotSymbolManager();
  window.vueMap.DrawToolManager =
    window.vueMap.DrawToolManager || new DrawToolManager();
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
    Object.keys(this).forEach(k => {
      if (k !== "vueKey") {
        flat = flat.concat(this[k]);
      }
    });
    return flat;
  }
}

export class MapManager extends BaseManager {}
export class PlotLayerManager extends BaseManager {}
export class PlotLayerGroupManager extends BaseManager {}
export class PlotLayerData extends BaseManager {}
export class PlotManager extends BaseManager {}
export class OneSymbolManager extends BaseManager {}
export class PlotAnimationManager extends BaseManager {}
export class PlotSymbolManager extends BaseManager {}
export class DrawToolManager extends BaseManager {}
