<template>
    <div :style="{ width: `${width}px`,height:'80px' }">
        <mapgis-ui-timeline-panel
            v-model="sliderValue"
            :max="pondingTime"
            :interval="intvl"
            :intervalOptions="intvlOptions"
            :intervalPlaceholder="intvlPlaceholder"
            :speedOptions="spdOptions"
            :tipFormatter="formatter"
            :isPlaying="playing"
            :currentTime="crtTime"
            :disabled="true"
            :width="width"
            :sliderStyle="sliderStyle"
            @startPlay="addflood"
            @stopPlay="stop"
            @intervalChange="intvlChange"
            @speedChange="spdChange"
        ></mapgis-ui-timeline-panel>
    </div>
</template>

<script>
export default {
    name: "mapgis-3d-ponding-simulation-timeline",
    inject: ["Cesium", "vueCesium", "viewer"],
    props: {
        value: {
            type: Number,
            default: 0,
        },
        isPlaying: {
            type: Boolean,
            default: false,
        },
        width: {
            type: Number,
            default: 500,
        },
        sliderStyle:{
            type: Object,
            default: ()=>{
                return { marginLeft:'90px', width:'240px' } 
            }
        }
    },
    watch: {
        value(e) {
            this.sliderValue = e;
        },
        sliderValue:{
          handler:function(e){
            this.crtTime = this.formatter(e)
          },
          immediate:true
        },
        pondingTime: {
            handler: function (e) {
                this.$emit("updateTime", e);
            },
            immediate: true,
        },
        isPlaying: {
            handler: function (e) {
                this.playing = e;
            },
            immediate: true,
        },
    },
    data() {
        return {
            sliderValue: this.value,
            marks: {
                0: "0:00",
                4: "4:00",
                8: "8:00",
                12: "12:00",
                16: "16:00",
                20: "20:00",
                24: "24:00",
            },

            //积水上涨的时间
            pondingTime: 24,

            
            timer: undefined,
            playing: this.isPlaying,
            spd:'1x',
            intvl: '时',
            crtTime:undefined,

            intvlOptions: ['时', '分', '秒'],
            intvlPlaceholder: '时',
            spdOptions: ['60x','12x','6x','3x', '2x', '1x'],
        };
    },
    mounted() {
        this.mount();
    },
    beforeDestroy() {
        this.unmount();
    },
    methods: {
        mount() {
            this.$emit("loaded", this);
        },
        unmount() {
            let vm = this;
            vm.sliderValue = 0;
        },
        formatter(value) {
          const vm = this;
          if(vm.intvl == '时'){
            return vm.addT(value) + ':00:00';
          }else if(vm.intvl == '分'){
            let ms = new Date((value - 8 * 60) * 60 * 1000);
            let h = ms.getHours();
            let m = ms.getMinutes();
            return vm.addT(h) + ':' + vm.addT(m) + ':00';
          }else if(vm.intvl == '秒'){
            let ms = new Date((value-8*60*60) * 1000);
            let h = ms.getHours();
            let m = ms.getMinutes();
            let s = ms.getSeconds();
            return vm.addT(h) + ':' + vm.addT(m) + ':' + vm.addT(s);
          }
        },
        addT(m) {
              return m < 10 ? '0' + m : m
            },    
        spdChange(e){
          this.spd = e;
          this.$emit('updateSpeed',parseFloat(this.spd))
        },
        intvlChange(e){
          this.intvl = e;
          this.sliderValue = 0;

          const vm = this;
          switch (e) {
            case "时":
              return vm.pondingTime = 24;
            case "分":
              return vm.pondingTime = 24 * 60 ;
            case "秒":
              return vm.pondingTime = 24* 60* 60;
          }
        },
        
        /* 开始播放 */
        addflood() {
            this.playing = true;
            this.$emit("play");
        },
        stop(){
          this.playing = false;
        },
    },
};
</script>

<style scoped>
</style>