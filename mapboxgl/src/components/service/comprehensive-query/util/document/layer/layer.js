import { Rectangle } from "@mapgis/webclient-es6-service/common/Rectangle";
import { ObjectTool } from "../../utils/object-tool";
/**
 * 图层加载状态
 *
 * @author Yuanye Ma
 * @date 19/03/2021
 * @enum {number}
 */
export var LoadStatus;
(function (LoadStatus) {
  /**
   * 没有加载过
   */
  LoadStatus[(LoadStatus["notLoaded"] = 0)] = "notLoaded";
  /**
   * 正在加载
   */
  LoadStatus[(LoadStatus["loading"] = 1)] = "loading";
  /**
   *  加载成功
   */
  LoadStatus[(LoadStatus["loaded"] = 2)] = "loaded";
  /**
   * 加载失败
   */
  LoadStatus[(LoadStatus["failed"] = 3)] = "failed";
})(LoadStatus || (LoadStatus = {}));
/**
 * 图层的类型
 *
 * @date 19/03/2021
 * @enum {number}
 */
export var LayerType;
(function (LayerType) {
  /**
   * 未知
   */
  LayerType[(LayerType["Unknown"] = 0)] = "Unknown";
  /**
   * 组图层
   */
  LayerType[(LayerType["Group"] = 1)] = "Group";
  /**
   * 瓦片服务图层
   */
  LayerType[(LayerType["Tile"] = 2)] = "Tile";
  /**
   * 地图服务图层
   */
  LayerType[(LayerType["MapImage"] = 3)] = "MapImage";
  /**
   * IGServer瓦片服务图层
   */
  LayerType[(LayerType["IGSTile"] = 4)] = "IGSTile";
  /**
   * IGServer地图服务图层
   */
  LayerType[(LayerType["IGSMapImage"] = 5)] = "IGSMapImage";
  /**
   * IGServer矢量服务图层
   */
  LayerType[(LayerType["IGSVector"] = 6)] = "IGSVector";
  /**
   * OGCWMTS服务图层
   */
  LayerType[(LayerType["OGCWMTS"] = 7)] = "OGCWMTS";
  /**
   * OGCWMS服务图层
   */
  LayerType[(LayerType["OGCWMS"] = 8)] = "OGCWMS";
  /**
   * ArcGIS瓦片服务图层
   */
  LayerType[(LayerType["ArcGISTile"] = 9)] = "ArcGISTile";
  /**
   * ArcGIS地图服务图层
   */
  LayerType[(LayerType["ArcGISMapImage"] = 10)] = "ArcGISMapImage";
  /**
   * 矢量瓦片图层
   */
  LayerType[(LayerType["VectorTile"] = 11)] = "VectorTile";
  /**
   * 互联网服务图层
   */
  LayerType[(LayerType["WebTile"] = 12)] = "WebTile";
  /**
   * 自定义瓦片服务图层
   */
  LayerType[(LayerType["CustomTile"] = 13)] = "CustomTile";
  /**
   * 自定义地图服务图层
   */
  LayerType[(LayerType["CustomMapImageLayer"] = 14)] = "CustomMapImageLayer";
  /**
   * 高德电子地图
   */
  LayerType[(LayerType["AMapMercatorEMap"] = 15)] = "AMapMercatorEMap";
  /**
   * 高德卫星影像图层
   */
  LayerType[(LayerType["AMapMercatorSatelliteMap"] = 16)] =
    "AMapMercatorSatelliteMap";
  /**
   * 高德卫星影像图注记图层
   */
  LayerType[(LayerType["AMapMercatorSatelliteAnnMap"] = 17)] =
    "AMapMercatorSatelliteAnnMap";
  /**
   * 三维模型缓存图层,用于显示三维模型缓存。如：m3d(中地定义的模型缓存格式)，osgb(osgb格式的倾斜摄影模型)、3dTileset(cesium标准的模型缓存)
   */
  LayerType[(LayerType["ModelCache"] = 18)] = "ModelCache";
  /**
   * 高程图层，用于接入地形服务
   */
  LayerType[(LayerType["Elevation"] = 19)] = "Elevation";
  /**
   * IGS高程图层，用于接入IGS三维服务中的地形服务
   */
  LayerType[(LayerType["IGSElevation"] = 20)] = "IGSElevation";
  /**
   *IGS场景图层,用于对接IGS的三维场景服务
   */
  LayerType[(LayerType["Scene"] = 21)] = "Scene";
  /**
   *IGS场景图层,用于对接IGS的三维场景服务
   */
  LayerType[(LayerType["IGSScene"] = 22)] = "IGSScene";
  /**
   * 覆盖物(临时绘制)图层
   *
   */
  LayerType[(LayerType["Graphics"] = 23)] = "Graphics";
  /**
   * 数据流
   *
   */
  LayerType[(LayerType["DataFlow"] = 24)] = "DataFlow";
  /**
  
     * 地理编码
     */
  LayerType[(LayerType["EsGeoCode"] = 25)] = "EsGeoCode";
  /**
   * 要素图层
   *
   */
  LayerType[(LayerType["Feature"] = 26)] = "Feature";
  /**
   * IGServer要素图层
   *
   */
  LayerType[(LayerType["IGSFeature"] = 27)] = "IGSFeature";
  /**
   * geoJson图层
   */
  LayerType[(LayerType["GeoJson"] = 28)] = "GeoJson";
})(LayerType || (LayerType = {}));
/**
 * 图层
 *
 * @author Yuanye Ma
 * @date 12/03/2021
 * @export
 * @class Layer
 */
export class Layer {
  /**
   * Creates an instance of Layer.
   * @date 22/04/2021
   * @param {Record<string, any>} [properties]
   * @memberof Layer
   */
  constructor(properties) {
    /**
     * 图层描述
     *
     * @date 22/04/2021
     * @memberof Layer
     */
    this.description = "";
    /**
     * 图层唯一id
     *
     * @author Yuanye Ma
     * @date 12/03/2021
     * @type {string}
     * @memberof Layer
     */
    this.id = "";
    /**
     * 图层加载状态
     *
     * @date 19/03/2021
     * @type {LoadStatus}
     * @memberof Layer
     */
    this.loadStatus = LoadStatus.notLoaded;
    /**
     * 不透明度
     * 范围：0——1,0:完全透明，1：完全不透明
     * 默认值:1.
     *
     * @date 19/03/2021
     * @memberof Layer
     */
    this.opacity = 1;
    /**
     * 图层标题
     * 图层在图层列表或图例中显示的名称
     *
     *
     * @date 19/03/2021
     * @memberof Layer
     */
    this.title = "";
    /**
     * 图层类型
     *
     * @date 19/03/2021
     * @type {LayerType}
     * @memberof Layer
     */
    this.type = LayerType.Unknown;
    /**
     * 是否可见
     *
     * @date 19/03/2021
     * @memberof Layer
     */
    this.isVisible = true;
    /**
     * 根据URL创建对应的图层
     *
     * @date 19/03/2021
     * @return {*}  {Promise<Layer>}
     * @memberof Layer
     */
    //   fromIGServerUrl(): Promise<Layer> {
    //     new Promise(resolve => {
    //       setTimeout(() => {
    //         resolve(new Layer())
    //       }, 2000)
    //     }).then(val => {
    //       console.log(val)
    //       return val
    //     })
    //   }
    this._fullExtent = new Rectangle(0.0, 0.0, 0.0, 0.0);
    if (!properties) return;
    if (properties.description) this.description = properties.description;
    if (properties.id) this.id = properties.id;
    if (properties.loadStatus) this.loadStatus = properties.loadStatus;
    if (properties.opacity) this.opacity = properties.opacity;
    if (properties.title) this.title = properties.title;
    if (properties.type) this.type = properties.type;
    if (properties.isVisible) this.isVisible = properties.isVisible;
    if (properties.fullExtent)
      this.fullExtent = ObjectTool.deepClone(properties.fullExtent);
  }
  /**
   * 全图范围
   *
   * @author Yuanye Ma
   * @date 12/03/2021
   * @type {Rectangle}
   * @memberof Layer
   */
  get fullExtent() {
    return this._fullExtent;
  }
  set fullExtent(rect) {
    this._fullExtent = rect;
  }
  // 定义一个深拷贝函数  接收目标target参数
  _deepClone(target) {
    return ObjectTool.deepClone(target);
  }
}
