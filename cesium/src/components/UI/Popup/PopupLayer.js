import { updataPopupPosition } from "./popup/popup";

let popupsIdIndex = 0;

/**
 * @author 基础平台/创新中心 潘卓然
 * @class module:客户端可视化.PopupLayer
 * @classdesc 弹出窗图层
 * @description PopupLayer cesium的popup的实现
 * @param {Viewer} map 传入的cesium的地图对象viewer
 * @param {Entity} [position.entity]  实体,内部获取坐标点cartesian, 输入此参数可忽略下面的，cartesian，longitude,latitude
 * @param {Cartesian3} [position.cartesian] 笛卡尔积坐标点cartesian, 输入此参数可忽略下面的longitude,latitude
 * @param {Number} [position.longitude] 经度, 先判断cartesian是否存在，存在忽略此参数
 * @param {Number} [position.latitude] 纬度, 先判断cartesian是否存在，存在忽略此参数
 * @param {Number}  [position.height] 高度, 可选 默认0
 * @param {String} [options.popupId] 本次popup对应的唯一id,不传随机生成
 * @param {String} [options.popupContentId] 本次popup对应的唯一内容id
 * @param {Boolean} [options.postRender=true] 是否实时渲染
 * @param {Boolean} [options.showClose=true]  是否显示关闭按钮
 * @param {Object} [options.callback]
 * @param {Function} [options.callback.onShow] 显示popup事件的回调
 * @param {Function} [options.callback.onHide] 隐藏popup事件的回调
 * @param {Function} [options.callback.onSeparate] 分离popup事件的回调
 * @param {Function} [options.popupType = 'table'] Popup的默认样式 'table' 'card' 'relation'
 * @param {Function} [options.images] Popup的样式为'relation'时，图片描述
 * @param {Function} [options.description] Popup的样式为'relation'时，文字描述
 * @param {Element|String} container 外部传入的div的字符串描述方式，一般是文字或者echarts的div;
 *
 * @example 这里唯一要注意的是我们中地数码的ceisum的右键事件不是放大缩小而是旋转视角
 * let cartesian1 = Cesium.Cartesian3.fromDegrees(
          100.108861,
          27.871516,
          0
        );
        let cartesian2 = Cesium.Cartesian3.fromDegrees(
          90.108861,
          37.871516,
          0
        );
        let cartesian3 = Cesium.Cartesian3.fromDegrees(
          116.108861,
          30.871516,
          0
        );
        popups = [cartesian1, cartesian2, cartesian3].map((c) => {
          const popup = new PopupLayer(
            webGlobe.viewer,
            {
              cartesian: c,
            },
            {
              popupId: "cesium-popup-id-1", //要保证唯一性
              popupContentId: "cesium-popup-content-id-1", //要保证唯一性
              postRender: true, //是否实时刷新
              showClose: false,
            },
          '<div id="echarts_id" style="height:100px;width:200px;color:#fff;">echats内容</div>'
        );
        return popup;
      });
 */
export default class PopupLayer {
  constructor(
    map,
    position,
    options,
    container,
    popupWapperStyle,
    popupHeaderStyle,
    popupCloseBtnStyle
  ) {
    this.map = map;
    this.scene = map.scene;

    this.position = position;
    this.options = options;
    this.container = container;

    this.popupWapperStyle = popupWapperStyle;
    this.popupHeaderStyle = popupHeaderStyle;
    this.popupCloseBtnStyle = popupCloseBtnStyle;

    this.popupId = options.popupId || "cesium-popup-id-" + popupsIdIndex++;
    this.popupClass = options.popupClass || "cesium-popup";
    this.popupTitle = options.title;
    this.popupContentId =
      options.popupContentId || "cesium-popup-content-id-" + popupsIdIndex++;

    this.options.postRender =
      this.options.postRender === undefined ? true : this.options.postRender;
    this.Cesium = options.Cesium || window["Cesium"];

    this.scene = map.scene;
    this.camera = map.camera;
    this.isShow = true;

    if (options.callback) {
      const { onShow, onHide, onSeparate } = options.callback;
      this.onShow = onShow;
      this.onHide = onHide;
      this.onSeparate = onSeparate;
    }

    let ScreenSpaceEventHandler =
      this.Cesium.ScreenSpaceEventHandler ||
      window["Cesium"].ScreenSpaceEventHandler;

    this.handler = new ScreenSpaceEventHandler(this.scene.canvas);

    this.infoDiv = null;
    // this.px_position = null;
    if (position.entity) {
      this.cartesian = position.entity.position._value;
    }

    this.cartesian =
      this.cartesian ||
      this.position.cartesian ||
      this.Cesium.Cartesian3.fromDegrees(
        this.position.longitude,
        this.position.latitude,
        this.position.height
      );

    let vc = this.map.container;
    let cesumWidgetContainer = undefined;
    if (vc.children && vc.children.length > 0) {
      if (vc.children[0].children && vc.children[0].children.length > 0) {
        if (
          vc.children[0].children[0].children &&
          vc.children[0].children[0].children.length > 0
        ) {
          cesumWidgetContainer = vc.children[0].children[0].children[0];
        }
      }
    }

    if (!cesumWidgetContainer) {
      let parents = document.getElementsByClassName("cesium-widget");
      parent = parents.length > 0 ? parents[0] : map.container;
      this.parent = parent;
    } else {
      this.parent = cesumWidgetContainer;
    }

    // this.initDevicePixelRatio();
    this.showClose = options.showClose === undefined ? true : options.showClose;
    this.popupType = options.popupType;
    this.images = options.images;
    this.description = options.description;
    this.popup = this._createPopup();

    this.moveStart = this.eventMoveStart.bind(this);
    this.moveEnd = this.eventMoveEnd.bind(this);
    this.movement = this.movement.bind(this);
    this.update = this.update.bind(this);

    this.updateEvent = () => this.update();

    this.bindEvent();

    return this;
  }

  /**
   * @description 当时是为了刻意适配一张图的需求才做下面的分支的
   * 核心思想是走dom-slot机制的就通过jsx的方式来渲染，走innerHtml的通过v-html/string的方式来渲染
   * 直观表达就是走jsx的title close sperate在独立的同一行 而html的是解决布局的方式实现
   * @date 2022/1/18 潘卓然
   */
  _createPopup() {
    const self = this;
    this.hide = this.hide.bind(this);
    let infoDiv = window.document.createElement("div");
    infoDiv.id = this.popupId;
    infoDiv.style.display = "none";
    if (typeof this.container === "string") {
      // v-html/string实现
      infoDiv.innerHTML =
        '<div id="' +
        this.popupContentId +
        '" class="cesium-popup">' +
        '<div class="cesium-popup-content-wrapper">' +
        this.container +
        "</div>" +
        '<div class="cesium-popup-tip-container">' +
        '<div class="cesium-popup-tip" />' +
        "</div>" +
        "</div>";

      let parent = window.document.getElementById(this.popupContentId);
      let close = window.document.createElement("div");
      close.className = "cesium-popup-close-button";
      close.addEventListener("click", () => self.hide());
      close.innerText = "x";
      if (this.popupCloseBtnStyle) {
        Object.keys(this.popupCloseBtnStyle).forEach((key) => {
          close.style[key] = this.popupCloseBtnStyle[key];
        });
      }
      this.parent.appendChild(infoDiv);
      let popupContentWrapperDiv = window.document.getElementsByClassName(
        "cesium-popup-content-wrapper"
      );
      if (this.popupWapperStyle) {
        Object.keys(this.popupWapperStyle).forEach((key) => {
          popupContentWrapperDiv[0].style[key] = this.popupWapperStyle[key];
        });
      }
      let separate = window.document.createElement("div");
      separate.className = "cesium-popup-separate-button";
      separate.addEventListener("click", () => self.separate());
      let icon =
        `<svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">` +
        `<use xlink:href="#mapgis-Matchsizeup"></use></svg>`;
      separate.innerHTML = icon;
      if (this.popupType == "table") {
      } else if (this.popupType == "card") {
        // parent && parent.appendChild(separate);
      } else if (this.popupType == "rich-text") {
        parent && parent.appendChild(separate);
      }

      // window.document.getElementById(this.popupId).style.display = 'block';
      if (this.showClose) {
        let parent = window.document.getElementById(this.popupContentId);
        parent && parent.appendChild(close);
      }
      this.infoDiv = infoDiv;
    } else {
      // dom-slot机制实现jsx
      let popupContentDiv = window.document.createElement("div");
      popupContentDiv.id = this.popupContentId;
      popupContentDiv.className = "cesium-popup";

      let popupHeader = window.document.createElement("div");
      popupHeader.className = "cesium-popup-content-header";

      let popupHeaderTitle = window.document.createElement("div");
      popupHeaderTitle.className = "cesium-popup-content-header-title";
      popupHeaderTitle.innerText = this.popupTitle || "";
      if (this.popupHeaderStyle) {
        Object.keys(this.popupHeaderStyle).forEach((key) => {
          popupHeaderTitle.style[key] = this.popupHeaderStyle[key];
        });
      }

      let popupHeaderExtra = window.document.createElement("div");
      popupHeaderExtra.className = "cesium-popup-content-header-extra";

      popupHeader.appendChild(popupHeaderTitle);
      popupHeader.appendChild(popupHeaderExtra);

      let close = window.document.createElement("div");
      close.className = "cesium-popup-close-button";
      close.addEventListener("click", () => self.hide());
      // close.innerText = "x";
      let closeicon =
        `<svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">` +
        `<use xlink:href="#mapgis-close"></use></svg>`;
      close.innerHTML = closeicon;
      if (this.popupCloseBtnStyle) {
        Object.keys(this.popupCloseBtnStyle).forEach((key) => {
          close.style[key] = this.popupCloseBtnStyle[key];
        });
      }

      let separate = window.document.createElement("div");
      separate.className = "cesium-popup-separate-button";
      separate.addEventListener("click", () => self.separate());
      let icon =
        `<svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">` +
        `<use xlink:href="#mapgis-Matchsizeup"></use></svg>`;
      separate.innerHTML = icon;
      if (this.popupType == "table") {
      } else if (this.popupType == "card") {
        // parent && parent.appendChild(separate);
      } else if (this.popupType == "rich-text") {
        popupHeaderExtra.appendChild(separate);
      }

      if (this.showClose) {
        popupHeaderExtra.appendChild(close);
      }
      // popupContentDiv.appendChild(popupHeader);

      let popupContentWrapperDiv = window.document.createElement("div");
      popupContentWrapperDiv.className = "cesium-popup-content-wrapper";
      if (this.popupWapperStyle) {
        Object.keys(this.popupWapperStyle).forEach((key) => {
          popupContentWrapperDiv.style[key] = this.popupWapperStyle[key];
        });
      }
      popupContentWrapperDiv.appendChild(popupHeader);
      popupContentWrapperDiv.appendChild(this.container);
      popupContentDiv.appendChild(popupContentWrapperDiv);

      let tipContainerDiv = window.document.createElement("div");
      tipContainerDiv.className = "cesium-popup-tip-container";
      let tipDiv = window.document.createElement("div");
      tipDiv.className = "cesium-popup-tip";
      tipContainerDiv.appendChild(tipDiv);
      popupContentDiv.appendChild(tipContainerDiv);
      infoDiv.appendChild(popupContentDiv);

      this.infoDiv = infoDiv;
      this.parent.appendChild(infoDiv);
    }
  }

  bindEvent() {
    let self = this;
    this.handler.setInputAction(
      this.movement,
      this.Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    if (!this.map) {
      return;
    }

    if (this.options.postRender) {
      this.map.scene.postRender.addEventListener(self.updateEvent);
    } else {
      this.map.camera.changed.addEventListener(self.updateEvent);
      this.handler.setInputAction(
        this.moveStart,
        this.Cesium.ScreenSpaceEventType.LEFT_DOWN
      );
      this.handler.setInputAction(
        this.moveEnd,
        this.Cesium.ScreenSpaceEventType.LEFT_UP
      );
      this.map.scene.camera.moveEnd.addEventListener(self.updateEvent);
    }
  }

  unbindEvent() {
    let self = this;
    if (!this.map) {
      return;
    }

    if (this.options.postRender) {
      this.map.scene.postRender.removeEventListener(self.updateEvent);
    } else {
      this.map.camera.changed.removeEventListener(self.updateEvent);
      this.map.scene.camera.moveEnd.removeEventListener(self.updateEvent);
      this.handler.destroy();
    }
  }

  movement(movement) {
    let pickedPrimitive = this.map.scene.pick(movement.position);
    let pickedEntity = this.Cesium.defined(pickedPrimitive)
      ? pickedPrimitive.id
      : undefined;
    if (
      this.Cesium.defined(
        pickedEntity
      ) /* && Cesium.defined(pickedEntity.billboard) */
    ) {
      if (this.position && this.position.entity) {
        pickedPrimitive.id === this.position.entity.id;
        this.show();
      }
    }
  }

  eventMoveStart(movement) {
    this.hide();
  }

  eventMoveEnd() {
    this.update();
  }

  update() {
    if (this.cartesian && this.isShow) {
      updataPopupPosition(
        this.map,
        this.cartesian,
        this.popupId,
        this.popupContentId,
        this.options
      );
    }
  }

  /**
   * 显示图层
   * @function module:客户端可视化.PopupLayer.prototype.show
   */
  show() {
    this.isShow = true;
    if (this.onShow) {
      this.onShow(this.isShow, this.popupId);
    }
    let node = window.document.getElementById(this.popupId);
    if (node && node.style) {
      node.style.display = "block";
    }
  }

  /**
   * 隐藏图层
   * @function module:客户端可视化.PopupLayer.prototype.hide
   */
  hide() {
    this.isShow = false;
    if (this.onHide) {
      this.onHide(this.isShow);
    }
    let node = window.document.getElementById(this.popupId);
    if (node && node.style) {
      node.style.display = "none";
    }
  }

  /**
   * 分离Popup
   * @function module:客户端可视化.PopupLayer.prototype.
   */
  separate() {
    this.hide();
    if (this.onSeparate) {
      this.onSeparate();
    }
  }

  /**
   * 删除图层
   * @function module:客户端可视化.PopupLayer.prototype.remove
   */
  remove() {
    this.unbindEvent();
    let node = window.document.getElementById(this.popupId);
    if (node) {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      } else {
        node.remove();
      }
    }
    return this;
  }
}
