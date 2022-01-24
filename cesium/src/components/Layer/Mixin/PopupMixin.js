import VueOptions from "../../Base/Vue/VueOptions";
import debounce from "lodash/debounce";

export default {
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
    properties: {
      type: Object,
      /* default: () => {
        return { };
      } */
    },
    enablePopup: {
      type: Boolean,
      default: false,
    },
    enableTips: {
      type: Boolean,
      default: false,
    },
    enableIot: {
      type: Boolean,
      default: false,
    },
    popupOptions: {
      type: Object,
      default: () => {
        return {
          type: "default",
          title: "name",
          popupType: "table",
          fullHeight: 900,
        };
      },
    },
    tipsOptions: {
      type: Object,
      default: () => {
        return { type: "default", title: "name" };
      },
    },
    iotOptions: {
      type: Object,
      default: () => {
        return {
          field: "Euid",
        };
      },
    },
    /**
     *  自定义Popup界面,JSX语法Function(features) { return <div>自定义元素 {features[0]}</div>}
     */
    customPopup: Function,
    /**
     *  自定义Tips界面,JSX语法Function(features) { return <div>自定义元素 {features[0]}</div>}
     */
    customTips: Function,
    clickVisible: { type: Boolean, default: false },
    hoverVisible: { type: Boolean, default: false },
    clickPosition: {
      type: Object,
      default: () => {
        return { longitude: 0, latitude: 0, height: 0 };
      },
    },
    hoverPosition: {
      type: Object,
      default: () => {
        return { longitude: 0, latitude: 0, height: 0 };
      },
    },
    clickFeatures: {
      type: Array,
      default: () => [],
    },
    hoverFeatures: {
      type: Array,
      default: () => [],
    },
    clickMode: { type: String, default: "click" },
    hoverMode: { type: String, default: "hover" },
  },
  data() {
    return {
      iPinMap: true,
      activeId: undefined,
      iClickVisible: false,
      iClickPosition: {
        longitude: 110,
        latitude: 30,
        height: 0,
      },
      iHoverVisible: false,
      iHoverPosition: {
        longitude: 110,
        latitude: 30,
        height: 0,
      },
      iClickFeatures: [],
      iHoverFeatures: [],
      iClickMode: "click",
      iHoverMode: "hover",
    };
  },
  watch: {
    clickVisible(next) {
      this.iClickVisible = next;
    },
    clickPosition(next) {
      this.iClickPosition = next;
    },
    hoverVisible(next) {
      this.iHoverPosition = next;
    },
    hoverPosition(next) {
      this.iHoverPosition = next;
    },
    clickFeatures(next) {
      this.iClickFeatures = next;
    },
    hoverFeatures(next) {
      this.iHoverFeatures = next;
    },
  },
  methods: {
    $_pickEvent(movement, mode, onSuccess, onFail) {
      const vm = this;
      const { Cesium, viewer, popupOptions } = this;
      const { iClickMode, iHoverMode } = this;
      const scene = viewer.scene;
      let tempRay = new Cesium.Ray();
      let tempPos = new Cesium.Cartesian3();
      if (!movement) return;
      if (scene.mode !== Cesium.SceneMode.MORPHING) {
        // let cartesian = viewer.scene.pickPosition(movement.position);
        // let cartesian = viewer.scene.pickPositionWorldCoordinates(movement.position);
        let position = movement.position || movement.endPosition;
        let cartesian = viewer.getCartesian3Position(position);
        let ray = scene.camera.getPickRay(position, tempRay);
        let cartesian2 = scene.globe.pick(ray, scene, tempPos);

        // 多选模式
        let entities = scene.drillPick(position);
        if (entities.length <= 0) {
          if (mode == iClickMode) {
            vm.iClickVisible = false;
          } else {
            vm.iHoverVisible = false;
          }
          onFail && onFail({ movement });
          return;
        }

        let longitudeString2, latitudeString2, heightString2;

        if (Cesium.defined(cartesian2)) {
          let cartographic2 = Cesium.Cartographic.fromCartesian(cartesian);
          longitudeString2 = Cesium.Math.toDegrees(cartographic2.longitude);
          latitudeString2 = Cesium.Math.toDegrees(cartographic2.latitude);
          heightString2 = cartographic2.height;
        }

        if (cartesian || cartesian2) {
          if (mode == iClickMode) {
            vm.iClickVisible = true;
            vm.iClickPosition = {
              longitude: longitudeString2,
              latitude: latitudeString2,
              height: heightString2,
            };
          } else {
            vm.iHoverVisible = true;
            vm.iHoverPosition = {
              longitude: longitudeString2,
              latitude: latitudeString2,
              height: heightString2,
            };
          }
          let iClickFeatures = entities.map((e) => {
            let info = {
              layer: { id: e.id ? e.id.id : "未知数据" },
              properties: {},
            };
            vm.activeId = e.id ? e.id.id : undefined;
            if (e.id && e.id.properties) {
              Object.keys(e.id.properties)
                .filter((p) => {
                  let inner =
                    p.indexOf("Subscription") <= 0 &&
                    !["_propertyNames", "_definitionChanged"].find(
                      (n) => n == p
                    );
                  return inner;
                })
                .forEach((p) => {
                  let name = p.substr(1);
                  info.properties[name] = e.id.properties[p]._value;
                });
              info.layer.id =
                vm.layerId ||
                info.properties["name"] ||
                info.properties["title"];
              let titlefield = popupOptions ? popupOptions.title : undefined;
              if (titlefield) {
                info.title = info.properties[titlefield];
              }
            }
            return info;
          });
          vm.iClickFeatures = iClickFeatures;
          onSuccess && onSuccess({ entities, movement, iClickFeatures });
        } else {
          if (mode == iClickMode) {
            vm.iClickVisible = false;
          } else {
            vm.iHoverVisible = false;
          }
          onFail && onFail();
        }
      }
    },
    $_bindClickEvent(onSuccess, onFail) {
      const vm = this;
      const { Cesium, viewer } = this;
      const { iClickMode } = this;
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (movement) {
        vm.$_pickEvent(movement, iClickMode, onSuccess, onFail);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      return handler;
    },
    $_bindHoverEvent(onSuccess, onFail) {
      const vm = this;
      const { Cesium, viewer } = this;
      const { iHoverMode } = this;

      let hoverEvent = debounce(
        (movement) => {
          vm.$_pickEvent(movement, iHoverMode, onSuccess, onFail);
        },
        100,
        { leading: true }
      );

      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(
        hoverEvent,
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
      return handler;
    },
    $_changeVisible(visible) {},
    $_separateMap() {
      this.iPinMap = false;
    },
    $_pinMap() {
      this.iPinMap = true;
    },
    $_onPinMap() {
      this.iPinMap = true;
    },
    $_onFlyTo() {},
    $_getVideoStatus() {},
    $_handleProjectScreen() {},
  },
};
