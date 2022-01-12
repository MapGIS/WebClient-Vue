<template>
  <div class="preview-container">
    <div class="preview-title">
      <span>{{ this.name }}</span>
      <div>
        <span @click="projectScreen">
          <a-checkable-tag v-if="type === 'hls'" v-model="isProjected">
            <a-icon type="video-camera" />
            <span v-if="isProjected">已投放</span>
            <span v-else>投放</span>
          </a-checkable-tag>
        </span>
        <a-icon type="close" @click="close" class="preview-title-icon" />
      </div>
    </div>
    <div class="preview-content">
      <iframe
        v-if="text.includes(sourceType)"
        :src="sourceUrl"
        :width="700"
        :height="400"
        frameborder="0"
      >
      </iframe>
      <img
        v-else-if="image.includes(sourceType)"
        :src="sourceUrl"
        alt=""
        width="100%"
        height="100%"
      />
      <mapgis-ui-video
        v-else-if="video.includes(sourceType) && sourceUrl"
        :width="700"
        :height="400"
        :videoUrl="sourceUrl"
        :protocol="sourceType"
      ></mapgis-ui-video>
      <mapgis-ui-empty v-else description="暂不支持" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { fileType } from './fileType.js'

export default {
  name: 'Preview',
  inject: ['getVideoStatus'],
  props: {
    url: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sourceUrl: '',
      sourceType: '',
      video: fileType.video,
      image: fileType.image,
      text: fileType.text,
      isProjected: false,
      featureProperties: null
    }
  },
  mounted() {
    this.getHlsSource()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    projectScreen() {
      const {
        vFOV,
        orientationHeading,
        orientationRoll,
        positionX,
        positionY,
        positionZ,
        hFOV,
        orientationPitch
      } = this.featureProperties
      const file = {
        url: this.sourceUrl,
        type: this.sourceType,
        name: this.name,
        vFOV,
        orientationHeading,
        orientationRoll,
        positionX,
        positionY,
        positionZ,
        hFOV,
        orientationPitch
      }
      this.$emit('project-screen', file)
      this.$nextTick(() => {
        this.isProjected = this.getVideoStatus(this.sourceUrl)
      })
    },
    async getHlsSource() {
      if (this.type === 'hls') {
        const res = await axios.get(this.url, {
          params: {
            deviceIDs: this.name,
            pageSize: 20,
            pageNo: 1
          }
        })
        if (res.status === 200) {
          const { total, features } = res.data
          if (features && features.length > 0) {
            const { properties } = features[0]
            const { stremDataUrl } = properties
            this.featureProperties = properties
            this.sourceUrl = stremDataUrl
            const typeArr = stremDataUrl.split('.')
            if (typeArr && typeArr.length > 1) {
              this.sourceType = typeArr[typeArr.length - 1]
            } else {
              this.sourceType = ''
            }
          }
        }
      } else {
        this.sourceUrl = this.url
        this.sourceType = this.type
      }

      if (this.video.includes(this.sourceType)) {
        this.isProjected = this.getVideoStatus(this.sourceUrl)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  .preview-title {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    .preview-title-icon {
      margin-left: 10px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .preview-content {
    flex: 1;
  }
}
</style>
