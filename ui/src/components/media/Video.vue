<template>
  <div>
    <video
      ref="videoPlayer"
      class="video-js vjs-default-skin"
      controls
      preload="auto"
      :width="width"
      :height="height"
    >
      <source :src="videoUrl" :type="playerType" />
    </video>
  </div>
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
    this.init();
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose(); //销毁
    }
  },
  methods: {
    init() {
      if (this.player) {
        return;
      }
      const vm = this;
      this.$nextTick(() => {
        const options = {
          autoplay: true
        };
        vm.player = videojs(
          vm.$refs.videoPlayer,
          options,
          function onPlayerReady() {
            vm.$emit("onPlayerReady", this);
          }
        );
        vm.addVideo();
      });
    },
    addVideo() {
      if (!this.player) {
        return;
      }
      if (this.videoUrl.length > 0) {
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
