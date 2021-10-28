<template>
  <div>
    <button @click="pause" style="position: absolute;top: 100px;left: 100px;z-index: 100">暂停</button>
    <button @click="changeDirect" style="position: absolute;top: 200px;left: 100px;z-index: 100">改变方向</button>
    <button @click="changeTime" style="position: absolute;top: 300px;left: 100px;z-index: 100">改变时间轴位置</button>
  </div>
</template>

<script>
export default {
  name: "Track",
  inject: ["viewer"],
  data() {
    return {
    }
  },
  props: {
    czml: {
      type: Array
    }
  },
  watch: {
    czml: {
      handler: function () {
        console.log("asdasdsadasdas",window.czml)
        window.czml.process(this.czml);
      },
      deep: true
    },
  },
  mounted(){
    let vm = this;
    window.czml = new Cesium.CzmlDataSource();
    this.viewer.dataSources
        .add(window.czml.load(this.czml))
        .then(function (ds) {
          console.log("--------")
          // vm.viewer.trackedEntity = ds.entities.getById("path");
        });
  },
  methods: {
    pause(){
      this.viewer.clockViewModel.shouldAnimate = !this.viewer.clockViewModel.shouldAnimate;
    },
    changeDirect(){
      this.viewer.clockViewModel.multiplier = this.viewer.clockViewModel.multiplier * -1;
    },
    changeTime(){
      // let vm = this;
      // this.viewer.clockViewModel.multiplier = -400;
      // this.viewer.clockViewModel.shouldAnimate = true;
      // setTimeout(function () {
      //   vm.viewer.clockViewModel.shouldAnimate = false;
      //   vm.viewer.clockViewModel.multiplier = 10;
      // },100);
      // console.log("this.viewer.clockViewModel",this.viewer.clockViewModel)
      this.viewer.clockViewModel.currentTime = Cesium.JulianDate.fromIso8601("2012-08-04T10:00:00Z");
    }
  }
}
</script>

<style scoped>

</style>