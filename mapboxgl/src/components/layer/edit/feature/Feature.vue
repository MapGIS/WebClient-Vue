<template>
  <div>
    <div v-for="(r, i) in rules" :key="i">
      <color
        v-if="r.type === 'color'"
        :rule="r"
        :layerid="layerid"
        class="mapgis-mvt-editor-feature"
        @change="onEditChange"
      />
      <string
        v-else-if="r.type === 'string'"
        :rule="r"
        :layerid="layerid"
        class="mapgis-mvt-editor-feature"
        @change="onEditChange"
      />
      <number
        v-else-if="r.type === 'number'"
        :rule="r"
        :layerid="layerid"
        class="mapgis-mvt-editor-feature"
        @change="onEditChange"
      />
      <sprite
        v-else-if="r.type === 'sprite'"
        :rule="r"
        :layerid="layerid"
        class="mapgis-mvt-editor-feature"
        @change="onEditChange"
      />
    </div>
  </div>
</template>

<script>
import EditMixin from "../EditMixin";

import color from "../property/PropertyColor.vue";
import string from "../property/PropertyString.vue";
import number from "../property/PropertyNumber.vue";
import sprite from "../property/PropertySprite.vue";

export default {
  name: "mapgis-mvt-editor-feature",
  mixins: [EditMixin],
  components: {
    color,
    number,
    string,
    sprite
  },
  props: {
    rules: { type: Array, default: () => [] }
  },
  methods: {
    onEditChange(event) {
      this.$_emitEvent(event);
    }
  }
};
</script>

<style>
.mapgis-mvt-editor-feature {
  margin: 2px 0px;
}
</style>
