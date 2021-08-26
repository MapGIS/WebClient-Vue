<template>
  <div class="svg-select-outer">
    <div class="svg-select-inner" @click="$_toggle"/>
    <div class="svg-select-panel" v-show="showPanel">
      <div class="svg-select-panel-head">
        <div class="svg-select-panel-prev" @click="$_prev">《</div>
        <div class="svg-select-panel-head-tabs">
          <div id="translateId" :style="{transform: 'translateX(' + translateX + 'px)'}">
            <div :id="iconObj.type" @click="$_changeType(iconObj.type)" class="svg-select-panel-tab" v-for="(iconObj,index) in icons" :key="index">
              {{iconObj.type}}
            </div>
          </div>
        </div>
        <div class="svg-select-panel-next" @click="$_next">》</div>
      </div>
      <div class="svg-select-panel-content" v-for="(iconObj,index) in icons" :key="index" v-show="activeType === iconObj.type">
        <img class="svg-select-icon" @click="$_clickIcon(icon)" :src="icon" style="fill:red;" v-for="(icon,index) in iconObj.icons" :key="index">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-svg-select",
  props: {
    icons: {
      type: Array
    }
  },
  data(){
    return {
      showPanel: false,
      activeType: undefined,
      translateX: 0,
      translateXStep: 10,
      translateLength: 0
    }
  },
  mounted() {
    this.activeType = this.icons[0].type;
  },
  methods: {
    $_getTranslateLength(){
      if(this.translateLength === 0){
        let translateLength = 0;
        for (let i = 0; i < this.icons.length; i++) {
          let divWidth = document.getElementById(this.icons[i].type).offsetWidth;
          translateLength += divWidth;
        }
        this.translateLength = translateLength;
      }
      return this.translateLength;
    },
    $_toggle(){
      this.showPanel = !this.showPanel;
    },
    $_clickIcon(icon){
      this.$emit("clickIcon",icon);
    },
    $_changeType(type){
      this.activeType = type;
    },
    $_prev(){
      if(this.translateX + this.translateXStep > 0){
        this.translateX = 0;
      }else {
        this.translateX = this.translateX + this.translateXStep;
      }
    },
    $_next(){
      let translate = document.getElementById("translateId");
      let translateLength = this.$_getTranslateLength();
      if(this.translateX - this.translateXStep < (translate.offsetWidth - translateLength)){
        this.translateX = translate.offsetWidth - translateLength;
      }else {
        this.translateX = this.translateX - this.translateXStep;
      }
    }
  }
}
</script>

<style scoped>
.svg-select-outer{
  border: 1px solid red;
  border-radius: 5px;
  width: 20px;
  height: 20px;
  position: relative;
  margin-left: 131px;
}

.svg-select-inner{
  background: red;
  border-radius: 10px;
  width: 10px;
  height: 10px;
}

.svg-select-panel-tab{
  display: inline-block;
  height: 100%;
  line-height: 30px;
  text-align: center;
  padding: 0 4px;
  cursor: pointer;
}

.svg-select-panel-prev,.svg-select-panel-next{
  display: inline-block;
  position: absolute;
  cursor: pointer;
  z-index: 100;
}

.svg-select-panel-prev{
  left: -2px;
  top: 5px;
}

.svg-select-panel-next{
  left: 269px;
  top: 5px;
}

.svg-select-panel{
  width: 286px;
  height: 255px;
  border-radius: 5px;
  position: absolute;
  top: 19px;
  left: -239px;
  background: rgb(74,74,74);
  z-index: 100;
}

.svg-select-panel-head{
  width: 98%;
  margin: 0 1%;
  height: 30px;
  border-bottom: 2px solid rgb(44,44,44);
  position: relative;
}

.svg-select-panel-head-tabs{
  margin-left: 16px;
  width: 89%;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
}

.svg-select-panel-content{
  width: 100%;
  height: 250px;
}

.svg-select-icon{
  width: 27px;
  height: 27px;
  margin-top: 4px;
  margin-left: 4px;
}
</style>