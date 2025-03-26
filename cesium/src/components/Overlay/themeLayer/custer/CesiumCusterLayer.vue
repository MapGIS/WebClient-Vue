<template>
  <span />
</template>

<script>
export default {
  name: "mapgis-3d-cesium-custer-layer",
  inject: ["viewer", "Cesium"],
  props: {
    // 聚合展示所需的geojson对象
    geojson: {
      type: Object,
      required: true,
    },
    // 是否开启聚类
    clusterEnabled: {
      type: Boolean,
      default: true,
    },
    // 聚合半径
    clusterPixelRange: {
      type: Number,
      default: 80,
    },
    // 禁用深度检测的距离
    disableDepthTestDistance: {
      type: Number,
      default: 500000,
    },
    // entity偏移距离
    pixelOffset: {
      type: Array,
      default: () => [0, 0], // 负值表示向上偏移
    },
    clusterStyle: {
      type: Array,
      default: () => [
        {
          start: 2,
          end: 30,
          billboard: {
            color: [1, 1, 1, 0.6], // rgba
            horizontalOrigin: 0, //CENTER:0 LEFT:1 RIGHT: -1
            verticalOrigin: 0, //CENTER:0 BOTTOM:1 TOP: -1 BASELINE:2
            imageStyle: {
              radius: 30,
              fillColor: "#a560e8", // 填充色
              borderColor: "#a26eea", // 边框颜色
              borderWidth: 5, // 边框宽度
            },
          },
          label: {
            horizontalOrigin: 0, //CENTER:0 LEFT:1 RIGHT: -1
            verticalOrigin: 0, //CENTER:0 BOTTOM:1 TOP: -1 BASELINE:2
            scale: 0.5, // 文字放大倍率
            fillColor: [0, 0, 0, 1], // rgba
            font: "40px Microsoft YaHei", // 字体
          },
        },
        {
          start: 30,
          end: 60,
          billboard: {
            color: [1, 1, 1, 0.6], // rgba
            horizontalOrigin: 0, //CENTER:0 LEFT:1 RIGHT: -1
            verticalOrigin: 0, //CENTER:0 BOTTOM:1 TOP: -1 BASELINE:2
            imageStyle: {
              radius: 30,
              fillColor: "#63a541", // 填充色
              borderColor: "#82bc23", // 边框颜色
              borderWidth: 5, // 边框宽度
            },
          },
          label: {
            horizontalOrigin: 0, //CENTER:0 LEFT:1 RIGHT: -1
            verticalOrigin: 0, //CENTER:0 BOTTOM:1 TOP: -1 BASELINE:2
            scale: 0.5, // 文字放大倍率
            fillColor: [0, 0, 0, 1], // rgba
            font: "40px Microsoft YaHei", // 字体
          },
        },
        {
          start: 60,
          end: 90,
          billboard: {
            color: [1, 1, 1, 0.6], // rgba
            horizontalOrigin: 0, //CENTER:0 LEFT:1 RIGHT: -1
            verticalOrigin: 0, //CENTER:0 BOTTOM:1 TOP: -1 BASELINE:2
            imageStyle: {
              radius: 30,
              fillColor: "#008ecf", // 填充色
              borderColor: "#15b6e5", // 边框颜色
              borderWidth: 5, // 边框宽度
            },
          },
          label: {
            horizontalOrigin: 0, //CENTER:0 LEFT:1 RIGHT: -1
            verticalOrigin: 0, //CENTER:0 BOTTOM:1 TOP: -1 BASELINE:2
            scale: 0.5, // 文字放大倍率
            fillColor: [0, 0, 0, 1], // rgba
            font: "40px Microsoft YaHei", // 字体
          },
        },
        {
          start: 90,
          billboard: {
            color: [1, 1, 1, 0.6], // rgba
            horizontalOrigin: 0, //CENTER:0 LEFT:1 RIGHT: -1
            verticalOrigin: 0, //CENTER:0 BOTTOM:1 TOP: -1 BASELINE:2
            imageStyle: {
              radius: 30,
              fillColor: "#f47b7b", // 填充色
              borderColor: "#e990ab", // 边框颜色
              borderWidth: 5, // 边框宽度
            },
          },
          label: {
            horizontalOrigin: 0, //CENTER:0 LEFT:1 RIGHT: -1
            verticalOrigin: 0, //CENTER:0 BOTTOM:1 TOP: -1 BASELINE:2
            scale: 0.5, // 文字放大倍率
            fillColor: [0, 0, 0, 1], // rgba
            font: "40px Microsoft YaHei", // 字体
          },
        },
      ],
    },
  },
  data() {
    return {
      // clusterBillboardImageCache: {}, //每个区间的Billboard对应的image记录一份即可
    };
  },
  watch: {
    geojson: {
      deep: true,
      handler(val) {
        this.destroyData();
        if (val) {
          this.initData(val);
        }
      },
    },
    clusterStyle: {
      deep: true,
      handler(val) {
        this.destroyData();
        if (val) {
          this.initData(this.geojson);
        }
      },
    },
    pixelOffset: {
      deep: true,
      handler(val) {
        this.destroyData();
        if (val) {
          this.initData(this.geojson);
        }
      },
    },
    clusterEnabled(val) {
      this.destroyData();
      this.initData(this.geojson);
    },
    clusterPixelRange(val) {
      this.destroyData();
      if (typeof val === "number") {
        this.initData(this.geojson);
      }
    },
    disableDepthTestDistance(val) {
      this.destroyData();
      if (typeof val === "number") {
        this.initData(this.geojson);
      }
    },
  },
  mounted() {
    this.clusterBillboardImageCache = {};
    this.initData(this.geojson);
  },
  methods: {
    // 初始化聚合图
    async initData(data) {
      const { clusterEnabled, clusterPixelRange } = this;
      this.creatClusterObject();
      // 创建Billboard对应的image记录
      this.createImages();
      // 添加entity
      this.addEntities(data.features);

      const clusterDataSource = await this.dataSourceObject;
      // 是否开启聚类
      clusterDataSource.clustering.enabled = clusterEnabled;
      // 设置聚合半径
      clusterDataSource.clustering.pixelRange = clusterPixelRange;
      // 设置聚类后的样式 clusteredEntities:聚类的entity数组 cluster:聚类对象，修改此对象，来设置聚类样式
      clusterDataSource.clustering.clusterEvent.addEventListener(
        (clusteredEntities, cluster) => {
          this.setClusterStyle(clusteredEntities, cluster);
        }
      );
    },
    // 创建CustomDataSource对象
    creatClusterObject() {
      this.dataSource = new Cesium.CustomDataSource("thematic-cluster");
      this.dataSourceObject = viewer.dataSources.add(this.dataSource, {
        // Cesium的相机对象
        camera: viewer.scene.camera,
        // Cesium的视图容器中的canvas对象
        canvas: viewer.scene.canvas,
      });
    },
    // 构建聚类样式设置
    setClusterStyle(clusteredEntities, cluster) {
      const { clusterStyle } = this;
      cluster.label.show = false;
      cluster.billboard.show = false;

      const conditions = [];
      clusterStyle.forEach((item, index) => {
        if (item.start && item.end) {
          if (
            clusteredEntities.length >= item.start &&
            clusteredEntities.length < item.end
          ) {
            this.constructClusterStyle(item, cluster, index);
          }
        } else {
          if (clusteredEntities.length >= item.start) {
            this.constructClusterStyle(item, cluster, index);
          }
        }
      });
    },
    constructClusterStyle(options, cluster, index) {
      const { disableDepthTestDistance, pixelOffset } = this;
      const { billboard, label } = options;
      // 设置billboard
      cluster.billboard.show = true;
      const { color } = billboard;
      cluster.billboard.color = new Cesium.Color(
        color[0],
        color[1],
        color[2],
        color[3]
      );
      cluster.billboard.image = this.clusterBillboardImageCache[index];
      cluster.billboard.horizontalOrigin = billboard.horizontalOrigin || 0;
      cluster.billboard.verticalOrigin = billboard.verticalOrigin || 0;
      cluster.billboard.pixelOffset = new Cesium.Cartesian2(
        pixelOffset[0],
        pixelOffset[1]
      );
      cluster.billboard.disableDepthTestDistance = disableDepthTestDistance;

      // 设置label
      cluster.label.show = true;
      cluster.label.horizontalOrigin = label.horizontalOrigin || 0;
      cluster.label.verticalOrigin = label.verticalOrigin || 0;
      cluster.label.font = label.font;
      cluster.label.scale = label.scale;
      const { fillColor } = label;
      cluster.label.fillColor = new Cesium.Color(
        fillColor[0],
        fillColor[1],
        fillColor[2],
        fillColor[3]
      );
      cluster.label.pixelOffset = new Cesium.Cartesian2(
        pixelOffset[0],
        pixelOffset[1]
      );
      cluster.label.disableDepthTestDistance = disableDepthTestDistance;
    },
    createImages() {
      const { clusterStyle } = this;
      clusterStyle.forEach((item, index) => {
        const { imageStyle } = item.billboard;
        const { radius, fillColor, borderColor, borderWidth } = imageStyle;
        const image = this.createImage(
          radius,
          fillColor,
          borderColor,
          borderWidth
        );
        this.clusterBillboardImageCache[index] = image;
        window.clusterBillboardImageCache = this.clusterBillboardImageCache;
      });
    },
    // 创建聚合效果的billboard的image内容
    createImage(radius, fillColor, borderColor, borderWidth) {
      const canvas = document.createElement("canvas");
      canvas.style.width = `${radius * 2}px`;
      canvas.style.height = `${radius * 2}px`;
      canvas.width = `${radius * 2}`;
      canvas.height = `${radius * 2}`;
      const ctx = canvas.getContext("2d");

      const centerX = radius; // 圆心x坐标
      const centerY = radius; // 圆心y坐标
      const startAngle = 0; // 起始角度
      const endAngle = Math.PI * 2; // 结束角度，Math.PI * 2表示360度
      const counterclockwise = false; // 顺时针绘制

      // 设置边框样式
      ctx.strokeStyle = borderColor; // 边框颜色
      ctx.lineWidth = borderWidth; // 边框宽度

      // 绘制圆
      ctx.beginPath(); // 开始路径
      ctx.arc(
        centerX,
        centerY,
        radius - 4,
        startAngle,
        endAngle,
        counterclockwise
      ); // 绘制圆弧
      ctx.stroke(); // 绘制边框
      ctx.fillStyle = fillColor; // 填充颜色
      ctx.fill();
      const image = new Image();
      image.src = canvas.toDataURL("image/png");
      return image;
    },
    addEntities(features) {
      features.forEach((feature) => {
        const options = {
          position: Cesium.Cartesian3.fromDegrees(
            // 经度
            feature.geometry.coordinates[0],
            // 纬度
            feature.geometry.coordinates[1]
          ),
          billboard: {
            show: true,
            image: this.clusterBillboardImageCache[0], // 默认使用第一个
            color: this.getColor(), // 默认使用第一个clusterStyle的样式
            pixelOffset: new Cesium.Cartesian2(
              this.pixelOffset[0],
              this.pixelOffset[1]
            ),
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            disableDepthTestDistance: this.disableDepthTestDistance,
          },
        };
        this.dataSource.entities.add(options);
      });
    },
    getColor() {
      if (!this.initBillboardColor) {
        const color = this.clusterStyle[0]?.billboard?.color || [1, 1, 1, 0.6];
        this.initBillboardColor = new Cesium.Color(
          color[0],
          color[1],
          color[2],
          color[3]
        );
      }
      return this.initBillboardColor;
    },
    // 销毁聚合图
    destroyData() {
      if (this.dataSource) {
        viewer.dataSources.remove(this.dataSource, true);
        this.dataSourceObject = null;
        this.dataSource = null;
        this.clusterBillboardImageCache = {};
        this.initBillboardColor = null;
      }
    },
  },
  destroyed() {
    this.destroyData();
  },
};
</script>

<style></style>
