<template>
  <div>
    <mapgis-ui-input-group compact>
      <mapgis-ui-select default-value="lonlat" style="width: 200px" @change="handleChange">
        <mapgis-ui-select-opt-group>
          <span slot="label"><mapgis-ui-icon type="user" />定位点</span>
          <mapgis-ui-select-option value="lonlat">
            经纬度
          </mapgis-ui-select-option>
          <mapgis-ui-select-option value="WebMecro">
            Web墨卡托
          </mapgis-ui-select-option>
        </mapgis-ui-select-opt-group>
        <mapgis-ui-select-opt-group label="图幅号">
          <mapgis-ui-select-option value="NewMapNum">
            新图幅号
          </mapgis-ui-select-option>
          <mapgis-ui-select-option value="OldMapNum">
            旧图幅号
          </mapgis-ui-select-option>
        </mapgis-ui-select-opt-group>
      </mapgis-ui-select>
      <mapgis-ui-input style="width: 50%" default-value="inputDefaultVal" id="inputVal"/>
    </mapgis-ui-input-group>
    <mapgis-ui-button
        shape="circle"
        type="primary"
        @click="locateToMap"
        :class="item.className"
    >
      <mapgis-ui-iconfont
          :type="item.icon"
          :class="item.className"
          theme="filled"
      />
    </mapgis-ui-button>
    <mapgis-ui-icon></mapgis-ui-icon>
      <!--        <mapgis-ui-group-tab title="下属行政区化定位">-->
      <!--        <mapgis-ui-form-item label="">-->
      <!--          <mapgis-ui-input-->
      <!--              v-model.number=""-->
      <!--              type="number"-->
      <!--              min="0"-->
      <!--          />-->
      <!--        </mapgis-ui-form-item>-->
      <!--        </mapgis-ui-group-tab>-->
  </div>
</template>

<script>
export default {
  name: "mapgis-3d-locate",
  inject: ["Cesium", "viewer"],
  data() {
    return {
      inputDefaultVal:'X°,Y°',
      NewMapNum: undefined,

    }
  },
  watch: {
    mapNumber: {
      handler: function (newVAal, oldVal) {
        this.resultCoorFromMapNumber();
      }
    }
  },
  methods: {
    handleChange(e){
      switch (e) {
        case 'lonlat':
          this.inputDefaultVal = 'X°,Y°';
          break;
        case 'WebMecro':
          this.inputDefaultVal = 'X Y';
          break;
        case 'NewMapNum':
          this.inputDefaultVal = 'NewMapNum';
          break;
        case 'OldMapNum':
          this.inputDefaultVal = 'OldMapNum';
          break;
      }
    },
    locateToMap(){
      let inputValue = document.getElementById("inputVal");
      switch (this.inputDefaultVal) {
        case 'NewMapNum':
          this.resultCoorFromMapNumber(inputValue);
          break;
      }
    },
    /**
     * 飞行定位到一个笛卡尔空间直角坐标点位置
     * @param destination 笛卡尔坐标系
     * @param heading 偏航角，正北偏东为正
     * @param pitch 俯仰角，倾斜角度
     * @param range 围绕x轴转动
     * @param duration 持续时间
     * @param callBack 回调函数
     */
    flyToPoint(destination, heading = 0.0, pitch = -90, range = 0.0, duration = 3, callBack = null) {
      let {viewer, Cesium} = this;
      if (!viewer) {
        console.log('三维球未初始化！');
        return;
      }
      if (!destination) {
        console.log('定位目标点不对！');
        return;
      }
      var boundingSphere = new Cesium.BoundingSphere(destination, 0.0);
      viewer.camera.flyToBoundingSphere(boundingSphere, {
        duration: duration,
        maximumHeight: undefined,
        complete: function () {
          if (callBack) {
            callBack();
          } else {
            console.log('定位失败！');
          }
        },
        cancel: function () {
          console.log('定位取消！');
        },
        offset: {
          heading: Cesium.Math.toRadians(heading),
          pitch: Cesium.Math.toRadians(pitch),
          range: range
        },
      });
    },
    /**
     * 定位到一个矩形范围
     * @param rectangle 笛卡尔坐标数组
     * @param heading
     * @param pitch
     * @param range
     * @param duration
     */
    flyToRectangle(rectangle, heading = 0.0, pitch = -90, range = 0.0, duration = 3) {
      let {viewer} = this;
      let locateEntity = viewer.entities.add({
        name: "",
        id:"NewMapNum",
        rectangle: {
          coordinates: rectangle
        }
      });
      viewer.flyTo(locateEntity, {
        duration: duration,
        offset: {
          heading: Cesium.Math.toRadians(heading),
          pitch: Cesium.Math.toRadians(pitch),
          range: range
        },
      });
    },
    //根据新图幅号计算坐标
    resultCoorFromMapNumber(NewMapNum) {
      debugger
      let {Cesium} = this;
      let H = 0, L = 0, h = 0, l = 0;
      let delX, delY;
      if (NewMapNum.length == 3) {
        // 只有1:100万图幅号
        delX = 6;
        delY = 4;
        //100w比例尺的情况下，没有后边六位的行列号，直接认为h和l是0即可
      } else {
        // 求行列号
        h = Number(NewMapNum.subString(4, 7));
        l = Number(NewMapNum.subString(7, 10));
      }
      // 判断图幅号第三位的其他比例尺字符编码 B->K
      switch (NewMapNum[3]) {
        case 'B':                       //50w
          delX = 3;
          delY = 2;
          break;
        case 'C':                       //25w
          delX = 1.5;
          delY = 1;
          break;
        case 'D':                       //10w
          delX = 0.5;
          delY = 1.0 / 3;
          break;
        case 'E':                       //5w
          delX = 0.25;
          delY = 1.0 / 6;
          break;
        case 'F':                       //2.5w
          delX = 0.125;
          delY = 1.0 / 12;
        case 'G':                       //1w
          delX = 0.0625;
          delY = 1.0 / 24;
        case 'H':                       //5000
          delX = 0.0625 / 2;
          delY = 1.0 / 24 / 2;
      }

      H = NewMapNum[0].charCodeAt() - 64;
      L = Number(NewMapNum.subString(1, 3));

      //计算左下角坐标
      //经度：
      let x = (L - 31) * 6 + (l - 1) * delX;
      //纬度：
      let y = (H - 1) * 4 + (4 / delY - h) * delY;
      let degreeArr = [];
      let leftDown = [x, y];
      degreeArr.push(leftDown);
      //计算右下角坐标
      let rightDown = [x + delX, y];
      degreeArr.push(rightDown);

      let rightUp = [x + delX, y + delY];
      degreeArr.push(rightUp);

      let leftUp = [x, y + delY];
      degreeArr.push(leftUp);

      //经纬度转换成笛卡尔坐标
      let pointArr = [];
      for (let i = 0; i < degreeArr.length; i++) {
        pointArr.push(new Cesium.Cartesian3(degreeArr[i][0], degreeArr[i][1], 0));
      }
      this.flyToRectangle(pointArr);
    }
  }
}

</script>

<style scoped>

</style>