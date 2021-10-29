<template>
  <div>
    <div class="mapgis-track-player">
      <div class="mapgis-track-player-container" style="padding-top: 20px">
        <mapgis-ui-slider @afterChange="$_sliderClick" v-model="currentSlider" :max="maxSlider"
                          class="mapgis-track-player-slider"/>
      </div>
      <div class="mapgis-track-player-container mapgis-track-player-option">
        <span class="mapgis-track-player-start">{{ playStartTime }}</span>
        <img @click="back" ref="back" @mouseleave="$_backLeave" @mouseenter="$_backEnter"
             class="mapgis-track-player-back"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNDQ0RUQxMzM4N0MxMUVDQkJGOUYxQjlBODkxNzI1OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNDQ0RUQxNDM4N0MxMUVDQkJGOUYxQjlBODkxNzI1OCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0NDRFRDExMzg3QzExRUNCQkY5RjFCOUE4OTE3MjU4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0NDRFRDEyMzg3QzExRUNCQkY5RjFCOUE4OTE3MjU4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+4zi8vgAAAOlJREFUeNpi/P//PwMlgImBQoBigJ1HxGEQJsUAFmQOMzOLDS6FQIMFgVQXEAcf2rFCCKsBLCwsWDU7+cREAeX6gUwxvC5gYWVDkXQLTFICUtOB4m5EeYGVDWKAT0QWK5AqZmPnqAPSnESHARsbO5gGRu1RIGVKciDCDAACRrJigRVqABMTkxXIC0BM0Aso6YCNnR2M50+q/Q3EHcAw0AHiXUDMgIxxGsAKjAVWpJiY2V16D4jdgV6LBuJXIC8ieZOwATAwuTVvGVBcA4jnAPF73CmRhfUIrgDsa8gAaUyFYjhgHPDcCBBgAIw4LgcxS9SEAAAAAElFTkSuQmCC"
             alt="后退">
        <img ref="play" @mouseleave="$_playerLeave" @mouseenter="$_playerEnter" v-if="!shouldAnimate" @click="play"
             class="mapgis-track-player-play"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowRDg0MzE4RDM4N0MxMUVDOTUzMEM0MEIyNDE1QjZEOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowRDg0MzE4RTM4N0MxMUVDOTUzMEM0MEIyNDE1QjZEOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBEODQzMThCMzg3QzExRUM5NTMwQzQwQjI0MTVCNkQ4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBEODQzMThDMzg3QzExRUM5NTMwQzQwQjI0MTVCNkQ4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+iIYkxAAAAcFJREFUeNqsls0rBHEYx78zViTaC1LKHok9ulGSkgvFwXtuykVyELm4eSnCQTk4KVoOlD/ALvEfrOLiZXPCRTYRzfr+9KzQzs9vxjz1aWrmme93fm/PM1bFSgaaqCL9pJnUkjLyRm7JDUmQHXLlJmC5GCjhedJN8qAPR0ymSOr3QzvHCx0kSfoMxLMaKvdMrlqDMbJPSuA9iskWGXcz6CHLLqMyDYssidYPAzXnG5Lw37BEq+q7wZwMMahQWgtZgwjp1WWfjwCLLUC4wJOJ2oERW8S1866EB6LAyRDQVW1s8KltyyEyitIiYK0NiHXy08JGrzQrg6jXCW7i8iUGgdF6IF+/56LqcamfVSwMAdMNwEG3Nq3MDmJP/rUQD36EX96B2VOgfVebdh+SGlLpRfyIJW3ykOX08c/UpDJgKlpNhB+egZljYO/C+FvitpRaR5f1+MoqxvrauOlJ/LOMqxFck13daa5Z97X+SvM6u4smSTrAWpQWza8SoTrRMMkEIJ4RrdTvfhCTZuH8U3xCtHJ2tFXCSoMnn9MyKA1H25MPpD7FDEfjSG4d2Tb9q8j126IEyuX+nRzQuOyWSzeBDwEGAGtXX2HVYW0fAAAAAElFTkSuQmCC"
             alt="播放">
        <img ref="pause" v-if="shouldAnimate" @mouseleave="$_pauseLeave" @mouseenter="$_pauseEnter" @click="play"
             class="mapgis-track-player-play"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowRUNEOEJENDM4N0MxMUVDODQ4MEVGMTIzMjhCM0ExOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowRUNEOEJENTM4N0MxMUVDODQ4MEVGMTIzMjhCM0ExOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBFQ0Q4QkQyMzg3QzExRUM4NDgwRUYxMjMyOEIzQTE5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBFQ0Q4QkQzMzg3QzExRUM4NDgwRUYxMjMyOEIzQTE5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+0oSpJgAAAYFJREFUeNq0lrFKw1AUhm8S3OpmxSmCo/YJ3PoCgotWcXVxUDoIfQPbQVQoTq5KdRF8AOsDiFPdpNbSSd0Ul9LE/+Af0Jpzibb3wEfg9Pb/c09O7ok3cxgbS4RgHRTBPMiDPuiBJ3ADzsGjJuApBiJcBSsgMPaIaFIB3eEf/ZQ/LIEWWMsgnmjI2nterQY74BJMmr9HDpyCsmawCg6UXWUND+xT64eB1PyEC0YNj1rhd4M9bvFXVBaNedj6utpyKeWqJV00i2tbK01vG08a99Qf4Jbqek7prjkRLdnqHrBoE4E9p3RXyedL5CqKYlBwaFAQgymHBnnfOA4xeHWo/+LzDHEVLTG4dmjQ9HnURtqKAU9zealsOe0YF4MOuNBW1W+N+cCIOb6z51JCNDvJwAn5LHJjKs07WJABlLSpTKJNEI9BPKZWd3geNDgsohHFd6mVOtGOwDJ4+2dZNjhwrDP5iudTI+NuIq6Vmp9l/apI+2wRgWnmn9kUTXZLWxP4FGAAq2FjjeJrfkEAAAAASUVORK5CYII="
             alt="暂停">
        <img @click="forward" ref="forward" @mouseleave="$_forwardLeave" @mouseenter="$_forwardEnter"
             class="mapgis-track-player-forward"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNERBNTNBMDM4N0MxMUVDOTYyNEEwRDg3NEMxQUI2QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNERBNTNBMTM4N0MxMUVDOTYyNEEwRDg3NEMxQUI2QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0REE1MzlFMzg3QzExRUM5NjI0QTBEODc0QzFBQjZCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0REE1MzlGMzg3QzExRUM5NjI0QTBEODc0QzFBQjZCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Br2+XwAAAONJREFUeNpi/P//PwMlgJGuBth5RBwG0Yd2rLCFibGgKXgHpNYCcRlQ0Xt0A5iZWWzQxZiQOSwsLIJAnALEN5x8YqLQFQPFwRi3AaxsMCwGxEvdApN2ArESujyKHmQOGzsHuqVuQHzFJyKrCUj3srKxYYQLigHsmAaAACcQtwNxECMjI1kGwGMMmyCqARyc2NR8B2KwF/79+/cLrwFYwmAXEGfO7C69B+KkFnfgdwEbGzuM+QqICye35i1DlmdlJRCIQAXvYQmpryEDIyERNACoSQhfKDKzsB5BD0zGAc+NAAEGAOxjOj4Wq8AXAAAAAElFTkSuQmCC"
             alt="前进">
        <span class="mapgis-track-player-end">{{ endTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {Style} from "@mapgis/webclient-es6-service";

const {PointStyle, ModelStyle, MarkerStyle, TrackStyle} = Style;
export default {
  name: "mapgis-3d-track-layer",
  inject: ["viewer"],
  data() {
    return {
      currentSlider: 0,
      maxSlider: 110,
      interval: undefined,
      playStartTime: undefined,
      shouldAnimate: false
    }
  },
  props: {
    startTime: {
      type: String
    },
    endTime: {
      type: String
    },
    speed: {
      type: Number,
      default: 10
    },
    trackPointStyle: {
      type: Object
    },
    trackStyle: {
      type: Object
    },
    dataSource: {
      type: [Object, Array]
    }
  },
  watch: {},
  mounted() {
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    this.playStartTime = this.$_getPlayStartTime(0);
    this.$_addTrack();
  },
  methods: {
    $_backLeave() {
      this.$refs.back.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNDQ0RUQxMzM4N0MxMUVDQkJGOUYxQjlBODkxNzI1OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNDQ0RUQxNDM4N0MxMUVDQkJGOUYxQjlBODkxNzI1OCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0NDRFRDExMzg3QzExRUNCQkY5RjFCOUE4OTE3MjU4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0NDRFRDEyMzg3QzExRUNCQkY5RjFCOUE4OTE3MjU4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+4zi8vgAAAOlJREFUeNpi/P//PwMlgImBQoBigJ1HxGEQJsUAFmQOMzOLDS6FQIMFgVQXEAcf2rFCCKsBLCwsWDU7+cREAeX6gUwxvC5gYWVDkXQLTFICUtOB4m5EeYGVDWKAT0QWK5AqZmPnqAPSnESHARsbO5gGRu1RIGVKciDCDAACRrJigRVqABMTkxXIC0BM0Aso6YCNnR2M50+q/Q3EHcAw0AHiXUDMgIxxGsAKjAVWpJiY2V16D4jdgV6LBuJXIC8ieZOwATAwuTVvGVBcA4jnAPF73CmRhfUIrgDsa8gAaUyFYjhgHPDcCBBgAIw4LgcxS9SEAAAAAElFTkSuQmCC";
    },
    $_backEnter() {
      this.$refs.back.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNjIxNkRDNjM4N0MxMUVDOUNERDhBNERBODEyOERCRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNjIxNkRDNzM4N0MxMUVDOUNERDhBNERBODEyOERCRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM2MjE2REM0Mzg3QzExRUM5Q0REOEE0REE4MTI4REJEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM2MjE2REM1Mzg3QzExRUM5Q0REOEE0REE4MTI4REJEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+PWvmjAAAANZJREFUeNpi/P//PwMlgImBQoBigOxkhsMgTIoBLMgcZkYGG1wKFaYwCAKpLiAOfpDDIITdABweUp7GEAWU6wcyxfC7AM0AtRkMSkBqOlDcjSgvsDBCaK2ZDKxAqhjIrwPSnESHAQvCBUeB2JTkQEQygJGsaASFARRbAXElEH9HEoNjnAaAXADCpxMZfgNxB5CtA8S7YOIwTNAAGDgez3APiN2BYtFA/IqgAcCEBMbo4HAswzKguAYQzwHi98hyjMiZyXkZOBkz7o3CnSLRAeOA50aAAAMAn1gn18iM2TcAAAAASUVORK5CYII=";
    },
    $_forwardLeave() {
      this.$refs.forward.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNERBNTNBMDM4N0MxMUVDOTYyNEEwRDg3NEMxQUI2QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNERBNTNBMTM4N0MxMUVDOTYyNEEwRDg3NEMxQUI2QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0REE1MzlFMzg3QzExRUM5NjI0QTBEODc0QzFBQjZCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0REE1MzlGMzg3QzExRUM5NjI0QTBEODc0QzFBQjZCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Br2+XwAAAONJREFUeNpi/P//PwMlgJGuBth5RBwG0Yd2rLCFibGgKXgHpNYCcRlQ0Xt0A5iZWWzQxZiQOSwsLIJAnALEN5x8YqLQFQPFwRi3AaxsMCwGxEvdApN2ArESujyKHmQOGzsHuqVuQHzFJyKrCUj3srKxYYQLigHsmAaAACcQtwNxECMjI1kGwGMMmyCqARyc2NR8B2KwF/79+/cLrwFYwmAXEGfO7C69B+KkFnfgdwEbGzuM+QqICye35i1DlmdlJRCIQAXvYQmpryEDIyERNACoSQhfKDKzsB5BD0zGAc+NAAEGAOxjOj4Wq8AXAAAAAElFTkSuQmCC";
    },
    $_forwardEnter() {
      this.$refs.forward.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNjdENzM5RjM4N0MxMUVDOTQyNUQ0NTdBMTJEMzFERiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNjdENzNBMDM4N0MxMUVDOTQyNUQ0NTdBMTJEMzFERiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM2N0Q3MzlEMzg3QzExRUM5NDI1RDQ1N0ExMkQzMURGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM2N0Q3MzlFMzg3QzExRUM5NDI1RDQ1N0ExMkQzMURGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k5y39wAAAM1JREFUeNpi/P//PwMlgJGuBshOZjgMoh/nMtjCxFiQFShMYXgHpNYCcdmDHIb36AYwMzLYoIsxoShgYhAE4hQgvqE8jSEKwwAmCMZnAAyLAfFStRkMO4FYCZ8BKF5gYcTwthsQX9GaydAEpHuxyKMZwIQ17DiBuB2Ig7BJEmMAPMawCeIKA2T8HYgrgdiKcBhgumAXEGcej2e4B+JYLiTeC6+AuPBwLMMyQl5kQUso72EJ6UAM1oSE3wCgJiF8oQj0/xH0wGQc8NwIEGAA3BcwGOe59OgAAAAASUVORK5CYII=";
    },
    $_pauseLeave() {
      this.$refs.pause.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowRUNEOEJENDM4N0MxMUVDODQ4MEVGMTIzMjhCM0ExOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowRUNEOEJENTM4N0MxMUVDODQ4MEVGMTIzMjhCM0ExOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBFQ0Q4QkQyMzg3QzExRUM4NDgwRUYxMjMyOEIzQTE5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBFQ0Q4QkQzMzg3QzExRUM4NDgwRUYxMjMyOEIzQTE5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+0oSpJgAAAYFJREFUeNq0lrFKw1AUhm8S3OpmxSmCo/YJ3PoCgotWcXVxUDoIfQPbQVQoTq5KdRF8AOsDiFPdpNbSSd0Ul9LE/+Af0Jpzibb3wEfg9Pb/c09O7ok3cxgbS4RgHRTBPMiDPuiBJ3ADzsGjJuApBiJcBSsgMPaIaFIB3eEf/ZQ/LIEWWMsgnmjI2nterQY74BJMmr9HDpyCsmawCg6UXWUND+xT64eB1PyEC0YNj1rhd4M9bvFXVBaNedj6utpyKeWqJV00i2tbK01vG08a99Qf4Jbqek7prjkRLdnqHrBoE4E9p3RXyedL5CqKYlBwaFAQgymHBnnfOA4xeHWo/+LzDHEVLTG4dmjQ9HnURtqKAU9zealsOe0YF4MOuNBW1W+N+cCIOb6z51JCNDvJwAn5LHJjKs07WJABlLSpTKJNEI9BPKZWd3geNDgsohHFd6mVOtGOwDJ4+2dZNjhwrDP5iudTI+NuIq6Vmp9l/apI+2wRgWnmn9kUTXZLWxP4FGAAq2FjjeJrfkEAAAAASUVORK5CYII=";
    },
    $_pauseEnter() {
      this.$refs.pause.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowRTVGREMyQjM4N0MxMUVDQjY2QUUyNDMyM0E2RTYyQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowRTVGREMyQzM4N0MxMUVDQjY2QUUyNDMyM0E2RTYyQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBFNUZEQzI5Mzg3QzExRUNCNjZBRTI0MzIzQTZFNjJDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBFNUZEQzJBMzg3QzExRUNCNjZBRTI0MzIzQTZFNjJDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+a1B7mgAAAYBJREFUeNq0lr9KA0EQxufWa4TYGctL65/4ECltBAlqFMHKWixE30AtROxtlVMRwQcwPkREK00OK7XTQjDc+Q3OQTxvltNkB34czO59HzvZzJw3EyZkiQAsgxqYBGXwCZ5AB9yAU/CoCXiKAQvvggUwRPaIxWQbRNlFk/PCLGiBpQLiqQbvvZWn1WAdXIIR+nuUwDHY0AwWwYFyqqLhgX3R+mHANT+SDf2GJ1pBr8GOHPFXrE4TXdS/n7ZcTrn2UoMKaGg75yeIhn2i+rg9lxN8AytGxNW6Gymab+w55XY1jPyJXEWNDaoODapsMOrQoGzIcbDBq0P9FyM9xFW02ODaoUHTSKuN1V4s3bwb23NaG2eDNjjTdp3fEX100Rru7bmcYM12OnAC+S1KAyrNO5jiAZReU55EayAZgHgiWlF2HoQyLOI+xTdFK3eiHYI58PbPsqzIwLHO5CvpT2HB08Syl2t+kl30lZciGeBbPZ8tLDAm689yKZpyWx409y8BBgCr2Frzb7D2qQAAAABJRU5ErkJggg==";
    },
    $_playerLeave() {
      this.$refs.play.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowRDg0MzE4RDM4N0MxMUVDOTUzMEM0MEIyNDE1QjZEOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowRDg0MzE4RTM4N0MxMUVDOTUzMEM0MEIyNDE1QjZEOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBEODQzMThCMzg3QzExRUM5NTMwQzQwQjI0MTVCNkQ4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBEODQzMThDMzg3QzExRUM5NTMwQzQwQjI0MTVCNkQ4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+iIYkxAAAAcFJREFUeNqsls0rBHEYx78zViTaC1LKHok9ulGSkgvFwXtuykVyELm4eSnCQTk4KVoOlD/ALvEfrOLiZXPCRTYRzfr+9KzQzs9vxjz1aWrmme93fm/PM1bFSgaaqCL9pJnUkjLyRm7JDUmQHXLlJmC5GCjhedJN8qAPR0ymSOr3QzvHCx0kSfoMxLMaKvdMrlqDMbJPSuA9iskWGXcz6CHLLqMyDYssidYPAzXnG5Lw37BEq+q7wZwMMahQWgtZgwjp1WWfjwCLLUC4wJOJ2oERW8S1866EB6LAyRDQVW1s8KltyyEyitIiYK0NiHXy08JGrzQrg6jXCW7i8iUGgdF6IF+/56LqcamfVSwMAdMNwEG3Nq3MDmJP/rUQD36EX96B2VOgfVebdh+SGlLpRfyIJW3ykOX08c/UpDJgKlpNhB+egZljYO/C+FvitpRaR5f1+MoqxvrauOlJ/LOMqxFck13daa5Z97X+SvM6u4smSTrAWpQWza8SoTrRMMkEIJ4RrdTvfhCTZuH8U3xCtHJ2tFXCSoMnn9MyKA1H25MPpD7FDEfjSG4d2Tb9q8j126IEyuX+nRzQuOyWSzeBDwEGAGtXX2HVYW0fAAAAAElFTkSuQmCC";
    },
    $_playerEnter() {
      this.$refs.play.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowREY0RTE1MjM4N0MxMUVDQTRFRUI2MUQzNEI1MTc4MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowREY0RTE1MzM4N0MxMUVDQTRFRUI2MUQzNEI1MTc4MCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBERjRFMTUwMzg3QzExRUNBNEVFQjYxRDM0QjUxNzgwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBERjRFMTUxMzg3QzExRUNBNEVFQjYxRDM0QjUxNzgwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ZGoY0gAAAc9JREFUeNqsljtLA1EQhWfXJVgoWBgJCAnYqcFCEOw0CGoawSY+sLCxFguNP0B8gCKChYiWhmhhwB9gbCwVhVjYaBIsgloIppCIG8+NE4lh93o32YGPBHZyzu7snZlo4XiRJOEH0yAEuoAXfIInkAEX4Bg82gloNgZCeB1EQAPJw2STZZCtvqhb/GAMpMCUgnhZQ+Te8afUYB4kQDM5jyZwBBbsDCbAts1TqYYGtljrj4Go+QEn1Bsaa/krDdb4Ed0KobVRNgiASVn2yTheTh9+5XFkIk5gQGdxad2F8EgH0X6YaDCgbFDS1rmJlKKlkWipn2hlgMinVtCQMAg6LXCvj2hvFDXoJDLkZy4oLrfW8hY9aMHZHqLNIWmaV3fjTMrCAK+g3alw4YsohuFwei9NezF4hjgyuM4R7V4R5fL/pqaEwTkYVhF++8BRvcGMzijfS9LgUbsq64V8gegSG+Dw9ue7YpTGuDBIi2aVdXMkUdP7F5rp8l1HxY26OIvyrPlbFrGJ5kDRBfEia2Wr90Gcl4VZp/gia1lutB2A2UnvNZZlhheOdCef8XyKKz6NybndIGbVyVaR5QUerfjbIgTa+PozN2iST8uDnfu3AAMAGj9gGBYQ1b0AAAAASUVORK5CYII=";
    },
    $_sliderClick(value) {
      this.viewer.clockViewModel.currentTime = Cesium.JulianDate.fromIso8601(this.$_getPlayStartTime(value));
      this.playStartTime = this.$_getPlayStartTime(value);
    },
    $_getPlayStartTime(value) {
      let time = this.startTime.split("T")[1];
      time = time.split("Z")[0];
      let startSecond = Number(time.split(":")[2]);
      let startMinute = Number(time.split(":")[1]);
      let startHour = Number(time.split(":")[0]);
      let second = value % 60;
      second += startSecond;
      second = second < 10 ? "0" + second : second;
      let minute = Math.floor(value / 60) % 60;
      minute += startMinute;
      minute = minute < 10 ? "0" + minute : minute;
      let hour = Math.floor(value / 3600) % 24;
      hour += startHour;
      hour = hour < 10 ? "0" + hour : hour;
      let currentTime = this.startTime.replace(time, hour + ":" + minute + ":" + second);
      return currentTime;
    },
    $_getCZML() {
      let czml;

      function isCZML(dataSource) {
        let flag = false;
        if (dataSource instanceof Array) {
          for (let i = 0; i < dataSource.length; i++) {
            if (dataSource[i].id && dataSource[i].id === "document") {
              flag = true;
              break;
            }
          }
        }
        return flag;
      }

      if (isCZML(this.dataSource)) {
        czml = this.dataSource;
      } else {
        let mStyle = new ModelStyle(this.trackPointStyle);
        mStyle = mStyle.toCesiumStyle(Cesium)
        if(mStyle.uri){
          mStyle.gltf = mStyle.uri;
        }
        let tStyle = new TrackStyle(this.trackStyle);
        tStyle = tStyle.toCesiumStyle(Cesium)
        czml = [
          {
            id: "document",
            name: "CZML Path",
            version: "1.0",
            clock: {
              interval: this.startTime + "/" + this.endTime,
              currentTime: this.startTime,
              multiplier: this.speed,
            },
          },
          {
            id: "path",
            name: "path with GPS flight data",
            description:
                "<p>Hang gliding flight log data from Daniel H. Friedman.<br>Icon created by Larisa Skosyrska from the Noun Project</p>",
            availability: this.startTime + "/" + this.endTime,
            path: tStyle,
            model: mStyle,
            position: {
              interpolationAlgorithm: "LINEAR",
              forwardExtrapolationType: "HOLD",
              epoch: this.startTime,
              cartographicDegrees: this.$_geoJSONToPath()
            },
          }
        ];
      }
      return czml;
    },
    $_geoJSONToPath() {
      let cartographicDegrees = [];
      if (this.dataSource instanceof Array) {
        if (typeof this.dataSource[0] === "number") {
          cartographicDegrees = this.dataSource;
          this.maxSlider = this.dataSource[this.dataSource.length - 4];
        }
      } else if (this.dataSource instanceof Object && this.dataSource.hasOwnProperty("features")) {
        let features = this.dataSource.features;
        for (let i = 0; i < features.length; i++) {
          let coordinates = features[i].geometry.coordinates;
          cartographicDegrees.push(Number(features[i].properties.timeStep), Number(coordinates[0]), Number(coordinates[1]), Number(coordinates[2]));
        }
        this.maxSlider = cartographicDegrees[cartographicDegrees.length - 4];
      }
      return cartographicDegrees;
    },
    $_addTrack() {
      let vm = this;
      window.czml = new Cesium.CzmlDataSource();
      this.viewer.dataSources
          .add(window.czml.load(this.$_getCZML()))
          .then(function (ds) {
            let s = ds.entities.getById("path");
            vm.viewer.trackedEntity = s;
            s.orientation = new Cesium.VelocityOrientationProperty(s.position)
          });
    },
    play() {
      let vm = this;
      this.viewer.clockViewModel.shouldAnimate = !this.viewer.clockViewModel.shouldAnimate;
      this.shouldAnimate = this.viewer.clockViewModel.shouldAnimate;
      if (!this.viewer.clockViewModel.shouldAnimate) {
        clearInterval(this.interval);
      } else {
        this.interval = setInterval(function () {
          vm.currentSlider += vm.viewer.clockViewModel.multiplier;
          vm.playStartTime = vm.$_getPlayStartTime(vm.currentSlider);
          if (vm.currentSlider >= vm.maxSlider) {
            vm.currentSlider = vm.maxSlider;
            vm.shouldAnimate = false;
            vm.playStartTime = vm.endTime;
            clearInterval(vm.interval);
          }
          if (vm.currentSlider <= 0) {
            vm.currentSlider = 0;
            vm.shouldAnimate = false;
            vm.playStartTime = vm.startTime;
            clearInterval(vm.interval);
          }
        }, 1000);
      }
    },
    forward() {
      if (this.viewer.clockViewModel.multiplier < 0) {
        this.viewer.clockViewModel.multiplier = this.viewer.clockViewModel.multiplier * -1;
      }
    },
    back() {
      if (this.viewer.clockViewModel.multiplier > 0) {
        this.viewer.clockViewModel.multiplier = this.viewer.clockViewModel.multiplier * -1;
      }
    },
    speedUp() {
      let vm = this;
      clearInterval(this.interval);
      this.viewer.clockViewModel.multiplier += this.viewer.clockViewModel.multiplier;
      let time = Math.floor(this.multiplier / this.viewer.clockViewModel.multiplier * 1000);
      this.interval = setInterval(function () {
        vm.currentSlider += this.viewer.clockViewModel.multiplier;
        if (vm.currentSlider >= vm.maxSlider) {
          vm.currentSlider = vm.maxSlider;
          clearInterval(vm.interval);
        }
      }, time);
    },
  }
}
</script>

<style scoped>
.mapgis-track-player {
  position: absolute;
  bottom: 100px;
  left: calc(50% - 400px);
  width: 800px;
  height: 70px;
  background: rgb(255, 255, 255);
  z-index: 1;
  border-radius: 10px;
  -webkit-box-shadow: #666 0 0 10px;
  -moz-box-shadow: #666 0 0 10px;
  box-shadow: #666 0 0 10px;
}

.mapgis-track-player-container {
  width: 100%;
  height: 50%;
}

.mapgis-track-player-slider {
  width: 760px;
  margin: auto;
}

.mapgis-track-player-option {
  position: relative;
}

.mapgis-track-player-play {
  margin: 0 18px;
  cursor: pointer;
}

.mapgis-track-player-forward, .mapgis-track-player-back {
  cursor: pointer;
}

.mapgis-track-player-start {
  float: left;
  margin-left: 20px;
}

.mapgis-track-player-end {
  float: right;
  margin-right: 20px;
}
</style>