<template>
  <mapgis-ui-card class="theme-panel" @click="$_panelClick">
    <!--  专题图面板  -->
    <div v-show="init" class="theme-panel-tab">
      <!--标题-->
      <mapgis-ui-row>
        <mapgis-ui-col :span="24" class="theme-panel-type theme-panel-type-title">
          <p class="theme-panel-title">{{ title }}</p>
          <p class="theme-panel-title-close" @click="$_close">X</p>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <!--专题图类型-->
      <mapgis-ui-collapse accordion>
        <mapgis-ui-collapse-panel key="1" header="专题图类型">
          <mapgis-ui-row v-if="showField">
            <p class="theme-panel-p">类型</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-select
                :default-value="themeDefaultTypeCopy"
                v-model="themeDefaultTypeCopy"
                @change="$_selectThemeType"
                class="theme-panel-select"
            >
              <mapgis-ui-select-option v-for="(theme,index) in themeType" :key="index" :value="theme.key">{{
                  theme.value
                }}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-row>
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>
      <!--字段信息-->
      <mapgis-ui-collapse accordion>
        <mapgis-ui-collapse-panel key="1" header="字段信息">
          <mapgis-ui-row v-if="showField">
            <p class="theme-panel-p">字段</p>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="showField">
            <mapgis-ui-select
                v-if="fields.length > 0"
                :default-value="fields[0]"
                @change="$_selectChange"
                class="theme-panel-select"
            >
              <mapgis-ui-select-option v-for="(Field,index) in fields" :key="index" :value="Field">{{ Field }}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-row>
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>
      <!--热点-->
      <mapgis-ui-collapse accordion v-if="dataType === 'heatmap'">
        <mapgis-ui-collapse-panel key="1" header="热点">
          <mapgis-ui-row>
            <p class="theme-panel-p">热点颜色</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col v-if="gradientValue === 'common'"
                           :span="25"
            >
              <mapgis-ui-select
                  :default-value="0"
                  @change="$_heatGradientChange"
              >
                <mapgis-ui-select-option v-for="(gradient,index) in heatGradientArr" :key="index" :value="index">
                  <div :style="{background: gradient.value}" class="theme-panel-gradient"></div>
                </mapgis-ui-select-option>
              </mapgis-ui-select>
            </mapgis-ui-col>
          </mapgis-ui-row>

          <mapgis-ui-row>
            <p class="theme-panel-p" style="margin-top: 0.8em">透明度</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider class="theme-panel-slider" v-model="opacity"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number class="theme-panel-input-number" v-model="opacity"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row
              v-if="dataType==='heatmap'"
          >
            <mapgis-ui-col :span="6">
              <p class="theme-panel-p">热力半径</p>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="12">
              <mapgis-ui-input-number v-model="heatMapRadius" class="theme-panel-input-radius"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>
      <!--自定义-->
      <mapgis-ui-collapse accordion v-if="dataType === 'heatmap'">
        <mapgis-ui-collapse-panel key="1" header="自定义">
          <mapgis-ui-row>
            <p class="theme-panel-p">自定义颜色</p>
          </mapgis-ui-row>
          <mapgis-ui-row v-for="(color,index) in currentColors" :key="index">
            <mapgis-ui-row>
              <p class="theme-panel-p">热力颜色{{ index }}:</p>
            </mapgis-ui-row>
            <mapgis-ui-row>
              <colorPicker
                  v-model="color.value"
                  class="picker theme-panel-line-color"
                  @change="$_selectColor(color)"
              />
            </mapgis-ui-row>
          </mapgis-ui-row>
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>
      <!--字段过滤-->
      <!--      <mapgis-ui-row>-->
      <!--        <mapgis-ui-collapse>-->
      <!--          <mapgis-ui-collapse-panel key="1" header="字段过滤">-->
      <!--            <p>dasdadadasdasd</p>-->
      <!--          </mapgis-ui-collapse-panel>-->
      <!--        </mapgis-ui-collapse>-->
      <!--      </mapgis-ui-row>-->
      <!--符号-->
      <mapgis-ui-collapse v-model="activeKey" accordion v-if="dataType !== 'heatmap'">
        <mapgis-ui-collapse-panel key="2" header="符号">
          <mapgis-ui-row v-if="dataType !== 'circle'">
            <mapgis-ui-col :span="4">
              <p class="theme-panel-p">图标</p>
            </mapgis-ui-col>
            <mapgis-ui-sprite-select
                :url="iconUrl"
                :defaultValue="defaultIconValue"
                @change="$_clickIcon"
                @iconLoaded="$_iconLoaded"
            ></mapgis-ui-sprite-select>
            <!--            <mapgis-ui-col :span="20">-->
            <!--              <div-->
            <!--                  class="theme-panel-icon-button"-->
            <!--                  @click="$_toggleIcon"-->
            <!--              >-->
            <!--                <div class="theme-panel-icon-button-inner"></div>-->
            <!--              </div>-->
            <!--              <div class="theme-panel-icons"-->
            <!--                   v-show="showIcon"-->
            <!--                   @mouseleave="$_closeIcon"-->
            <!--              >-->
            <!--                <mapgis-ui-tabs-->
            <!--                    default-active-key="0"-->
            <!--                >-->
            <!--                  <mapgis-ui-tab-pane-->
            <!--                      v-for="(iconTap,index) in icons"-->
            <!--                      :key="String(index)"-->
            <!--                      :tab="iconTap.type">-->
            <!--                    <img-->
            <!--                        class="theme-panel-icon"-->
            <!--                        v-for="(icon,iconIndex) in iconTap.icons"-->
            <!--                        :src="icon.url"-->
            <!--                        :key="iconIndex"-->
            <!--                        @click="$_clickIcon(icon)"-->
            <!--                    >-->
            <!--                  </mapgis-ui-tab-pane>-->
            <!--                </mapgis-ui-tabs>-->
            <!--              </div>-->
            <!--            </mapgis-ui-col>-->
          </mapgis-ui-row>
          <mapgis-ui-row
              style="margin-top: 8px;"
              v-if="dataType !== 'line' && dataType !== 'symbol'"
          >
            <mapgis-ui-radio-group
                v-model="radioMode"
                :style="{ marginBottom: '8px',marginLeft: '7px',float: 'left' }"
            >
              <mapgis-ui-radio-button @click="$_chooseColor('gradient')" value="gradient">
                渐变颜色
              </mapgis-ui-radio-button>
              <mapgis-ui-radio-button @click="$_chooseColor('single')" value="single">
                单体颜色
              </mapgis-ui-radio-button>
            </mapgis-ui-radio-group>
          </mapgis-ui-row>
          <mapgis-ui-row
              v-if="dataType !== 'line' && dataType !== 'symbol'"
          >
            <mapgis-ui-select
                :default-value="'#FF0000'"
                v-model="gradientColor"
                @change="$_gradientChange"
                v-show="radioMode === 'gradient'"
            >
              <mapgis-ui-select-option v-for="(gradient,index) in gradientArr" :key="index" :value="gradient.key">
                <div class="theme-panel-gradient" :style="{background: gradient.value}"></div>
              </mapgis-ui-select-option>
            </mapgis-ui-select>
            <colorPicker
                class="picker theme-panel-line-color"
                v-model="singleColor"
                @change="$_singleChanged"
                v-show="radioMode === 'single'"
            />
          </mapgis-ui-row>
          <mapgis-ui-row
              v-if="dataType !== 'line'"
          >
            <p class="theme-panel-p" style="margin-top: 0.8em">透明度</p>
          </mapgis-ui-row>
          <mapgis-ui-row
              v-if="dataType !== 'line'"
          >
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider class="theme-panel-slider" v-model="opacity"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number class="theme-panel-input-number" v-model="opacity"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'symbol'">
            <p class="theme-panel-p">图标大小</p>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'symbol'">
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider
                  :min="0"
                  :max="radiusMax"
                  :step="radiusStep"
                  class="theme-panel-slider"
                  v-model="radius"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number
                  :min="0"
                  :max="radiusMax"
                  :step="radiusStep"
                  class="theme-panel-input-number"
                  v-model="radius"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'circle'">
            <p class="theme-panel-p">半径</p>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'circle'">
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider
                  :min="0"
                  :max="radiusMax"
                  :step="radiusStep"
                  class="theme-panel-slider"
                  v-model="radius"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number
                  :min="0"
                  :max="radiusMax"
                  :step="radiusStep"
                  class="theme-panel-input-number"
                  v-model="radius"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'symbol' || dataType === 'circle'">
            <p class="theme-panel-p">x轴偏移</p>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'symbol' || dataType === 'circle'">
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider
                  :min="xOffsetMin"
                  :max="xOffsetMax"
                  :step="xOffsetStep"
                  class="theme-panel-slider"
                  v-model="xOffset"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number
                  :min="xOffsetMin"
                  :max="xOffsetMax"
                  :step="xOffsetStep"
                  class="theme-panel-input-number"
                  v-model="xOffset"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'symbol' || dataType === 'circle'">
            <p class="theme-panel-p">y轴偏移</p>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'symbol' || dataType === 'circle'">
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider
                  :min="yOffsetMin"
                  :max="yOffsetMax"
                  :step="yOffsetStep"
                  class="theme-panel-slider"
                  v-model="yOffset"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number
                  :min="yOffsetMin"
                  :max="yOffsetMax"
                  :step="yOffsetStep"
                  class="theme-panel-input-number"
                  v-model="yOffset"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'symbol'">
            <p class="theme-panel-p">旋转角度</p>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'symbol'">
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider
                  :min="0"
                  :max="360"
                  :step="rotationStep"
                  class="theme-panel-slider"
                  v-model="rotation"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number
                  :min="0"
                  :max="360"
                  :step="rotationStep"
                  class="theme-panel-input-number"
                  v-model="rotation"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>
      <!--边线样式-->
      <mapgis-ui-collapse accordion v-if="dataType !== 'symbol' && dataType !== 'heatmap'">
        <mapgis-ui-collapse-panel key="5" header="线">
          <mapgis-ui-row v-if="dataType === 'line'">
            <p class="theme-panel-p">边线样式</p>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'line'">
            <mapgis-ui-select
                :default-value="'theme-panel-line-zero'"
                class="theme-panel-select"
                @change="$_selectLineStyleChanged"
            >
              <mapgis-ui-select-option v-for="(line,index) in lineStyle" :key="index" :value="line.key">
                <div v-if="line.key !== 'theme-panel-line-three'" :class="line.key"></div>
                <div v-if="line.key === 'theme-panel-line-three'" :class="line.key">
                  <div class="theme-panel-line-long"></div>
                  <div class="theme-panel-line-short"></div>
                  <div class="theme-panel-line-long"></div>
                  <div class="theme-panel-line-short"></div>
                  <div class="theme-panel-line-long"></div>
                  <div class="theme-panel-line-short"></div>
                  <div class="theme-panel-line-long"></div>
                  <div class="theme-panel-line-short"></div>
                  <div class="theme-panel-line-long"></div>
                  <div class="theme-panel-line-short"></div>
                  <div class="theme-panel-line-long"></div>
                  <div class="theme-panel-line-short"></div>
                </div>
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <p class="theme-panel-p">边线颜色</p>
          </mapgis-ui-row>
          <mapgis-ui-row style="margin-top: 8px;" v-if="dataType === 'line' || dataType === 'fill'">
            <mapgis-ui-radio-group
                v-model="radioMode"
                :style="{ marginBottom: '8px',marginLeft: '7px',float: 'left' }"
                v-if="dataType !== 'fill'"
            >
              <mapgis-ui-radio-button value="gradient">
                渐变颜色
              </mapgis-ui-radio-button>
              <mapgis-ui-radio-button value="single">
                单体颜色
              </mapgis-ui-radio-button>
            </mapgis-ui-radio-group>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'line'">
            <mapgis-ui-select
                :default-value="'#FF0000'"
                @change="$_gradientChange"
                v-show="radioMode === 'gradient'"
            >
              <mapgis-ui-select-option v-for="(gradient,index) in gradientArr" :key="index" :value="gradient.key">
                <div class="theme-panel-gradient" :style="{background: gradient.value}"></div>
              </mapgis-ui-select-option>
            </mapgis-ui-select>
            <colorPicker
                class="picker theme-panel-line-color"
                v-model="singleColor"
                @change="$_singleChanged"
                v-show="radioMode === 'single'"
            />
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'circle' || dataType === 'fill'">
            <colorPicker
                class="picker theme-panel-line-color"
                v-model="outerLineColor"
                @change="$_outerLineColorChanged"
            />
          </mapgis-ui-row>
          <mapgis-ui-row>
            <p class="theme-panel-p">边线宽度</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider
                  :min="0"
                  :max="lineWidthMax"
                  :step="lineWidthStep"
                  class="theme-panel-slider"
                  v-model="lineWidth"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number
                  :min="0"
                  :max="lineWidthMax"
                  :step="lineWidthStep"
                  class="theme-panel-input-number"
                  v-model="lineWidth"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <p class="theme-panel-p" style="margin-top: 0.8em">透明度</p>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'line'">
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider class="theme-panel-slider" v-model="opacity"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number class="theme-panel-input-number" v-model="opacity"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row v-if="dataType === 'circle' || dataType === 'fill'">
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider class="theme-panel-slider" v-model="outerLineOpacity"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number class="theme-panel-input-number" v-model="outerLineOpacity"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>
      <!--标签-->
      <mapgis-ui-collapse accordion v-if="dataType !== 'heatmap'">
        <mapgis-ui-collapse-panel key="3" header="标签">
          <mapgis-ui-row>
            <p class="theme-panel-p">显示字段</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-select
                v-if="labelFieldsCopy.length > 0"
                class="theme-panel-select"
                :default-value="labelFieldsCopy[0]"
                @change="$_selectTextChange"
            >
              <mapgis-ui-select-option v-for="(Field,index) in labelFieldsCopy" :key="index" :value="Field">
                {{ Field }}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <p class="theme-panel-p">字体颜色</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <colorPicker
                class="picker theme-panel-line-color"
                v-model="fontColor"
                @change="$_selectFontColor"
            />
          </mapgis-ui-row>
          <!--          <mapgis-ui-row>-->
          <!--            <p class="theme-panel-p">背景颜色</p>-->
          <!--          </mapgis-ui-row>-->
          <!--          <mapgis-ui-row>-->
          <!--            <colorPicker-->
          <!--                class="picker theme-panel-line-color"-->
          <!--                v-model="lineColor"-->
          <!--                @change="$_selectLineColor"-->
          <!--            />-->
          <!--          </mapgis-ui-row>-->
          <mapgis-ui-row>
            <p class="theme-panel-p">描边颜色</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <colorPicker
                class="picker theme-panel-line-color"
                v-model="haloColor"
                @change="$_selectHaloColor"
            />
          </mapgis-ui-row>
          <mapgis-ui-row>
            <p class="theme-panel-p" style="margin-top: 0.8em">描边宽度</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider
                  :min="0"
                  :max="haloWidthMax"
                  :step="haloWidthStep"
                  class="theme-panel-slider"
                  v-model="haloWidth"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number class="theme-panel-input-number" v-model="haloWidth"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <p class="theme-panel-p">字体</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-select
                v-if="fields.length > 0"
                :default-value="textFonts[0]"
                class="theme-panel-select"
                @change="$_fontChanged"
            >
              <mapgis-ui-select-option v-for="(font,index) in textFonts" :key="index" :value="font">
                {{ font }}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <p class="theme-panel-p" style="margin-top: 0.8em">字体大小</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider
                  :min="1"
                  :max="fontSizeMax"
                  :step="fontSizeStep"
                  class="theme-panel-slider"
                  v-model="fontSize"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number
                  :min="1"
                  :max="fontSizeMax"
                  :step="fontSizeStep"
                  class="theme-panel-input-number"
                  v-model="fontSize"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <p class="theme-panel-p">x轴偏移</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider
                  :min="xOffsetTextMin"
                  :max="xOffsetTextMax"
                  :step="xOffsetTextStep"
                  class="theme-panel-slider"
                  v-model="xOffsetText"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number
                  :min="xOffsetTextMin"
                  :max="xOffsetTextMax"
                  :step="xOffsetTextStep"
                  class="theme-panel-input-number"
                  v-model="xOffsetText"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <p class="theme-panel-p">y轴偏移</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider
                  :min="yOffsetTextMin"
                  :max="yOffsetTextMax"
                  :step="yOffsetTextStep"
                  class="theme-panel-slider"
                  v-model="yOffsetText"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number
                  :min="yOffsetTextMin"
                  :max="yOffsetTextMax"
                  :step="yOffsetTextStep"
                  class="theme-panel-input-number"
                  v-model="yOffsetText"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <p class="theme-panel-p">文字间距</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider
                  :min="0"
                  :max="textPaddingMax"
                  :step="textPaddingStep"
                  class="theme-panel-slider"
                  v-model="textPadding"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number
                  :min="0"
                  :max="textPaddingMax"
                  :step="textPaddingStep"
                  class="theme-panel-input-number"
                  v-model="textPadding"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <p class="theme-panel-p">旋转角度</p>
          </mapgis-ui-row>
          <mapgis-ui-row>
            <mapgis-ui-col :span="18">
              <mapgis-ui-slider
                  :min="0"
                  :max="360"
                  :step="textRotationStep"
                  class="theme-panel-slider"
                  v-model="textRotation"/>
            </mapgis-ui-col>
            <mapgis-ui-col :span="6">
              <mapgis-ui-input-number
                  :min="0"
                  :max="360"
                  :step="textRotationStep"
                  class="theme-panel-input-number"
                  v-model="textRotation"/>
            </mapgis-ui-col>
          </mapgis-ui-row>
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>
      <slot name="operation"></slot>
      <!--专题图信息-->
      <mapgis-ui-collapse accordion @change="$_clickCollapse" v-if="dataType !== 'heatmap'">
        <mapgis-ui-collapse-panel key="4" header="图例">
          <slot name="legend" :selectValue="selectValue">
            <!--            <mapgis-ui-row>-->
            <!--              <mapgis-ui-input v-model="search" placeholder="搜索框"/>-->
            <!--            </mapgis-ui-row>-->
            <mapgis-ui-row>
              <div id="theme-panel-list"
                   class="theme-panel-list"
                   :style="{overflowY:scroll}"
                   @mouseover="$_mouseover"
                   @mouseleave="$_mouseleave"
              >
                <mapgis-ui-list
                    bordered
                    :data-source="dataSourceCopy"
                >
                  <mapgis-ui-list-item slot="renderItem" slot-scope="item, index">
                    <div class="theme-panel-td theme-panel-td-border-right">
                      {{ index }}
                    </div>
                    <div class="theme-panel-td theme-panel-td-border-right">
                      <mapgis-ui-checkbox
                          :value="{item:item,color:colors[index]}"
                          :color="colors[index]"
                          :checked="checkBoxArr[index]"
                          @change="$_checked">
                      </mapgis-ui-checkbox>
                    </div>
                    <div class="theme-panel-td theme-panel-td-border-right">
                      <div class="theme-panel-color-picker">
                        <colorPicker class="picker" v-model="colors[index]" v-on:change="$_changeColor(index)"/>
                      </div>
                    </div>
                    <div class="theme-panel-td theme-panel-td-key theme-panel-td-border-right"
                         v-bind:title="selectValue">
                      {{
                        selectValue.toString().length > 4 ? String(selectValue).substr(0, 4) + "..." : (selectValue === "" ? "其他" : selectValue)
                      }}
                    </div>
                    <div class="theme-panel-td theme-panel-td-value" v-bind:title="item">
                      {{
                        item.toString().length > 8 ? String(item).substr(0, 8) + "..." : (item === "" ? "其他" : item)
                      }}
                    </div>
                  </mapgis-ui-list-item>
                </mapgis-ui-list>
              </div>
            </mapgis-ui-row>
          </slot>
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>
    </div>
    <!--  loading  -->
    <div v-show="!init" class="theme-panel-tab theme-panel-loading">
      <mapgis-ui-row>
        <mapgis-ui-col :span="24">{{ loadingTest }}</mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col :span="24">
          <mapgis-ui-spin size="small"/>
        </mapgis-ui-col>
      </mapgis-ui-row>
    </div>
  </mapgis-ui-card>
</template>

<script>
export default {
  name: "mapgis-igs-theme-panel",
  props: {
    title: {
      type: String,
      default: "单值专题图"
    },
    fields: {
      type: Array,
      default() {
        return []
      }
    },
    labelFields: {
      type: Array,
      default() {
        return []
      }
    },
    dataSource: {
      type: Array,
      default() {
        return []
      }
    },
    colors: {
      type: Array,
      default() {
        return []
      }
    },
    checkBoxArr: {
      type: Array,
      default() {
        return []
      }
    },
    dataType: {
      type: String
    },
    showField: {
      type: Boolean,
      default: true
    },
    showGradient: {
      type: Boolean,
      default: true
    },
    showOpacity: {
      type: Boolean,
      default: true
    },
    showOutLineColor: {
      type: Boolean,
      default: true
    },
    showRange: {
      type: Boolean
    },
    icons: {
      type: Array
    },
    textFonts: {
      type: Array
    },
    activeKey: {
      type: Array,
      default() {
        return [];
      }
    },
    iconUrl: {
      type: String
    },
    defaultIconValue: {
      type: String
    },
    themeDefaultType: {
      type: String
    },
    panelProps: {
      type: Object,
      default() {
        return {}
      }
    },
    themeType: {
      type: Array,
      default() {
        return [{
          key: "unique",
          value: "单值专题图"
        }, {
          key: "range",
          value: "分段专题图"
        }, {
          key: "symbol",
          value: "等级符号专题图"
        }, {
          key: "heatmap",
          value: "热力专题图"
        }];
      }
    },
  },
  data() {
    return {
      defaultValue: "",
      opacity: 100,
      radius: 6,
      radiusMax: 12,
      radiusStep: 0.1,
      xOffset: 0,
      xOffsetMax: 20,
      xOffsetMin: -20,
      xOffsetStep: 0.1,
      yOffset: 0,
      yOffsetMin: -20,
      yOffsetMax: 20,
      yOffsetStep: 0.1,
      rotation: 0,
      rotationStep: 1,
      singleColor: "#000000",
      outerLineColor: "#000000",
      lineWidth: 2,
      lineWidthMax: 10,
      lineWidthStep: 0.1,
      outerLineOpacity: 100,
      fontColor: "#000000",
      haloColor: "#FFFFFF",
      haloWidth: 0,
      haloWidthMax: 10,
      haloWidthStep: 0.1,
      fontSize: 11,
      fontSizeMax: 20,
      fontSizeStep: 1,
      xOffsetText: 0,
      xOffsetTextMin: -20,
      xOffsetTextMax: 20,
      xOffsetTextStep: 0.1,
      yOffsetText: 0,
      yOffsetTextMin: -20,
      yOffsetTextMax: 20,
      yOffsetTextStep: 0.1,
      textPaddingMax: 1,
      textPaddingStep: 0.05,
      textPadding: 0.05,
      textRotationStep: 1,
      textRotation: 0,
      heatMapRadius: 12,
      currentColors: [{
        key: "0",
        value: "#0000FF"
      }, {
        key: "1",
        value: "#00FFFF"
      }, {
        key: "2",
        value: "#00FF00"
      }, {
        key: "3",
        value: "#FFFF00"
      }, {
        key: "4",
        value: "#FF0000"
      }],
      heatGradientArr: [{
        key: "#0000FF,#00FFFF,#00FF00,#FFFF00,#FF0000",
        value: "-webkit-linear-gradient(left,#0000FF,#00FFFF,#00FF00,#FFFF00,#FF0000)"
      }, {
        key: "#636CEA,#1B1DD5,#BE1C4D,#F79390,#FFFFCC",
        value: "-webkit-linear-gradient(left,#636CEA,#1B1DD5,#BE1C4D,#F79390,#FFFFCC)"
      }, {
        key: "#B0B0B0,#0000FF,#00A6FF,#00FF00,#00FFFF,#FF0000,#FFA600,#FF00FF,#0000FF",
        value: "-webkit-linear-gradient(left,#B0B0B0,#0000FF,#00A6FF,#00FF00,#00FFFF,#FF0000,#FFA600,#FF00FF,#0000FF)"
      }],
      init: false,
      loadingTest: "加载中，请稍后...",
      FieldArray: [],
      dataSourceCopy: [],
      selectValue: "",
      gradientValue: "common",
      lineValue: "common",
      lineColor: "#000000",
      startColor: "#FFF",
      endColor: "#000",
      currentColorIndex: 0,
      gradientArr: [{
        key: "#FF0000",
        value: "-webkit-linear-gradient(left,#FFFFFF,#FF0000)"
      }, {
        key: "#00FF00",
        value: "-webkit-linear-gradient(left,#FFFFFF,#00FF00)"
      }, {
        key: "#0000FF",
        value: "-webkit-linear-gradient(left,#FFFFFF,#0000FF)"
      }],
      marks: {
        0: '0%',
        100: {
          style: {
            color: '#000',
          },
          label: '100%'
        }
      },
      mouseOver: false,
      scrollBack: 0,
      scroll: "hidden",
      search: undefined,
      searchBack: undefined,
      timeOut: undefined,
      radioMode: "gradient",
      showIcon: false,
      lineStyle: [{
        key: "theme-panel-line-zero",
        value: [10000]
      }, {
        key: "theme-panel-line-one",
        value: [1, 1]
      }, {
        key: "theme-panel-line-two",
        value: [3, 3]
      }, {
        key: "theme-panel-line-three",
        value: [10, 3, 2, 3]
      }],
      themeDefaultTypeCopy: undefined,
      labelFieldsCopy: [],
      gradientColor: "#FF0000"
    }
  },
  watch: {
    dataSource: {
      deep: true,
      handler: function () {
        this.$_initDataSource();
      }
    },
    themeDefaultType: {
      handler: function () {
        this.themeDefaultTypeCopy = this.themeDefaultType;
      }
    },
    showRange: {
      handler: function () {
        this.$_addScrollEvent();
      }
    },
    panelProps: {
      handler: function () {
        this.$_formatPanelProps();
      },
      deep: true
    },
    search: {
      handler: function () {
        let vm = this;
        this.$_debounce(function () {
          if (vm.search) {
            let searchArr = vm.search.split(" ");
            let key = searchArr[0];
            let operate = searchArr[1];
            let value = searchArr[2];
            vm.$emit("beginSearch", key, operate, value);
          } else if (vm.searchBack) {
            vm.dataSourceCopy = vm.searchDataBack;
          }
        });
      }
    },
    heatMapRadius: {
      handler: function () {
        this.$emit("heatRadiusChanged", Number(this.heatMapRadius));
      }
    },
    themeType: {
      handler: function () {}
    },
    defaultIconValue: {
      handler: function () {}
    },
    labelFields: {
      handler: function () {
        if(this.labelFields.length > 0){
          this.labelFieldsCopy = ["未设置"].concat(this.labelFields);
        }
      }
    },
  },
  created() {
    this.$_formatPanelProps();
  },
  mounted() {
    this.themeDefaultTypeCopy = this.themeDefaultType;
    if(this.labelFields.length > 0){
      this.labelFieldsCopy = ["未设置"].concat(this.labelFields);
    }
    this.$watch("radius", function () {
      this.$emit("radiusChanged", Number(this.radius));
    });
    this.$watch("opacity", function () {
      this.$emit("opacityChanged", Number(this.opacity) / 100);
    });
    this.$watch("outerLineOpacity", function () {
      this.$emit("outerLineOpacityChanged", Number(this.outerLineOpacity) / 100);
    });
    this.$watch("xOffset", function () {
      this.$emit("xOffsetChanged", Number(this.xOffset));
    });
    this.$watch("yOffset", function () {
      this.$emit("yOffsetChanged", Number(this.yOffset) * -1);
    });
    this.$watch("xOffsetText", function () {
      this.$emit("xOffsetTextChanged", Number(this.xOffsetText));
    });
    this.$watch("textPadding", function () {
      this.$emit("textPaddingChanged", Number(this.textPadding));
    });
    this.$watch("yOffsetText", function () {
      this.$emit("yOffsetTextChanged", Number(this.yOffsetText) * -1);
    });
    this.$watch("rotation", function () {
      this.$emit("rotationChanged", Number(this.rotation));
    });
    this.$watch("textRotation", function () {
      this.$emit("textRotationChanged", Number(this.textRotation));
    });
    this.$watch("haloWidth", function () {
      this.$emit("haloWidthChanged", Number(this.haloWidth));
    });
    this.$watch("fontSize", function () {
      this.$emit("fontSizeChanged", Number(this.fontSize));
    });
    this.$watch("lineWidth", function () {
      this.$emit("lineWidthChanged", Number(this.lineWidth));
    });
    this.$_initDataSource();
  },
  methods: {
    $_chooseColor(radioMode){
      if(radioMode === "single" && this.radioMode !== "single"){
        this.$emit("singleChanged", this.singleColor, this.singleColor);
      }else if(radioMode === "gradient" && this.radioMode !== "gradient"){
        this.$emit("gradientChange", "#FFFFFF", this.gradientColor);
      }
    },
    $_formatPanelProps() {
      let vm = this;
      Object.keys(this.$data).forEach(function (key) {
        if (vm.$props.panelProps.hasOwnProperty(key)) {
          vm.$data[key] = vm.$props.panelProps[key];
        }
      });
    },
    $_fontChanged(font) {
      this.$emit("fontChanged", font);
    },
    $_toggleIcon() {
      this.showIcon = !this.showIcon;
    },
    $_closeIcon() {
      this.showIcon = false;
    },
    $_clickIcon(icon) {
      // this.showIcon = false;
      this.$emit("clickIcon", icon);
    },
    $_iconLoaded(json) {
      this.$emit("iconLoaded", json);
    },
    $_debounce(callback, time) {
      time = time || 1500;
      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.timeOut = setTimeout(callback, time);
    },
    $_addScrollEvent() {
      if (!this.showRange) {
        this.$nextTick(function () {
          let vm = this;
          let list = document.getElementById("theme-panel-list");
          if (list) {
            this.scrollBack = document.documentElement.scrollTop || document.body.scrollTop;
            list.addEventListener('scroll', function (event) {
              if (vm.mouseOver) {
                let el = event.target
                if (el.scrollTop - vm.scrollBack > 200) {
                  vm.scrollBack = el.scrollTop;
                  let dataArr = [];
                  let startLength = vm.dataSourceCopy.length;
                  let endLength = ((startLength + 15) < vm.dataSource.length) ? startLength + 15 : vm.dataSource.length;
                  for (let i = startLength; i < endLength; i++) {
                    dataArr.push(vm.dataSource[i]);
                  }
                  vm.dataSourceCopy = vm.dataSourceCopy.concat(dataArr);
                }
              }
            })
          }
        });
      }
    },
    $_clickCollapse(key) {
      if (key === "4") {
        this.$_addScrollEvent();
      }
    },
    $_selectTextChange(value) {
      this.selectText = value;
      this.$emit("selectTextChanged", value);
    },
    $_selectHaloColor(color) {
      this.$emit("haloColorChanged", color);
    },
    $_selectFontColor(color) {
      this.$emit("fontColorChanged", color);
    },
    $_mouseover() {
      this.mouseOver = true;
    },
    $_mouseleave() {
      this.mouseOver = false;
    },
    $_close() {
      this.$emit("closePanel");
    },
    $_selectLineColor(e) {
      this.lineColorChanged = e;
      this.$emit("lineColorChanged", e);
    },
    $_changeLineOption(e) {
      this.lineValue = e;
    },
    $_selectStartColor(e) {
      this.startColor = e;
      this.$emit("gradientChange", e, this.endColor);
    },
    $_selectEndColor(e) {
      this.endColor = e;
      this.$emit("gradientChange", this.startColor, this.endColor);
    },
    $_changeOption(e) {
      this.gradientValue = e;
    },
    $_gradientChange(e) {
      this.$emit("gradientChange", "#FFFFFF", e);
    },
    $_singleChanged(e) {
      this.$emit("singleChanged", e, e);
    },
    $_outerLineColorChanged(e) {
      this.$emit("outerLineColorChanged", e);
    },
    $_selectLineStyleChanged(e) {
      let lineStyle = {};
      for (let i = 0; i < this.lineStyle.length; i++) {
        if (this.lineStyle[i].key === e) {
          lineStyle = this.lineStyle[i];
          break;
        }
      }
      this.$emit("lineStyleChanged", lineStyle);
    },
    $_checked(e) {
      let value = e.target.value.item;
      let color = e.target.value.color;
      let index = this.dataSourceCopy.indexOf(value);
      if (index >= 0) {
        this.$set(this.checkBoxArr, index, !this.checkBoxArr[index]);
      }
      this.$emit("checked", this.checkBoxArr, index, color);
    },
    $_changeColor(index) {
      this.$emit("oneColorChanged", index, this.colors[index]);
    },
    $_selectChange(value) {
      this.selectValue = value;
      this.$emit("change", value);
    },
    $_selectThemeType(key) {
      let value;
      for (let i = 0; i < this.themeType.length; i++) {
        if (this.themeType[i].key === key) {
          value = this.themeType[i].value;
        }
      }
      this.$emit("themeTypeChanged", key, value);
    },
    $_initDataSource() {
      if (this.dataSource.length > 0) {
        this.init = true;
      }else {
        return;
      }
      let dataArr = [];
      let length = this.dataSource.length > 30 ? 30 : this.dataSource.length;
      for (let i = 0; i < length; i++) {
        dataArr.push(this.dataSource[i])
      }
      this.dataSourceCopy = dataArr;
      this.scroll = this.dataSource.length > 15 ? "scroll" : "hidden";
      this.defaultValue = this.defaultValue === "" ? this.fields[0] : this.defaultValue;
      this.selectValue = this.selectValue === "" ? this.fields[0] : this.selectValue;
    },
    $_panelClick() {
      this.$emit("panelClick", this);
    },
    $_heatGradientChange(index) {
      this.currentColorIndex = index;
      let e = this.heatGradientArr[index].key;
      let colorsArr = [];
      colorsArr = e.split(",");
      this.currentColors = [];
      colorsArr.forEach((color, i) => {
        this.currentColors.push({key: i, value: color});
      });
      colorsArr.unshift("rgba(255,255,255,0)");
      this.$emit("gradientChange", colorsArr);
    },
    $_selectColor(e) {
      let colorsArr = [];
      this.currentColors.forEach((c, index) => {
        if (c.key === e.key) {
          c.value = e.value;
        }
        colorsArr.push(c.value);
      })
      let changeOneColor = {
        key: colorsArr.toString(),
        value: "-webkit-linear-gradient(left," + colorsArr.toString() + ")"
      };
      this.$set(this.heatGradientArr, this.currentColorIndex, changeOneColor);
      colorsArr.unshift("rgba(255,255,255,0)");
      this.$emit("gradientChange", colorsArr);
    },
  }
}
</script>

<style scoped>
.theme-panel {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 300px;
  height: calc((100vh - 64px) - 24px);
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-color: transparent transparent;
  scrollbar-width: thin;
}

.theme-panel-tab {
  width: 100%;
  height: 100%;
}

.theme-panel-loading {
  padding-top: 180px;
}

.theme-panel-type {
  text-align: left;
}

.theme-panel-p {
  margin-top: 0;
  margin-bottom: 0;
  text-align: left;
  padding-left: 5px;
}

.theme-panel .mapgis-ui-row {
  margin-top: 0;
}

.theme-panel-color-picker {
  cursor: pointer;
  display: inline-block;
  width: 10px;
  height: 10px;
}

.theme-panel-color-picker .picker {
  position: absolute;
  top: 2px;
  right: 6px;
}

.theme-panel-color-picker .picker .colorBtn {
  margin-left: 20px;
}

.theme-panel-td {
  position: relative;
  display: inline-block;
  text-align: center;
  width: 10%;
  height: 30px;
  line-height: 2;
}

.theme-panel-td-key {
  width: 35%;
  padding: 0 4px;
  cursor: pointer;
}

.theme-panel-td-value {
  width: 35%;
  cursor: pointer;
}

.theme-panel-td-border-right {
  border-right: 1px solid rgb(217, 217, 217);
}

.theme-panel .mapgis-ui-list-item {
  display: block;
  padding: 0 !important;
  height: 30px;
}

.theme-panel .m-colorPicker {
  margin-top: 6px;
  margin-left: -2px;
}

.theme-panel .mapgis-ui-checkbox-checked {
  margin-top: 3px;
}

.theme-panel-gradient {
  width: 202px;
  height: 15px;
  margin: 8px 0px 0;
  border-radius: 3px;
}

.theme-panel-input-num {
  width: 200px;
}

/deep/ .theme-panel-noflow .mapgis-ui-collapse-content {
  overflow: visible !important;
}

.theme-panel-slider {
  width: 168px;
  margin-left: 7px;
}

.theme-panel-input-number {
  width: 47px;
  margin-left: 0;
  margin-top: 5px;
}

/deep/ .theme-panel-line-color .colorBtn {
  width: 242px !important;
  height: 30px !important;
  margin-left: 3px;
  border-radius: 3px;
  border: 1px solid rgb(218, 218, 218);
}

.theme-panel-type-title {
  border-bottom: 1px solid rgb(228, 228, 228);
  width: 315px;
  height: 26px;
  margin-left: -19px;
  margin-top: -9px;
  padding-left: 24px;
  padding-bottom: 40px;
  font-size: 16px;
}

.theme-panel-title {
  display: inline-block;
}

.theme-panel-title-close {
  display: inline-block;
  color: #40a9ff;
  font-size: 12px;
  position: absolute;
  right: 16px;
  top: 4px;
  cursor: pointer;
}

.theme-panel-list {
  width: 100%;
  height: 480px;
  overflow: hidden;
}

.theme-panel-select {
  width: 242px;
  margin: 7px 0;
}

.theme-panel .mapgis-ui-collapse {
  margin-top: 10px;
}

/deep/ .mapgis-ui-collapse-header {
  text-align: left;
}

/deep/ .mapgis-ui-card-body {
  padding: 24px 4px;
}

.theme-panel-icons {
  position: absolute;
  left: -54px;
  width: 272px;
  height: 200px;
  border: 1px solid rgb(218, 218, 218);
  background: white;
  z-index: 1000;
  border-radius: 4px;
}

.theme-panel-icon {
  float: left;
  margin-left: 1px;
  cursor: pointer;
}

/deep/ .mapgis-ui-tabs-bar {
  margin: 0 0 4px 0;
}

.theme-panel-icon-button {
  position: absolute;
  left: 0;
  top: -2px;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  border: 2px solid rgb(218, 218, 218);
  cursor: pointer;
}

.theme-panel-icon-button-inner {
  position: absolute;
  left: 5px;
  top: 5px;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background: rgb(218, 218, 218);
}

/deep/ .mapgis-ui-collapse-content {
  overflow: visible;
}

.theme-panel-line-zero {
  width: 100%;
  height: 10px;
  margin-top: 10px;
  border-top: 5px solid black;
}

.theme-panel-line-one {
  width: 100%;
  height: 10px;
  margin-top: 10px;
  border-top: 5px dotted black;
}

.theme-panel-line-two {
  width: 100%;
  height: 10px;
  margin-top: 10px;
  border-top: 5px dashed black;
}

.theme-panel-line-three {
  width: 100%;
  height: 20px;
}

.theme-panel-line-long {
  width: 11%;
  height: 10px;
  border-top: 5px solid black;
  margin-right: 2%;
  display: inline-block;
}

.theme-panel-line-short {
  width: 2%;
  height: 10px;
  border-top: 5px solid black;
  margin-right: 2%;
  display: inline-block;
}
</style>