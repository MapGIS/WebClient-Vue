<template>
  <div class="camera-setting">
    <mapgis-ui-form-model v-bind="formItemLayout" :layout="layout" labelAlign="left" :colon="false">

      <mapgis-ui-switch-panel label="地下模式" :checked="undgrd" @changeChecked="enableUndgrd">
        <mapgis-ui-input-number-panel 
          size="small"
          label="地表透明度" 
          :value="groundAlpha" 
          :range="range"
          :step="0.1" 
          @change="enableUndgrd"
        >
        </mapgis-ui-input-number-panel> 
      </mapgis-ui-switch-panel>


      <mapgis-ui-input-number-panel 
        size="small"
        label="FOV设置" 
        :value="fov" 
        :range="fovRange"
        :step="15" 
        @change="fovChange"
      >
      </mapgis-ui-input-number-panel>

    </mapgis-ui-form-model>
  </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";

export default {
  name: "CameraSetting",
  mixins: [ServiceLayer],
  props: {
    layout: {
      type: String,
      default: "horizontal" // 'horizontal' 'vertical' 'inline'
    },
  },
  data() {
    return {
      
      undgrd: false,
      undgrdParams:undefined,
      groundAlpha:0.5,
      range:[0,1],

      fov:60.0,
      fovRange:[0,180]
    }
  },
  computed: {
    formItemLayout({layout}) {
      return layout === "horizontal"
          ? {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
          }
          : {};
    },
  },
  methods: {
    /*
    * 地下模式
    * */
    enableUndgrd(e) {
      const {viewer} = this;
      if(typeof e ==='boolean'){
       this.undgrd = e;
      }else{
        this.groundAlpha = e;
      }
      this.$emit('updateSpin',true);
      let vm = this;

      setTimeout(function () {
        viewer.scene.screenSpaceCameraController.enableCollisionDetection = !vm.undgrd;
        viewer.scene.globe.translucency.enabled = vm.undgrd;
        //设置地表透明度
        viewer.scene.globe.translucency.backFaceAlpha = vm.groundAlpha;
        viewer.scene.globe.translucency.frontFaceAlpha = vm.groundAlpha;

        //最小缩放距离
        //viewer.scene.screenSpaceCameraController.minimumZoomDistance = ;

        vm.$emit('updateSpin',false);
      },300)
    },
        /*
    * FOV设置
    * */
   fovChange(e){
      const {viewer,Cesium} = this;
      this.fov = e;
    //   console.log('default fov',Cesium.Math.toDegrees(1.0471975511965976));
      viewer.scene.camera.frustum.fov = Cesium.Math.toRadians(this.fov);
   }
  },
}
</script>

<style scoped>
</style>