import { SceneView } from "@mapgis/webclient-cesium-plugin";
import {
  Map,
  GraphicsLayer,
  Feature,
  Geometry,
  GeometryType,
  PictureMarkerSymbol,
  ElevationInfo,
  ElevationMode,
} from "@mapgis/webclient-common";

export default class MarkerManager {
  constructor(Cesium, viewer) {
    this.entityArray = [];
    this.markerOptions = [];
    this.Cesium = Cesium;
    this.viewer = viewer;
    this.screenSpaceEventHandler = new this.Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
    this.commonMap = new Map();
    this.sceneView = new SceneView({
      // 视图
      innerView: viewer,
      // 图层管理容器
      map: this.commonMap,
      // 实例化SceneView对象时是否执行视角调整（goTo）操作
      initialGoTo: false,
    });
    this.graphicsCollection = new GraphicsLayer(viewer, {});
    this.commonMap.add(this.graphicsCollection);
  }

  static getInstance(Cesium, viewer) {
    if (!this.instance) {
      this.instance = new MarkerManager(Cesium, viewer);
      window.MarkerManager = this.instance;
    }
    return this.instance;
  }

  addGraphicMarker(marker) {
    const { Cesium, viewer, graphicsCollection } = this;
    const { mouseOver, mouseOut, leftClick } = marker;
    const {
      markerId,
      img,
      coordinates,
      name,
      iconWidth = 25,
      iconHeight = 25,
    } = marker;
    // 标注点添加鼠标事件
    marker.mouseOver =
      mouseOver !== undefined && mouseOver !== null
        ? mouseOver
        : (event) => {
            this.markerMouseOver(event, marker);
          };
    marker.mouseOut =
      mouseOut !== undefined && mouseOut !== null
        ? mouseOut
        : (event) => {
            this.markerMouseOut(event, marker);
          };
    marker.leftClick =
      leftClick !== undefined && leftClick !== null
        ? leftClick
        : (event) => {
            this.markerLeftClick(event, marker);
          };
    this.markerOptions.push(marker);
    if (this.markerOptions.length == 1) {
      this.registerMarkerMouseEvent();
    }

    const feature = new Feature({
      id: markerId,
      geometry: Geometry.fromJSON({
        type: GeometryType.point,
        coordinates,
      }),
      symbol: new PictureMarkerSymbol({
        width: iconWidth,
        height: iconHeight,
        url: img,
      }),
      elevationInfo: new ElevationInfo({
        mode: ElevationMode.OnTheScene,
      }),
    });
    graphicsCollection.add(feature);
    this.entityArray.push(feature);
  }

  updateMarkerImage(img, markerId) {
    if (!markerId) return;
    const feature = this.entityArray.find((item) => item.id === markerId);
    if (feature) {
      feature.symbol.url = img;
    }
  }

  removeGraphicById(id) {
    const feature = this.entityArray.find((item) => item.id === id);
    this.graphicsCollection.remove(feature);

    this.entityArray = this.entityArray.filter((item) => item.id !== id);
    this.markerOptions = this.markerOptions.filter(
      (item) => item.markerId !== id
    );
    if (this.markerOptions.length == 0) {
      this.unregisterMarkerMouseEvent();
    }
  }

  pickMarker(event) {
    if (this.markerOptions.length == 0) return;

    const options = this.markerOptions;
    const collection = this.viewer.scene.pick(event.endPosition);
    for (let i = 0; i < options.length; i += 1) {
      const option = options[i];
      if (
        collection &&
        collection.id &&
        collection.id._id &&
        collection.id._id === option.id
      ) {
        option.mouseOver(event);
        break;
      } else if (collection && collection.id === option.markerId) {
        // 以feature对象添加时的移入事件
        option.mouseOver(event);
        break;
      }
      if (i === options.length - 1) {
        option.mouseOut(event);
        break;
      }
    }
  }

  registerMarkerMouseEvent() {
    // 注册鼠标移动事件
    this.registerMouseEvent("MOUSE_MOVE", (event) => {
      // 标注点增加hover响应
      this.pickMarker(event);
    });
    this.registerMouseEvent("LEFT_CLICK", (event) => {
      if (this.markerOptions.length == 0) return;
      const options = this.markerOptions;
      const collection = this.viewer.scene.pick(event.position);
      for (let i = 0; i < options.length; i += 1) {
        const option = options[i];
        if (
          collection &&
          collection.id &&
          collection.id._id &&
          collection.id._id === option.id
        ) {
          option.leftClick(event);
          break;
        } else if (collection && collection.id === option.markerId) {
          // 以feature对象添加时的左键事件
          option.leftClick(event);
          break;
        }
      }
    });
  }

  registerMouseEvent(eventType, callbackFun) {
    if (this.screenSpaceEventHandler === undefined) {
      return;
    }
    const { ScreenSpaceEventType } = this.Cesium;
    let eventHandler;
    const self = this;
    if (eventType === "LEFT_CLICK") {
      eventHandler = this.screenSpaceEventHandler.setInputAction(function (
        movement
      ) {
        let outputLeftClick = true;
        if (typeof callbackFun === "function") {
          callbackFun(movement);
        } else {
          // 如果点的是marker，则不需要抛出CESIUM_LEFT_CLICK事件
          if (self.markerOptions.length > 0) {
            const options = self.markerOptions;
            const collection = self.viewer.scene.pick(movement.position);
            for (let i = 0; i < options.length; i += 1) {
              const option = options[i];
              if (
                collection &&
                collection.id &&
                collection.id._id &&
                collection.id._id === option.id
              ) {
                option.leftClick(movement);
                outputLeftClick = false;
                break;
              }
            }
          }
        }
        if (outputLeftClick) {
          // eventBus.$emit(events.CESIUM_LEFT_CLICK, movement)
        }
      },
      ScreenSpaceEventType.LEFT_CLICK);
    } else if (eventType === "LEFT_DOWN") {
      eventHandler = this.screenSpaceEventHandler.setInputAction(function (
        movement
      ) {
        if (typeof callbackFun === "function") {
          callbackFun(movement);
        }
      },
      ScreenSpaceEventType.LEFT_DOWN);
    } else if (eventType === "LEFT_UP") {
      eventHandler = this.screenSpaceEventHandler.setInputAction(function (
        movement
      ) {
        if (typeof callbackFun === "function") {
          callbackFun(movement);
        }
      },
      ScreenSpaceEventType.LEFT_UP);
    } else if (eventType === "LEFT_DOUBLE_CLICK") {
      eventHandler = this.screenSpaceEventHandler.setInputAction(function (
        movement
      ) {
        if (typeof callbackFun === "function") {
          callbackFun(movement);
        }
      },
      ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    } else if (eventType === "RIGHT_DOWN") {
      eventHandler = this.screenSpaceEventHandler.setInputAction(function (
        movement
      ) {
        if (typeof callbackFun === "function") {
          callbackFun(movement);
        }
      },
      ScreenSpaceEventType.RIGHT_DOWN);
    } else if (eventType === "RIGHT_UP") {
      eventHandler = this.screenSpaceEventHandler.setInputAction(function (
        movement
      ) {
        if (typeof callbackFun === "function") {
          callbackFun(movement);
        }
      },
      ScreenSpaceEventType.RIGHT_UP);
    } else if (eventType === "RIGHT_CLICK") {
      eventHandler = this.screenSpaceEventHandler.setInputAction(function (
        movement
      ) {
        if (typeof callbackFun === "function") {
          callbackFun(movement);
        }
      },
      ScreenSpaceEventType.RIGHT_CLICK);
    } else if (eventType === "MOUSE_MOVE") {
      eventHandler = this.screenSpaceEventHandler.setInputAction(function (
        movement
      ) {
        if (typeof callbackFun === "function") {
          callbackFun(movement);
        }
      },
      ScreenSpaceEventType.MOUSE_MOVE);
    } else if (eventType === "WHEEL") {
      eventHandler = this.screenSpaceEventHandler.setInputAction(function (
        movement
      ) {
        if (typeof callbackFun === "function") {
          callbackFun(movement);
        }
      },
      ScreenSpaceEventType.WHEEL);
    }
    return eventHandler;
  }

  unregisterMarkerMouseEvent() {
    this.unRegisterMouseEvent("MOUSE_MOVE");
    this.unRegisterMouseEvent("LEFT_CLICK");
  }

  unRegisterMouseEvent(eventType) {
    if (this.screenSpaceEventHandler === undefined) {
      return;
    }
    const { ScreenSpaceEventType } = this.Cesium;
    if (eventType === "LEFT_CLICK") {
      this.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.LEFT_CLICK
      );
    } else if (eventType === "LEFT_DOWN") {
      this.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.LEFT_DOWN
      );
    } else if (eventType === "LEFT_UP") {
      this.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.LEFT_UP
      );
    } else if (eventType === "LEFT_DOUBLE_CLICK") {
      this.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
    } else if (eventType === "RIGHT_DOWN") {
      this.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.RIGHT_DOWN
      );
    } else if (eventType === "RIGHT_UP") {
      this.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.RIGHT_UP
      );
    } else if (eventType === "RIGHT_CLICK") {
      this.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.RIGHT_CLICK
      );
    } else if (eventType === "MOUSE_MOVE") {
      this.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.MOUSE_MOVE
      );
    } else if (eventType === "WHEEL") {
      this.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.WHEEL
      );
    }
  }

  markerMouseOver(event, option) {}

  markerMouseOut(event, option) {}

  markerLeftClick(event, option) {}
}
