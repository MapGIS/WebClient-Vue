<template>
  <div>
    <mapgis-ui-table
      v-if="isList"
      :columns="columnsTable"
      :data-source="fileList"
      :showHeader="!isrelationShip"
      class="table-preview-container"
      :class="isrelationShip ? 'relation-accessory-empty' : ''"
      size="small"
      :pagination="false"
      bordered
      rowKey="id"
      :scroll="{ y: 200 }"
    >
      <div
        class="mp-file-previer-table-cneter"
        slot="name"
        slot-scope="text, record"
      >
        <img
          :src="getTypeImage(record.type).image"
          width="15"
          style="margin-right: 5px"
        />
        <mapgis-ui-tag v-if="isrelationShip && record.toType === videoToType">
          可投放
        </mapgis-ui-tag>
        <span>{{ record.name }}</span>
      </div>
      <span slot="operation" slot-scope="text, record">
        <a v-if="isPreviewData(record)" @click="preview(record)">预览</a>
        <a v-else :href="record.url">下载</a>
      </span>
    </mapgis-ui-table>
    <ul
      v-else
      class="mp-file-previer-container"
      :class="isrelationShip ? 'relation-previer' : ''"
    >
      <li v-if="fileList.length === 0" style="width: 100%; padding: 10px">
        <mapgis-ui-empty />
      </li>
      <li
        class="file-previer-item"
        v-for="file in fileList"
        :key="file.id"
        :style="isrelationShip ? '' : itemWidth"
      >
        <div class="item-content" @click="preview(file)">
          <div class="image-container">
            <img :src="getTypeImage(file.type).image" width="100%" />
          </div>
          <mapgis-ui-tooltip>
            <template slot="title">
              {{ file.name
              }}<span v-if="isrelationShip && file.toType === videoToType"
                >(可投放)</span
              >
            </template>
            <span v-if="isrelationShip && file.toType === videoToType"
              >{{ file.name }}(可投放)</span
            >
            <span v-else>{{ file.name }}</span>
          </mapgis-ui-tooltip>
        </div>
      </li>
    </ul>
    <mapgis-ui-modal
      v-model="showModal"
      :footer="null"
      :width="700"
      :centered="true"
      :title="null"
      :bodyStyle="{ padding: 0 }"
      :destroyOnClose="true"
      :afterClose="afterClose"
      :closable="false"
    >
      <preview
        v-if="selectFile"
        :name="selectFile.name"
        :url="selectFile.url"
        :type="getTypeImage(selectFile.type).type"
        @project-screen="projectScreen"
        @close="showModal = false"
      />
    </mapgis-ui-modal>
  </div>
</template>

<script>
import image from "./assets/图片@3x.png";
import video from "./assets/视频@3x.png";
import text from "./assets/txt@3x.png";
import other from "./assets/其他格式@3x.png";
import preview from "./Preview.vue";
import { fileType } from "./fileType.js";

export default {
  components: {
    preview
  },
  name: "mapgis-ui-file-preview",
  props: {
    /**
     * 是否通过列表模式展示内容
     */
    isList: { type: Boolean, default: false },
    /**
     * 当为flex展示模式时，每行的个数
     */
    column: {
      type: Number,
      default: 6
    },
    /**
     * [{
     *   name : '名称',
     *   url : '文件链接',
     *   type : '文件类型,如果没有该字段，则自动通过名称尾缀判断类型'
     * }]
     */
    files: {
      type: Array,
      default: () => []
    },
    /**
     * 当在关系图谱中显示时去除itemWidth返回的样式
     */
    isrelationShip: {
      type: Boolean,
      default: false
    },
    /**
     * 当在关系图谱中显示toType为301的视频展示'可投放'tag标签
     */
    videoToType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      /**
       * 控制弹窗可见性
       */
      showModal: false,

      /**
       * 选中的条目信息
       */
      selectFile: null,

      /**
       * 根据文件类型，默认图片对照表
       */
      fileType: [
        {
          image: image,
          types: fileType.image
        },
        {
          image: text,
          types: fileType.text
        },
        {
          image: video,
          types: fileType.video
        }
      ],
      columnsTable: [
        {
          title: "文件名称",
          dataIndex: "name",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: this.isrelationShip ? "25%" : 100,
          scopedSlots: { customRender: "operation" }
        }
      ]
    };
  },
  computed: {
    /**
     * 根据files属性，获取文件相关信息
     */
    fileList() {
      return this.files.map((file, index) => {
        let type = file.type;
        if (!file.type) {
          type = this.getFileTypeByName(file.name);
        }
        return {
          id: index,
          ...file,
          type: type.toLowerCase()
        };
      });
    },
    itemWidth() {
      // 每个条目占的百分比
      const percentage = `${100 / this.column}%`;
      // 每个条目间距为10px
      const margin = `${(10 * (this.column + 1)) / this.column}px`;
      return { width: `calc(${percentage} - ${margin})` };
    }
  },
  methods: {
    isPreviewData(file) {
      const { type } = this.getTypeImage(file.type);
      if (type === "other") {
        return false;
      }
      return true;
    },
    afterClose() {
      this.selectFile = null;
    },
    /**
     * 点击条目的回调事件
     */
    preview(file) {
      this.showModal = true;
      this.selectFile = file;
    },
    /**
     * 视频投放回调函数
     */
    projectScreen(file) {
      this.$emit("project-screen", file);
    },
    /**
     * 根据名称获取文件类型
     */
    getFileTypeByName(name) {
      const typeArr = name.split(".");
      if (typeArr && typeArr.length > 1) {
        return typeArr[1];
      }
      return "";
    },
    /**
     * 根据文件类型，获取默认展示的图片
     */
    getTypeImage(type) {
      const typeItem = this.fileType.find(item => item.types.includes(type));
      if (typeItem) {
        return {
          ...typeItem,
          type
        };
      }
      return {
        image: other,
        type: "other",
        types: []
      };
    }
  }
};
</script>

<style lang="less">
.mp-file-previer-table-cneter {
  display: flex;
  align-items: center;
}
.mp-file-previer-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  border: 1px solid var(--border-color-base);
  border-radius: 4px;
  padding-top: 10px;
  max-height: 300px;
  overflow: auto;
  &,
  file-previer-item {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .file-previer-item {
    // width: calc(~'25% - 12.5px');
    padding: 10px;
    margin-left: 10px;
    margin-bottom: 10px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      cursor: pointer;
    }
    .item-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .image-container {
        width: 100%;
        position: relative;
        .image-thumbnail {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          object-fit: cover;
        }
        .hidden-image {
          opacity: 0;
        }
      }

      span {
        display: block;
        text-align: center;
        margin-top: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        width: 92%;
      }
    }
  }
}
.relation-previer {
  flex-wrap: wrap;
  .file-previer-item {
    margin-left: 7px !important;
    padding: 5px 0 0 !important;
    justify-content: center;
    align-items: center;
    display: flex;
    .item-content {
      width: 60px;
      span {
        margin-top: 4px !important;
      }
    }
  }
  .image-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    > img {
      width: 60px;
      height: 80px;
    }
  }
}
.relation-accessory-empty {
  .mapgis-ui-empty-image {
    display: flex;
    align-items: center;
    > img {
      width: 100% !important;
      height: 70% !important;
    }
  }
}
</style>
