<template>
  <div class="camera-setting">
    <mapgis-ui-form-model v-bind="formItemLayout" :layout="layout" labelAlign="left" :colon="false">

      <mapgis-ui-form-model-item label="地下模式" >
        <mapgis-ui-switch checked-children="开启" un-checked-children="关闭"  v-model="undgrd" @change="enableUndgrd">
        </mapgis-ui-switch>
      </mapgis-ui-form-model-item>

      <div class="parameter" :style="{maxHeight: undgrdParams}">
        <mapgis-ui-form-model-item label="地表透明度">
          <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="groundAlpha"
                :max="1"
                :min="0"
                :step="0.1"
                @change="enableUndgrd"
            />
            <mapgis-ui-input-number
                v-model="groundAlpha"
                  :max="1"
                :min="0"
                :step="0.1"
                size="small"
                @change="enableUndgrd"
            />
          </mapgis-ui-space>
        </mapgis-ui-form-model-item>        
      </div>

      <mapgis-ui-form-model-item label="FOV设置" >
        <mapgis-ui-space>
            <mapgis-ui-slider
                v-model="fov"
                :max="180"
                :min="0"
                :step="15"
                @change="fovChange"
            />
            <mapgis-ui-input-number
                v-model="fov"
                :max="180"
                :min="0"
                :step="15"
                size="small"
                @change="fovChange"
            />
          </mapgis-ui-space>
      </mapgis-ui-form-model-item>

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

      fov:60.0,
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
    enableUndgrd() {
      const {viewer} = this;
      this.$emit('updateSpin',true);
      let vm = this;

     if(vm.undgrd){
        vm.undgrdParams = "40px"
      }else{
        vm.undgrdParams = "0px"
      }

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
   fovChange(){
      const {viewer,Cesium} = this;
    //   console.log('default fov',Cesium.Math.toDegrees(1.0471975511965976));
      viewer.scene.camera.frustum.fov = Cesium.Math.toRadians(this.fov);
   }
  },
}
</script>

<style scoped>

/* .camera-setting {
} */

.mapgis-ui-form-item {
  margin: 0;
  padding: 0 10px;
}

::v-deep .mapgis-ui-form-item-control{
  text-align: right;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
}

::v-deep .mapgis-ui-form > .mapgis-ui-form-item .mapgis-ui-form-item-label:before{
  content: url("titlew.png");
  margin-right: 6px;
}

.mapgis-ui-input-number{
  margin-right: 12px;
  width: 60px;
}

.mapgis-ui-slider{
  width: 110px;
}

::v-deep .mapgis-ui-slider-rail{
  background-color: #F0F0F0;
}

::v-deep .parameter .mapgis-ui-slider-rail{
  background-color: #FFFFFF;
}
::v-deep .mapgis-ui-slider-track{
  background-color: #91D5FF;
}
::v-deep .mapgis-ui-slider-handle{
  border: 2px solid #91D5FF;
}

/*!*设置tab头宽度为80px*!

.mapgis-ui-tabs-nav .mapgis-ui-tabs-tab{
  padding: 12px;
}

.mapgis-ui-tabs-ink-bar[style]{
  width: 80px!important;
}*/

.parameter{
  background: #F1F1F1;
  border-radius: 4px;
  /*margin-bottom: 10px;*/
  overflow: hidden;
  max-height: 0px;
  transition:max-height .5s;
  -moz-transition:max-height .5s; /* Firefox 4 */
  -webkit-transition:max-height .5s; /* Safari and Chrome */
  -o-transition:max-height .5s; /* Opera */
}

/*::v-deep .mapgis-ui-col-6{*/
/*  padding-right: 16px;*/
/*}*/
</style>