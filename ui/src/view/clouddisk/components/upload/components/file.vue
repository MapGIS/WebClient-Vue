<template>
  <div class="uploader-file" :status="status">
    <slot
      :file="file"
      :list="list"
      :status="status"
      :paused="paused"
      :error="error"
      :response="response"
      :average-speed="averageSpeed"
      :formated-average-speed="formatedAverageSpeed"
      :current-speed="currentSpeed"
      :is-complete="isComplete"
      :is-uploading="isUploading"
      :size="size"
      :formated-size="formatedSize"
      :uploaded-size="uploadedSize"
      :progress="progress"
      :progress-style="progressStyle"
      :progressing-class="progressingClass"
      :time-remaining="timeRemaining"
      :formated-time-remaining="formatedTimeRemaining"
      :type="type"
      :extension="extension"
      :file-category="fileCategory"
    >
       <div class="uploader-file-progress" :class="progressingClass" :style="progressStyle"></div>
      <div class="uploader-file-info">
        <div class="uploader-file-icon">
          <mapgis-ui-iconfont type="mapgis-tuichuX" />
        </div>
        <div class="uploader-file-detail">
          <div class="uploader-file-name">{{file.name}}</div>
          <!-- <div class="uploader-file-size">{{formatedSize}}</div> -->
          <!-- <span class="uploader-file-size" :title=fileUrl>{{fileUrl}}</span> -->
          <div class="uploader-file-sizeandurl">
            <span class="uploader-file-size">{{formatedSize}}</span>
            <span class="uploader-file-url" :title=fileUrl>{{fileUrl}}</span>
          </div>
        </div>
        <div class="uploader-file-meta"></div>
        <div class="uploader-file-status">
          <span class="uploader-file-status-message" v-show="status !== 'uploading'">{{statusText}}</span>
          <!-- <span class="uploader-file-status-message" v-show="status === 'importing'">{{statusText}}</span> -->
          <span v-show="status === 'uploading'">
            <span>{{progressStyle.progress}}</span>
            <em>{{formatedAverageSpeed}}</em>
            <i>{{formatedTimeRemaining}}</i>
          </span>
        </div>
        <div class="uploader-file-actions">
          <span class="uploader-file-pause" @click="pause"></span>
          <span class="uploader-file-resume" @click="resume">️</span>
          <span class="uploader-file-retry" @click="retry"></span>
          <span class="uploader-file-remove" @click="remove"></span>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import Uploader from 'simple-uploader.js'
import events from '../common/file-events'
import { secondsToStr } from '../common/utils'
import UploadMixin from "../../../../../mixin/UploaderMixin";
// import { task } from '@/axios/gis.js'

const COMPONENT_NAME = 'uploader-file'

export default {
  name: COMPONENT_NAME,
  mixins: [UploadMixin],
  props: {
    file: {
      type: Object, // Uploader.File @see https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md
      default () {
        return {}
      }
    },
    list: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      response: null,
      paused: false,
      error: false,
      averageSpeed: 0,
      currentSpeed: 0,
      isComplete: false,
      isUploading: false,
      isImporting: false,
      isImportError: false,
      isCompleteImport: false,
      size: 0,
      formatedSize: '',
      uploadedSize: 0,
      progress: 0,
      timeRemaining: 0,
      type: '',
      extension: '',
      progressingClass: '',
      fileUrl: '',
      timeid: null
    }
  },
  computed: {
    fileCategory () {
      const extension = this.extension
      const isFolder = this.file.isFolder
      let type = isFolder ? 'folder' : 'unknown'
      const categoryMap = this.file.uploader.opts.categoryMap
      const typeMap = categoryMap || {
        image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
        video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
        audio: ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'],
        document: [
          'doc',
          'txt',
          'docx',
          'pages',
          'epub',
          'pdf',
          'numbers',
          'csv',
          'xls',
          'xlsx',
          'keynote',
          'ppt',
          'pptx'
        ]
      }
      Object.keys(typeMap).forEach(_type => {
        const extensions = typeMap[_type]
        if (extensions.indexOf(extension) > -1) {
          type = _type
        }
      })
      return type
    },
    progressStyle () {
      const progress = Math.floor(this.progress * 100)
      const style = `translateX(${Math.floor(progress - 100)}%)`
      return {
        progress: `${progress}%`,
        webkitTransform: style,
        mozTransform: style,
        msTransform: style,
        transform: style
      }
    },
    formatedAverageSpeed () {
      return `${Uploader.utils.formatSize(this.averageSpeed)} / s`
    },
    status () {
      const isUploading = this.isUploading
      const isComplete = this.isComplete
      const isError = this.error
      const paused = this.paused
      const isImporting = this.isImporting
      const isImportError = this.isImportError
      const isCompleteImport = this.isCompleteImport

      if (isCompleteImport) {
        return 'importsuccess'
      } else if (isImportError) {
        return 'importerror'
      } else if (isImporting) {
        return 'importing'
      } else if (isComplete) {
        return 'success'
      } else if (isError) {
        return 'error'
      } else if (isUploading) {
        return 'uploading'
      } else if (paused) {
        return 'paused'
      } else {
        return 'waiting'
      }
    },
    statusText () {
      const status = this.status
      const fileStatusText = this.file.uploader.fileStatusText
      let txt = status
      if (typeof fileStatusText === 'function') {
        txt = fileStatusText(status, this.response)
      } else {
        txt = fileStatusText[status]
      }
      switch (txt) {
        case 'importsuccess':
          txt = '上传成功！导入成功！'
          break
        case 'importerror':
          txt = '上传成功！该格式不支持导入或导入失败！'
          break
        case 'importing':
          txt = '上传成功！导入中...'
          break
        case 'success':
          txt = '上传成功！'
          break
        case 'error':
          txt = '上传失败！'
          break
        case 'uploading':
          txt = '上传中...'
          break
        case 'paused':
          txt = '上传暂停！'
          break
        case 'waiting':
          txt = '等待中...'
          break
      }
      return txt || status
    },
    formatedTimeRemaining () {
      const timeRemaining = this.timeRemaining
      const file = this.file
      if (timeRemaining === Number.POSITIVE_INFINITY || timeRemaining === 0) {
        return ''
      }
      let parsedTimeRemaining = secondsToStr(timeRemaining)
      const parseTimeRemaining = file.uploader.opts.parseTimeRemaining
      if (parseTimeRemaining) {
        parsedTimeRemaining = parseTimeRemaining(
          timeRemaining,
          parsedTimeRemaining
        )
      }
      return parsedTimeRemaining
    }
  },
  watch: {
    status (newStatus, oldStatus) {
      if (oldStatus && newStatus === 'uploading' && oldStatus !== 'uploading') {
        this.tid = setTimeout(() => {
          this.progressingClass = 'uploader-file-progressing'
        }, 200)
      } else {
        clearTimeout(this.tid)
        this.progressingClass = ''
      }
    }
  },
  methods: {
    _actionCheck () {
      this.paused = this.file.paused
      this.error = this.file.error
      this.isUploading = this.file.isUploading()
    },
    pause () {
      this.file.pause()
      this._actionCheck()
      this._fileProgress()
    },
    resume () {
      this.file.resume()
      this._actionCheck()
    },
    remove () {
      this.file.cancel()
    },
    retry () {
      this.file.retry()
      this._actionCheck()
    },
    processResponse (message) {
      let res = message
      try {
        res = JSON.parse(message)
      } catch (e) {}
      this.response = res
    },
    fileEventsHandler (event, args) {
      const rootFile = args[0]
      const file = args[1]
      const target = this.list ? rootFile : file
      if (this.file === target) {
        if (this.list && event === 'fileSuccess') {
          this.processResponse(args[2])
          return
        }
        this[`_${event}`].apply(this, args)
      }
    },
    _fileProgress () {
      this.progress = this.file.progress()
      this.averageSpeed = this.file.averageSpeed
      this.currentSpeed = this.file.currentSpeed
      this.timeRemaining = this.file.timeRemaining()
      this.uploadedSize = this.file.sizeUploaded()
      this._actionCheck()
    },
    _fileSuccess (rootFile, file, message) {
      this.getFileUrl()
      // if (this.$store.state.upload.param.isImport) { // 这里原本是用来展示导入状态，现不再展示。
      //   this.isCompleteImport = false
      //   this.isImportError = false
      //   this.isImporting = true
      //   console.warn('成功导入', this.$store.state.upload.param)
      //   if (this.$store.state.upload.param.isCurrent) {
      //     this.getImportStatus()
      //   }
      // }
      if (rootFile) {
        this.processResponse(message)
      }
      this._fileProgress()
      this.error = false
      this.isComplete = true
      this.isUploading = false
    },
    _fileComplete () {
      this._fileSuccess()
    },
    _fileError (rootFile, file, message) {
      this._fileProgress()
      this.processResponse(message)
      this.error = true
      this.isComplete = false
      this.isUploading = false
    },
    getImportStatus () {
      let fileName = this.file.name
      let fileUrl = this.$store.state.path.current.uri + '/' + fileName
      console.warn('进到状态', fileUrl)
      this.timeid = setInterval(() => {
        this.getImportDaskStatus(fileUrl)
      }, 600000)
      setTimeout(() => {
        this.getImportDaskStatus(fileUrl)
      }, 6000)
    },
    getImportDaskStatus (fileUrl) {
      console.warn('进到状态延迟', fileUrl)
      /* task(fileUrl)
        .then(res => {
          console.warn('进到task', res.data)
          // if (res.data.data.list.length <= 0) {
          //   this.isCompleteImport = false
          //   this.isImportError = true
          //   clearInterval(this.timeid)
          // } else {
          //   let importStatus = res.data.data.list[0].status
          //   console.warn('进到task', importStatus)
          //   if (importStatus === 'finish') {
          //     this.isCompleteImport = true
          //     clearInterval(this.timeid)
          //   } else if (importStatus === 'failed') {
          //     this.isCompleteImport = false
          //     this.isImportError = true
          //     clearInterval(this.timeid)
          //   } else {
          //     this.isCompleteImport = false
          //     this.isImportError = false
          //     this.isImporting = true
          //   }
          // }
        }) */
    },
    getFileUrl () {
      let currentUrl = this.param.folderDir
      let gisIndex = currentUrl.indexOf('.gis')
      if (gisIndex >= 0) {
        let temUrl1 = currentUrl.slice(gisIndex + 4)
        this.fileUrl = '我的数据' + temUrl1 + '/' + this.file.name
      } else {
        let index = currentUrl.indexOf('/')
        let temUrl = index < 0 ? '' : currentUrl.slice(index)
        this.fileUrl = '我的文件' + temUrl + '/' + this.file.name
      }
      console.warn('观察', currentUrl, this.fileUrl)
      return this.fileUrl
    }
  },
  mounted () {
    const staticProps = ['paused', 'error', 'averageSpeed', 'currentSpeed']
    const fnProps = [
      'isComplete',
      'isUploading',
      {
        key: 'size',
        fn: 'getSize'
      },
      {
        key: 'formatedSize',
        fn: 'getFormatSize'
      },
      {
        key: 'uploadedSize',
        fn: 'sizeUploaded'
      },
      'progress',
      'timeRemaining',
      {
        key: 'type',
        fn: 'getType'
      },
      {
        key: 'extension',
        fn: 'getExtension'
      }
    ]
    staticProps.forEach(prop => {
      this[prop] = this.file[prop]
    })
    fnProps.forEach(fnProp => {
      if (typeof fnProp === 'string') {
        this[fnProp] = this.file[fnProp]()
      } else {
        this[fnProp.key] = this.file[fnProp.fn]()
      }
    })

    const handlers = (this._handlers = {})
    const eventHandler = event => {
      handlers[event] = (...args) => {
        this.fileEventsHandler(event, args)
      }
      return handlers[event]
    }
    events.forEach(event => {
      this.file.uploader.on(event, eventHandler(event))
    })
  },
  destroyed () {
    events.forEach(event => {
      this.file.uploader.off(event, this._handlers[event])
    })
    this._handlers = null
  }
}
</script>

<style>
.uploader-file {
  position: relative;
  height: 52px;
  line-height: 52px;
  overflow: hidden;
  border-bottom: 1px solid #dcdcdc;
}
.uploader-file[status="waiting"] .uploader-file-pause,
.uploader-file[status="uploading"] .uploader-file-pause {
  display: block;
}
.uploader-file[status="paused"] .uploader-file-resume {
  display: block;
}
.uploader-file[status="error"] .uploader-file-retry {
  display: block;
}
.uploader-file[status="success"] .uploader-file-remove,
.uploader-file[status="importing"] .uploader-file-remove,
.uploader-file[status="importerror"] .uploader-file-remove,
.uploader-file[status="importsuccess"] .uploader-file-remove {
  display: none;
}
.uploader-file[status="error"] .uploader-file-progress {
  background: #ffe0e0;
}
.uploader-file-progress {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #e2eeff;
  transform: translateX(-100%);
}
.uploader-file-progressing {
  transition: all 0.4s linear;
}
.uploader-file-info {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow: hidden;
}
.uploader-file-info:hover {
  background-color: rgba(240, 240, 240, 0.2);
}
.uploader-file-info i,
.uploader-file-info em {
  font-style: normal;
}

.uploader-file-icon,
.uploader-file-detail,
.uploader-file-meta,
.uploader-file-status,
.uploader-file-actions {
  float: left;
  position: relative;
  height: 100%;
}
.uploader-file-detail {
  width: 50%;
  padding-top: 10px;
  padding-bottom: 9px;
}

.uploader-file-name {
  max-width: 350px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 15px;
  font-family: "微软雅黑";
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 12px;
  letter-spacing: 0px;
  color: #333333;
}
.uploader-file-icon {
  padding-top: 11px;
  padding-bottom: 9px;
}

.uploader-file-sizeandurl {
  max-width: 400px !important;
  height: 13px;
  overflow: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: "微软雅黑";
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 24px;
  letter-spacing: 0px;
  color: #999999;
}
.uploader-file-size {
  width: 100px;
  height: 13px;
  margin-right: 10px;
  /* overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; */
  font-family: "微软雅黑";
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 24px;
  letter-spacing: 0px;
  color: #999999;
}
.uploader-file-url {
  max-width: 400px;
  height: 13px;
  overflow: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: "微软雅黑";
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 24px;
  letter-spacing: 0px;
  color: #999999;
}
.uploader-file-meta {
  width: 8%;
}
.uploader-file-status {
  width: 24%;
  text-indent: 20px;
}

.uploader-file-status-message {
  height: 15px;
  font-family: "微软雅黑";
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /*   line-height: 12px; */
}

.uploader-file-actions {
  width: 10%;
}
.uploader-file-actions > span {
  display: none;
  float: left;
  width: 16px;
  height: 16px;
  margin-top: 16px;
  margin-right: 10px;
  cursor: pointer;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABkCAYAAAD0ZHJ6AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAACxMAAAsTAQCanBgAAARkSURBVGje7ZnfS1NRHMAH4ptPkvQSuAdBkCxD8FUQJMEULUgzy1KyyPVQ4JMiiP4Bvg6EwUQQfMmwhwRDshwaKUjDVCgoSdDNHkzTJZ6+Z37Purve8+PeTb2TM/ggu+ew89l33x8H9BBCPG7GowXTJej3+wnDvEm0JuLC04+EYWftVAUv+fiCvDUdQR1BHUEdQR3BTIygvixoQS14XgTtthLVdpNWwXRLqvQ724LplFRtyrYF0yVpFLQrKRVMh6RZ0I6kkmCqklaCqpKZH0FX56Crq9jVfdDVk0RfFrSgFsxkQVmLcdKCVrKySCrryhPEyYShhzOcrFtG0EoilfHHk1CRU5rF6ZjNZhlVOW6RnMSVyyilKies4pO41diVy8wIujoHXV3FGdMHXTtJKLFYTLhZtq4vC1rwXApCZTIqgR6g1PBMCO9DL3bMMSqBHqDU8EyISDAHiGKvWwcCQG2KgjlAFCDAOhAAap0K5gKLphk8mqJgLrCIgoxRJ4J5wKpJ7gAoMkn5EBXBPGDVJHcAFJmkfIhQcAql1oBpTvTol9gG9pm4RHAKpdaAaU706JfYBvaZuJVgPQrt4sFlnOh5MC/p3lmJYD0K7eLBZZzoeTAv6d5ZnuAYHjpgEOnk5F0ufhG6v1ggOIaHDhhEOjl5l4tfhO4vthLcwAMrFNvLJO5vEwhu4IEViu1lEve3WQmyoihQFBzG/V0CQVYUBYqCw7i/SxTBcpsRbFeIYLnNCLZbCY5b5KAnxRwct8hBj9McZFVMW0ihRNBuFdMWUigRlFaxuQ9WWYjRMTiIe5z0wSoLMToGB3GPsA9aTZIJoB+nRgBnM1tzOkkmgH6cGgGczWzNpzqLx3n/aULJJgezeNw07oxQySbVywKjBOgFRnDs+VEsx8FlgVEC9AIjOPb8KJYjvSzoG7UW1IJaUAtqQS14toLNM5fN5APdwBJA8G83Pk/aK/rgzVvXzeQD3cASQPBvNz5P2ssTzAaGUIrHEO6zI5gNDKEUjyHcxxWkh4Ylcowwk1QQpIeGJXKMMJO0EgwqyjGCioJBJvDrxRMSuVOTJEXfbz1/bHwWtBL0yoQehK6RucgE+bGzanzulQh6E3IgQV+xpc8kcrfuSO7eTfJ3ZYmQw0Oy9azVKOk1C/bJ5D5F38YPeLfx0rjWJxHsS0SqsSYuxySjj5qO5Oj7xQWy2VBtFOwzCy6ryH3YfE3uh64Y1xckgstJPydEjkkeHv07Iy4Xaao15+KCWTBx6M/db+T9xivSErqaJDdzXI6yLRE8Vgg0coex/SPJvT0SbWu0KpZtbgSpCH3NRt7I5OxHkObc6heU+/M/J5vrpBFM5GBLqCQux14COXs5CNXK5OjPGm1tSMrJSOMNYQ4mVTGV/L6zTL7+DovkbFUxbSW0Wo05l8hJWsU+cRWfSh+Mt5Lb1ck/J1TvVsdDaR/MiEni+llsdZuZp62EViu+96bpNjNPWwmtVnzvFd5m9IVVC54x/wA7gNvqFG9vXQAAAABJRU5ErkJggg==")
    no-repeat 0 0;
}
.uploader-file-actions > span:hover {
  background-position-x: -21px;
}
.uploader-file-actions .uploader-file-pause {
  background-position-y: 0;
}
.uploader-file-actions .uploader-file-resume {
  background-position-y: -17px;
}
.uploader-file-actions .uploader-file-retry {
  background-position-y: -53px;
}
.uploader-file-actions .uploader-file-remove {
  display: block;
  background-position-y: -34px;
}
.uploader-file-icon > .icon {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: top;
  margin-top: 4px;
  margin-left: 17px;
  margin-right: 15px;
}
</style>
