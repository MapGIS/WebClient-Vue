<template>
  <div>
    <slot>
      <div class="mapgis-3d-rotate">
        <mapgis-ui-group-tab title="旋转模式"/>
        <mapgis-ui-radio-group v-model="value">
          <mapgis-ui-radio :value="1"> 全球旋转</mapgis-ui-radio>
          <mapgis-ui-radio :value="2"> 绕点旋转</mapgis-ui-radio>
        </mapgis-ui-radio-group>
        <mapgis-ui-group-tab title="参数设置">
        </mapgis-ui-group-tab>

        <div  v-show="value === 1">
          <mapgis-ui-input-number-panel
              size="small"
              class="mapgis-ui-number-style"
              label="纬度(°)"
              :range="[0,90]"
              v-model="latitude"/>
          <mapgis-ui-input-number-panel
              size="small"
              class="mapgis-ui-number-style"
              label="高度(米)"
              :range="[200000,280430000]"
              v-model="height"/>
          <mapgis-ui-input-number-panel
              size="small"
              class="mapgis-ui-number-style"
              label="旋转周期(秒)"
              :range="[1,600]"
              v-model="rotatePeriod"/>
        </div>
        <div v-show="value === 2">
          <mapgis-ui-input-number-panel
              size="small"
              class="mapgis-ui-number-style"
              label="俯仰角(°)"
              :range="[-90,0]"
              v-model="pitch"/>
          <mapgis-ui-input-number-panel
              size="small"
              class="mapgis-ui-number-style"
              label="距离(米)"
              :range="[0,50000]"
              v-model="distance"/>
          <mapgis-ui-input-number-panel
              size="small"
              class="mapgis-ui-number-style"
              label="环绕周期(秒)"
              :range="[1,600]"
              v-model="rotatePeriod"/>
          <mapgis-ui-switch-panel
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }"
              layout="horizontal"
              label="鼠标拾取中心点"
              size="small"
              :height="'154px'"
              :checked="getCenter"
              @changeChecked="getM3dCenter"
          >
            <mapgis-ui-form-item label="x坐标">
              <mapgis-ui-input
                  v-model.number="coordinate.longitude"
                  type="number"
                  min="0"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="y坐标">
              <mapgis-ui-input
                  v-model.number="coordinate.latitude"
                  type="number"
                  min="0"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="z坐标">
              <mapgis-ui-input
                  v-model.number="coordinate.height"
                  type="number"
                  min="0"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-switch-panel>
        </div>
        <mapgis-ui-setting-footer>
          <mapgis-ui-button type="primary" @click="beginRotate"
          >旋转
          </mapgis-ui-button
          >
          <mapgis-ui-button @click="stopRotate">停止</mapgis-ui-button>
        </mapgis-ui-setting-footer>
      </div>
    </slot>
  </div>
</template>

<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-rotate",
  mixins: [ServiceLayer],
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {},
  watch: {
    value:{
      handler(next) {
        const vm = this;
        let tool = this.findRotateTool();
        tool.stop();
        if (tool) {
          if (next === 1){
              tool.pitch = -1*vm.Cesium.Math.toRadians(parseInt(vm.latitude));
              tool.distance = vm.height;
              tool.speed = vm.speed;
          } else if (next === 2){
            tool.pitch = vm.Cesium.Math.toRadians(parseInt(vm.pitch));
            tool.distance = vm.distance;
            tool.speed = vm.speed;
          }
        }
      }
    },
    pitch: {
      handler(next) {
        let tool = this.findRotateTool();
        tool.pitch = this.Cesium.Math.toRadians(parseInt(next));
      },
    },
    distance: {
      handler(next) {
        let tool = this.findRotateTool();
        tool.distance = next;
      },
    },
    height: {
      handler(next) {
        let tool = this.findRotateTool();
        tool.distance = next;
      },
    },
    rotatePeriod: {
      handler(next) {
        let vm = this;
        let tool = vm.findRotateTool();
        vm.speed = 360/next;
        tool.speed = vm.speed;
      },
    },
    latitude:{
      handler(next){
        let tool = this.findRotateTool();
        tool.pitch = -1*this.Cesium.Math.toRadians(parseInt(next));
      }
    }
  },
  data() {
    return {
      value: 1,
      pitch: -30,
      distance: 500,
      rotatePeriod: 60,
      speed:6,
      height: 20966848,
      //纬度
      latitude: 38,
      //鼠标监听对象
      handlerAction: undefined,
      getCenter:false,
      coordinate:{
        longitude:'',
        latitude:'',
        height:'',
      }
    };
  },

  created() {
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      return new Promise(
          resolve => {
            resolve();
          },
          reject => {
          }
      );
    },
    mount() {
      let {vueCesium, vueKey, vueIndex} = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function (dataSource) {
        let rotatePointTool = vm.addRotatePointTool();
        vueCesium.RotateManager.addSource(
            vueKey,
            vueIndex,
            dataSource,
            rotatePointTool
        );
        vm.$emit("loaded", vm);
      });
    },
    unmount(){
      let {vueCesium, vueKey, vueIndex} = this;
      let tool = this.findRotateTool();
      tool.stop();
      vueCesium.RotateManager.deleteSource(vueKey, vueIndex);
    },
    addRotatePointTool() {
      let {viewer, Cesium} = this;
      const vm = this;
      // 定义绕点旋转对象
      let rotatePointTool = new Cesium.AnimationTool(viewer, {
        //类型指定为point
        toolType: 'point',
        //绕Z轴旋转角度，弧度值，初始化时有效。
        heading: 0,
        //绕Y轴旋转，弧度值，可通过纬度值转化，可实时更改。
        pitch: -1*vm.Cesium.Math.toRadians(parseInt(vm.latitude)),
        //速度，度/秒。
        speed: vm.speed,
        // duration: 20,
        //是否循环动画
        isLoop:true,
        //旋转中心点，设置为球心
        positions: new Cesium.Cartesian3(0, 0, 0),
        //也可指定特定点
        // positions: Cesium.Cartesian3.fromDegrees(108.96044700955785, 34.21796237686321, 60.99772929683282),
        //绕点旋转时，相机定位点的平移距离（沿着相机视角的相反方向）
        distance: vm.height,
        //绕点旋转时，移动鼠标，停止旋转
        moveToStop: true,
        //绕点旋转动画完成事件
        complete: function () {
          // alert('完毕');
        },
        //绕点旋转时，每一帧的回调函数，暂停同时暂停返回结果
        onPositionCallback: function (result) {
          // console.log('heading:' + result.heading + '，pitch：' + result.pitch);
        },
      });
      // rotatePointTool.start();
      return rotatePointTool;
    },
    findRotateTool(){
      let {vueCesium, vueKey, vueIndex} = this;
      let find = vueCesium.RotateManager.findSource(vueKey, vueIndex);
      let rotatePointTool;
      if (find && find.options) {
        rotatePointTool = find.options;
      }
      return rotatePointTool;
    },
    getCenterPosition(){
      let {viewer, Cesium} = this;
      let result = viewer.camera.pickEllipsoid(
          new Cesium.Cartesian2(
              viewer.canvas.clientWidth / 2,
              viewer.canvas.clientHeight / 2,
          ),
      );
      let curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
      let lon = (curPosition.longitude * 180) / Math.PI;
      let lat = (curPosition.latitude * 180) / Math.PI;
      return [lon,lat];
    },
    /**
     * @description 通过getPickRay鼠标拾取点的经纬度和高度。
     */
    getM3dCenter(value){
      let vm = this;
      vm.getCenter = true;
      if (value){
          this.handlerAction = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
          this.handlerAction.setInputAction(event => {
            let ray = vm.viewer.scene.camera.getPickRay(event.position);
            let position1 = vm.viewer.scene.globe.pick(ray,vm.viewer.scene);
            let cartographic1 = vm.Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
            let feature = vm.viewer.scene.pick(event.position);
            if (feature == undefined) {
              vm.coordinate.longitude = Cesium.Math.toDegrees(cartographic1.longitude);
              vm.coordinate.latitude = Cesium.Math.toDegrees(cartographic1.latitude);
              vm.coordinate.height = cartographic1.height;
            } else if(feature instanceof vm.Cesium.Cesium3DTileFeature){
              let cartesian = vm.viewer.scene.pickPosition(event.position);
              if (vm.Cesium.defined(cartesian) ) {
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                vm.coordinate.longitude = Cesium.Math.toDegrees(cartographic.longitude);
                vm.coordinate.latitude = Cesium.Math.toDegrees(cartographic.latitude);
                vm.coordinate.height = cartographic.height;
              }
            }
          }, vm.Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
    },
    beginRotate() {
      const vm = this;
      let rotatePointTool = vm.findRotateTool();
      if (vm.value === 1) {
        rotatePointTool.positions = new Cesium.Cartesian3(0, 0, 0);
        rotatePointTool.start();
      } else {
        if (vm.getCenter){
          rotatePointTool.positions = new Cesium.Cartesian3.fromDegrees(vm.coordinate.longitude,vm.coordinate.latitude,0);
        } else {
          let position =  vm.getCenterPosition();
          rotatePointTool.positions = new Cesium.Cartesian3.fromDegrees(position[0],position[1],0);
        }
        rotatePointTool.start();
      }
    },
    stopRotate() {
      const vm = this;
      let rotatePointTool = vm.findRotateTool();
      rotatePointTool.stop();
    }
  }

}
</script>

<style scoped>

</style>