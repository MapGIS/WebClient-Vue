import VueOptions from "../../Base/Vue/VueOptions";
import Popup from "../../UI/Popup/Popup.vue";
import PopupContent from "../../UI/Geojson/Popup";
import { getPopupHtml } from "../../UI/Popup/popupUtil";

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
      activeId: undefined,
      visible: false,
      position: {
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
      visible,
      position,
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
        <Popup
          position={position}
          visible={visible}
          forceRender={true}
          container={container}
        ></Popup>
      );
    }
  },
  methods: {
    $_renderPopup(h) {
      let {
        visible,
        position,
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
          <Popup
            position={position}
            visible={visible}
            forceRender={true}
            container={container}
          ></Popup>
        );
      }
    },
    $_bindEvent(onSuccess, onError) {
      const vm = this;
      const { Cesium, viewer, popupOptions } = this;
      let tempRay = new Cesium.Ray();
      let tempPos = new Cesium.Cartesian3();
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function(movement) {
        const scene = viewer.scene;
        if (scene.mode !== Cesium.SceneMode.MORPHING) {
          let cartesian = viewer.scene.pickPosition(movement.position);
          let ray = scene.camera.getPickRay(movement.position, tempRay);
          let cartesian2 = scene.globe.pick(ray, scene, tempPos);

          // 多选模式
          let entities = scene.drillPick(movement.position);
          if (entities.length <= 0) {
            vm.visible = false;
            return;
          }

          let longitudeString2, latitudeString2, heightString2;

          if (Cesium.defined(cartesian2)) {
            let cartographic2 = Cesium.Cartographic.fromCartesian(cartesian2);
            longitudeString2 = Cesium.Math.toDegrees(cartographic2.longitude);
            latitudeString2 = Cesium.Math.toDegrees(cartographic2.latitude);
            heightString2 = cartographic2.height;
          }

          if (cartesian || cartesian2) {
            vm.visible = true;
            vm.position = {
              longitude: longitudeString2,
              latitude: latitudeString2,
              height: heightString2
            };
            vm.currentClickInfo = entities.map(e => {
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
                      !["_propertyNames", "_definitionChanged"].find(
                        n => n == p
                      );
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
            onSuccess && onSuccess(entities);
          } else {
            vm.visible = false;
            onError && onError();
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      return handler;
    }
  }
};
