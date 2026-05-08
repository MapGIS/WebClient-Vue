import * as Feature from "../../../service/comprehensive-query/util/feature";
import { LayerType as InnerLayerType } from "@mapgis/webclient-common";
export default {
  props: {
    // 挂靠的查询参数，比如三维简单要素类，如果有挂靠的查询参数，则拾取的要素属性使用从三维简单要素类里的内容
    searchParams: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    /**
     *
     * @param {*} layer 模型图层对象/模型子图层对象
     * @param {*} id 要素id
     * @returns 要素属性信息
     */
    async getFeatureProperties(layer, id) {
      if (this.searchParams) {
        const {
          domain,
          mapList,
          serverType,
          searchName,
          queryPrefix = "",
          querySuffix = "",
          _innerLayer,
        } = this.searchParams;
        let searchLayerIndex, gdbp;
        // 场景服务关联地图文档与简单要素类（包含三维简单要素类）
        // 地图服务查询使用docName和layerIndex进行地图文档查询，简单要素类使用gdbp查询
        const isBindDoc = serverType === "IGSMapImage";
        if (isBindDoc) {
          const searchMapDoc = mapList.find(
            (mapDoc) =>
              `${queryPrefix}${mapDoc.LayerName}${querySuffix}` === layer.title
          );

          if (!searchMapDoc) {
            return;
          }
          searchLayerIndex = searchMapDoc.ID;
        } else {
          gdbp = searchName;
        }
        let fields = this.getLayerFields(_innerLayer, searchLayerIndex);

        const featureSet = await Feature.FeatureQuery.query(
          {
            domain,
            f: "geojson",
            IncludeAttribute: true,
            IncludeGeometry: false,
            IncludeWebGraphic: false,
            where: null,
            gdbp,
            docName: searchName,
            layerIdxs: searchLayerIndex,
            rtnLabel: false,
            objectIds: id,
            requestType: "POST",
          },
          false,
          false
        );

        const feature = featureSet.features[0];
        if (!fields) {
          fields = featureSet.fields;
        }

        if (feature) {
          fields.unshift({
            name: "fid",
            alias: "",
            type: "long",
          });
          const properties = {};
          fields.forEach((item) => {
            const key = item.alias || item.aliasName || item.name;
            properties[key] = feature.properties[item.name];
          });

          return properties;
        }
      }
    },
    /**
     * 获取图层属性结构
     * @param _innerLayer webclient-common层图层对象
     * @param layerIndex 图层layerIndex
     * @returns 图层属性结构
     */
    getLayerFields(_innerLayer, layerIndex) {
      let fields;
      if (_innerLayer) {
        if (_innerLayer.type === InnerLayerType.IGSMapImage) {
          const targetSublayer = _innerLayer.findSublayerById(layerIndex);
          // IGS1.0的地图服务获从layer对象上获取fields属性时始终为空数组
          if (targetSublayer?.fields && targetSublayer?.fields.length) {
            fields = targetSublayer.fields.map((field) => {
              return {
                name: field.name,
                alias: field.alias,
                type: field.type,
              };
            });
          }
        } else if (_innerLayer.type === InnerLayerType.IGSFeature) {
          fields = _innerLayer.fields.map((field) => {
            return {
              name: field.name,
              alias: field.alias,
              // 类型带fld前缀的，去掉fld获取真实类型
              type: field.type.replace("fld", ""),
            };
          });
        }
      }
      return fields;
    },
  },
};
