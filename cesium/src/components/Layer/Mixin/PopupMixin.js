import VueOptions from "../../Base/Vue/VueOptions";
import Popup from "../../UI/Popup/Popup.vue";
import PopupContent from "../../UI/Geojson/Popup";
import { getPopupHtml } from "../../UI/Popup/popupUtil";

import debounce from "lodash/debounce";

export default {
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
    enablePopup: {
      type: Boolean,
      default: false
    },
    popupOptions: {
      type: Object,
      default: () => {
        return { type: "default", title: "name" };
      }
    },
    enableTips: {
      type: Boolean,
      default: false
    },
    tipsOptions: {
      type: Object,
      default: () => {
        return { type: "default", title: "name" };
      }
    },
    /**
     *  自定义Popup界面,JSX语法Function(features) { return <div>自定义元素 {features[0]}</div>}
     */
    customPopup: Function,
    /**
     *  自定义Tips界面,JSX语法Function(features) { return <div>自定义元素 {features[0]}</div>}
     */
    customTips: Function
  },
  data() {
    return {
      pinMap: true,
      activeId: undefined,
      visible: false,
      position: {
        longitude: 110,
        latitude: 30,
        height: 0
      },
      hovervisible: false,
      hoverposition: {
        longitude: 110,
        latitude: 30,
        height: 0
      },
      currentClickInfo: [],
      currentHoverInfo: [],
      clickMode: "click",
      hoverMode: "hover"
    };
  },
  components: {
    Popup,
    PopupContent
  },
  render(h) {
    let {
      pinMap,
      visible,
      position,
      hovervisible,
      hoverposition,
      customPopup,
      customTips,
      clickMode,
      hoverMode,
      currentClickInfo,
      currentHoverInfo,
      popupOptions,
      tipsOptions
    } = this;

    const { type, enableSeparate } = popupOptions;
    const feature =
      currentClickInfo && currentClickInfo.length > 0
        ? currentClickInfo[0]
        : { properties: {} };

    let container = getPopupHtml(type, feature, {
      enableSeparate: enableSeparate,
      separateMap: this.$_separateMap,
      title: feature.title,
      fields: Object.keys(feature.properties),
      style: {
        containerStyle: { width: "360px" }
      }
    });
    if (!pinMap) {
      const images = "http://192.168.82.89:8086/static/assets/gallery/m3d.png";
      /* [
        "http://192.168.82.89:8086/static/assets/gallery/m3d.png",
        "http://192.168.82.89:8086/static/assets/gallery/biggps.png"
      ]; */
      const description = "这是一段说明文字";
      const fs = currentClickInfo.forEach(f => {
        f.images = images;
        f.content = description;
      });
      return (
        <mapgis-ui-story-panel-large
          onClosePanel={this.$_onPinMap.bind(this)}
          onFlyTo={this.$_onFlyTo.bind(this)}
          feature={currentClickInfo}
        />
      );
    }
    if (customPopup || customTips) {
      return (
        <Popup position={position} visible={visible} forceRender={true}>
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
        <div class="mapgis-geojson-default-wrapper">
          <Popup
            position={position}
            visible={visible}
            forceRender={true}
            container={container}
            onSeparate={this.$_separateMap.bind(this)}
          ></Popup>
          <Popup
            position={hoverposition}
            visible={hovervisible}
            forceRender={true}
          >
            <mapgis-ui-card>
              <span>{feature.title}</span>
            </mapgis-ui-card>
          </Popup>
        </div>
      );
    }
  },
  methods: {
    $_render(h) {
      let {
        visible,
        position,
        hovervisible,
        hoverposition,
        customPopup,
        customTips,
        clickMode,
        hoverMode,
        currentClickInfo,
        currentHoverInfo,
        popupOptions,
        tipsOptions
      } = this;

      const { type } = popupOptions;
      const feature =
        currentClickInfo && currentClickInfo.length > 0
          ? currentClickInfo[0]
          : { properties: {} };

      let container = getPopupHtml(type, feature, {
        title: feature.title,
        fields: Object.keys(feature.properties),
        style: {
          containerStyle: { width: "360px" }
        }
      });

      console.log("feature", feature);
      console.log("contarin", container);

      if (customPopup || customTips) {
        return (
          <Popup position={position} visible={visible} forceRender={true}>
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
          <div class="mapgis-geojson-default-wrapper">
            <Popup
              position={position}
              visible={visible}
              forceRender={true}
              container={container}
            ></Popup>
            <Popup
              position={hoverposition}
              visible={hovervisible}
              forceRender={true}
            >
              <mapgis-ui-card>
                <span>{feature.title}</span>
              </mapgis-ui-card>
            </Popup>
          </div>
        );
      }
    },
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
            vm.visible = false;
          } else {
            vm.hovervisible = false;
          }
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
            vm.visible = true;
            vm.position = {
              longitude: longitudeString2,
              latitude: latitudeString2,
              height: heightString2
            };
          } else {
            vm.hovervisible = true;
            vm.hoverposition = {
              longitude: longitudeString2,
              latitude: latitudeString2,
              height: heightString2
            };
          }
          let currentClickInfo = entities.map(e => {
            let info = {
              layer: { id: e.id ? e.id.id : "未知数据" },
              properties: {}
            };
            vm.activeId = e.id ? e.id.id : undefined;
            if (e.id && e.id.properties) {
              Object.keys(e.id.properties)
                .filter(p => {
                  let inner =
                    p.indexOf("Subscription") <= 0 &&
                    !["_propertyNames", "_definitionChanged"].find(n => n == p);
                  return inner;
                })
                .forEach(p => {
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
            vm.visible = false;
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
      handler.setInputAction(function(movement) {
        vm.$_pickEvent(movement, clickMode, onSuccess, onFail);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      return handler;
    },
    $_bindHoverEvent(onSuccess, onFail) {
      const vm = this;
      const { Cesium, viewer } = this;
      const { hoverMode } = this;

      let hoverEvent = debounce(
        movement => {
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
    $_separateMap() {
      this.pinMap = false;
    },
    $_pinMap() {
      this.pinMap = true;
    },
    $_onPinMap() {
      this.pinMap = true;
    },
    $_onFlyTo() {}
  }
};
