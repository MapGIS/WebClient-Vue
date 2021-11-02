<template>
  <div v-if="editOptionsCopy" v-show="show" class="mapgis-plotting-edit-panel">
    <mapgis-ui-row class="mapgis-plotting-edit-tool-row mapgis-plotting-edit-tool-row-title">
      <mapgis-ui-col class="mapgis-plotting-edit-tool-title" :span="8">
        <span style="font-size: 16px;margin-left: 17px">编辑区域</span>
      </mapgis-ui-col>
      <mapgis-ui-col :span="16" class="mapgis-plotting-edit-tool-title" style="padding-left: 5px;">
        <img @click="$_closePanel" class="mapgis-plotting-edit-panel-close" :src="closeImg">
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row class="mapgis-plotting-edit-tool-row">
      <mapgis-ui-col class="mapgis-plotting-edit-tool-title" :span="8">类型 <span style="font-weight: bold">:</span>
      </mapgis-ui-col>
      <mapgis-ui-col :span="16" class="mapgis-plotting-edit-tool-title" style="padding-left: 5px;">
        {{ editOptionsCopy.type }}
      </mapgis-ui-col>
    </mapgis-ui-row>
    <div v-for="(option,index) in editOptionsCopy.options" :key="index">
      <mapgis-ui-row class="mapgis-plotting-edit-tool-row" v-if="option.type === 'input'">
        <mapgis-ui-col class="mapgis-plotting-edit-tool-title" :span="8">{{ option.title }} <span
            style="font-weight: bold">:</span>
        </mapgis-ui-col>
        <mapgis-ui-col :span="16">
          <mapgis-ui-input
              class="mapgis-plotting-edit-input"
              v-model="option.value"
          />
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-plotting-edit-tool-row" v-if="option.type === 'inputNumber'">
        <mapgis-ui-col class="mapgis-plotting-edit-tool-title" :span="8">{{ option.title }} <span
            style="font-weight: bold">:</span>
        </mapgis-ui-col>
        <mapgis-ui-col :span="16">
          <mapgis-ui-input-number
              class="mapgis-plotting-edit-input"
              v-model="option.value"
          />
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-plotting-edit-tool-row" v-if="option.type === 'color'">
        <mapgis-ui-col class="mapgis-plotting-edit-tool-title" :span="8">{{ option.title }} <span
            style="font-weight: bold">:</span>
        </mapgis-ui-col>
        <mapgis-ui-col :span="16">
          <div class="mapgis-plotting-edit-tool-material-color">
            <mapgis-ui-sketch-color-picker
                :color.sync="option.value"
                @input="$_changeMaterialColor"
            />
          </div>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-plotting-edit-tool-row" v-if="option.type === 'slider'">
        <mapgis-ui-col class="mapgis-plotting-edit-tool-title" :span="8">{{ option.title }} <span
            style="font-weight: bold">:</span>
        </mapgis-ui-col>
        <mapgis-ui-col :span="9">
          <mapgis-ui-slider
              class="mapgis-plotting-edit-slider"
              v-model="option.value"
              :min="option.min"
              :max="option.max"
              :step="option.step"
          />
        </mapgis-ui-col>
        <mapgis-ui-col :span="7">
          <mapgis-ui-input-number
              class="mapgis-plotting-edit-input-slider"
              v-model="option.value"
          />
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-plotting-edit-tool-row" v-if="option.type === 'switch'">
        <mapgis-ui-col class="mapgis-plotting-edit-tool-title" :span="10">{{ option.title }} <span
            style="font-weight: bold">:</span>
        </mapgis-ui-col>
        <mapgis-ui-col :span="14">
          <mapgis-ui-switch
              class="mapgis-plotting-edit-tool-switch"
              checked-children="开"
              un-checked-children="关"
              v-model="option.value"
              @change="$_switchChange(option.fields,option.value)"
          />
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-plotting-edit-tool-row" style="margin-bottom: 6px" v-if="option.type === 'collapse'">
        <mapgis-ui-row>
          <mapgis-ui-col class="mapgis-plotting-edit-tool-title" :span="10">{{ option.title }} <span
              style="font-weight: bold">:</span>
          </mapgis-ui-col>
          <mapgis-ui-col :span="14">
            <mapgis-ui-switch
                class="mapgis-plotting-edit-tool-switch"
                checked-children="开"
                un-checked-children="关"
                v-model="option.value"
                @change="$_switchChange(option.key,option.value,option)"
            />
          </mapgis-ui-col>
        </mapgis-ui-row>
        <div class="mapgis-plotting-edit-collapse" :style="{maxHeight: option.height}">
          <div v-for="(o, oIndex) in option.options" :key="oIndex">
            <mapgis-ui-row class="mapgis-plotting-edit-collapse-row" v-if="o.type === 'inputNumber'">
              <mapgis-ui-col class="mapgis-plotting-edit-tool-title" :span="8">{{ o.title }} <span
                  style="font-weight: bold">:</span>
              </mapgis-ui-col>
              <mapgis-ui-col :span="16">
                <mapgis-ui-input-number
                    class="mapgis-plotting-edit-input"
                    v-model="o.value"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row class="mapgis-plotting-edit-collapse-row" v-if="o.type === 'input'">
              <mapgis-ui-col class="mapgis-plotting-edit-tool-title" :span="8">{{ o.title }} <span
                  style="font-weight: bold">:</span>
              </mapgis-ui-col>
              <mapgis-ui-col :span="16">
                <mapgis-ui-input
                    class="mapgis-plotting-edit-input"
                    v-model="o.value"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row class="mapgis-plotting-edit-collapse-row" v-if="o.type === 'color'">
              <mapgis-ui-col class="mapgis-plotting-edit-tool-title" :span="8">
                {{ o.title }} <span style="font-weight: bold">:</span>
              </mapgis-ui-col>
              <mapgis-ui-col :span="16">
                <div class="mapgis-plotting-edit-tool-material-color">
                  <mapgis-ui-sketch-color-picker
                      :color.sync="o.value"
                      @input="$_changeMaterialColor"
                  />
                </div>
              </mapgis-ui-col>
            </mapgis-ui-row>
          </div>
        </div>
      </mapgis-ui-row>
      <mapgis-ui-row class="mapgis-plotting-edit-tool-row" v-if="option.type === 'select'">
        <mapgis-ui-col class="mapgis-plotting-edit-tool-title" :span="8">{{ option.title }} <span
            style="font-weight: bold">:</span>
        </mapgis-ui-col>
        <mapgis-ui-col :span="16">
          <mapgis-ui-select class="mapgis-plotting-edit-select" v-model="material">
            <mapgis-ui-select-option v-for="(m,index) in option.value" :key="index" :value="m">
              {{ m }}
            </mapgis-ui-select-option>
          </mapgis-ui-select>
        </mapgis-ui-col>
      </mapgis-ui-row>
    </div>
  </div>
</template>

<script>
import {closeImg} from "./base64Source"

export default {
  name: "EditPanel",
  props: {
    editOptions: {
      type: Object,
      default() {
        return {}
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      materials: ["纯色"],
      material: "纯色",
      materialColor: "rgba(0,0,0,255)",
      editOptionsCopy: undefined,
      closeImg: closeImg,
      maxHeight: 0
    }
  },
  watch: {
    editOptions: {
      handler: function () {
        this.editOptionsCopy = this.editOptions;
        console.log("this.editOptionsCopy", this.editOptionsCopy)
      },
    }
  },
  mounted() {
    this.editOptionsCopy = this.editOptions;
  },
  methods: {
    $_closePanel() {
      this.show = false;
    },
    $_changeMaterialColor(e) {
      let rgba = `rgba(${e.rgba.r}, ${e.rgba.g}, ${e.rgba.b}, ${e.rgba.a})`;
      this.$emit("change", rgba);
    },
    $_switchOption(switches, hide) {
      for (let i = 0; i < switches.length; i++) {
        for (let j = 0; j < this.editOptionsCopy.options.length; j++) {
          if (this.editOptionsCopy.options[j].title === switches[i]) {
            this.editOptionsCopy.options[j].show = hide;
            break;
          }
        }
      }
    },
    $_switchChange(key, flag, option) {
      if (flag) {
        this.activeTool = key;
        option.height = option.maxHeight + "px"
      } else {
        this.activeTool = undefined;
        option.height = "0"
      }
    }
  }
}
</script>

<style scoped>
.mapgis-plotting-edit-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 290px;
  padding: 20px;
  padding-top: 10px;
  background: white;
  border-radius: 4px;
  -webkit-box-shadow: #666 0 0 10px;
  -moz-box-shadow: #666 0 0 10px;
  box-shadow: #666 0 0 10px;
}

.mapgis-plotting-edit-tool-title {
  text-align: left;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
}

.mapgis-plotting-edit-input, .mapgis-plotting-edit-select {
  width: 171px;
  height: 32px;
}

.mapgis-plotting-edit-tool-row {
  margin-bottom: 16px;
}

.mapgis-plotting-edit-tool-row-title {
  width: 290px;
  margin-left: -20px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #dedddd;
}

.mapgis-plotting-edit-tool-material-color {
  width: 171px;
  height: 32px;
}

.mapgis-plotting-edit-slider {
  width: 91px;
  margin-top: 9px;
}

.mapgis-plotting-edit-input-slider {
  width: 60px;
  height: 28px;
  border-radius: 14px;
  margin-left: 18px;
}

.mapgis-plotting-edit-tool-switch {
  float: right;
  margin-top: 5px;
  margin-right: -3px;
}

.mapgis-plotting-edit-panel-close {
  position: absolute;
  top: 4px;
  right: 12px;
  width: 22px;
  cursor: pointer;
}

.mapgis-plotting-edit-collapse-row {
  margin: 8px;
}

.mapgis-plotting-edit-collapse {
  background: #F1F1F1;
  border-radius: 4px;
  width: 268px;
  max-height: 0;
  margin-left: -8px;
  margin-top: 4px;
  overflow: hidden;
  transition: max-height 1s;
  -moz-transition: max-height 1s; /* Firefox 4 */
  -webkit-transition: max-height 1s; /* Safari and Chrome */
  -o-transition: max-height 1s; /* Opera */
}
</style>