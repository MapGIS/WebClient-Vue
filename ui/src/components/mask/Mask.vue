<template>
  <div></div>
</template>

<script>
export default {
  name: 'mapgis-ui-mask',
  props: {
    parentDivClass: {
      type: String,
      required: true,
      default: 'mapgis-ui-map-container'
    },
    loading: {
      type: Boolean,
      required: true,
      default: false
    },
    percent: {
      type: Number,
      required: false,
      default: 0
    },
    text: {
      type: String,
      required: false,
      default: '分析中...'
    }
  },
  watch: {
    loading: {
      handler() {
        if (this.loading) {
          this.addMask()
        } else {
          this.removeMask()
        }
      }
    },
    percent: {
      handler() {
        if (!this.loading) {
          return
        }
        const mpMaskContentDiv = document.getElementsByClassName(
          'mapgis-ui-mask-content'
        )
        const content = this.text.replace(/\{percent\}/g, `${this.percent}%`)
        mpMaskContentDiv[0].innerHTML = content
      }
    },
    text(nV) {
      if (!this.loading) {
        return
      }
      document.querySelector('.mapgis-ui-mask-content').innerHTML = nV
    }
  },
  data() {
    return {
      maskHtml: `<div class="mapgis-ui-mask"><div class="loading-mask"></div><div class="loading"><div class="loading-indicator"><div class="mapgis-ui-mask-content">${this.text}</mapgis-ui-button></div></div></div>`,
      maskHtmlSVG:
        '<div class="mapgis-ui-mask"><div class="loading-mask"></div><div class="loading"><div class="loading-indicator"><svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30" ></circle></svg></div></div></div>'
    }
  },
  methods: {
    addMask() {
      // 添加遮罩层
      this.removeMask();

      //阻止浏览器默认的右键菜单行为
      document.oncontextmenu = function(){
      　　return false;
      }

      const parentDivClass = this.parentDivClass || 'mapgis-ui-map-container'
      const parent = document.getElementsByClassName(parentDivClass)
      const mask = document.createElement('mapgis-ui-mask')
      mask.innerHTML = this.maskHtml
      parent[0].appendChild(mask)
    },

    removeMask() {
      // 移除遮罩层
      const mpMask = document.getElementsByClassName('mapgis-ui-mask')
      if (mpMask && mpMask.length > 0) {
        const parent = mpMask[0].parentElement
        parent.removeChild(mpMask[0])
      }
    }
  }
}
</script>
