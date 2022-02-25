<template>
  <div style="display: none">
    <!-- slot for custom marker -->
    <slot name="marker" />
    <!-- slot for popup -->
    <slot v-if="marker" />
  </div>
</template>

<script>
export default {
  name: "mapgis-3d-marker",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    fid: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    fontSize: {
      type: String,
      default: "16px"
    },
    fontFamily: {
      type: String,
      default: "宋体"
    },
    longitude: {
      type: Number,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      default: "#000000"
    },
    iconUrl: {
      type: String,
      required: true
    },
    iconHeight: {
      type: Number,
      default: 32
    },
    iconWidth: {
      type: Number,
      default: 32
    },
    farDist: {
      type: Number,
      default: 10000000
    },
    nearDist: {
      type: Number,
      default: 1
    },
    iconPos: {
      type: String,
      default: "center"
    },
    heightReference: {
      type: String,
      default: "clamped"
    },
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    },
    changeEvent: {
      type: Function
    }
  },
  data() {
    return {
      marker: undefined,
      isMoveIn: false,
      isMoveOut: true
    };
  },
  provide() {
    const self = this;
    return {
      get marker() {
        // 提供marker给子组件popup或者插槽槽
        return self.marker;
      }
    };
  },
  mounted() {
    let vm = this;
    const defaults = ["vueKey", "vueIndex"];
    Object.keys(this.$props).forEach(function(key) {
      if (defaults.indexOf(key) < 0) {
        vm.$watch(key, function() {
          vm.$_unmount();
          vm.$_mount();
        });
      }
    });
    this.$_mount();
  },
  destroyed() {
    this.$_unmount();
  },
  methods: {
    $_mount() {
      let vm = this;
      const { vueCesium } = this;
      vueCesium.getViewerByInterval(function(viewer) {
        vm.$_init(viewer);
      }, this.vueKey);
    },
    $_unmount() {
      let { vueKey, vueIndex, vueCesium } = this;
      const vm = this;
      vueCesium = this.vueCesium || window.vueCesium;
      vueCesium.getViewerByInterval(function(viewer) {
        let MarkerManager = vueCesium.MarkerManager.findSource(
          vueKey,
          vueIndex
        );
        viewer = vm.viewer || viewer;
        viewer.entities.remove(MarkerManager.source);
        vueCesium.MarkerManager.deleteSource(vueKey, vueIndex);
      }, vueKey);
    },
    $_init(viewer) {
      const { vueCesium } = this;
      let vm = this;
      let Cesium = this.Cesium || window.Cesium;
      let viewerMarker = this.viewer || viewer;
      let heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
      switch (this.heightReference) {
        case "clamped":
          heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
          break;
        case "absolute":
          heightReference = Cesium.HeightReference.NONE;
          break;
        case "above":
          heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
          break;
      }
      if (this.height > 0) {
        heightReference = Cesium.HeightReference.NONE;
      }
      let label = {
        //文本内容
        text: this.text,
        //经度、纬度、高度
        longitude: this.longitude,
        latitude: this.latitude,
        height: this.height,
        //文字大小、字体
        font: this.fontSize + " " + this.fontFamily,
        //文字颜色
        fontColor: Cesium.Color.fromCssColorString(this.color),
        // "data/picture/icon.png",
        iconUrl: this.iconUrl,
        iconWidth: this.iconWidth,
        iconHeight: this.iconHeight,
        //最远显示距离：相机到注记的距离大于该值 注记不显示
        farDist: this.farDist,
        //最近显示距离：相机到注记的距离小于该值 注记不显示
        nearDist: this.nearDist,
        //图片位置：'center','top','bottom'
        iconPos: this.iconPos,
        //相对位置
        heightReference: heightReference
      };
      this.$_append(heightReference, label);
      this.marker = this;

      if (!window.DynamicMarkerHandler) {
        window.DynamicMarkerHandler = new Cesium.ScreenSpaceEventHandler(
          viewerMarker.scene.canvas
        );
      }
      window.DynamicMarkerHandler.removeInputAction(
        vm.$_markerMouseAction,
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
      window.DynamicMarkerHandler.setInputAction(
        vm.$_markerMouseAction,
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
    },
    $_hasId(id) {
      let { vueCesium } = this;
      let marker = {};
      marker.flag = false;
      let markerManagers = vueCesium.MarkerManager[this.vueKey];
      for (let i = 0; i < markerManagers.length; i++) {
        if (markerManagers[i].source._id === id) {
          marker.flag = true;
          marker.label = markerManagers[i].source.markLabel;
          break;
        }
      }
      return marker;
    },
    $_markerMouseAction(movement) {
      const { Cesium, vueCesium, viewer } = this;
      const vm = this;
      let scene = viewer.scene;
      window.DynamicMarkerLastActiceId =
        window.DynamicMarkerLastActiceId || undefined;
      if (scene.mode !== Cesium.SceneMode.MORPHING) {
        let pickedObject = scene.pick(movement.endPosition);
        if (
          Cesium.defined(pickedObject) &&
          pickedObject.hasOwnProperty("id") &&
          pickedObject.id.label &&
          vm.$_hasId(pickedObject.id.id).flag
        ) {
          if (!vm.isMoveIn) {
            vm.isMoveIn = true;
            vm.isMoveOut = false;
            let label = vm.$_hasId(pickedObject.id.id).label;
            if (
              window.DynamicMarkerLastActiceId &&
              window.DynamicMarkerLastActiceId != label
            ) {
              vm.$emit("mouseLeave", window.DynamicMarkerLastActiceId);
            }
            vm.$emit("mouseEnter", label);
            window.DynamicMarkerLastActiceId = label;
          }
        }
        if (!Cesium.defined(pickedObject)) {
          if (!vm.isMoveOut) {
            vm.isMoveIn = false;
            vm.isMoveOut = true;
            vm.$emit("mouseLeave", window.DynamicMarkerLastActiceId);
          }
        }
      }
    },
    $_append(heightReference, label) {
      let icon = this.$_addLabelIcon(
        //文本内容
        this.text,
        //经度、纬度、高度
        this.longitude,
        this.latitude,
        this.height,
        //文字大小、字体
        this.fontSize + " " + this.fontFamily,
        //文字颜色
        Cesium.Color.fromCssColorString(this.color),
        // "data/picture/icon.png",
        this.iconUrl,
        this.iconWidth,
        this.iconHeight,
        //最远显示距离：相机到注记的距离大于该值 注记不显示
        this.farDist,
        //最近显示距离：相机到注记的距离小于该值 注记不显示
        this.nearDist,
        ""
      );
      label.fid = this.fid;
      label.changeEvent = this.changeEvent;
      icon.markLabel = label;
      this.$_addIcon(icon);
    },

    /**
     * @修改说明 添加图标注记
     * @修改人 龚跃健
     * @修改时间 2022/1/21
     * 添加图标注记
     * @param  {String} text       注记文字内容
     * @param  {Number} lon        经度(必须)
     * @param  {Number} lat        纬度(必须)
     * @param  {Number} height     高程
     * @param  {String} font       字体 这里将字体和大小放在一起 eg:'14pt 楷体'
     * @param  {Color}  fillColor  字体的填充色
     * @param  {String} iconUrl    图标路径
     * @param  {Number} iconWidth  图标宽度
     * @param  {Number} iconHeight 图标高度
     * @param  {Number} farDist    最远显示距离
     * @param  {Number} nearDist   最近显示距离
     * @param  {String} attribute  其他属性信息
     * @return {entity} labelIcon  图标注记对象
     */
    $_addLabelIcon(
      text,
      lon,
      lat,
      height,
      font,
      fillColor,
      iconUrl,
      iconWidth,
      iconHeight,
      farDist,
      nearDist,
      attribute
    ) {
      if (!this.Cesium) {
        console.log("Cesium缺失");
        return null;
      }
      if (!lon || !lat) {
        return null;
      }
      text = text || "";
      lon = lon || 0;
      lat = lat || 0;
      height = height || 0;
      font = font || "14pt 宋体";
      fillColor = fillColor || "";
      iconUrl = iconUrl || null;
      iconWidth = iconWidth || 27;
      iconHeight = iconHeight || 32;
      farDist = farDist || 10000000000000;
      nearDist = nearDist || 1;
      attribute = attribute || "";
      name = name || "pictureLabel";
      const labelIcon = this.viewer.entities.add({
        name: text,
        position: this.Cesium.Cartesian3.fromDegrees(lon, lat, height),
        billboard: {
          // 图标
          image: iconUrl,
          width: iconWidth,
          height: iconHeight,
          // heightReference: this.root.HeightReference.CLAMP_TO_GROUND,
          // 随远近缩放
          // pixelOffset:new this.root.Cartesian2(0.0, -image.height),
          pixelOffsetScaleByDistance: new this.Cesium.NearFarScalar(
            1.5e5,
            3.0,
            1.5e7,
            0.5
          ),
          // 随远近隐藏
          translucencyByDistance: new this.Cesium.NearFarScalar(
            1.5e5,
            1.0,
            1.5e7,
            0.0
          ),
          // 定位点
          // verticalOrigin: this.root.VerticalOrigin.BOTTOM
          horizontalOrigin: this.Cesium.HorizontalOrigin.TOP
        },
        label: {
          // 文字标签
          text: text,
          font: font,
          style: this.Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: fillColor,
          outlineWidth: 1,
          verticalOrigin: this.Cesium.VerticalOrigin.BOTTOM, // 垂直方向以底部来计算标签的位置
          horizontalOrigin: this.Cesium.HorizontalOrigin.BOTTOM, // 原点在下方
          // pixelOffset: lPixelOffset, // 偏移量
          // heightReference : this.root.HeightReference.CLAMP_TO_GROUND ,
          // 随远近缩放
          pixelOffset: new this.Cesium.Cartesian2(0.0, -iconHeight / 4), // x,y方向偏移 相对于屏幕
          pixelOffsetScaleByDistance: new this.Cesium.NearFarScalar(
            1.5e2,
            3.0,
            1.5e7,
            0.5
          ),
          // 随远近隐藏
          translucencyByDistance: new this.Cesium.NearFarScalar(
            1.5e5,
            1.0,
            1.5e7,
            0.0
          )
        },
        description: attribute
      });
      labelIcon.billboard.translucencyByDistance = new this.Cesium.NearFarScalar(
        1.5e5,
        1.0,
        1.5e7,
        1.0
      ); // 不随距离的远近改变透明度
      // labelIcon.pixelOffsetScaleByDistance = new cesium.NearFarScalar(1.5e2, 0.0, 8.0e6, 10.0);// 随远近改变大小
      labelIcon.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
      labelIcon.name = name;
      return labelIcon;
    },
    $_addIcon(icon) {
      const { vueKey, vueIndex } = this;
      let vueCesium = this.vueCesium || window.vueCesium;
      vueCesium.MarkerManager.addSource(vueKey, vueIndex, icon);
    },
    togglePopup() {
      const { longitude, latitude, height } = this;
      let children = this.$children;
      if (!children || children.length <= 0) return;
      let popup = children[0];
      let vnode = popup.$vnode;
      if (!vnode) return;
      let { tag } = vnode;
      if (!tag || tag.indexOf("mapgis-3d-popup") < 0) return;
      if (!popup.$props.position) {
        popup.$props.position = { longitude, latitude, height };
        popup.togglePopup();
      }
      popup.togglePopup();
    }
  }
};
</script>
