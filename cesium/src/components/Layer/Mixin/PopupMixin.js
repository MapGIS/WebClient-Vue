import VueOptions from "../../Base/Vue/VueOptions";
import Popup from "../../UI/Popup/Popup.vue";
import PopupContent from "../../UI/Geojson/Popup";
import PopupFeatureContent from "../../UI/Popup/PopupContent.vue";

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
    enableTips: {
      type: Boolean,
      default: false,
    },
    tipsOptions: {
      type: Object,
      default: () => {
        return { type: "default", title: "name" };
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
  },
  data() {
    return {
      pinMap: true,
      activeId: undefined,
      clickvisible: false,
      clickposition: {
        longitude: 110,
        latitude: 30,
        height: 0,
      },
      hovervisible: false,
      hoverposition: {
        longitude: 110,
        latitude: 30,
        height: 0,
      },
      currentClickInfo: [],
      currentHoverInfo: [],
      clickMode: "click",
      hoverMode: "hover",
    };
  },
  components: {
    Popup,
    PopupContent,
    PopupFeatureContent,
  },
  render(h) {
    let {
      pinMap,
      clickvisible,
      clickposition,
      hovervisible,
      hoverposition,
      customPopup,
      customTips,
      clickMode,
      hoverMode,
      currentClickInfo,
      currentHoverInfo,
      popupOptions,
      tipsOptions,
    } = this;
    const vm = this;
    const {
      title = "name",
      type = "default",
      enableSeparate = true,
      popupType = "table",
      fullHeight = 900,
    } = popupOptions;
    const feature = this.properties
      ? { properties: this.properties }
      : currentClickInfo && currentClickInfo.length > 0
      ? currentClickInfo[0]
      : { properties: {} };
    // 字符串或者数组
    const images = [];
    const description = "补充一段说明文字,默认字段description";
    const options = {
      type,
      popupType,
      images: images,
      description: description,
    };

    if (!pinMap) {
      const fs = currentClickInfo.forEach((f) => {
        f.images = feature.properties.images || images;
        f.content = feature.properties.description || description;
      });
      let features = feature ? [feature.properties] : currentClickInfo;
      return (
        <mapgis-ui-story-panel-large
          onClosePanel={this.$_onPinMap.bind(this)}
          onFlyTo={this.$_onFlyTo.bind(this)}
          dataSource={features}
          height={fullHeight}
        />
      );
    }

    let defaultSlot = this.$slots.default;
    let enableDefaultSlot = defaultSlot ? true : false;
    console.log("enableDefaultSlot", enableDefaultSlot, feature, popupOptions);

    if (customPopup || customTips) {
      return (
        <Popup
          position={clickposition}
          visible={clickvisible}
          forceRender={true}
        >
          <div ref="click">
            {customPopup && customPopup(currentClickInfo)}
            {!customPopup && (
              <PopupContent
                mode={clickMode}
                currentLayerInfo={currentClickInfo}
              ></PopupContent>
            )}
          </div>
          <div ref="hover">
            {customTips && customTips(currentHoverInfo)}
            {!customTips && (
              <PopupContent
                mode={hoverMode}
                currentLayerInfo={currentHoverInfo}
              ></PopupContent>
            )}
          </div>
        </Popup>
      );
    } else {
      return (
        <div class="mapgis-popup-default-wrapper">
          <Popup
            position={clickposition}
            visible={clickvisible}
            forceRender={true}
            onChange={this.$_changeVisible.bind(this)}
            onSeparate={this.$_separateMap.bind(this)}
            options={options}
          >
            <PopupFeatureContent feature={feature} popupOptions={popupOptions}>
              {enableDefaultSlot && defaultSlot}
            </PopupFeatureContent>
          </Popup>
          <Popup
            position={hoverposition}
            visible={hovervisible}
            forceRender={true}
          >
            <mapgis-ui-card>
              <span>
                {feature.properties.title || feature.properties[title]}
              </span>
            </mapgis-ui-card>
          </Popup>
        </div>
      );
    }
  },
  methods: {
    $_pickEvent(movement, mode, onSuccess, onFail) {
      const vm = this;
      const { Cesium, viewer, popupOptions } = this;
      const { clickMode, hoverMode } = this;
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
          if (mode == clickMode) {
            vm.clickvisible = false;
          } else {
            vm.hovervisible = false;
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
          if (mode == clickMode) {
            vm.clickvisible = true;
            vm.clickposition = {
              longitude: longitudeString2,
              latitude: latitudeString2,
              height: heightString2,
            };
          } else {
            vm.hovervisible = true;
            vm.hoverposition = {
              longitude: longitudeString2,
              latitude: latitudeString2,
              height: heightString2,
            };
          }
          let currentClickInfo = entities.map((e) => {
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
          onSuccess && onSuccess({ entities, movement, currentClickInfo });
        } else {
          if (mode == clickMode) {
            vm.clickvisible = false;
          } else {
            vm.hovervisible = false;
          }
          onFail && onFail();
        }
      }
    },
    $_bindClickEvent(onSuccess, onFail) {
      const vm = this;
      const { Cesium, viewer } = this;
      const { clickMode } = this;
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (movement) {
        vm.$_pickEvent(movement, clickMode, onSuccess, onFail);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      return handler;
    },
    $_bindHoverEvent(onSuccess, onFail) {
      const vm = this;
      const { Cesium, viewer } = this;
      const { hoverMode } = this;

      let hoverEvent = debounce(
        (movement) => {
          vm.$_pickEvent(movement, hoverMode, onSuccess, onFail);
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
      this.pinMap = false;
    },
    $_pinMap() {
      this.pinMap = true;
    },
    $_onPinMap() {
      this.pinMap = true;
    },
    $_onFlyTo() {},
  },
};
