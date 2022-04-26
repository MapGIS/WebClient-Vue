<template>
  <div style="display: none">
    <!-- slot for custom marker -->
    <slot name="marker" />
    <!-- slot for popup -->
    <slot v-if="marker" />
  </div>
</template>

<script>
import axios from "axios";
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
    /**
     * 加载的marker的经度。使用entity方式加载marker，即usePrimitive为false时必传。
     */
    longitude: {
      type: Number,
      // required: true
    },
    /**
     * 加载的marker的纬度。使用entity方式加载marker，即usePrimitive为false时必传
     */
    latitude: {
      type: Number,
      // required: true
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
    },
    /**
     * 设置usePrimitive为true，底层将使用primitive的方式加载marker，在数据量大的时候会改善卡顿的现象
     */
    usePrimitive: {
      type: Boolean,
      default: false
    },
    /**
     * usePrimitive为true时，使用primitiveList属性传入加载的geojson数据，必传
     */
    primitiveList:{
      type: [ Object , String ]
    }
  },
  data() {
    return {
      marker: undefined,
      isMoveIn: false,
      isMoveOut: true,
      DynamicMarkerHandler: undefined,
      DynamicMarkerLastActive: undefined
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
      const { vueKey, vueIndex, vueCesium } = this;
      vueCesium.getViewerByInterval(function(viewer) {
        vueCesium.MarkerManager.addSource(vueKey, vueIndex,null,{
          'entity': undefined,
          'primitive': undefined
        });
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
        let options = MarkerManager.options;
        viewer = vm.viewer || viewer;
        if(options.entity){
          viewer.entities.remove(options.entity);
        }
        if(options.primitive){
          viewer.scene.primitives.remove(options.primitive.icon);
          viewer.scene.primitives.remove(options.primitive.label);
        }
        vueCesium.MarkerManager.deleteSource(vueKey, vueIndex);
        
        vm.DynamicMarkerHandler.removeInputAction(
        vm.$_markerMouseAction,
          Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );
        vm.DynamicMarkerHandler = undefined;

      }, vueKey);

    },
    $_init(viewer) {
      let vm = this;
      let Cesium = this.Cesium || window.Cesium;
      let viewerMarker = this.viewer || viewer;
      //heightReference useless
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
      this.$_append(label);
      this.marker = this;

      if (!this.DynamicMarkerHandler) {
        this.DynamicMarkerHandler = new Cesium.ScreenSpaceEventHandler(
          viewerMarker.scene.canvas
        );
      }
      this.DynamicMarkerHandler.removeInputAction(
        vm.$_markerMouseAction,
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
      this.DynamicMarkerHandler.setInputAction(
        vm.$_markerMouseAction,
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
    },
    $_hasId(id) {
      let { vueCesium } = this;
      let marker = {};
      marker.flag = false;
      let markerManagers = vueCesium.MarkerManager[this.vueKey];
      // console.log('markerManagers',markerManagers);
      for (let i = 0; i < markerManagers.length; i++) {
        if(this.usePrimitive && markerManagers[i].options.primitive){
          let primitiveCol = markerManagers[i].options.primitive;
          let index = id.split('_')[1];
          marker.flag = primitiveCol.icon.get(index) || primitiveCol.label && primitiveCol.label.get(index);
          if(marker.flag){
            // console.log('marker.flag',marker.flag);
            marker.iconLabel = {
              icon: primitiveCol.icon.get(index),
              label: primitiveCol.label && primitiveCol.label.get(index),
            };
            break;
          }
        } else if (!this.usePrimitive && markerManagers[i].options.entity._id === id) {
          marker.flag = true;
          marker.label = markerManagers[i].options.entity.markLabel;
          break;
        }
      }
      return marker;
    },
    $_markerMouseAction(movement) {
      const { Cesium, viewer } = this;
      const vm = this;
      let scene = viewer.scene;
      this.DynamicMarkerLastActive =
        this.DynamicMarkerLastActive || undefined;
      if (scene.mode !== Cesium.SceneMode.MORPHING) {
        let pickedObject = scene.pick(movement.endPosition);
        // console.log('pickedObject',pickedObject);
        if (
          Cesium.defined(pickedObject) &&
          pickedObject.hasOwnProperty("id")
        ) {
          if (
            !this.usePrimitive && 
            pickedObject.id.label &&
            vm.$_hasId(pickedObject.id.id).flag
          ) {
            if (!vm.isMoveIn) {
              vm.isMoveIn = true;
              vm.isMoveOut = false;
              let label = vm.$_hasId(pickedObject.id.id).label;
              if (
                this.DynamicMarkerLastActive &&
                this.DynamicMarkerLastActive != label
              ) {
                vm.$emit("mouseLeave", this.DynamicMarkerLastActive);
              }
              vm.$emit("mouseEnter", label);
              this.DynamicMarkerLastActive = label;
            }
          }else if(
            this.usePrimitive &&
            typeof pickedObject.id === 'string' &&
            vm.$_hasId(pickedObject.id).flag
          ){
            if (!vm.isMoveIn) {
              vm.isMoveIn = true;
              vm.isMoveOut = false;
              let iconLabel = vm.$_hasId(pickedObject.id).iconLabel;
              if (
                this.DynamicMarkerLastActive &&
                this.DynamicMarkerLastActive != iconLabel
              ) {
                vm.$emit("mouseLeave", this.DynamicMarkerLastActive);
              }
              vm.$emit("mouseEnter", iconLabel);
              this.DynamicMarkerLastActive = iconLabel;
            }
          };
        }
        if (!Cesium.defined(pickedObject)) {
          if (!vm.isMoveOut) {
            vm.isMoveIn = false;
            vm.isMoveOut = true;
            vm.$emit("mouseLeave", this.DynamicMarkerLastActive);
          }
        }
      }
    },
    $_append(label) {
      const vm = this;
      if(!this.usePrimitive){
        let iconLabel = this.$_addLabelIcon(
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
        iconLabel.markLabel = label;
        //存储icon结果
        this.$_addIcon(iconLabel);
      } else {
        this.$_addLabelIconByPrimitive(
          //文本内容
          this.text,
          this.primitiveList,
          this.height,
          //文字大小、字体
          this.fontSize + " " + this.fontFamily,
          //文字颜色
          this.Cesium.Color.fromCssColorString(this.color),
          // "data/picture/icon.png",
          this.iconUrl,
          this.iconWidth,
          this.iconHeight,
        ).then(function(data){
        //存储icon结果
          vm.$_addIcon(data);
        })     
      }
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
      // labelIcon.pixelOffsetScaleByDistance = new Cesium.NearFarScalar(1.5e2, 0.0, 8.0e6, 10.0);// 随远近改变大小
      labelIcon.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
      labelIcon.name = name;
      return labelIcon;
    },
    async $_addLabelIconByPrimitive(
      text,
      geojson,
      height,
      font,
      fillColor,
      iconUrl,
      iconWidth,
      iconHeight,
    ){
      if (!this.Cesium) {
        console.log("Cesium缺失");
        return null;
      }
      if (!geojson) {
        return null;
      }
      
      if( typeof geojson === 'string'){
          const res = await axios.get(geojson);
          geojson = res.data;
      }    

      let Cesium = this.Cesium || window.Cesium;
      let viewer = this.viewer || viewer;

      text = text || "";
      height = height || 0;
      font = font || "14pt 宋体";
      fillColor = fillColor || "";
      iconUrl = iconUrl || null;
      iconWidth = iconWidth || 27;
      iconHeight = iconHeight || 32;

      var billboards = viewer.scene.primitives.add(new Cesium.BillboardCollection());
      var labels;

      if( text !== ""){
        labels = viewer.scene.primitives.add(new Cesium.LabelCollection());
      }
      
      geojson.features.forEach(function(item,index){
        // console.log('item of geojson',item);
        let lon = item.geometry.coordinates[0];
        let lat = item.geometry.coordinates[1];
        billboards.add({
          position : Cesium.Cartesian3.fromDegrees(lon, lat, height),
          horizontalOrigin : Cesium.HorizontalOrigin.TOP,
          image : iconUrl,
          id : 'icon_' + index,
          width : iconWidth,
          height : iconHeight,
          translucencyByDistance : new Cesium.NearFarScalar(
            1.5e5,
            1.0,
            1.5e7,
            1.0
          ),
          pixelOffsetScaleByDistance : new Cesium.NearFarScalar(
            1.5e5, 3.0,
            1.5e7, 0.5
          ),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        });

        if( labels ) {
          labels.add({
            id : 'label_' + index,
            position : Cesium.Cartesian3.fromDegrees(lon, lat, height),
            text : text,
            font : font,
            fillColor : fillColor,
            style : Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset : new Cesium.Cartesian2(0.0, -iconHeight / 4),
            horizontalOrigin : Cesium.VerticalOrigin.BOTTOM,
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
            translucencyByDistance :  new Cesium.NearFarScalar(
              1.5e5,
              1.0,
              1.5e7,
              0.0
            ),
            pixelOffsetScaleByDistance : new Cesium.NearFarScalar(
              1.5e2,
              3.0,
              1.5e7,
              0.5
            ),
          }) 
        }

      });

      var iconLableCollection = {
        icon: billboards,
        label: labels
      }
      return iconLableCollection;
    },
    $_addIcon(iconLabel) {
      const { vueKey, vueIndex } = this;
      let vueCesium = this.vueCesium || window.vueCesium;
      var key = this.usePrimitive ? 'primitive' : 'entity';
      // console.log('iconLabel',this.usePrimitive,iconLabel);
      vueCesium.MarkerManager.changeOptions(vueKey, vueIndex, key, iconLabel);
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
