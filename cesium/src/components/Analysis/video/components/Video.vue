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
  name: "mapgis-video",
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
      }
      return type;
    }
  },
  watch: {
    videoUrl: {
      handler() {
        if (!this.player) {
          this.init();
        }
        if (this.videoUrl.length > 0) {
          this.player.src({
            src: this.videoUrl,
            type: this.playerType
          });
          this.player.load();
        }
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
      const options = {
        autoplay: true
      };
      this.player = videojs(
        this.$refs.videoPlayer,
        options,
        function onPlayerReady() {
          console.log("onPlayerReady", this);
        }
      );
    }
  }
};
</script>
