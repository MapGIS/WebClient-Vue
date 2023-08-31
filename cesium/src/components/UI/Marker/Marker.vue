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
const makerKey = "mapgis-3d-marker-eventHandler";
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
      type: Number
      // required: true
    },
    /**
     * 加载的marker的纬度。使用entity方式加载marker，即usePrimitive为false时必传
     */
    latitude: {
      type: Number
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
     * 是否开启聚类 todo
     */
    enableCluster: {
      type: Boolean,
      default: false
    },
    /**
     * 聚类 和 primitive 加载时必传，加载使用的数据
     */
    geojson: {
      type: [Object, String]
    },
    /**
     * 设置usePrimitive为true，底层将使用primitive的方式加载marker，在数据量大的时候会改善卡顿的现象
     */
    usePrimitive: {
      type: Boolean,
      default: false
    },
    /**
     * 是否开启动态圆特效
     */
    enableCircle: {
      type: Boolean,
      default: false
    },
    /**
     * 动态圆特效的初始半径
     */
    radius: {
      type: Number,
      default: 500000.0
    },
    // /**
    //  * 是否根据相机变化调整圆特效的半径大小
    //  */
    // radiusChange:{
    //   type: Boolean,
    //   default: false
    // },
    /**
     * 动态圆特效的颜色
     */
    circleColor: {
      type: String,
      default: "#FF8C00"
    },
    /**
     * 允许加载的最大圆特效数目，不建议超过300，否则容易卡顿
     */
    maxCircleNumber: {
      type: Number,
      default: 100
    },
    /**
     * 设置图标的深度检测。
     * 当设置为10000，表示当相机高度低于10000时，图标参与深度检测，当相机高度高于10000时，图标不参与深度检测；
     * 当设置为0，表示不管高度为多少，都图标都参与深度检测，
     * 当设置为Number.POSITIVE_INFINITY，表示不管高度为多少，图标都不参与深度检测
     */
    disableDepthTestDistance: {
      type: Number,
      default: 0
    },
    /**
     * 文字标注相对于图标高度在y方向的偏移量比例，默认默认-0.5，及在y方向的偏移量为-0.5*this.iconHeight
     */
    pixelOffsetYScale: {
      type: Number,
      default: -0.5
    }
  },
  data() {
    return {
      marker: undefined,
      isMoveIn: false,
      isMoveOut: true,
      DynamicMarkerHandler: undefined,
      DynamicMarkerLastActive: undefined,
      heightReferenceCopy: 1 // 默认为CLAMP_TO_GROUND
      // initH: 0,
      // circleRadius: this.radius,
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
        vueCesium.MarkerManager.addSource(vueKey, vueIndex, null, {
          entity: undefined,
          primitive: undefined
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
        if (options.entity) {
          if (vm.enableCluster) {
            viewer.dataSources.remove(options.entity.dataSource);
          } else {
            viewer.entities.remove(options.entity);
          }
          vm.enableCircle &&
            viewer.scene.primitives.remove(options.entity.circle);
        }
        if (options.primitive) {
          viewer.scene.primitives.remove(options.primitive.icon);
          viewer.scene.primitives.remove(options.primitive.label);
          vm.enableCircle &&
            viewer.scene.primitives.remove(options.primitive.circle);
        }
        vueCesium.MarkerManager.deleteSource(vueKey, vueIndex);

        let eventHandlerManager = vueCesium.EventHandlerManager.findSource(
          vueKey,
          makerKey
        );
        let eventHandlerOptions = eventHandlerManager
          ? eventHandlerManager.options
          : undefined;
        if (eventHandlerOptions && eventHandlerOptions.DynamicMarkerHandler) {
          let dynamicMarkerHandler = eventHandlerOptions.DynamicMarkerHandler;
          dynamicMarkerHandler.removeInputAction(
            vm.$_markerMouseAction,
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
          );
          dynamicMarkerHandler.removeInputAction(
            vm.$_markerClickAction,
            Cesium.ScreenSpaceEventType.LEFT_CLICK
          );
          vueCesium.EventHandlerManager.deleteSource(vueKey, makerKey);
        }
      }, vueKey);
    },
    $_init(viewer) {
      let vm = this;
      let { vueKey } = this;
      let Cesium = this.Cesium || window.Cesium;
      let viewerMarker = this.viewer || viewer;
      //heightReference useless
      this.heightReferenceCopy = Cesium.HeightReference.CLAMP_TO_GROUND;
      switch (this.heightReference) {
        case "clamped":
          this.heightReferenceCopy = Cesium.HeightReference.CLAMP_TO_GROUND;
          break;
        case "absolute":
          this.heightReferenceCopy = Cesium.HeightReference.NONE;
          break;
        case "above":
          this.heightReferenceCopy = Cesium.HeightReference.RELATIVE_TO_GROUND;
          break;
      }
      // if (this.height > 0) {
      //   heightReference = Cesium.HeightReference.NONE;
      // }
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
        heightReference: this.heightReferenceCopy
      };
      this.$_append(label);
      this.marker = this;
      let eventHandlerManager = vueCesium.EventHandlerManager.findSource(
        vueKey,
        makerKey
      );
      let eventHandlerOptions = eventHandlerManager
        ? eventHandlerManager.options
        : undefined;
      let dynamicMarkerHandler;
      if (eventHandlerOptions && eventHandlerOptions.DynamicMarkerHandler) {
        dynamicMarkerHandler = eventHandlerOptions.DynamicMarkerHandler;
      } else {
        dynamicMarkerHandler = new Cesium.ScreenSpaceEventHandler(
          viewerMarker.scene.canvas
        );
        dynamicMarkerHandler.removeInputAction(
          vm.$_markerMouseAction,
          Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );
        dynamicMarkerHandler.setInputAction(
          vm.$_markerMouseAction,
          Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );

        dynamicMarkerHandler.removeInputAction(
          vm.$_markerClickAction,
          Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
        dynamicMarkerHandler.setInputAction(
          vm.$_markerClickAction,
          Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
        vueCesium.EventHandlerManager.addSource(vueKey, makerKey, null, {
          DynamicMarkerHandler: dynamicMarkerHandler
        });
      }

      // //监听相机的移动
      // vm.initH = viewerMarker.camera.positionCartographic.height;
      // viewerMarker.camera.moveEnd.addEventListener(vm.$_changeRadius);
    },
    // $_changeRadius(){
    //   let cameraH = this.viewer.camera.positionCartographic.height;
    //   this.circleRadius =this.radiusChange ? this.radius * cameraH / this.initH : this.radius;
    //   console.log('circleRadius',this.circleRadius);
    // },
    $_hasId(id) {
      let { vueCesium } = this;
      let marker = {};
      marker.flag = false;
      let markerManagers = vueCesium.MarkerManager[this.vueKey];
      for (let i = 0; i < markerManagers.length; i++) {
        if (this.usePrimitive && markerManagers[i].options.primitive) {
          let primitiveCol = markerManagers[i].options.primitive;
          let index = id.split("_")[1];
          marker.flag =
            primitiveCol.icon.get(index) ||
            (primitiveCol.label && primitiveCol.label.get(index));
          if (marker.flag) {
            // console.log('marker.flag',marker.flag);
            marker.iconLabel = {
              icon: primitiveCol.icon.get(index),
              label: primitiveCol.label && primitiveCol.label.get(index)
            };
            break;
          }
        } else if (
          !this.usePrimitive &&
          markerManagers[i].options.entity._id === id
        ) {
          marker.flag = true;
          marker.label = markerManagers[i].options.entity.markLabel;
          break;
        }
      }
      return marker;
    },
    $_markerClickAction(ev) {
      const { Cesium, viewer } = this;
      const vm = this;
      let scene = viewer.scene;
      if (scene.mode !== Cesium.SceneMode.MORPHING) {
        let pickedObject = scene.pick(ev.position);
        if (
          Cesium.defined(pickedObject) &&
          pickedObject.hasOwnProperty("id") &&
          pickedObject.id
        ) {
          // console.log('clickedObject',pickedObject);
          if (
            !this.usePrimitive &&
            pickedObject.id.label &&
            vm.$_hasId(pickedObject.id.id).flag
          ) {
            let label = vm.$_hasId(pickedObject.id.id).label;
            vm.$emit("click", label);
          } else if (
            !this.usePrimitive &&
            this.enableCircle &&
            pickedObject.primitive
          ) {
            vm.$emit("click", pickedObject.primitive);
          } else if (
            this.usePrimitive &&
            typeof pickedObject.id === "string" &&
            vm.$_hasId(pickedObject.id).flag
          ) {
            let iconLabel = vm.$_hasId(pickedObject.id).iconLabel;
            vm.$emit("click", iconLabel);
          }
        }
      }
    },
    $_markerMouseAction(movement) {
      const { Cesium, viewer } = this;
      const vm = this;
      let scene = viewer.scene;
      this.DynamicMarkerLastActive = this.DynamicMarkerLastActive || undefined;
      if (scene.mode !== Cesium.SceneMode.MORPHING) {
        let pickedObject = scene.pick(movement.endPosition);
        // let pickedObject = scene.pick(movement.position);
        if (
          Cesium.defined(pickedObject) &&
          pickedObject.hasOwnProperty("id") &&
          pickedObject.id
        ) {
          // console.log('pickedObject',pickedObject);

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
          } else if (
            !this.usePrimitive &&
            this.enableCircle &&
            pickedObject.primitive
          ) {
            if (!vm.isMoveIn) {
              vm.isMoveIn = true;
              vm.isMoveOut = false;
              let iconLabel = pickedObject.primitive;
              if (
                this.DynamicMarkerLastActive &&
                this.DynamicMarkerLastActive != iconLabel
              ) {
                vm.$emit("mouseLeave", this.DynamicMarkerLastActive);
              }
              vm.$emit("mouseEnter", iconLabel);
              this.DynamicMarkerLastActive = iconLabel;
            }
          } else if (
            this.usePrimitive &&
            typeof pickedObject.id === "string" &&
            vm.$_hasId(pickedObject.id).flag
          ) {
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
          }
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
    async $_append(label) {
      const vm = this;
      let geojson;
      geojson = this.geojson;
      if (typeof geojson === "string") {
        const res = await axios.get(geojson);
        geojson = res.data;
      }
      let iconLabel;
      if (!this.usePrimitive) {
        iconLabel = this.$_addLabelIcon(
          //文本内容
          this.text,
          //经度、纬度、高度
          this.longitude,
          this.latitude,
          geojson,
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
      } else {
        iconLabel = this.$_addLabelIconByPrimitive(
          //文本内容
          this.text,
          geojson,
          this.height,
          //文字大小、字体
          this.fontSize + " " + this.fontFamily,
          //文字颜色
          this.Cesium.Color.fromCssColorString(this.color),
          // "data/picture/icon.png",
          this.iconUrl,
          this.iconWidth,
          this.iconHeight
        );
      }
      //存储icon结果
      this.$_addIcon(iconLabel);
    },

    /**
     * @修改说明 使用entity方式添加图标注记
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
      geojson,
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
      const vm = this;
      if (!this.Cesium) {
        console.log("Cesium缺失");
        return null;
      }
      if ((!lon || !lat) && !geojson) {
        console.log("缺少marker位置信息");
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

      if (this.enableCluster) {
        let circles;
        if (this.enableCircle) {
          circles = viewer.scene.primitives.add(
            new Cesium.PrimitiveCollection()
          );
          // console.log('circles',circles);
        }
        let dataSource = new Cesium.CustomDataSource("marker");
        //添加聚类数据
        geojson.features.forEach(function(item, index) {
          // console.log('item of geojson',item);
          let lon = item.geometry.coordinates[0];
          let lat = item.geometry.coordinates[1];

          dataSource.entities.add({
            id: index,
            position: vm.Cesium.Cartesian3.fromDegrees(lon, lat, height),
            billboard: {
              id: "icon_" + index,
              // 图标
              image: iconUrl,
              width: iconWidth,
              height: iconHeight,
              horizontalOrigin: vm.Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: vm.Cesium.VerticalOrigin.BOTTOM,
              heightReference: vm.heightReferenceCopy
            }
          });
        });

        //开启及设置聚类
        dataSource.clustering.enabled = true;
        dataSource.clustering.pixelRange = 15;
        dataSource.clustering.minimumClusterSize = 2;

        let preLength = 0;
        let i = 0;
        dataSource.clustering.clusterEvent.addEventListener(
          (clusteredEntities, cluster, clusters) => {
            // console.log('clusteredEntities',clusteredEntities);
            // console.log('clusters',clusters && clusters.length);

            cluster.label.show = false;
            cluster.billboard.show = true;
            cluster.billboard.image = iconUrl;
            cluster.billboard.width = iconWidth;
            cluster.billboard.height = iconHeight;
            cluster.billboard.id = "cluster_icon_" + i++;
            cluster.billboard.entities = clusteredEntities;
            // console.log('vm.enableCircle',vm.enableCircle);

            if (vm.enableCircle && clusters && clusters.length !== preLength) {
              if (clusters.length > vm.maxCircleNumber) {
                console.log("动态圆特效数目超出设置的范围");
                return null;
              }
              preLength = clusters.length;

              vm.viewer.scene.globe.enableLighting = true;

              circles.removeAll();
              clusters.forEach(function(item) {
                // console.log('item',item);
                circles.add(
                  new Cesium.Primitive({
                    geometryInstances: new Cesium.GeometryInstance({
                      geometry: new Cesium.EllipseGeometry({
                        center: item.position,
                        height: 0,
                        semiMinorAxis: vm.radius,
                        semiMajorAxis: vm.radius
                      })
                    }),
                    appearance: new Cesium.MaterialAppearance({
                      material: Cesium.Material.fromType("CircleWaveMaterial", {
                        duration: 1000,
                        gradient: 0.5,
                        color: Cesium.Color.fromCssColorString(vm.circleColor),
                        count: 4
                      })
                    })
                  })
                );
              });
            }

            vm.$emit("cluster", clusteredEntities, cluster, clusters);
          }
        );

        this.viewer.dataSources.add(dataSource);

        return { dataSource: dataSource, circle: circles };
      } else {
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
            horizontalOrigin: this.Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: this.Cesium.VerticalOrigin.BOTTOM,
            disableDepthTestDistance: this.disableDepthTestDistance,
            heightReference: this.heightReferenceCopy
          },
          label: {
            // 文字标签
            text: text,
            font: font,
            style: this.Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: fillColor,
            outlineWidth: 1,
            verticalOrigin: this.Cesium.VerticalOrigin.BOTTOM, // 垂直方向以底部来计算标签的位置
            horizontalOrigin: this.Cesium.HorizontalOrigin.CENTER,
            // pixelOffset: lPixelOffset, // 偏移量
            // heightReference : this.root.HeightReference.CLAMP_TO_GROUND ,
            // 随远近缩放
            pixelOffset: new this.Cesium.Cartesian2(
              0.0,
              this.pixelOffsetYScale * this.iconHeight
            ), // x,y方向偏移 相对于屏幕
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
            heightReference: this.heightReferenceCopy
          },
          description: attribute
        });

        let circle;
        if (this.enableCircle && !this.enableCluster) {
          // this.viewer.clock.shouldAnimate = true;
          this.viewer.scene.globe.enableLighting = true;

          circle = this.viewer.scene.primitives.add(
            new Cesium.Primitive({
              geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.EllipseGeometry({
                  center: new Cesium.Cartesian3.fromDegrees(lon, lat, height),
                  height: 0,
                  semiMinorAxis: vm.radius,
                  semiMajorAxis: vm.radius
                })
              }),
              appearance: new Cesium.MaterialAppearance({
                material: Cesium.Material.fromType("CircleWaveMaterial", {
                  duration: 1000,
                  gradient: 0.5,
                  color: Cesium.Color.fromCssColorString(vm.circleColor),
                  count: 4
                })
              })
            })
          );
          // console.log('circle',circle);
        }
        labelIcon.name = name;
        labelIcon.circle = circle;
        return labelIcon;
      }
    },
    $_addLabelIconByPrimitive(
      text,
      geojson,
      height,
      font,
      fillColor,
      iconUrl,
      iconWidth,
      iconHeight
    ) {
      if (!this.Cesium) {
        console.log("Cesium缺失");
        return null;
      }
      if (!geojson) {
        console.log("缺少数据");
        return null;
      }
      const vm = this;

      let Cesium = this.Cesium || window.Cesium;
      let viewer = this.viewer || viewer;

      text = text || "";
      height = height || 0;
      font = font || "14pt 宋体";
      fillColor = fillColor || "";
      iconUrl = iconUrl || null;
      iconWidth = iconWidth || 27;
      iconHeight = iconHeight || 32;

      let billboards = viewer.scene.primitives.add(
        new Cesium.BillboardCollection()
      );
      let labels;
      let circles;

      if (text !== "") {
        labels = viewer.scene.primitives.add(new Cesium.LabelCollection());
      }

      if (this.enableCircle) {
        circles = viewer.scene.primitives.add(new Cesium.PrimitiveCollection());
        // console.log('circles',circles);
      }

      circles.removeAll();
      geojson.features.forEach(function(item, index) {
        // console.log('item of geojson',item);
        let lon = item.geometry.coordinates[0];
        let lat = item.geometry.coordinates[1];
        billboards.add({
          position: Cesium.Cartesian3.fromDegrees(lon, lat, height),
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          image: iconUrl,
          id: "icon_" + index,
          width: iconWidth,
          height: iconHeight,
          translucencyByDistance: new Cesium.NearFarScalar(
            1.5e5,
            1.0,
            1.5e7,
            1.0
          ),
          pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
            1.5e5,
            3.0,
            1.5e7,
            0.5
          ),
          disableDepthTestDistance: this.disableDepthTestDistance
        });

        if (labels) {
          labels.add({
            id: "label_" + index,
            position: Cesium.Cartesian3.fromDegrees(lon, lat, height),
            text: text,
            font: font,
            fillColor: fillColor,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(
              0.0,
              vm.pixelOffsetYScale * vm.iconHeight
            ),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            translucencyByDistance: new Cesium.NearFarScalar(
              1.5e5,
              1.0,
              1.5e7,
              0.0
            ),
            pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
              1.5e2,
              3.0,
              1.5e7,
              0.5
            )
          });
        }

        if (vm.enableCircle) {
          // console.log('geojson.features.length',geojson.features.length);
          if (geojson.features.length > vm.maxCircleNumber) {
            console.log(
              "动态圆特效数目超出设置的范围",
              geojson.features.length
            );
            return null;
          }

          circles.add(
            new Cesium.Primitive({
              geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.EllipseGeometry({
                  center: new Cesium.Cartesian3.fromDegrees(lon, lat, height),
                  height: 0,
                  semiMinorAxis: vm.radius,
                  semiMajorAxis: vm.radius
                })
              }),
              appearance: new Cesium.MaterialAppearance({
                material: Cesium.Material.fromType("CircleWaveMaterial", {
                  duration: 1000,
                  gradient: 0.5,
                  color: Cesium.Color.fromCssColorString(vm.circleColor),
                  count: 4
                })
              })
            })
          );
        }
      });

      let iconLableCollection = {
        icon: billboards,
        label: labels,
        circle: circles
      };

      return iconLableCollection;
    },
    $_addIcon(iconLabel) {
      const { vueKey, vueIndex } = this;
      let vueCesium = this.vueCesium || window.vueCesium;
      let key = this.usePrimitive ? "primitive" : "entity";
      // console.log('iconLabel',iconLabel);
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
