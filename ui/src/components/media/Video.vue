<template>
  <video
    ref="videoPlayer"
    class="video-js vjs-default-skin"
    controls
    preload="auto"
    :width="width"
    :height="height"
  >
    <source
      v-if="videoUrl && videoUrl !== ''"
      :src="videoUrl"
      :type="playerType"
    />
  </video>
</template>

<script>
import videojs from "video.js";
import "videojs-contrib-hls";
import "video.js/dist/video-js.css";
export default {
  name: "mapgis-ui-video",
  props: {
    width: { type: Number, default: 300 },
    height: { type: Number, default: 200 },
    protocol: {
      type: String,
      default: "mp4"
    },
    videoUrl: {
      type: String,
      default: ""
    }
  },
  computed: {
    playerType() {
      let type = "video/mp4";
      if (this.protocol === "mp4") {
        type = "video/mp4";
      } else if (this.protocol === "m3u8") {
        type = "application/x-mpegURL";
      } else if (this.protocol === "webm") {
        type = "video/webm";
      } else if (this.protocol === "ogg") {
        type = "video/ogg";
      }
      return type;
    }
  },
  watch: {
    videoUrl: {
      handler() {
        this.addVideo();
      },
      immediate: true
    }
  },
  data() {
    return {
      player: null
    };
  },
  mounted() {
    this.addVideo();
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose(); //销毁
    }
  },
  methods: {
    initPlayer() {
      const options = {
        // 播放速度  playbackRates: [0.7, 1.0, 1.5, 2.0],
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      };
      const vm = this;
      setTimeout(function() {
        vm.player = videojs(
          vm.$refs.videoPlayer,
          options,
          function onPlayerReady() {
            vm.$emit("onPlayerReady", vm.player);
          }
        );
        vm.addVideo();
      }, 1500);
    },
    addVideo() {
      if (this.videoUrl.length > 0) {
        if (!this.player) {
          this.initPlayer();
          return;
        }
        this.player.src({
          src: this.videoUrl,
          type: this.playerType
        });
        this.player.load();
      }
    }
  }
};
</script>
