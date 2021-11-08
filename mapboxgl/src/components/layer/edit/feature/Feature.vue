<template>
  <div class="mapgis-mvt-editor-feature-wrapper">
    <mapgis-ui-form-model :layout="layout" v-bind="formItemLayout">
      <mapgis-ui-form-model-item v-for="(r, i) in rules" :key="i">
        <span slot="label">
          <mapgis-ui-iconfont :type="r.icon" />
          <span class="mapgis-property-color-left">{{ r.title }} </span>
        </span>
        <div>
          <color
            v-if="r.type === 'color'"
            :rule="r"
            :layerid="layerid"
            class="mapgis-mvt-editor-feature"
            @edit-change="onEditChange"
          />
          <string
            v-else-if="r.type === 'string'"
            :rule="r"
            :layerid="layerid"
            class="mapgis-mvt-editor-feature"
            @edit-change="onEditChange"
          />
          <boolean
            v-else-if="r.type === 'boolean'"
            :rule="r"
            :layerid="layerid"
            class="mapgis-mvt-editor-feature"
            @edit-change="onEditChange"
          />
          <number
            v-else-if="r.type === 'number'"
            :rule="r"
            :layerid="layerid"
            class="mapgis-mvt-editor-feature"
            :minimum="r.minimum || 0"
            :maximum="r.maximum || 1000"
            @edit-change="onEditChange"
          />
          <enums
            v-else-if="r.type === 'enum'"
            :rule="r"
            :layerid="layerid"
            class="mapgis-mvt-editor-feature"
            :enums="r.enums || []"
            @edit-change="onEditChange"
          />
          <numberarray
            v-else-if="r.type === 'array-number'"
            :rule="r"
            :layerid="layerid"
            class="mapgis-mvt-editor-feature"
            @edit-change="onEditChange"
          />
          <sprite
            v-else-if="r.type === 'sprite'"
            :rule="r"
            :layerid="layerid"
            class="mapgis-mvt-editor-feature"
            @edit-change="onEditChange"
          />
        </div>
      </mapgis-ui-form-model-item>
    </mapgis-ui-form-model>
  </div>
</template>

<script>
import EditMixin from "../EditMixin";

import color from "../property/PropertyColor.vue";
import string from "../property/PropertyString.vue";
import number from "../property/PropertyNumber.vue";
import enums from "../property/PropertyEnum.vue";
import boolean from "../property/PropertyBoolean.vue";
import numberarray from "../property/PropertyArrayNumber.vue";
import sprite from "../property/PropertySprite.vue";

export default {
  name: "mapgis-mvt-editor-feature",
  mixins: [EditMixin],
  components: {
    color,
    number,
    boolean,
    enums,
    numberarray,
    string,
    sprite
  },
  props: {
    rules: { type: Array, default: () => [] },
    layout: {
      type: String,
      default: "horizontal" /* horizontal vertical inline */
    }
  },
  computed: {
    formItemLayout() {
      const { layout } = this;
      return layout === "horizontal"
        ? {
            labelCol: { span: 7 },
            wrapperCol: { span: 16 }
          }
        : {};
    },
    buttonItemLayout() {
      const { layout } = this.form;
      return layout === "horizontal"
        ? {
            wrapperCol: { span: 14, offset: 4 }
          }
        : {};
    }
  },
  methods: {
    onEditChange(event) {
      this.$_emitEvent(event);
    }
  }
};
</script>

<style>
.mapgis-mvt-editor-feature-wrapper .mapgis-ui-form-item {
  /* overflow-y: scroll; */
  margin-bottom: 0px;
}
.mapgis-mvt-editor-feature {
}
</style>
