import { CesiumInnerGraphicsLayer } from "@mapgis/webclient-cesium-plugin";
import {
  Zondy,
  FeatureServer,
  RendererUtil,
  BaseRenderer,
  Feature,
  FeatureSet,
  Geometry,
} from "@mapgis/webclient-common";
const { Renderer, Symbol, Color } = Zondy;
const { SimpleRenderer } = Renderer;
const { SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol } = Symbol;
export default {
  props: {
    opacity: {
      type: Number,
      default: 1,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    renderer: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    opacity(val) {
      if (this.innerLayer) {
        this.innerLayer.setOpacity(val);
      }
    },
    visible(val) {
      if (this.innerLayer) {
        this.innerLayer.setVisible(val);
      }
    },
    renderer(val, oldVal) {
      if (this.innerLayer && JSON.stringify(val) !== JSON.stringify(oldVal)) {
        this.reloadLayer();
      }
    },
  },
  methods: {
    // 构建cesiumInnerGraphicsLayer实例，后续看需不需要统一管理CesiumInnerGraphicsLayer实例
    getCesiumInnerGraphicsLayer(options) {
      return new CesiumInnerGraphicsLayer(options);
    },
    // 通过gdbp查询要素信息
    async queryFeaturesInLayers(gdbps, baseUrl) {
      const featureServer = new FeatureServer({
        url: baseUrl,
      });
      const {
        data: { featureSet },
      } = await featureServer.queryFeaturesInLayers({
        gdbp: gdbps,
        pageCount: 100000,
      });
      // 保存featureSet，更新的时候使用
      this.featureSet = featureSet.toJSON();
      return featureSet.features;
    },
    // 对fetureSet设置renderer
    featureSetApplyRenderer(features, renderer) {
      RendererUtil.updateRenderer(features, renderer);
    },
    // 将renderer格式的json对象转换为真正的renderer对象
    transfromRenderer(renderer) {
      return renderer.type ? BaseRenderer.fromJSON(renderer) : null;
    },
    // 判断是否为textSymbol
    isTextSymbol(renderer) {
      let type;
      switch (renderer.type) {
        case "simple":
          type = renderer?.symbol?.type;
          break;
        case "class-breaks":
          //   type = renderer?.classBreakInfos[0]?.symbol?.type;
          break;
        case "unique-value":
          //   type = renderer?.uniqueValueInfos[0]?.symbol?.type;
          break;
        default:
          break;
      }
      return type === "text";
    },
    // 获取textSymbol设置的字段
    getTextSymbolField(renderer) {
      const {
        symbol: { text },
      } = renderer;
      return text;
    },
    // geojson中的features对象构建FeatureSet
    constructFeatureSet(features) {
      const featureArr = [];
      features.forEach((item) => {
        try {
          const feature = new Feature({
            attributes: item.properties,
            geometry: Geometry.fromJSON(item.geometry),
          });
          featureArr.push(feature);
        } catch (error) {
          console.log(item);
        }
      });
      const featureSet = new FeatureSet({ features: featureArr });
      this.featureSet = featureSet.toJSON();
      return featureArr;
    },
    // 构建简单点的renderer
    getSimplePointRenderer(layerStyle) {
      return new SimpleRenderer({
        symbol: new SimpleMarkerSymbol({
          color: layerStyle.color,
          size: layerStyle.radius,
          outline: new SimpleLineSymbol({
            color: layerStyle.outlineColor,
            width: layerStyle.outlineWidth,
          }),
        }),
      });
    },
    // 构建简单线的renderer
    getSimpleLineRenderer(layerStyle) {
      return new SimpleRenderer({
        symbol: new SimpleLineSymbol({
          color: layerStyle.color,
          width: layerStyle.width,
        }),
      });
    },
    // 构建简单区的renderer
    getSimplePolygonRenderer(layerStyle) {
      return new SimpleRenderer({
        symbol: new SimpleFillSymbol({
          color: layerStyle.color,
          outline: new SimpleLineSymbol({
            color: layerStyle.outlineColor,
            width: layerStyle.lineWidth,
          }),
        }),
      });
    },

    // 添加图层
    addLayer(viewer, renderer, features) {
      const { opacity, visible } = this;
      if (!this.innerLayer) {
        this.innerLayer = this.getCesiumInnerGraphicsLayer({
          // id: vueIndex,
          viewer: viewer,
        });
      }
      // 统一专题图的文本类型需要处理
      if (this.isTextSymbol(renderer)) {
        const deepCloneRenderer = JSON.parse(JSON.stringify(renderer));
        const field = deepCloneRenderer.symbol.text;
        features.forEach((feature) => {
          // 获取真实的textSymbol
          const attributes = feature.attributes || {};
          deepCloneRenderer.symbol.text = attributes[field];
          const transformRenderer = this.transfromRenderer(deepCloneRenderer);
          feature.symbol = transformRenderer.symbol;
          this.innerLayer.add(feature);
        });
      } else {
        const transformRenderer = this.transfromRenderer(renderer);
        this.featureSetApplyRenderer(features, transformRenderer);

        features.forEach((feature) => {
          this.innerLayer.add(feature);
        });
      }
      // 设置透明度
      this.innerLayer.setOpacity(opacity);
      // 设置是否显示
      this.innerLayer.setVisible(visible);
    },
    // 更新图层
    reloadLayer() {
      const { renderer, opacity, visible } = this;
      const featureArr = FeatureSet.fromJSON(this.featureSet).features;
      const featureSet = [];
      const isTextRenderer = this.isTextSymbol(renderer);
      if (isTextRenderer) {
        this.innerLayer.removeAll();
        const deepCloneRenderer = JSON.parse(JSON.stringify(renderer));
        const field = deepCloneRenderer.symbol.text;
        featureArr.forEach((feature) => {
          // 获取真实的textSymbol
          const attributes = feature.attributes || {};
          deepCloneRenderer.symbol.text = attributes[field];
          feature.symbol = deepCloneRenderer.symbol;
          featureSet.push(Feature.fromJSON(feature));
        });
      } else {
        featureArr.forEach((feature) => {
          featureSet.push(Feature.fromJSON(feature));
        });
        this.featureSetApplyRenderer(
          featureSet,
          BaseRenderer.fromJSON(renderer)
        );
      }

      featureSet.forEach((feature) => {
        isTextRenderer
          ? this.innerLayer.add(feature)
          : this.innerLayer.update(feature);
      });
      // 设置透明度
      this.innerLayer.setOpacity(opacity);
      // 设置是否显示
      this.innerLayer.setVisible(visible);
    },
  },
};
