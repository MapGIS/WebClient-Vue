<template>
  <label class="uploader-btn" ref="btn" v-show="support">
    <slot></slot>
  </label>
</template>

<script>
  import { uploaderMixin, supportMixin } from '../common/mixins'

  const COMPONENT_NAME = 'uploader-btn'

  export default {
    name: COMPONENT_NAME,
    mixins: [uploaderMixin, supportMixin],
    props: {
      directory: {
        type: Boolean,
        default: false
      },
      single: {
        type: Boolean,
        default: false
      },
      attrs: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    mounted () {
      // 注意 mounted 不会承诺所有的子组件也都一起被挂载。
      // 如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted
      this.$nextTick(() => {
        // assignBrowse 指定 DOM 元素可以选择上传
        this.uploader.uploader.assignBrowse(
          this.$refs.btn, // DOM 元素
          this.directory, // 如果传入的是 true 则代表是要选择文件夹上传的，你可以通过判断 supportDirectory 来决定是否设置
          this.single, // 是否只能选择单个文件
          this.attrs) // 传入的其他属性值，例如你可以传入 accept 属性的值为 image/*，这样就意味着点选的时候只能选择图片。全部属性列表：https://www.w3.org/wiki/HTML/Elements/input/file
      })
    }
  }
</script>

<style>
  .uploader-btn {
    display: inline-block;
    position: relative;
    padding: 4px 8px;
    font-size: 100%;
    line-height: 1.4;
    color: #666;
    border: 1px solid #666;
    cursor: pointer;
    border-radius: 2px;
    background: none;
    outline: none;
  }
  .uploader-btn:hover {
    background-color: rgba(0, 0, 0, .08);
  }
</style>
