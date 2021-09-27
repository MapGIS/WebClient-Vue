<template>
  <div
    v-infinite-scroll="handleInfiniteOnLoad"
    class="mapgis-ui-infinite-list-container"
    :infinite-scroll-disabled="busy"
    :infinite-scroll-distance="10"
  >
    <mapgis-ui-list :data-source="data">
      <mapgis-ui-list-item slot="renderItem" slot-scope="item, index">
        <slot :item="item" :index="index"></slot>
      </mapgis-ui-list-item>
      <div v-if="loading && !busy" class="mapgis-ui-infinite-list-loading">
        <mapgis-ui-spin/>
      </div>
    </mapgis-ui-list>
  </div>
</template>

<script>

export default {
  name: 'mapgis-ui-infinite-list',
  props: {
    dataSource: Array,
    distance: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      data: [],
      loading: false,
      busy: false,
      index: 0,
    }
  },
  beforeMount() {
  },
  methods: {
    fetchData(callback) {
      setTimeout(() => {
        callback(this.dataSource)
      }, 500)
    },
    handleInfiniteOnLoad() {
      const data = this.data;
      this.loading = true;
      // if (data.length >= this.dataSource.length) {
      //   this.$message.warning('已经到底了~');
      //   this.busy = true;
      //   this.loading = false;
      //   return;
      // }
      this.fetchData(res => {
        this.data = this.data.concat(res.slice(this.index, this.index + this.distance));
        this.index += this.distance;
        this.loading = false;
      });
    },
  }
}
</script>
