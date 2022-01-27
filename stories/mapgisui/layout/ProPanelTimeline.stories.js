import MapgisUiTimelinePanel from "../../../ui/src/layout/panel/TimelinePanel.vue";

export default {
  title: "界面/Pro/面板/时间轴面板",
  component: MapgisUiTimelinePanel,
  argTypes: {

  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiTimelinePanel },
  data() {
    return {
      sliderValue: 0,
      timer: undefined,
      playing: undefined,
      spd:'1x',
      intvl: '时',
      maxV:24,
      crtTime:undefined

    };
  },
  mounted() {},
  watch:{
    sliderValue:{
      handler:function(e){
        this.crtTime = this.formatter(e)
      },
      immediate:true
    }
  },
  methods: {
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

    start(){
      const vm = this;

      this.playing = true;

      if(vm.sliderValue >= vm.maxV){
          vm.sliderValue = 0
      }

      this.timer = window.setInterval(function(){
          if(vm.sliderValue >= vm.maxV){
                vm.playing = false;
                window.clearInterval(vm.timer);
          }else{
            vm.sliderValue += 1 * parseFloat(vm.spd);
          }
      },1000)

    },
    stop(){
      window.clearInterval(this.timer);
      this.playing = false;
    },
    spdChange(e){
      this.spd = e;
    },
    intvlChange(e){
      this.intvl = e;
      this.sliderValue = 0;
      
      const vm = this;
      switch (e) {
        case "时":
          return vm.maxV = 24;
        case "分":
          return vm.maxV = 24 * 60 ;
        case "秒":
          return vm.maxV = 24 * 60 * 60;
      }
    }

  },
  template: `<div>
    <mapgis-ui-timeline-panel 
      v-bind="$props" 
      v-model="sliderValue"
      :interval="intvl"
      :tipFormatter="formatter"
      :isPlaying="playing"
      :max="maxV"
      :currentTime="crtTime"
      @startPlay="start"
      @stopPlay="stop"
      @intervalChange="intvlChange"
      @speedChange="spdChange"
    >
    </mapgis-ui-timeline-panel>
  </div>`,
});

export const 时间轴面板 = Template.bind({});
时间轴面板.args = {
  intervalOptions: ['时', '分', '秒'],
  intervalPlaceholder: '时',
  speedOptions: ['60x','12x','6x','3x', '2x', '1x'],
  sliderStyle:{
    marginLeft:'90px',
    width:'240px'
  }
};

