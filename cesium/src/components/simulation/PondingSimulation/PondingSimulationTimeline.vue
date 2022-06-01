<template>
    <div class="ponding-simuilation-timeline">
        <mapgis-ui-plot-timeline
            v-model="sliderValue"
            :duration="pondingTime"
            :interval="intvl"
            :speed="multiSpeedCopy"
            :speedStep="speedStep"
            :maxSpeed="60"
            :intervalOptions="intvlOptions"
            :intervalPlaceholder="intvlPlaceholder"
            :currentTime="crtTime"
            :curTimeWidth="curTimeWidth"
            @forward="play"
            @intervalChange="intvlChange"
            @speedChange="spdChange"
            :pauseActive="!playing"
            :forwardActive="playing"
            :enableStart="false"
            :enableBack="false"
            :enableEnd="false"
            :disablePause="true"
            :disableForward="noForward"
            ref="timeline"
        ></mapgis-ui-plot-timeline>
    </div>
</template>

<script>
export default {
    name: "mapgis-3d-ponding-simulation-timeline",
    inject: ["Cesium", "vueCesium", "viewer"],
    props: {
        costTime: {
            type: Number,
            default: 0,
        },
        speedStep: {
            type: Number,
            default: 1,
        },
        isPlaying: {
            type: Boolean,
            default: false,
        },
        curTimeWidth: {
            type: Number,
            default: null,
        }
    },
    watch: {
        multiSpeedCopy(e) {
            this.$emit('updateSpeed',e)
        },
        costTime:{
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
                const vm = this;
                this.playing = e;
                if(e){
                    vm.noForward = false;
                    vm.value = 0;
                    this.$refs.timeline.disableForwardCopy = vm.noForward;
                    this.$refs.timeline.valueCopy = vm.value;
                    this.$refs.timeline.forward();

                }else{
                    this.noForward = false;
                    if( this.costTime === 0){
                        this.noForward = true;
                    }
                    this.$refs.timeline && this.$refs.timeline.pause();
                }
            },
            immediate: true,
        },
    },
    data() {
        return {
            sliderValue: 0,
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

            noForward: false,
            playing: this.isPlaying,
            intvl: '时',
            crtTime:undefined,

            intvlOptions: ['时', '分', '秒'],
            intvlPlaceholder: '时',
            multiSpeedCopy: 1,
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
            this.sliderValue = 0;
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
            let ms = new Date(( value - 8 * 60 * 60 ) * 1000);
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
            if(this.playing){
                this.sliderValue = 0;
            }
            this.multiSpeedCopy = e;
        },
        intvlChange(e){
          this.intvl = e;
          if(this.playing){
            this.sliderValue = 0;
          }
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
        play() {
            this.$emit("play");
        },
    },
};
</script>

<style scoped>
</style>