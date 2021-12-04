<template>
  <mapgis-ui-card :style="panelStyle" :class="panelClass" id="theme-panel" v-show="showPanel" class="theme-panel" @click="$_panelClick">
    <!--  专题图面板  -->
    <div class="theme-panel-tab">
      <div v-if="hideItem.indexOf('themeType') < 0" class="theme-panel-head" :style="{height: dataType !== 'circle' ? '154px' : '248px'}">
        <!--标题-->
        <mapgis-ui-row>
          <mapgis-ui-col :span="24" class="theme-panel-type theme-panel-type-title">
            <p class="theme-panel-title" :title="title">{{ title }}</p>
            <p class="theme-panel-title-close" @click="$_close">
              <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABS5JREFUeF7tW02IHEUUfq+a3YNEIx6FDSgevShCBCNxjZrV7Te9HpKLu4J68Adnb+IhEqPoQbxlReNBBbNezMHprp5k438wggHRgx5FIQGPsolLDrt0PalheuyZ7Znu6q7Z7aHTp2H71ffe+7Z+XlV/hbADj5TyIWaeAYB9QoiZ+Dci6r8BM18BgMuIeEUp1ftNRN+POzwch4NWqzWDiAcdxznMzA0AuKWgn2uIGERRdJ6ZLywsLGhyrD7WCFhbW7tta2urCQAHAWDWapT/g30HABempqZW5ubm/rHhwwoBYRg2lVLLiHiXjaCyMJj5DyHESdd1V7Jss96XIkBK+RQiNpl5f5ajcbxHxEvMvEJEnxXFL0SA7/sPCCGOAcDjRR1bbndOKfW253k/muIaEyClfBkA3gGAm0ydjdn+OgC8SkTvmfgxIkBK+REAPGviYBdsPyai5/L6zU2AlPIXALgnL/Au2/1KRPfmiSEXAVJKzgNWNRsiyswv00BKGQAAVS25nPFIItKF2NBnJAFBEDQR8WROZ5U0Y+blRqMxtF4YSoCUcgEAvqhkVuZBPUlErbRmqQT4vn+fEOIrALjV3FclW6wrpR71PO/nwehSCZBSnq1QkWOL0XNE9EQmAbq8BYBVW14rhrM4WDZv6wFhGP60W7X9uMnSewfXde9P+ukjQO/qmHmiZ/0sEhFxObmL7BGg9/Obm5uXdmpLmxXouN7rrfT09PT++DyhR4CU8nUAODEuxxXDPUFEb+iYkgT8AAAHbASKiEejKPrbcZxXmNkrg4mIfhRF7zqOczszf14GK9H2IhE92CMgCII7EPFPS+CzycNMKaUO+khB7DNEdDRuqw9XAUAfi5V+mPnORqPxV6cH+L7/ohDi/dKoAKCUOjB4MFGQhL7ku3Hqg5iLluJ8yfO8DzoEBEHQQsRSXTUOSndZ13V1Gd33GJKwLXkNFoZhq+yQioNiZr/RaCx0CJBS/gsAe2ww28VITSAnCWXamqSwQUQ3o81xNeC9SCJF2pgkPWg7i0EQLCHip2VQRrQ1ScjE1kq4zPy0JuAYIr5lBTEdJE9ieWysh8jMr2EYhqeY+Xnr6P2AoxKE5FKXWPLKLJ+50kHED/Uc0AaAbdvEXAhmRqkkpEHknCzNvKdbn9UE/AYAd9tAy4GRScIOJq/D/V0PgXVm3psjeFsmQ0nY4eQBEa/eIKD2Q6D2k2Dtl8HaF0K1L4VrvxnqboevllBypdUHZWr7Mm1NapVrRLS3cx4QhuFpZl40aT3Ctk1E7uB7wyJnGAkhAMzbiBMRV13XXYqPxBaFEKdtAAshaH5+XgfaewyTj9ttI6HdbrtKKWkjTqXUkud5qx0CtLDRcZzLNoD1ibDrumcs7er6SAjD8Iitk+EoivZp4WXyWPxbiwLHWSHEHqXUCxa6bFsIcUoptWHrRFjjENHD+p9048NI3FVr/2msuxrU9+No3BNq/Xm8WxTVWyDRJaG+EhlNQFcM/WUF9cBFS5XrSqnH0sTUo2RyWhRdWo9fNGLL7ZrDRNQjhZITIo7O4mqkeDqPVHaSRNKDZGSKpjMJ6E6K9RVLJzY1kySazhRJx3nl6gGx8SSIp7PE0YNjxIiA7nDQ6o9PKqgjXgeAZ4aJoofNlMYEdOsELaZ+s0J6Yn1p6niaGDpriShEQGJeqOe1uUFWa3txMklE4ursI7YElyndV0vkvq7c1dnBQLXwkpnnEPEwIh4qoUDbYOZvmPk8Iq5pYWPWmDZ9X2oOyOusytfn/wM8WMoN6jpefQAAAABJRU5ErkJggg=="
                  alt="close">
            </p>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <!--专题图类型-->
        <mapgis-ui-row>
          <div class="theme-panel-img-out" v-for="(type,index) in themeTypeArr"
               :key="index">
            <div :style="{left: index % 3 === 1 ? 40 + 'px' : index % 3 === 2 ? 55 + 'px' : 20 + 'px'}"
                 class="theme-panel-img-border" :class="{themePanelImgOutline: currentThemeType === type.key}">
              <img @click="$_selectThemeType(type.key)" v-if="type.key === 'uniform'" class="theme-panel-img"
                   :src="images[type.key][type.type]"
                   alt="">
              <img @click="$_selectThemeType(type.key)" v-if="type.key === 'unique'" class="theme-panel-img"
                  :src="images[type.key][type.type]"
                   alt="">
              <img @click="$_selectThemeType(type.key)" v-if="type.key === 'range'" class="theme-panel-img"
                  :src="images[type.key][type.type]"
                   alt="">
              <img @click="$_selectThemeType(type.key)" v-if="type.key === 'symbol'" class="theme-panel-img"
                  :src="images[type.key][type.type]"
                   alt="">
              <img @click="$_selectThemeType(type.key)" v-if="type.key === 'heatmap'" class="theme-panel-img"
                  :src="images[type.key][type.type]"
                   alt="">
              <div @click="$_selectThemeType(type.key)" class="theme-panel-img-type">
                {{ type.value }}
              </div>
            </div>
          </div>
        </mapgis-ui-row>
      </div>
      <div class="theme-panel-options">
        <!--字段信息-->
        <mapgis-ui-collapse v-if="hideItem.indexOf('themeField') < 0" accordion>
          <mapgis-ui-collapse-panel key="2" header="字段信息">
            <mapgis-ui-row>
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p">字段</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <mapgis-ui-select
                    :getPopupContainer="$_popupContainer"
                    v-if="fields.length > 0"
                    v-model="selectField"
                    @change="$_selectFieldChange"
                    class="theme-panel-select"
                >
                  <mapgis-ui-select-option v-for="(Field,index) in fields" :key="index" :value="Field">{{ Field }}
                  </mapgis-ui-select-option>
                </mapgis-ui-select>
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-collapse-panel>
        </mapgis-ui-collapse>
        <!--符号-->
        <mapgis-ui-collapse accordion v-if="currentThemeType === 'heatmap'">
          <mapgis-ui-collapse-panel key="3" header="热点">
            <mapgis-ui-row>
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p" style="margin-top: 5px;">热点颜色</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="16">
                <mapgis-ui-col :span="25">
                  <mapgis-ui-select
                      :getPopupContainer="$_popupContainer"
                      v-model="heatmapGradient"
                      @change="$_heatGradientChange"
                      style="width: 155px;margin-left: -3px;"
                  >
                    <mapgis-ui-select-option v-for="(gradient,index) in heatGradientArr" :key="index" :value="index">
                      <div :style="{background: gradient.value}" class="theme-panel-gradient"></div>
                    </mapgis-ui-select-option>
                  </mapgis-ui-select>
                </mapgis-ui-col>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row>
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p" style="margin-top: 0.8em">透明度</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider class="theme-panel-slider" v-model="heatmapOpacity"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number class="theme-panel-input-number" v-model="heatmapOpacity"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row>
              <mapgis-ui-col :span="12">
                <p class="theme-panel-p">热力半径</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-input-number
                    v-model="heatmapRadius"
                    class="theme-panel-input-radius"
                    style="margin-top: 5px"
                />
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-collapse-panel>
        </mapgis-ui-collapse>
        <mapgis-ui-collapse v-if="currentThemeType !== 'heatmap'">
          <mapgis-ui-collapse-panel :forceRender="forceRender" key="3" header="符号">
            <mapgis-ui-row v-if="currentThemeType === 'symbol'">
              <mapgis-ui-col :span="8">
                <p style="margin-top: 0" class="theme-panel-p">图标</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="16">
                <mapgis-ui-svg-select
                    ref="svg"
                    :icons="icons"
                    :defaultIcon="iconUrl"
                    @change="$_clickIcon"
                ></mapgis-ui-svg-select>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'circle' && currentThemeType === 'uniform'">
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p">颜色</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <div class="theme-panel-color-outer">
                  <colorPicker
                      class="picker theme-panel-line-color"
                      v-model="uniformColor"
                      @change="$_uniformColorChange"
                  />
                </div>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row
                v-if="dataType === 'circle' && currentThemeType !== 'symbol' && currentThemeType !== 'uniform'">
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p" style="margin-top: 5px">渐变颜色</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <mapgis-ui-select
                    :getPopupContainer="$_popupContainer"
                    v-model="gradientColor"
                    @change="$_gradientChange"
                    style="width: 155px;margin-left: -12px;"
                >
                  <mapgis-ui-select-option v-for="(gradient,index) in gradientArr" :key="index" :value="gradient.key">
                    <div class="theme-panel-gradient" :style="{background: gradient.value}"></div>
                  </mapgis-ui-select-option>
                </mapgis-ui-select>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'circle' && currentThemeType !== 'symbol'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p" style="margin-top: 0.8em">透明度</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider class="theme-panel-slider" v-model="circleOpacity"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number class="theme-panel-input-number" v-model="circleOpacity"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'circle' && currentThemeType === 'symbol'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p" style="margin-top: 0.8em">透明度</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider class="theme-panel-slider" v-model="iconOpacity"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number class="theme-panel-input-number" v-model="iconOpacity"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'circle' && currentThemeType !== 'symbol'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">半径</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="0"
                    :max="radiusMax"
                    :step="radiusStep"
                    class="theme-panel-slider"
                    v-model="circleRadius"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="0"
                    :max="radiusMax"
                    :step="radiusStep"
                    class="theme-panel-input-number"
                    v-model="circleRadius"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'circle' && currentThemeType !== 'symbol'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">x轴偏移</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="xOffsetMin"
                    :max="xOffsetMax"
                    :step="xOffsetStep"
                    class="theme-panel-slider"
                    v-model="circleTranslateX"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="xOffsetMin"
                    :max="xOffsetMax"
                    :step="xOffsetStep"
                    class="theme-panel-input-number"
                    v-model="circleTranslateX"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'circle' && currentThemeType === 'symbol'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">x轴偏移</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="iconTranslateXMin"
                    :max="iconTranslateXMax"
                    :step="iconTranslateXStep"
                    class="theme-panel-slider"
                    v-model="iconTranslateX"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="iconTranslateXMin"
                    :max="iconTranslateXMax"
                    :step="iconTranslateXStep"
                    class="theme-panel-input-number"
                    v-model="iconTranslateX"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'circle' && currentThemeType !== 'symbol'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">y轴偏移</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="yOffsetMin"
                    :max="yOffsetMax"
                    :step="yOffsetStep"
                    class="theme-panel-slider"
                    v-model="circleTranslateY"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="yOffsetMin"
                    :max="yOffsetMax"
                    :step="yOffsetStep"
                    class="theme-panel-input-number"
                    v-model="circleTranslateY"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'circle' && currentThemeType === 'symbol'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">y轴偏移</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="iconTranslateYMin"
                    :max="iconTranslateYMax"
                    :step="iconTranslateYStep"
                    class="theme-panel-slider"
                    v-model="iconTranslateY"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="iconTranslateYMin"
                    :max="iconTranslateYMax"
                    :step="iconTranslateYStep"
                    class="theme-panel-input-number"
                    v-model="iconTranslateY"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'circle' && currentThemeType !== 'symbol'">
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p">边线颜色</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <div class="theme-panel-color-outer">
                  <colorPicker
                      class="picker theme-panel-line-color"
                      v-model="circleStrokeColor"
                      @change="$_outerLineColorChange"
                  />
                </div>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'circle' && currentThemeType !== 'symbol'">
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p">边线宽度</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="11">
                <mapgis-ui-slider
                    :min="0"
                    :max="circleStrokeWidthMax"
                    :step="circleStrokeWidthStep"
                    class="theme-panel-slider"
                    style="margin-left: -8px;"
                    v-model="circleStrokeWidth"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="0"
                    :max="circleStrokeWidthMax"
                    :step="circleStrokeWidthStep"
                    class="theme-panel-input-number"
                    v-model="circleStrokeWidth"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'circle' && currentThemeType !== 'symbol'">
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p" style="margin-top: 0.8em">边线透明度</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="11">
                <mapgis-ui-slider
                    class="theme-panel-slider"
                    v-model="circleStrokeOpacity"
                    style="margin-left: -8px;"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number class="theme-panel-input-number" v-model="circleStrokeOpacity"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'line'">
              <mapgis-ui-col :span="8">
                <p style="margin-top: 0" class="theme-panel-p">填充图案</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="16">
                <mapgis-ui-svg-select
                    ref="wenli"
                    :icons="icons"
                    @change="$_clickWenliIcon"
                ></mapgis-ui-svg-select>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'line' && currentThemeType === 'uniform'">
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p">颜色</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <div class="theme-panel-color-outer">
                  <colorPicker
                      class="picker theme-panel-line-color"
                      v-model="uniformColor"
                      @change="$_uniformColorChange"
                  />
                </div>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'line' && currentThemeType !== 'uniform'">
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p" style="margin-top: 5px">渐变颜色</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <mapgis-ui-select
                    :getPopupContainer="$_popupContainer"
                    v-model="gradientColor"
                    @change="$_gradientChange"
                    style="width: 155px;margin-left: -12px;"
                >
                  <mapgis-ui-select-option v-for="(gradient,index) in gradientArr" :key="index" :value="gradient.key">
                    <div class="theme-panel-gradient" :style="{background: gradient.value}"></div>
                  </mapgis-ui-select-option>
                </mapgis-ui-select>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'line'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p" style="margin-top: 0.8em">透明度</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider class="theme-panel-slider" v-model="lineOpacity"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number class="theme-panel-input-number" v-model="lineOpacity"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'line'">
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p">线宽度</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="11">
                <mapgis-ui-slider
                    :min="0"
                    :max="lineWidthMax"
                    :step="lineWidthStep"
                    class="theme-panel-slider"
                    style="margin-left: -8px;"
                    v-model="lineWidth"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="0"
                    :max="lineWidthMax"
                    :step="lineWidthStep"
                    class="theme-panel-input-number"
                    v-model="lineWidth"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'line'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">x轴偏移</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="lineTranslateXMin"
                    :max="lineTranslateXMax"
                    :step="lineTranslateXStep"
                    class="theme-panel-slider"
                    v-model="lineTranslateX"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="lineTranslateXMin"
                    :max="lineTranslateXMax"
                    :step="lineTranslateXStep"
                    class="theme-panel-input-number"
                    v-model="lineTranslateX"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'line'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">y轴偏移</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="lineTranslateYMin"
                    :max="lineTranslateYMax"
                    :step="lineTranslateYStep"
                    class="theme-panel-slider"
                    v-model="lineTranslateY"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="lineTranslateYMin"
                    :max="lineTranslateYMax"
                    :step="lineTranslateYStep"
                    class="theme-panel-input-number"
                    v-model="lineTranslateY"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'fill'">
              <mapgis-ui-col :span="8">
                <p style="margin-top: 0" class="theme-panel-p">填充图案</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="16">
                <mapgis-ui-svg-select
                    ref="wenli"
                    :icons="icons"
                    @change="$_clickWenliIcon"
                ></mapgis-ui-svg-select>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'fill' && currentThemeType === 'uniform'">
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p">颜色</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <div class="theme-panel-color-outer">
                  <colorPicker
                      class="picker theme-panel-line-color"
                      v-model="uniformColor"
                      @change="$_uniformColorChange"
                  />
                </div>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'fill' && currentThemeType !== 'uniform'">
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p" style="margin-top: 5px">渐变颜色</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <mapgis-ui-select
                    :getPopupContainer="$_popupContainer"
                    v-model="gradientColor"
                    @change="$_gradientChange"
                    style="width: 155px;margin-left: -12px;"
                >
                  <mapgis-ui-select-option v-for="(gradient,index) in gradientArr" :key="index" :value="gradient.key">
                    <div class="theme-panel-gradient" :style="{background: gradient.value}"></div>
                  </mapgis-ui-select-option>
                </mapgis-ui-select>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'fill'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p" style="margin-top: 0.8em">透明度</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider class="theme-panel-slider" v-model="fillOpacity"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number class="theme-panel-input-number" v-model="fillOpacity"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'fill'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">x轴偏移</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="fillTranslateXMin"
                    :max="fillTranslateXMax"
                    :step="fillTranslateXStep"
                    class="theme-panel-slider"
                    v-model="fillTranslateX"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="fillTranslateXMin"
                    :max="fillTranslateXMax"
                    :step="fillTranslateXStep"
                    class="theme-panel-input-number"
                    v-model="fillTranslateX"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'fill'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">y轴偏移</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="fillTranslateYMin"
                    :max="fillTranslateYMax"
                    :step="fillTranslateYStep"
                    class="theme-panel-slider"
                    v-model="fillTranslateY"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="fillTranslateYMin"
                    :max="fillTranslateYMax"
                    :step="fillTranslateYStep"
                    class="theme-panel-input-number"
                    v-model="fillTranslateY"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'fill'">
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p" style="margin-top: 14px">边线颜色</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <div class="theme-panel-color-outer">
                  <colorPicker
                      class="picker theme-panel-line-color"
                      v-model="fillOutlineColor"
                      @change="$_fillOutlineColorChange"
                  />
                </div>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'fill'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p" style="margin-top: 0.8em">边线透明度</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider class="theme-panel-slider" v-model="fillOutlineOpacity"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number class="theme-panel-input-number" v-model="fillOutlineOpacity"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType === 'fill'">
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p">边线宽度</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="11">
                <mapgis-ui-slider
                    :min="0"
                    :max="fillOutlineWidthMax"
                    :step="fillOutlineWidthStep"
                    class="theme-panel-slider"
                    style="margin-left: -8px;"
                    v-model="fillOutlineWidth"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="0"
                    :max="fillOutlineWidthMax"
                    :step="fillOutlineWidthStep"
                    class="theme-panel-input-number"
                    v-model="fillOutlineWidth"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-collapse-panel>
        </mapgis-ui-collapse>
        <!--自定义-->
        <mapgis-ui-collapse accordion v-if="currentThemeType === 'heatmap'">
          <mapgis-ui-collapse-panel key="4" header="自定义">
            <mapgis-ui-row v-for="(color,index) in heatmapColors" :key="index">
              <mapgis-ui-row>
                <mapgis-ui-col :span="9">
                  <p class="theme-panel-p">颜色{{ index }}</p>
                </mapgis-ui-col>
                <mapgis-ui-col :span="15">
                  <div class="theme-panel-color-outer">
                    <colorPicker
                        v-model="color.value"
                        class="picker theme-panel-line-color"
                        @change="$_selectColor(color)"
                    />
                  </div>
                </mapgis-ui-col>
              </mapgis-ui-row>
            </mapgis-ui-row>
          </mapgis-ui-collapse-panel>
        </mapgis-ui-collapse>
        <!--标签-->
        <mapgis-ui-collapse accordion v-if="currentThemeType !== 'heatmap'">
          <mapgis-ui-collapse-panel key="7" header="标签">
            <mapgis-ui-row>
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p">显示字段</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <mapgis-ui-select
                    :getPopupContainer="$_popupContainer"
                    class="theme-panel-select"
                    v-model="textField"
                    @change="$_selectLabelTextChange"
                >
                  <mapgis-ui-select-option v-for="(Field,index) in labelFields" :key="index" :value="Field">
                    {{ Field }}
                  </mapgis-ui-select-option>
                </mapgis-ui-select>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row>
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p">字体颜色</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <div class="theme-panel-color-outer">
                  <colorPicker
                      class="picker theme-panel-line-color"
                      v-model="textColor"
                      @change="$_selectLabelTextColor"
                  />
                </div>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row>
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p">描边颜色</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <div class="theme-panel-color-outer">
                  <colorPicker
                      class="picker theme-panel-line-color"
                      v-model="textHaloColor"
                      @change="$_selectLabelHaloColor"
                  />
                </div>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row>
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p" style="margin-top: 0.8em">描边宽度</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="0"
                    :max="textHaloWidthMax"
                    :step="textHaloWidthStep"
                    class="theme-panel-slider"
                    v-model="textHaloWidth"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number class="theme-panel-input-number" v-model="textHaloWidth"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row>
              <mapgis-ui-col :span="9">
                <p class="theme-panel-p">字体</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="15">
                <mapgis-ui-select
                    :getPopupContainer="$_popupContainer"
                    v-model="textFont"
                    class="theme-panel-select"
                    @change="$_labelTextFontChanged"
                >
                  <mapgis-ui-select-option v-for="(font,index) in textFonts" :key="index" :value="font">
                    {{ font }}
                  </mapgis-ui-select-option>
                </mapgis-ui-select>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row>
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p" style="margin-top: 0.8em">字体大小</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="1"
                    :max="textSizeMax"
                    :step="textSizeStep"
                    class="theme-panel-slider"
                    v-model="textSize"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="1"
                    :max="textSizeMax"
                    :step="textSizeStep"
                    class="theme-panel-input-number"
                    v-model="textSize"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType !== 'line'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">x轴偏移</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="textOffsetXMin"
                    :max="textOffsetXMax"
                    :step="textOffsetXStep"
                    class="theme-panel-slider"
                    v-model="textOffsetX"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="textOffsetXMin"
                    :max="textOffsetXMax"
                    :step="textOffsetXStep"
                    class="theme-panel-input-number"
                    v-model="textOffsetX"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType !== 'line'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">y轴偏移</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="textOffsetYMin"
                    :max="textOffsetYMax"
                    :step="textOffsetYStep"
                    class="theme-panel-slider"
                    v-model="textOffsetY"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="textOffsetYMin"
                    :max="textOffsetYMax"
                    :step="textOffsetYStep"
                    class="theme-panel-input-number"
                    v-model="textOffsetY"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row>
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">文字间距</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="0"
                    :max="textLetterSpacingMax"
                    :step="textLetterSpacingStep"
                    class="theme-panel-slider"
                    v-model="textLetterSpacing"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="0"
                    :max="textLetterSpacingMax"
                    :step="textLetterSpacingStep"
                    class="theme-panel-input-number"
                    v-model="textLetterSpacing"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="dataType !== 'line'">
              <mapgis-ui-col :span="8">
                <p class="theme-panel-p">旋转角度</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="12">
                <mapgis-ui-slider
                    :min="0"
                    :max="360"
                    :step="textRotateStep"
                    class="theme-panel-slider"
                    v-model="textRotate"/>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    :min="0"
                    :max="360"
                    :step="textRotateStep"
                    class="theme-panel-input-number"
                    v-model="textRotate"/>
              </mapgis-ui-col>
            </mapgis-ui-row>
          </mapgis-ui-collapse-panel>
        </mapgis-ui-collapse>
        <mapgis-ui-collapse accordion v-if="currentThemeType !== 'heatmap' && currentThemeType !== 'uniform'">
          <mapgis-ui-collapse-panel key="8" header="分段值" :forceRender="true">
            <mapgis-ui-row v-if="currentThemeType === 'unique'">
              <div :id="listId"
                   :style="{overflowY:scroll}"
                   style="overflow-x: hidden;height: 392px"
                   @mouseover="$_mouseover"
                   @mouseleave="$_mouseleave"
              >
                <div class="theme-panel-list-symbol" style="height: 32px" v-for="(item,index) in dataSourceUnique"
                     :key="index"
                     :class="{panelListFirst: index === 0,panelListLast: index === dataSource.length - 1}">
                  <div class="range-theme-list-item">
                    <div class="theme-panel-td theme-panel-td-border-right">
                      {{ index }}
                    </div>
                    <div class="theme-panel-td theme-panel-td-border-right" v-if="dataType !== 'symbol'">
                      <mapgis-ui-checkbox
                          :value="{item:item,color:colors[index]}"
                          :color="colors[index]"
                          :checked="checkBoxArr[index]"
                          @change="$_checked">
                      </mapgis-ui-checkbox>
                    </div>
                    <div class="theme-panel-td theme-panel-td-border-right" v-if="dataType !== 'symbol'">
                      <div class="theme-panel-color-picker">
                        <colorPicker class="picker" v-model="colors[index]" v-on:change="$_changeColor(index)"/>
                      </div>
                    </div>
                    <div class="theme-panel-td theme-panel-td-key theme-panel-td-border-right"
                         v-bind:title="selectField" :style="{width: dataType !== 'symbol' ? '35%' : '45%'}">
                      {{
                        $_editStr(selectField, 8)
                      }}
                    </div>
                    <div class="theme-panel-td theme-panel-td-value" v-bind:title="item"
                         :style="{width: dataType !== 'symbol' ? '35%' : '45%'}">
                      {{
                        $_editStr(item, 8)
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="currentThemeType === 'symbol'">
              <div class="theme-panel-list-symbol" v-for="(data,index) in dataSource" :key="index"
                   :class="{panelListFirst: index === 0,panelListLast: index === dataSource.length - 1}">
                <div class="range-theme-list-item">
                  <div class="theme-panel-td theme-panel-td-symbol theme-panel-td-border-right theme-panel-td-index">
                    {{ index }}
                  </div>
                  <div class="theme-panel-td theme-panel-td-symbol theme-panel-td-border-right">
                    <div class="theme-panel-radius-out" @click="$_showRadius(index)">
                      <div class="theme-panel-radius"
                           :style="{width: 20 - (10 / dataSource.length) * (dataSource.length - index) + 'px',height: 20 - (10 / dataSource.length) * (dataSource.length - index) + 'px',marginTop: (10 / dataSource.length) * (dataSource.length - index) / 2 + 'px',marginLeft: (10 / dataSource.length) * (dataSource.length - index) / 2 + 'px'}"/>
                    </div>
                  </div>
                  <div class="theme-panel-td theme-panel-td-symbol theme-panel-td-input-num" style="padding-top: 4px">
                    <img alt="数据错误" class="theme-panel-input-wrong" v-if="index > 0 && (index - 1) === numWrong"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAypJREFUeF7tmc9LlEEYx7/zuu+7JkFhRWU6Glg7mwRBEYFBRSJaHToUgRBEQUQEHTrUIUwPQRFE0CE8RBFEYHQoKQOLIuwQBV7SfTczc3YT+iVBkO686zux2GFb3teb8y7zvu8fsPN8PvN9ZucHQcg/EnJ+RAKiBITcQNQCIQ9AtAhGLRC1QMgNRC0QRACGGrC0UpqdhiStEpghQN/vvLiyZRJ/VNejPAEfaxbV5WOzjwBsKoaVwJBpirbGMXxTKUG5gHSdeV0ScsoH8gHj4oDWAmxq2QASXpAS8muSO6t0FyDnAZxmXFTpLuAngGofyEnGxRqtBaSoNUqARh/I94yLjVoLsKn1BsBWL0gC8irBczv0FlBn9YOgzQfyIeNiv+4C7oKgwxOS4BabEEe1FjDfPkBKeTWZcc5oLSBFrW4CdHpCSpxnGXFRawE2jZ8G5DVvAfIkyzg3tBaQpuZhCXLHcyco0ZHMiHtaC/hA4/tcyD5PSJe0s2zuqdYCbBprBoxBL0jDldvWZ53CPkHZp/w0OEqtDbPAsCdhBWFsPJdWRg+ovxX+XF+1ekbmJ70gY6ZYqf19wHgDKnOuNe0lYHaxiDeNQGidgAKcTa1fAJaUgE4xLpaphC+MpXwN+CfgE4C1JbBjjAu/U+KCeQlKwDsAm0uo3jIuPE+JC0YfVAJS1BwgIC3FYBJyIMmd1oWE9frtoBLQC+BgSUG9jItDoRCQpvEeCXn8f1jSw3juRCgE2NS6BOBsCexlxsW5UAhI08rdEu6zYlgCoyXBZ56HQkABMk2tC0XrwP0EF92q4QPbBwQB6jdmIP8CkYAyMhAlIIjJsOvNY5DGEUh37pGUGGkQ9zabcG6qrkd5AlK1sZ3EMF54gUrX3ZXM5l+qlKBcgE3jg4Bs9oYkrxnPbddcgPkdIMu9IeUPxp0VmguwvgCo8YHU/3ncptZjAHt8BDxhXOzVOgHz3QpXAE3ruBjRWkABbrgW1YZhdgGkfQ5W9ruu09WUxZRK+OgsENSVmOpZnm885fuAcoKPWiBqgYAeRsqpDaI1oJxmI4haogQEYb2cxowSUE6zEUQtfwEJOe5BvxJGeQAAAABJRU5ErkJggg=="/>
                    <mapgis-ui-input v-if="dataSource.length === 1 || (dataSource.length > 1 && index === 0)"
                                     class="range-theme-num"
                                     @click="$_inputClick('start')"
                                     v-model="startData"
                                     v-bind:title="startData"
                    >
                    </mapgis-ui-input>
                    <mapgis-ui-input v-if="index > 0" class="range-theme-num"
                                     @click="$_inputClick(index - 1)"
                                     v-model="dataSource[index - 1]"
                                     v-bind:title="dataSource[index - 1]"
                    >
                    </mapgis-ui-input>
                  </div>
                  <div class="theme-panel-td theme-panel-td-symbol" style="width: 3%">
                    ~
                  </div>
                  <div
                      class="theme-panel-td theme-panel-td-symbol theme-panel-td-input-num theme-panel-td-border-right"
                      style="padding-top: 4px">
                    <img alt="数据错误" class="theme-panel-input-wrong"
                         v-if="index < dataSource.length - 1 && dataSource.length > 1 && index === numWrong"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAypJREFUeF7tmc9LlEEYx7/zuu+7JkFhRWU6Glg7mwRBEYFBRSJaHToUgRBEQUQEHTrUIUwPQRFE0CE8RBFEYHQoKQOLIuwQBV7SfTczc3YT+iVBkO686zux2GFb3teb8y7zvu8fsPN8PvN9ZucHQcg/EnJ+RAKiBITcQNQCIQ9AtAhGLRC1QMgNRC0QRACGGrC0UpqdhiStEpghQN/vvLiyZRJ/VNejPAEfaxbV5WOzjwBsKoaVwJBpirbGMXxTKUG5gHSdeV0ScsoH8gHj4oDWAmxq2QASXpAS8muSO6t0FyDnAZxmXFTpLuAngGofyEnGxRqtBaSoNUqARh/I94yLjVoLsKn1BsBWL0gC8irBczv0FlBn9YOgzQfyIeNiv+4C7oKgwxOS4BabEEe1FjDfPkBKeTWZcc5oLSBFrW4CdHpCSpxnGXFRawE2jZ8G5DVvAfIkyzg3tBaQpuZhCXLHcyco0ZHMiHtaC/hA4/tcyD5PSJe0s2zuqdYCbBprBoxBL0jDldvWZ53CPkHZp/w0OEqtDbPAsCdhBWFsPJdWRg+ovxX+XF+1ekbmJ70gY6ZYqf19wHgDKnOuNe0lYHaxiDeNQGidgAKcTa1fAJaUgE4xLpaphC+MpXwN+CfgE4C1JbBjjAu/U+KCeQlKwDsAm0uo3jIuPE+JC0YfVAJS1BwgIC3FYBJyIMmd1oWE9frtoBLQC+BgSUG9jItDoRCQpvEeCXn8f1jSw3juRCgE2NS6BOBsCexlxsW5UAhI08rdEu6zYlgCoyXBZ56HQkABMk2tC0XrwP0EF92q4QPbBwQB6jdmIP8CkYAyMhAlIIjJsOvNY5DGEUh37pGUGGkQ9zabcG6qrkd5AlK1sZ3EMF54gUrX3ZXM5l+qlKBcgE3jg4Bs9oYkrxnPbddcgPkdIMu9IeUPxp0VmguwvgCo8YHU/3ncptZjAHt8BDxhXOzVOgHz3QpXAE3ruBjRWkABbrgW1YZhdgGkfQ5W9ruu09WUxZRK+OgsENSVmOpZnm885fuAcoKPWiBqgYAeRsqpDaI1oJxmI4haogQEYb2cxowSUE6zEUQtfwEJOe5BvxJGeQAAAABJRU5ErkJggg=="/>
                    <img alt="数据错误" class="theme-panel-input-wrong"
                         v-if="index === dataSource.length - 1 && dataSource.length > 1 && endNumWrong"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAypJREFUeF7tmc9LlEEYx7/zuu+7JkFhRWU6Glg7mwRBEYFBRSJaHToUgRBEQUQEHTrUIUwPQRFE0CE8RBFEYHQoKQOLIuwQBV7SfTczc3YT+iVBkO686zux2GFb3teb8y7zvu8fsPN8PvN9ZucHQcg/EnJ+RAKiBITcQNQCIQ9AtAhGLRC1QMgNRC0QRACGGrC0UpqdhiStEpghQN/vvLiyZRJ/VNejPAEfaxbV5WOzjwBsKoaVwJBpirbGMXxTKUG5gHSdeV0ScsoH8gHj4oDWAmxq2QASXpAS8muSO6t0FyDnAZxmXFTpLuAngGofyEnGxRqtBaSoNUqARh/I94yLjVoLsKn1BsBWL0gC8irBczv0FlBn9YOgzQfyIeNiv+4C7oKgwxOS4BabEEe1FjDfPkBKeTWZcc5oLSBFrW4CdHpCSpxnGXFRawE2jZ8G5DVvAfIkyzg3tBaQpuZhCXLHcyco0ZHMiHtaC/hA4/tcyD5PSJe0s2zuqdYCbBprBoxBL0jDldvWZ53CPkHZp/w0OEqtDbPAsCdhBWFsPJdWRg+ovxX+XF+1ekbmJ70gY6ZYqf19wHgDKnOuNe0lYHaxiDeNQGidgAKcTa1fAJaUgE4xLpaphC+MpXwN+CfgE4C1JbBjjAu/U+KCeQlKwDsAm0uo3jIuPE+JC0YfVAJS1BwgIC3FYBJyIMmd1oWE9frtoBLQC+BgSUG9jItDoRCQpvEeCXn8f1jSw3juRCgE2NS6BOBsCexlxsW5UAhI08rdEu6zYlgCoyXBZ56HQkABMk2tC0XrwP0EF92q4QPbBwQB6jdmIP8CkYAyMhAlIIjJsOvNY5DGEUh37pGUGGkQ9zabcG6qrkd5AlK1sZ3EMF54gUrX3ZXM5l+qlKBcgE3jg4Bs9oYkrxnPbddcgPkdIMu9IeUPxp0VmguwvgCo8YHU/3ncptZjAHt8BDxhXOzVOgHz3QpXAE3ruBjRWkABbrgW1YZhdgGkfQ5W9ruu09WUxZRK+OgsENSVmOpZnm885fuAcoKPWiBqgYAeRsqpDaI1oJxmI4haogQEYb2cxowSUE6zEUQtfwEJOe5BvxJGeQAAAABJRU5ErkJggg=="/>
                    <mapgis-ui-input class="range-theme-num"
                                     @click="$_inputClick(index)"
                                     v-model="dataSource[index]"
                                     v-if="index < dataSource.length && dataSource.length >= 1"
                                     v-bind:title="dataSource[index]"
                    >
                    </mapgis-ui-input>
                  </div>
                  <div class="theme-panel-td theme-panel-td-symbol theme-panel-td-add theme-panel-td-border-right"
                       @click="$_addSymbolRange(index)" v-if="dataSource.length > 1">
                    <img class="theme-panel-img-add"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABEZJREFUWEe1V01sVUUU/s68vtomxY2BWMVEEwNRU9/rzLxdVVi4EAjGRdlIVARd4EZAILIBE6PBqDX4kxjE/7iAhbHiT2IMGOvGzkxfjaXWhXHhT6CykSZN2r45Zl7ufbnvcu/70Xo3792ZM9/57jlnvjlD6PJxzq313t8khFgP4GZmvgbAvBDiEjNPSinnu4GkTowjp6NCiFFm3tRqDTN/BuDzYrE4XiqVfmuH35JAcMzMxwCMAljbDiw1fxnA+0T0npRyOm9tLoHJyclNQoiTAG7t0nGW+T6l1CtZE5kEjDF7iej19AIi+sp7P0tEF4hoFsCs956ZeWOhUNgYfoko/N6f4eyYUuqZqzDTA9baRwC8kxwnoovM/KxS6rVOomGM2UNEJwD0p+x3KaXebcJOvhhjRonodGrRB729vQeHhoYupp2HGgljWZVvjBkkoi8B3Jlcx8w7tNZn4rFGCpxzJWauppxkhi3YGGMOENHh8J+Zj2utX8qKjrX2KIBQyI2HiMpxYTYIWGtfBrAvYTeulMrKZd3EOXcu3pJEdF5KuTkvPc6555j56cT8mFJqf3ivE5ienl6/srISvv666IvC/r1Xa/1TC9COCQQMa60BoCK8yz09PeWgE3UC1tqDAF6InTHzg1rrj1oVXDcRiHw8DuDNBOZ+pdRYTOB7AJVo8lOl1PZWzrtNQYxljPmFiG6phz5KGznnbmfmmaz8rGYEItInmXlPjNvX1zcYCGxn5k8S4X9Ca/3G/xGBSF3PxdhCiK2BwKPMfCoe9N5vrlQq56O87SSi3Xlkkrughc0ppdSHYb5arW6o1WpzCdtdZK09BOB4PEhE64KwVKvVG2u1WpDbNe2i0Wb+SqFQuK1cLv8+MTGxpr+//++E/aFAoGkHLC4uXjsyMnIlOglDbXR7Cqb5zBPRHeGj8gg0aX84VMrl8s8BJaidEGLbf0mB9/5srJKZKZiamtrivQ9NRP1J1sBq74K8IgxNx6XELngqT9eThLoVomgbvsjMB5L1VhciY8xZItoaCcQZKeWOdoX3bwgYY+aIaEPADq2b1npbTKCpASGiLVLKL1YzBdbaJilm5rreZB5GAL5VSt29ygTyD6NIdJqOYyJqmYpuUuCcO83MobGNn+bjOCqQrhoSa+1OALFk743VLh21jhuSKApPAhhLghDR81LKI1npCGoZxoPKZc1nNCKh+B7TWr/V2AmdMA41ERFpWZgxlnPuvqgDuiuFf1gp1eg76rsui3lWZxzZfRwaKO/9N8Vi8Y+FhYU/w/jAwMDg8vLyDUKIewCUADyQwv0rHGpSyvG0v9yLSU6H3E4erppn5jlm3l2pVL7LWtzuahYK82EAD8X9YhcMFgG8WigUTuTVSG4K0k6ipjXcGULz0u5y+iMRfQ3gbaXUD+0Id3Q7ToLMzMxcv7S0JL336xJHdf16DuDC8PDwr+2cJuf/AZGKXgkO+31+AAAAAElFTkSuQmCC"
                         alt="新增分段">
                  </div>
                  <div class="theme-panel-td theme-panel-td-symbol theme-panel-td-delete"
                       @click="$_deleteSymbolRange(index)" v-if="dataSource.length > 1">
                    <img class="theme-panel-img-add"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA7lJREFUWEfFV02MFEUU/l737GGJSIzIBXCBgwknd7qK2T2sXOCKikYhKMarJGtI9OJP5CeAF0kIG+BqFAgL/nLGi+5hd6zXs55MPAiiXgBDlkXmsNP9SE26NzU93Ts725tQSV+q3qvv66qv6n1FWGabmppaOzg4uBvAPgAviMh6InrWpovIf0R0D8AfACabzeaNsbGx+eVMTb2CmHk7EY2LyH4Az/SKT8bvE9EVEZlQSv2+VM6SBJj5BIBxAE8vEzgb9gCAJfFpUX4hAWb+GcBLKwTOpv2ilNqZN1cuAWa+C2B9NkFE5omo7ny/JhrYISK19COitTlg95RSz2X7uwgw800AW3ImuNhqtT4bGRmx44VtZmZma6VSOQ7g7ZygW0qprW5/B4EwDK+KyBuZRLsa40qpyX62g5ntaZkA0PHXRHQtCII307kWCSSC+yQDclQpdawf4GwsMx8BcDTTfzIVZpuAPWoApl21i8hNrfW2MuBprjHmTyJyl96ejlF7RNsEwjA8LyLvuWBRFNVqtVpbZGVbvV7f4ft+vWPviS4EQXCIjDHriOgvAOvSABE5rbX+sCywm2+M+YKIPnD65kRkiMIwPCgiXzkDDxcWFraPjo7+s5oEpqenNw0MDNhb8alFARK9Q8z8DYDXHbDCS6MsoZzL7VtLIARQdZZ/Qmv9flmwvHxjzFlbV5yxhtXAbSLa7BB4S2t9udFobInj2B6hd0uSuaSUal9KxpgDRHTJwfrbrsD/ANY4nUNa69vMfA7AoZLgaXr7PjHGPJ8IPu1/1EXA9/1Nw8PD/xZcICvl0yYwOzu7MYoiV9yPurbA87y91Wr1B4vEzNcB7FkpapL3ped5x6rV6q1Go/FqHMffZ7egQ4RE9HkQBB+XBM1ND8PwlIh81CFCZr6S2Ky0/yellLVeq96Y+QaAXc7Ek1YDewF85yzLfBRFL/Yqu/2ys2Xa9/3fMl7hNUrMpr2KXb93USl1sF+QpeKZ+euMR7jfbDaHCosRgP39eoAiAok3sFu92CgtRonau8oxgLtKqQ2rsQrMfCdjTDrLcULCOuAnY0jSv8xzwtaYxHG8r19vYD2A53mTGSNioTqKXZ4pLXLEp1ut1pleZdqW3UqlcjhT+9N/7HLGRba8yBk/BNAQkdnEwk0lM49Zi0VEw0llXaz5joa6HLEdK3yYFDjkFWky64Q7TkOPs/vknmaOMNPH6QHXN/ZYijkiulz6ceqCWPPqed7LIvIKgG0Fz3Nrv3+M4/i61npuOfv1GEgrvUth6rD9AAAAAElFTkSuQmCC"
                         alt="删除分段">
                  </div>
                </div>
                <div class="range-theme-list-item" style="border-top: 1px solid rgb(93, 93, 93)"
                     v-if="radiusIndex === index">
                  <mapgis-ui-row style="margin-top: 0">
                    <mapgis-ui-col :span="5">
                      <p class="theme-panel-icon-title">半径</p>
                    </mapgis-ui-col>
                    <mapgis-ui-col :span="12">
                      <mapgis-ui-slider
                          style="width: 97px"
                          :min="0"
                          :max="20"
                          v-model="radiusArr[index]"
                          class="theme-panel-slider theme-panel-icon-slider"
                      />
                    </mapgis-ui-col>
                    <mapgis-ui-col :span="5">
                      <mapgis-ui-input-number
                          v-model="radiusArr[index]"
                          style="margin-left: 2px"
                          class="theme-panel-input-number theme-panel-input-icon-number"/>
                    </mapgis-ui-col>
                  </mapgis-ui-row>
                </div>
<!--                <div class="range-theme-list-item" style="border-top: 1px solid rgb(93, 93, 93)"-->
<!--                     v-if="radiusIndex === index">-->
<!--                  <mapgis-ui-row style="margin-top: 0">-->
<!--                    <mapgis-ui-col :span="5">-->
<!--                      <p class="theme-panel-icon-title">X偏移</p>-->
<!--                    </mapgis-ui-col>-->
<!--                    <mapgis-ui-col :span="12">-->
<!--                      <mapgis-ui-slider-->
<!--                          style="width: 97px"-->
<!--                          :min="0"-->
<!--                          :max="20"-->
<!--                          v-model="radiusArr[index]"-->
<!--                          class="theme-panel-slider theme-panel-icon-slider"-->
<!--                      />-->
<!--                    </mapgis-ui-col>-->
<!--                    <mapgis-ui-col :span="5">-->
<!--                      <mapgis-ui-input-number-->
<!--                          v-model="radiusArr[index]"-->
<!--                          style="margin-left: 2px"-->
<!--                          class="theme-panel-input-number theme-panel-input-icon-number"/>-->
<!--                    </mapgis-ui-col>-->
<!--                  </mapgis-ui-row>-->
<!--                </div>-->
<!--                <div class="range-theme-list-item" style="border-top: 1px solid rgb(93, 93, 93)"-->
<!--                     v-if="radiusIndex === index">-->
<!--                  <mapgis-ui-row style="margin-top: 0">-->
<!--                    <mapgis-ui-col :span="5">-->
<!--                      <p class="theme-panel-icon-title">Y偏移</p>-->
<!--                    </mapgis-ui-col>-->
<!--                    <mapgis-ui-col :span="12">-->
<!--                      <mapgis-ui-slider-->
<!--                          style="width: 97px"-->
<!--                          :min="0"-->
<!--                          :max="20"-->
<!--                          v-model="radiusArr[index]"-->
<!--                          class="theme-panel-slider theme-panel-icon-slider"-->
<!--                      />-->
<!--                    </mapgis-ui-col>-->
<!--                    <mapgis-ui-col :span="5">-->
<!--                      <mapgis-ui-input-number-->
<!--                          v-model="radiusArr[index]"-->
<!--                          style="margin-left: 2px"-->
<!--                          class="theme-panel-input-number theme-panel-input-icon-number"/>-->
<!--                    </mapgis-ui-col>-->
<!--                  </mapgis-ui-row>-->
<!--                </div>-->
              </div>
            </mapgis-ui-row>
            <mapgis-ui-row v-if="currentThemeType === 'range'">
              <div class="theme-panel-list" style="height: 40px" v-for="(data,index) in dataSource" :key="index"
                   :class="{panelListFirst: index === 0,panelListLast: index === dataSource.length - 1}">
                <div class="range-theme-list-item">
                  <div class="theme-panel-td theme-panel-td-range theme-panel-td-border-right theme-panel-td-index"
                       style="padding-top: 6px">
                    {{ index }}
                  </div>
                  <div class="theme-panel-td theme-panel-td-range theme-panel-td-border-right theme-panel-td-checkbox"
                       style="padding-top: 6px">
                    <mapgis-ui-checkbox
                        :value="{item:data,color:colors[index]}"
                        :checked="checkBoxArr[index]"
                        @change="$_checked">
                    </mapgis-ui-checkbox>
                  </div>
                  <div class="theme-panel-td theme-panel-td-range theme-panel-td-border-right">
                    <div class="theme-panel-color-picker">
                      <colorPicker style="margin-top: 11px" class="picker" v-model="colors[index]"
                                   @change="$_changeColor(index)"/>
                    </div>
                  </div>
                  <div class="theme-panel-td theme-panel-td-range theme-panel-td-input-num">
                    <img alt="数据错误" class="theme-panel-input-wrong" v-if="index > 0 && (index - 1) === numWrong"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAypJREFUeF7tmc9LlEEYx7/zuu+7JkFhRWU6Glg7mwRBEYFBRSJaHToUgRBEQUQEHTrUIUwPQRFE0CE8RBFEYHQoKQOLIuwQBV7SfTczc3YT+iVBkO686zux2GFb3teb8y7zvu8fsPN8PvN9ZucHQcg/EnJ+RAKiBITcQNQCIQ9AtAhGLRC1QMgNRC0QRACGGrC0UpqdhiStEpghQN/vvLiyZRJ/VNejPAEfaxbV5WOzjwBsKoaVwJBpirbGMXxTKUG5gHSdeV0ScsoH8gHj4oDWAmxq2QASXpAS8muSO6t0FyDnAZxmXFTpLuAngGofyEnGxRqtBaSoNUqARh/I94yLjVoLsKn1BsBWL0gC8irBczv0FlBn9YOgzQfyIeNiv+4C7oKgwxOS4BabEEe1FjDfPkBKeTWZcc5oLSBFrW4CdHpCSpxnGXFRawE2jZ8G5DVvAfIkyzg3tBaQpuZhCXLHcyco0ZHMiHtaC/hA4/tcyD5PSJe0s2zuqdYCbBprBoxBL0jDldvWZ53CPkHZp/w0OEqtDbPAsCdhBWFsPJdWRg+ovxX+XF+1ekbmJ70gY6ZYqf19wHgDKnOuNe0lYHaxiDeNQGidgAKcTa1fAJaUgE4xLpaphC+MpXwN+CfgE4C1JbBjjAu/U+KCeQlKwDsAm0uo3jIuPE+JC0YfVAJS1BwgIC3FYBJyIMmd1oWE9frtoBLQC+BgSUG9jItDoRCQpvEeCXn8f1jSw3juRCgE2NS6BOBsCexlxsW5UAhI08rdEu6zYlgCoyXBZ56HQkABMk2tC0XrwP0EF92q4QPbBwQB6jdmIP8CkYAyMhAlIIjJsOvNY5DGEUh37pGUGGkQ9zabcG6qrkd5AlK1sZ3EMF54gUrX3ZXM5l+qlKBcgE3jg4Bs9oYkrxnPbddcgPkdIMu9IeUPxp0VmguwvgCo8YHU/3ncptZjAHt8BDxhXOzVOgHz3QpXAE3ruBjRWkABbrgW1YZhdgGkfQ5W9ruu09WUxZRK+OgsENSVmOpZnm885fuAcoKPWiBqgYAeRsqpDaI1oJxmI4haogQEYb2cxowSUE6zEUQtfwEJOe5BvxJGeQAAAABJRU5ErkJggg=="/>
                    <mapgis-ui-input v-if="dataSource.length === 1 || (dataSource.length > 1 && index === 0)"
                                     class="range-theme-num"
                                     @click="$_inputClick('start')"
                                     v-model="startData"
                                     v-bind:title="startData"
                    >
                    </mapgis-ui-input>
                    <mapgis-ui-input v-if="index > 0" class="range-theme-num"
                                     @click="$_inputClick(index - 1)"
                                     v-model="dataSource[index - 1]"
                                     v-bind:title="dataSource[index - 1]"
                    >
                    </mapgis-ui-input>
                  </div>
                  <div class="theme-panel-td theme-panel-td-range" style="width: 3%;padding-top: 4px">
                    ~
                  </div>
                  <div class="theme-panel-td theme-panel-td-range theme-panel-td-input-num theme-panel-td-border-right">
                    <img alt="数据错误" class="theme-panel-input-wrong"
                         v-if="index < dataSource.length - 1 && dataSource.length > 1 && index === numWrong"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAypJREFUeF7tmc9LlEEYx7/zuu+7JkFhRWU6Glg7mwRBEYFBRSJaHToUgRBEQUQEHTrUIUwPQRFE0CE8RBFEYHQoKQOLIuwQBV7SfTczc3YT+iVBkO686zux2GFb3teb8y7zvu8fsPN8PvN9ZucHQcg/EnJ+RAKiBITcQNQCIQ9AtAhGLRC1QMgNRC0QRACGGrC0UpqdhiStEpghQN/vvLiyZRJ/VNejPAEfaxbV5WOzjwBsKoaVwJBpirbGMXxTKUG5gHSdeV0ScsoH8gHj4oDWAmxq2QASXpAS8muSO6t0FyDnAZxmXFTpLuAngGofyEnGxRqtBaSoNUqARh/I94yLjVoLsKn1BsBWL0gC8irBczv0FlBn9YOgzQfyIeNiv+4C7oKgwxOS4BabEEe1FjDfPkBKeTWZcc5oLSBFrW4CdHpCSpxnGXFRawE2jZ8G5DVvAfIkyzg3tBaQpuZhCXLHcyco0ZHMiHtaC/hA4/tcyD5PSJe0s2zuqdYCbBprBoxBL0jDldvWZ53CPkHZp/w0OEqtDbPAsCdhBWFsPJdWRg+ovxX+XF+1ekbmJ70gY6ZYqf19wHgDKnOuNe0lYHaxiDeNQGidgAKcTa1fAJaUgE4xLpaphC+MpXwN+CfgE4C1JbBjjAu/U+KCeQlKwDsAm0uo3jIuPE+JC0YfVAJS1BwgIC3FYBJyIMmd1oWE9frtoBLQC+BgSUG9jItDoRCQpvEeCXn8f1jSw3juRCgE2NS6BOBsCexlxsW5UAhI08rdEu6zYlgCoyXBZ56HQkABMk2tC0XrwP0EF92q4QPbBwQB6jdmIP8CkYAyMhAlIIjJsOvNY5DGEUh37pGUGGkQ9zabcG6qrkd5AlK1sZ3EMF54gUrX3ZXM5l+qlKBcgE3jg4Bs9oYkrxnPbddcgPkdIMu9IeUPxp0VmguwvgCo8YHU/3ncptZjAHt8BDxhXOzVOgHz3QpXAE3ruBjRWkABbrgW1YZhdgGkfQ5W9ruu09WUxZRK+OgsENSVmOpZnm885fuAcoKPWiBqgYAeRsqpDaI1oJxmI4haogQEYb2cxowSUE6zEUQtfwEJOe5BvxJGeQAAAABJRU5ErkJggg=="/>
                    <img alt="数据错误" class="theme-panel-input-wrong"
                         v-if="index === dataSource.length - 1 && dataSource.length > 1 && endNumWrong"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAypJREFUeF7tmc9LlEEYx7/zuu+7JkFhRWU6Glg7mwRBEYFBRSJaHToUgRBEQUQEHTrUIUwPQRFE0CE8RBFEYHQoKQOLIuwQBV7SfTczc3YT+iVBkO686zux2GFb3teb8y7zvu8fsPN8PvN9ZucHQcg/EnJ+RAKiBITcQNQCIQ9AtAhGLRC1QMgNRC0QRACGGrC0UpqdhiStEpghQN/vvLiyZRJ/VNejPAEfaxbV5WOzjwBsKoaVwJBpirbGMXxTKUG5gHSdeV0ScsoH8gHj4oDWAmxq2QASXpAS8muSO6t0FyDnAZxmXFTpLuAngGofyEnGxRqtBaSoNUqARh/I94yLjVoLsKn1BsBWL0gC8irBczv0FlBn9YOgzQfyIeNiv+4C7oKgwxOS4BabEEe1FjDfPkBKeTWZcc5oLSBFrW4CdHpCSpxnGXFRawE2jZ8G5DVvAfIkyzg3tBaQpuZhCXLHcyco0ZHMiHtaC/hA4/tcyD5PSJe0s2zuqdYCbBprBoxBL0jDldvWZ53CPkHZp/w0OEqtDbPAsCdhBWFsPJdWRg+ovxX+XF+1ekbmJ70gY6ZYqf19wHgDKnOuNe0lYHaxiDeNQGidgAKcTa1fAJaUgE4xLpaphC+MpXwN+CfgE4C1JbBjjAu/U+KCeQlKwDsAm0uo3jIuPE+JC0YfVAJS1BwgIC3FYBJyIMmd1oWE9frtoBLQC+BgSUG9jItDoRCQpvEeCXn8f1jSw3juRCgE2NS6BOBsCexlxsW5UAhI08rdEu6zYlgCoyXBZ56HQkABMk2tC0XrwP0EF92q4QPbBwQB6jdmIP8CkYAyMhAlIIjJsOvNY5DGEUh37pGUGGkQ9zabcG6qrkd5AlK1sZ3EMF54gUrX3ZXM5l+qlKBcgE3jg4Bs9oYkrxnPbddcgPkdIMu9IeUPxp0VmguwvgCo8YHU/3ncptZjAHt8BDxhXOzVOgHz3QpXAE3ruBjRWkABbrgW1YZhdgGkfQ5W9ruu09WUxZRK+OgsENSVmOpZnm885fuAcoKPWiBqgYAeRsqpDaI1oJxmI4haogQEYb2cxowSUE6zEUQtfwEJOe5BvxJGeQAAAABJRU5ErkJggg=="/>
                    <mapgis-ui-input class="range-theme-num"
                                     @click="$_inputClick(index)"
                                     v-model="dataSource[index]"
                                     v-bind:title="dataSource[index]"
                                     >
                    </mapgis-ui-input>
                  </div>
                  <div class="theme-panel-td theme-panel-td-range theme-panel-td-add theme-panel-td-border-right"
                       @click="$_addRange(index)">
                    <img class="theme-panel-img-add"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABEZJREFUWEe1V01sVUUU/s68vtomxY2BWMVEEwNRU9/rzLxdVVi4EAjGRdlIVARd4EZAILIBE6PBqDX4kxjE/7iAhbHiT2IMGOvGzkxfjaXWhXHhT6CykSZN2r45Zl7ufbnvcu/70Xo3792ZM9/57jlnvjlD6PJxzq313t8khFgP4GZmvgbAvBDiEjNPSinnu4GkTowjp6NCiFFm3tRqDTN/BuDzYrE4XiqVfmuH35JAcMzMxwCMAljbDiw1fxnA+0T0npRyOm9tLoHJyclNQoiTAG7t0nGW+T6l1CtZE5kEjDF7iej19AIi+sp7P0tEF4hoFsCs956ZeWOhUNgYfoko/N6f4eyYUuqZqzDTA9baRwC8kxwnoovM/KxS6rVOomGM2UNEJwD0p+x3KaXebcJOvhhjRonodGrRB729vQeHhoYupp2HGgljWZVvjBkkoi8B3Jlcx8w7tNZn4rFGCpxzJWauppxkhi3YGGMOENHh8J+Zj2utX8qKjrX2KIBQyI2HiMpxYTYIWGtfBrAvYTeulMrKZd3EOXcu3pJEdF5KuTkvPc6555j56cT8mFJqf3ivE5ienl6/srISvv666IvC/r1Xa/1TC9COCQQMa60BoCK8yz09PeWgE3UC1tqDAF6InTHzg1rrj1oVXDcRiHw8DuDNBOZ+pdRYTOB7AJVo8lOl1PZWzrtNQYxljPmFiG6phz5KGznnbmfmmaz8rGYEItInmXlPjNvX1zcYCGxn5k8S4X9Ca/3G/xGBSF3PxdhCiK2BwKPMfCoe9N5vrlQq56O87SSi3Xlkkrughc0ppdSHYb5arW6o1WpzCdtdZK09BOB4PEhE64KwVKvVG2u1WpDbNe2i0Wb+SqFQuK1cLv8+MTGxpr+//++E/aFAoGkHLC4uXjsyMnIlOglDbXR7Cqb5zBPRHeGj8gg0aX84VMrl8s8BJaidEGLbf0mB9/5srJKZKZiamtrivQ9NRP1J1sBq74K8IgxNx6XELngqT9eThLoVomgbvsjMB5L1VhciY8xZItoaCcQZKeWOdoX3bwgYY+aIaEPADq2b1npbTKCpASGiLVLKL1YzBdbaJilm5rreZB5GAL5VSt29ygTyD6NIdJqOYyJqmYpuUuCcO83MobGNn+bjOCqQrhoSa+1OALFk743VLh21jhuSKApPAhhLghDR81LKI1npCGoZxoPKZc1nNCKh+B7TWr/V2AmdMA41ERFpWZgxlnPuvqgDuiuFf1gp1eg76rsui3lWZxzZfRwaKO/9N8Vi8Y+FhYU/w/jAwMDg8vLyDUKIewCUADyQwv0rHGpSyvG0v9yLSU6H3E4erppn5jlm3l2pVL7LWtzuahYK82EAD8X9YhcMFgG8WigUTuTVSG4K0k6ipjXcGULz0u5y+iMRfQ3gbaXUD+0Id3Q7ToLMzMxcv7S0JL336xJHdf16DuDC8PDwr+2cJuf/AZGKXgkO+31+AAAAAElFTkSuQmCC"
                         alt="新增分段">
                  </div>
                  <div class="theme-panel-td theme-panel-td-range theme-panel-td-delete" @click="$_deleteRange(index)">
                    <img class="theme-panel-img-add"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA7lJREFUWEfFV02MFEUU/l737GGJSIzIBXCBgwknd7qK2T2sXOCKikYhKMarJGtI9OJP5CeAF0kIG+BqFAgL/nLGi+5hd6zXs55MPAiiXgBDlkXmsNP9SE26NzU93Ts725tQSV+q3qvv66qv6n1FWGabmppaOzg4uBvAPgAviMh6InrWpovIf0R0D8AfACabzeaNsbGx+eVMTb2CmHk7EY2LyH4Az/SKT8bvE9EVEZlQSv2+VM6SBJj5BIBxAE8vEzgb9gCAJfFpUX4hAWb+GcBLKwTOpv2ilNqZN1cuAWa+C2B9NkFE5omo7ny/JhrYISK19COitTlg95RSz2X7uwgw800AW3ImuNhqtT4bGRmx44VtZmZma6VSOQ7g7ZygW0qprW5/B4EwDK+KyBuZRLsa40qpyX62g5ntaZkA0PHXRHQtCII307kWCSSC+yQDclQpdawf4GwsMx8BcDTTfzIVZpuAPWoApl21i8hNrfW2MuBprjHmTyJyl96ejlF7RNsEwjA8LyLvuWBRFNVqtVpbZGVbvV7f4ft+vWPviS4EQXCIjDHriOgvAOvSABE5rbX+sCywm2+M+YKIPnD65kRkiMIwPCgiXzkDDxcWFraPjo7+s5oEpqenNw0MDNhb8alFARK9Q8z8DYDXHbDCS6MsoZzL7VtLIARQdZZ/Qmv9flmwvHxjzFlbV5yxhtXAbSLa7BB4S2t9udFobInj2B6hd0uSuaSUal9KxpgDRHTJwfrbrsD/ANY4nUNa69vMfA7AoZLgaXr7PjHGPJ8IPu1/1EXA9/1Nw8PD/xZcICvl0yYwOzu7MYoiV9yPurbA87y91Wr1B4vEzNcB7FkpapL3ped5x6rV6q1Go/FqHMffZ7egQ4RE9HkQBB+XBM1ND8PwlIh81CFCZr6S2Ky0/yellLVeq96Y+QaAXc7Ek1YDewF85yzLfBRFL/Yqu/2ys2Xa9/3fMl7hNUrMpr2KXb93USl1sF+QpeKZ+euMR7jfbDaHCosRgP39eoAiAok3sFu92CgtRonau8oxgLtKqQ2rsQrMfCdjTDrLcULCOuAnY0jSv8xzwtaYxHG8r19vYD2A53mTGSNioTqKXZ4pLXLEp1ut1pleZdqW3UqlcjhT+9N/7HLGRba8yBk/BNAQkdnEwk0lM49Zi0VEw0llXaz5joa6HLEdK3yYFDjkFWky64Q7TkOPs/vknmaOMNPH6QHXN/ZYijkiulz6ceqCWPPqed7LIvIKgG0Fz3Nrv3+M4/i61npuOfv1GEgrvUth6rD9AAAAAElFTkSuQmCC"
                         alt="删除分段">
                  </div>
                </div>
              </div>
            </mapgis-ui-row>
          </mapgis-ui-collapse-panel>
        </mapgis-ui-collapse>
      </div>
    </div>
  </mapgis-ui-card>
</template>

<script>
import gradients from "./gradient";
import gradientHeatColor from "./gradientHeatColor";

import theme_line_uniform from './images/theme_line_uniform.png'
import theme_line_unique from './images/theme_line_unique.png'
import theme_line_range from './images/theme_line_range.png'

import theme_polygon_uniform from './images/theme_polygon_uniform.png'
import theme_polygon_unique from './images/theme_polygon_unique.png'
import theme_polygon_range from './images/theme_polygon_range.png'

import theme_point_uniform from './images/theme_point_uniform.png'
import theme_point_unique from './images/theme_point_unique.png'
import theme_point_range from './images/theme_point_range.png'
import theme_point_symbol from './images/theme_point_symbol.png'
import theme_point_heater from './images/theme_point_heater.png'

export default {
  name: "mapgis-igs-theme-panel",
  props: {
    hideItem: {
      type: Array
    },
    panelClass: {
      type: Object
    },
    panelStyle: {
      type: Object
    }
  },
  data() {
    return {
      images: {
        uniform: {
          circle: theme_point_uniform,
          line: theme_line_uniform,
          fill: theme_polygon_uniform
        },
        unique: {
          circle: theme_point_unique,
          line: theme_line_unique,
          fill: theme_polygon_unique
        },
        range: {
          circle: theme_point_range,
          line: theme_line_range,
          fill: theme_polygon_range
        },
        heatmap: {
          circle: theme_point_heater,
        },
        symbol: {
          circle: theme_point_symbol,
        }
      },
      //是否显示面板
      showPanel: true,
      //标题
      title: undefined,
      //数据类型，circle、line、fill
      dataType: undefined,
      scrollBack: 0,
      scroll: "hidden",
      //是否更新数据
      isUpDate: true,
      listId: "theme-panel-list-" + parseInt(Math.random() * 100000),
      //数据源
      dataSource: undefined,
      //复制一个数据源进行比较
      dataSourceCopy: undefined,
      dataSourceUnique: [],
      //图标url
      iconUrl: "",
      //专题图类型
      themeTypeArr: [{
        key: "uniform ",
        value: "统一专题图"
      }, {
        key: "unique",
        value: "单值专题图"
      }, {
        key: "range",
        value: "分段专题图"
      }],
      //面板激活参数
      activeKey: ["3"],
      //默认专题图类型
      currentThemeType: "unique",
      forceRender: true,
      //所有字段
      fields: [],
      //颜色数组
      colors: [],
      //图标数组
      icons: [],
      //复选框数组
      checkBoxArr: [],
      //是否初始化数据
      dataInit: false,
      rangeLevel: 10,
      startData: 0,
      startDataCopy: 0,
      endData: 0,
      endDataCopy: 0,
      numWrong: -1,
      startNumWrong: false,
      endNumWrong: false,
      radiusIndex: undefined,
      radiusArr: [],
      addRange: false,
      //被选择的字段
      selectField: undefined,
      radiusMax: 100,
      radiusStep: 0.1,
      circleRadius: 6,
      circleOpacity: 100,
      xOffsetMin: -20,
      xOffsetMax: 20,
      xOffsetStep: 0.1,
      circleTranslateX: 0,
      yOffsetMin: -20,
      yOffsetMax: 20,
      yOffsetStep: 0.1,
      circleTranslateY: 0,
      circleStrokeColor: "#000000",
      gradientColor: "#D53E4F,#FB8D59,#FEE08B,#FFFFBF,#E6F598,#99D594,#3288BD",
      uniformColor: "#EE4C5A",
      gradientArr: gradients,
      circleStrokeWidth: 1,
      circleStrokeWidthMax: 10,
      circleStrokeWidthStep: 0.1,
      circleStrokeOpacity: 100,
      lineOpacity: 100,
      lineTranslateX: 0,
      lineTranslateXMin: -20,
      lineTranslateXMax: 20,
      lineTranslateXStep: 0.1,
      lineTranslateY: 0,
      lineTranslateYMin: -20,
      lineTranslateYMax: 20,
      lineTranslateYStep: 0.1,
      lineWidth: 1,
      lineWidthMax: 20,
      lineWidthStep: 0.1,
      fillOpacity: 100,
      fillTranslateX: 0,
      fillTranslateXMin: -20,
      fillTranslateXMax: 20,
      fillTranslateXStep: 0.1,
      fillTranslateY: 0,
      fillTranslateYMin: -20,
      fillTranslateYMax: 20,
      fillTranslateYStep: 0.1,
      fillOutlineColor: "#000000",
      fillOutlineOpacity: 100,
      fillOutlineWidth: 1,
      fillOutlineWidthMax: 20,
      fillOutlineWidthStep: 0.1,
      textField: undefined,
      labelFields: [],
      textColor: "#000000",
      textHaloColor: "#FFFFFF",
      textHaloWidth: 0,
      textHaloWidthMax: 10,
      textHaloWidthStep: 0.1,
      textFont: "宋体",
      textFonts: ["宋体", "微软雅黑"],
      textSize: 11,
      textSizeMax: 100,
      textSizeStep: 1,
      textOffsetX: 0,
      textOffsetXMin: -20,
      textOffsetXMax: 20,
      textOffsetXStep: 0.1,
      textOffsetY: 0,
      textOffsetYMin: -20,
      textOffsetYMax: 20,
      textOffsetYStep: 0.1,
      textLetterSpacing: 0.05,
      textLetterSpacingMax: 1,
      textLetterSpacingStep: 0.01,
      textRotate: 0,
      textRotateStep: 1,
      heatGradientArr: gradientHeatColor,
      heatmapGradient: 0,
      heatmapOpacity: 100,
      heatmapRadius: 40,
      iconOpacity: 100,
      iconTranslateX: 0,
      iconTranslateXMin: -20,
      iconTranslateXMax: 20,
      iconTranslateXStep: 0.1,
      iconTranslateY: 0,
      iconTranslateYMin: -20,
      iconTranslateYMax: 20,
      iconTranslateYStep: 0.1,
      heatmapColors: [{
        key: "0",
        value: "#C1D2EF"
      }, {
        key: "1",
        value: "#86FD86"
      }, {
        key: "2",
        value: "#ECFD43"
      }, {
        key: "3",
        value: "#FEB028"
      }, {
        key: "4",
        value: "#FF0000"
      }]
    }
  },
  watch: {
    radiusArr: {
      handler: function () {
        if (this.dataInit && !this.addRange) {
          this.$emit("radiusChanged", this.radiusArr, this.radiusIndex);
        }
      },
      deep: true
    },
    startData: {
      handler: function () {
        if ((this.dataSource.length === 1 && Number(this.startData) >= Number(this.endData)) ||
            (this.dataSource.length > 1 && Number(this.startData) >= Number(this.dataSource[0]))) {
          //输入错误，改变输入框样式
          this.startNumWrong = true;
        } else {
          this.$_removeInputWrong();
          this.$emit("startDataChanged", this.startData);
        }
      }
    },
    dataSource: {
      handler: function () {
        if (this.dataInit) {
          if (!this.addRange) {
            let index = 0;
            for (let i = 0; i < this.dataSource.length; i++) {
              if (Number(this.dataSource[i]) !== Number(this.dataSourceCopy[i])) {
                index = i;
              }
            }
            this.$_removeInputWrong();
            if (index === 0 && Number(this.dataSource[index]) > Number(this.startData) && Number(this.dataSource[index]) < Number(this.dataSource[index + 1])) {
              this.$_setDataSourceCopy();
              this.$emit("rangeInputChanged", index, this.dataSource[index]);
            } else if (index === 0 && this.dataSource.length === 2 && Number(this.dataSource[index]) > Number(this.startData) && Number(this.dataSource[index]) < Number(this.endData)) {
              this.$_setDataSourceCopy();
              this.$emit("rangeInputChanged", index, this.dataSource[index]);
            } else if (index === this.dataSource.length - 1 && Number(this.dataSource[index]) > Number(this.dataSource[index - 1])) {
              this.$_setDataSourceCopy();
              this.$emit("rangeInputChanged", index, this.dataSource[index]);
            } else if (Number(this.dataSource[index - 1]) < Number(this.dataSource[index]) && Number(this.dataSource[index]) < Number(this.dataSource[index + 1])) {
              this.$_setDataSourceCopy();
              this.$emit("rangeInputChanged", index, this.dataSource[index]);
            } else {
              //输入错误，改变输入框样式
              this.$_inputWrong(index);
            }
          }
        }
      },
      deep: true
    },
  },
  created() {
    let numWatchs = ["circleOpacity", "circleRadius", "circleTranslateX", "circleTranslateY", "circleStrokeWidth", "circleStrokeOpacity", "textHaloWidth",
      "textSize", "textOffsetX", "textOffsetY", "textLetterSpacing", "textRotate", "lineOpacity", "lineWidth", "lineTranslateX",
      "lineTranslateY", "fillOpacity", "fillTranslateX", "fillTranslateY", "fillOutlineOpacity", "fillOutlineWidth", "heatmapOpacity", "heatmapRadius",
      "iconOpacity", "iconTranslateX", "iconTranslateY"
    ];
    for (let i = 0; i < numWatchs.length; i++) {
      this.$watch(numWatchs[i], function () {
        if (this.isUpDate) {
          this.$emit(numWatchs[i] + "Changed", Number(this[numWatchs[i]]));
        }
      });
    }
    let stringWatchs = ["circleStrokeColor"];
    for (let i = 0; i < stringWatchs.length; i++) {
      this.$watch(stringWatchs[i], function () {
        if (this.isUpDate) {
          this.$emit(stringWatchs[i] + "Changed", this[stringWatchs[i]]);
        }
      });
    }
  },
  mounted() {
    ;
  },
  methods: {
    $_popupContainer() {
      return document.querySelector('#theme-panel');
    },
    $_reset() {
      this.isUpDate = false;
      if(this.$refs.wenli){
        this.$refs.wenli.selectIcon = undefined;
      }
      this.dataInit = false;
      this.radiusIndex = undefined;
      this.uniformColor = "#EE4C5A";
      this.radiusMax = 100;
      this.radiusStep = 0.1;
      this.circleRadius = 6;
      this.circleOpacity = 100;
      this.xOffsetMin = -20;
      this.xOffsetMax = 20;
      this.xOffsetStep = 0.1;
      this.circleTranslateX = 0;
      this.yOffsetMin = -20;
      this.yOffsetMax = 20;
      this.yOffsetStep = 0.1;
      this.circleTranslateY = 0;
      this.circleStrokeColor = "#000000";
      // this.gradientColor = "#D53E4F;#FB8D59;#FEE08B;#FFFFBF;#E6F598;#99D594;#3288BD";
      this.circleStrokeWidth = 2;
      this.circleStrokeWidthMax = 10;
      this.circleStrokeWidthStep = 0.1;
      this.circleStrokeOpacity = 100;
      this.lineOpacity = 100;
      this.lineTranslateX = 0;
      this.lineTranslateXMin = -20;
      this.lineTranslateXMax = 20;
      this.lineTranslateXStep = 0.1;
      this.lineTranslateY = 0;
      this.lineTranslateYMin = -20;
      this.lineTranslateYMax = 20;
      this.lineTranslateYStep = 0.1;
      this.lineWidth = 3;
      this.lineWidthMax = 20;
      this.lineWidthStep = 0.1;
      this.fillOpacity = 100;
      this.fillTranslateX = 0;
      this.fillTranslateXMin = -20;
      this.fillTranslateXMax = 20;
      this.fillTranslateXStep = 0.1;
      this.fillTranslateY = 0;
      this.fillTranslateYMin = -20;
      this.fillTranslateYMax = 20;
      this.fillTranslateYStep = 0.1;
      this.fillOutlineColor = "#000000";
      this.fillOutlineOpacity = 100;
      this.fillOutlineWidth = 3;
      this.fillOutlineWidthMax = 20;
      this.fillOutlineWidthStep = 0.1;
      this.textField = undefined;
      this.textColor = "#000000";
      this.textHaloColor = "#FFFFFF";
      this.textHaloWidth = 0;
      this.textHaloWidthMax = 10;
      this.textHaloWidthStep = 0.1;
      this.textFont = "宋体";
      this.textSize = 11;
      this.textSizeMax = 100;
      this.textSizeStep = 1;
      this.textOffsetX = 0;
      this.textOffsetXMin = -20;
      this.textOffsetXMax = 20;
      this.textOffsetXStep = 0.1;
      this.textOffsetY = 0;
      this.textOffsetYMin = -20;
      this.textOffsetYMax = 20;
      this.textOffsetYStep = 0.1;
      this.textLetterSpacing = 0.05;
      this.textLetterSpacingMax = 1;
      this.textLetterSpacingStep = 0.01;
      this.textRotate = 0;
      this.textRotateStep = 1;
      this.iconOpacity = 100;
      this.iconTranslateX = 0;
      this.iconTranslateXMin = -20;
      this.iconTranslateXMax = 20;
      this.iconTranslateXStep = 0.1;
      this.iconTranslateY = 0;
      this.iconTranslateYMin = -20;
      this.iconTranslateYMax = 20;
      this.iconTranslateYStep = 0.1;
      this.heatmapGradient = 0;
      this.heatmapOpacity = 100;
      this.heatmapRadius = 40;
      this.heatmapColors = [{
        key: "0",
        value: "rgb(193,210,239)"
      }, {
        key: "1",
        value: "rgb(134,253,134)"
      }, {
        key: "2",
        value: "rgb(236,253,67)"
      }, {
        key: "3",
        value: "rgb(254,176,40)"
      }, {
        key: "4",
        value: "rgb(255,0,0)"
      }];
      this.radiusArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      this.$nextTick(function () {
        this.isUpDate = true;
        this.dataInit = true;
      });
    },
    //面板点击事件
    $_panelClick() {
      //当需要重置数据时，重置数据
      if (this.numWrong >= 0 && this.resetNum) {
        this.dataSource[this.numWrong] = this.dataSourceCopy[this.numWrong];
        this.numWrong = -1;
      }
      this.$emit("panelClick", this);
    },
    //面板关闭事件
    $_close() {
      this.showPanel = false;
      this.$emit("closePanel");
    },
    $_show() {
      this.showPanel = true;
      this.$emit("closePanel");
    },
    //切换专题图类型
    $_selectThemeType(key) {
      this.currentThemeType = key;
      this.$emit("themeTypeChanged", key);
    },
    //设置图层名称
    $_setTitle(title) {
      this.title = title;
    },
    //设置字段数组
    $_setFields(fields) {
      let newFields = [];
      for (let i = 0; i < fields.length; i++) {
        newFields.push(fields[i]);
      }
      this.fields = newFields;
    },
    //设置标签字段数组
    $_setLabelFields(fields, noField) {
      let newFields = [];
      for (let i = 0; i < fields.length; i++) {
        newFields.push(fields[i]);
      }
      if (!noField) {
        this.textField = newFields[0];
      }
      this.labelFields = newFields;
    },
    //设置字段
    $_setField(field) {
      this.selectField = field;
    },
    //设置数据几何类型
    $_setDataType(dataType) {
      this.dataType = dataType;
      if (this.dataType === "circle") {
        this.themeTypeArr = [{
          type: this.dataType,
          key: "uniform",
          value: "统一专题图"
        }, {
          type: this.dataType, 
          key: "unique",
          value: "单值专题图"
        }, {
          type: this.dataType,
          key: "range",
          value: "分段专题图"
        }, {
          type: this.dataType, 
          key: "symbol",
          value: "符号专题图"
        }, {
          type: this.dataType,
          key: "heatmap",
          value: "热力专题图"
        }]
      } else {
        this.themeTypeArr = [{
          type: this.dataType,
          key: "uniform",
          value: "统一专题图"
        }, {
          type: this.dataType,  
          key: "unique",
          value: "单值专题图"
        }, {
          type: this.dataType,  
          key: "range",
          value: "分段专题图"
        }]
      }
    },
    //字段选择函数
    $_selectFieldChange(value) {
      this.selectField = value;
      this.$emit("fieldChanged", value);
    },
    $_outerLineColorChange(e) {
      this.$emit("outerLineColorChanged", e);
    },
    $_fillOutlineColorChange(e) {
      this.$emit("fillOutlineColorChanged", e);
    },
    //渐变颜色选择
    $_gradientChange(e) {
      this.$emit("gradientChanged", e);
    },
    //切换标签字段
    $_selectLabelTextChange(value) {
      this.$emit("textFieldChanged", value);
    },
    //设置标签字体颜色
    $_selectLabelTextColor(color) {
      this.$emit("textColorChanged", color);
    },
    //设置标签字体描边颜色
    $_selectLabelHaloColor(color) {
      this.$emit("textHaloColorChanged", color);
    },
    //设置标签字体
    $_labelTextFontChanged(font) {
      this.$emit("textFontChanged", font);
    },
    $_mouseover() {
      this.mouseOver = true;
    },
    $_mouseleave() {
      this.mouseOver = false;
    },
    //复选框选择事件
    $_checked(e) {
      let value = e.target.value.item;
      let color = e.target.value.color;
      let index = this.dataSourceCopy.indexOf(value);
      if (index >= 0) {
        this.$set(this.checkBoxArr, index, !this.checkBoxArr[index]);
      }
      this.$emit("checked", this.checkBoxArr, index, color);
    },
    //改变颜色事件
    $_changeColor(index) {
      this.$emit("colorChanged", index, this.colors[index]);
    },
    //处理字符串
    $_editStr(item, strLength) {
      item = item || "";
      item = String(item);
      let regString = new RegExp('^[\x00-\xff]');
      let regNumber = new RegExp('^[0-9]+$');
      let regOperate = new RegExp('[\+\-\_\.]');
      let chars = item.split("");
      let str = "", length = 0;
      for (let i = 0; i < chars.length; i++) {
        if (regString.test(chars[i]) || regNumber.test(chars[i]) || regOperate.test(chars[i])) {
          length++;
        } else {
          length += 2;
        }
        if (length > strLength) {
          str += "...";
          break;
        } else {
          str += chars[i];
        }
      }
      return str;
    },
    $_setDataSoure(dataSource) {
      let datas = [];
      for (let i = 0; i < dataSource.length; i++) {
        datas.push(dataSource[i]);
      }
      let dataSourceCopy = [];
      this.dataInit = false;
      this.dataSource = datas;
      this.scroll = this.dataSource.length > 11 ? "scroll" : "hidden";
      for (let i = 0; i < this.dataSource.length; i++) {
        dataSourceCopy.push(this.dataSource[i]);
      }
      this.dataSourceCopy = dataSourceCopy;
      if (this.currentThemeType === "unique") {
        let dataSourceUnique = [];
        let length = this.dataSource.length > 15 ? 15 : this.dataSource.length;
        for (let j = 0; j < length; j++) {
          dataSourceUnique.push(this.dataSource[j]);
        }
        this.dataSourceUnique = dataSourceUnique;
      }
      this.$nextTick(function () {
        this.$_addScrollEvent();
        this.dataInit = true;
      });
    },
    $_setCheckBoxArr(checkBoxArr) {
      let newCheckBoxArr = [];
      for (let i = 0; i < checkBoxArr.length; i++) {
        newCheckBoxArr.push(checkBoxArr[i]);
      }
      this.isUpDate = false;
      this.checkBoxArr = newCheckBoxArr;
      this.$nextTick(function () {
        this.isUpDate = true;
      });
    },
    $_setColors(colors) {
      let newColors = [];
      for (let i = 0; i < colors.length; i++) {
        newColors.push(colors[i]);
      }
      this.isUpDate = false;
      this.colors = newColors;
      this.$nextTick(function () {
        this.isUpDate = true;
      });
    },
    //根据输入的props设置数据
    $_setPanel(props, field, fields) {
      this.isUpDate = false;
      this.selectField = field;
      this.fields = fields;
      let vm = this;
      Object.keys(props).forEach(function (key) {
        let keys = key.split("-");
        let newKey = "";
        for (let i = 0; i < keys.length; i++) {
          if (i === 0) {
            newKey = keys[i];
          } else {
            newKey +=
                keys[i].substr(0, 1).toUpperCase() +
                keys[i].substr(1, keys[i].length - 1);
          }
        }
        if (key === "heatmap-colors") {
          let heatmapColors = [];
          for (let j = 0; j < props[key].length; j++) {
            heatmapColors.push({
              key: props[key][j].key,
              value: props[key][j].value
            });
          }
          vm[newKey] = heatmapColors;
        }
        if (key === vm.dataType + "-translate") {
          vm[vm.dataType + "TranslateX"] = props[key][0];
          vm[vm.dataType + "TranslateY"] = props[key][1];
        } else if (key === "icon-translate") {
          vm["iconTranslateX"] = props[key][0];
          vm["iconTranslateY"] = props[key][1];
        } else if (key === "text-offset") {
          vm["textOffsetX"] = props[key][0];
          vm["textOffsetY"] = props[key][1];
        } else if (key === "text-field") {
          if (props[key] === "{未设置}") {
            vm[newKey] = "未设置";
          }
        } else {
          vm[newKey] = props[key];
        }
      });
      this.$nextTick(function () {
        this.isUpDate = true;
      });
    },
    $_setIcons(icons) {
      this.icons = icons;
    },
    $_setDefaultIcon(iconUrl) {
      this.iconUrl = iconUrl;
    },
    $_resetIcon(iconUrl) {
      this.$refs.svg.selectIcon = iconUrl;
    },
    $_setPattern(patternUrl) {
      this.$refs.wenli.selectIcon = patternUrl;
    },
    $_showRadius(index) {
      if (this.radiusIndex === index) {
        this.radiusIndex = undefined;
      } else {
        this.radiusIndex = index;
      }
      this.$emit("radiusIndexChanged", this.radiusIndex);
    },
    $_setRadiusArr(radiusArr) {
      let radius = [];
      for (let i = 0; i < radiusArr.length; i++) {
        radius.push(radiusArr[i]);
      }
      this.radiusArr = radius;
    },
    $_inputClick(index) {
      if (index !== 'start' && this.startNumWrong) {
        this.startNumWrong = false;
        this.startData = this.startDataCopy;
      } else if (index !== 'end' && this.endNumWrong) {
        this.endNumWrong = false;
        this.endData = this.endDataCopy;
      } else if (index === this.numWrong && typeof index === 'number') {
        this.resetNum = false;
      } else {
        this.resetNum = true;
      }
    },
    $_addSymbolRange(index) {
      this.addRange = true;
      let startData = Number(this.dataSource[index]);
      let endData
      if (this.dataSource.length === 2) {
        endData = this.endData;
      } else {
        endData = Number(this.dataSource[index + 1]);
      }
      if (index < this.dataSource.length - 1) {
        if (startData < endData) {
          let addNum = (startData + endData) / 2;
          this.dataSource.splice(index + 1, 0, addNum);
          this.$_setDataSourceCopy();
          this.radiusArr.splice(index + 1, 0, this.radiusArr[index]);
          this.rangeLevel++;
        }
      } else {
        let addNum = (this.dataSource[index] - this.dataSource[index - 1]) + this.dataSource[index];
        this.radiusArr.splice(index + 1, 0, this.radiusArr[index]);
        this.dataSource.push(addNum);
        this.$_setDataSourceCopy();
        this.endData = addNum;
        this.rangeLevel++;
      }
      this.$emit("addRange", this.dataSource, this.radiusArr);
      if (this.radiusIndex && this.radiusIndex >= index) {
        this.radiusIndex++;
      }
      this.$nextTick(function () {
        this.addRange = false;
      });
    },
    $_deleteSymbolRange(index) {
      if (this.rangeLevel > 2) {
        this.rangeLevel--;
        this.addRange = true;
        this.dataSource.splice(index - 1, 1);
        this.$_setDataSourceCopy();
        this.radiusArr.splice(index, 1);
        if (this.radiusIndex && this.radiusIndex >= index) {
          this.radiusIndex--;
        }
        this.$emit("deleteRange", this.dataSource, this.radiusArr);
        this.$nextTick(function () {
          this.addRange = false;
        });
      }
    },
    $_removeInputWrong() {
      this.numWrong = -1;
      this.startNumWrong = false;
      this.endNumWrong = false;
    },
    //数据输入错误提示
    $_inputWrong(index) {
      this.numWrong = index;
    },
    $_setDataSourceCopy() {
      let dataSourceCopy = [];
      for (let i = 0; i < this.dataSource.length; i++) {
        dataSourceCopy.push(this.dataSource[i]);
      }
      this.dataSourceCopy = dataSourceCopy;
    },
    $_clickIcon(icon, url) {
      this.$emit("iconChanged", icon, url);
    },
    $_clickWenliIcon(icon, url){
      this.$emit("wenliIconChanged", icon, url);
    },
    $_heatGradientChange(index) {
      this.heatmapGradient = index;
      let colorsArr = this.heatGradientArr[index].key.split(",");
      let heatmapColors = [];
      for (let i = 0; i < colorsArr.length; i++) {
        heatmapColors.push({
          key: i + "",
          value: colorsArr[i]
        });
      }
      this.heatmapColors = heatmapColors;
      this.$emit("heatmapGradientChanged", colorsArr.toString(), index);
    },
    $_selectColor(e) {
      let colorsArr = [];
      this.heatmapColors.forEach((c, index) => {
        if (c.key === e.key) {
          c.value = e.value;
        }
        colorsArr.push(c.value);
      })
      this.$emit("heatmapGradientChanged", colorsArr.toString());
    },
    $_rangeChecked() {
    },
    $_addRange(index) {
      this.addRange = true;
      let startData;
      if (index === 0) {
        startData = Number(this.startData);
      } else {
        startData = Number(this.dataSource[index - 1]);
      }
      let endData, addNum;
      endData = Number(this.dataSource[index]);
      if (index < this.dataSource.length - 1) {
        if (startData < endData) {
          addNum = (startData + endData) / 2;
          this.dataSource.splice(index, 0, addNum);
          this.$_setDataSourceCopy();
          this.checkBoxArr.splice(index + 1, 0, true);
          this.rangeLevel++;
        }
      } else {
        addNum = (endData - startData) + endData;
        this.checkBoxArr.push(true);
        this.dataSource.push(addNum);
        this.$_setDataSourceCopy();
        this.endData = addNum;
        this.rangeLevel++;
      }
      this.$emit("addRange", this.dataSource, this.checkBoxArr, index, addNum, this.dataSource[index + 1]);
      this.$nextTick(function () {
        this.addRange = false;
      });
    },
    $_deleteRange(index) {
      if (this.rangeLevel > 2) {
        this.addRange = true;
        if (index === 0) {
          this.dataSource.splice(index, 1);
          this.$_setDataSourceCopy();
          this.checkBoxArr.splice(index, 1);
          this.rangeLevel--;
          this.$emit("deleteRange", this.dataSource, this.checkBoxArr, index, this.startData, this.dataSource[index]);
        } else if (index < this.dataSource.length - 1) {
          let startData = this.dataSource.splice(index - 1, 1);
          this.$_setDataSourceCopy();
          this.checkBoxArr.splice(index, 1);
          this.rangeLevel--;
          this.$emit("deleteRange", this.dataSource, this.checkBoxArr, index, startData, this.dataSource[index - 1]);
        } else if (index === this.dataSource.length - 1) {
          this.dataSource.splice(index - 1, 1);
          this.$_setDataSourceCopy();
          this.checkBoxArr.splice(index, 1);
          this.rangeLevel--;
          this.$emit("deleteRange", this.dataSource, this.checkBoxArr, index, this.dataSource[index - 2], this.dataSource[index - 1]);
        }
        this.$nextTick(function () {
          this.addRange = false;
        });
      }
    },
    $_uniformColorChange(color) {
      this.$emit("uniformColorChanged", color);
    },
    $_addScrollEvent() {
      this.$nextTick(function () {
        let vm = this;
        let list = document.getElementById(this.listId);
        if (list) {
          list.scrollTop = 0;
          this.scrollBack = document.documentElement.scrollTop || document.body.scrollTop;
          list.addEventListener('scroll', function (event) {
            if (vm.mouseOver) {
              let el = event.target
              if (el.scrollTop - vm.scrollBack > 200) {
                vm.scrollBack = el.scrollTop;
                let dataArr = [];
                let startLength = vm.dataSourceUnique.length;
                let endLength = ((startLength + 15) < vm.dataSource.length) ? startLength + 15 : vm.dataSource.length;
                for (let i = startLength; i < endLength; i++) {
                  dataArr.push(vm.dataSource[i]);
                }
                vm.dataSourceUnique = vm.dataSourceUnique.concat(dataArr);
              }
            }
          })
        }
      });
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
  height: calc(100vh - 64px);
  /*overflow-y: scroll;*/
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
  margin-top: 13px;
  margin-bottom: 0;
  text-align: left;
  font-family: "Microsoft YaHei";
}

.theme-panel .mapgis-ui-row {
  margin-top: 5px;
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
  right: 4px;
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
  float: left;
}

.theme-panel-td-symbol {
  height: 44px;
  padding-top: 6px;
}

.theme-panel-td-range {
  height: 39px;
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
  border-right: 1px solid rgb(86, 86, 86);
}

.theme-panel .mapgis-ui-list-item {
  display: block;
  padding: 0 !important;
  height: 30px;
}

.theme-panel .m-colorPicker {
  margin-top: 6px;
  margin-left: 8px;
}

.theme-panel .mapgis-ui-checkbox-checked {
  margin-top: 3px;
}

.theme-panel-gradient {
  width: 106px;
  height: 15px;
  margin: 8px 0 0;
  border-radius: 3px;
}

.theme-panel-input-num {
  width: 200px;
}

/deep/ .theme-panel-noflow .mapgis-ui-collapse-content {
  overflow: visible !important;
}

.theme-panel-slider {
  width: 88px;
  margin-left: 0px;
  margin-top: 15px;
}

.theme-panel-input-number {
  width: 47px;
  margin-top: 5px;
  margin-left: -11px;
}

/deep/ .theme-panel-line-color .colorBtn {
  width: 137px !important;
  height: 17px !important;
}

.theme-panel-type-title {
  width: 307px;
  height: 26px;
  margin-left: -19px;
  margin-top: -9px;
  padding-left: 24px;
  padding-bottom: 40px;
  font-size: 16px;
}

.theme-panel-title {
  display: inline-block;
  width: 313px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 20px;
  margin-bottom: 0;
}

.theme-panel-title-close {
  display: inline-block;
  color: #40a9ff;
  font-size: 12px;
  position: absolute;
  right: -8px;
  top: -2px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  overflow: hidden;
}

.theme-panel-title-close > img {
  width: 16px;
  margin-top: 4px;
}

.theme-panel-title-close > img:hover {
  transform: translateY(-50px);
  filter: drop-shadow(#5eb7f2 0 50px);
}

.theme-panel-list {
  width: 100%;
  height: 46px;
  /*overflow: hidden;*/
}

.theme-panel-select {
  width: 153px;
  margin: 7px 0;
  margin-left: -10px;
}

.theme-panel .mapgis-ui-collapse {
  margin-top: 16px;
  width: 265px;
  margin-left: 16px;
  border-radius: 5px;
  padding-top: 5px;
  padding-bottom: 7px;
}

/deep/ .mapgis-ui-collapse-header {
  text-align: left;
}

/deep/ .mapgis-ui-card-body {
  padding: 24px 4px 4px;
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
  width: 105px;
  height: 10px;
  margin-top: 13px;
  border-top: 5px solid black;
}

.theme-panel-line-one {
  width: 105px;
  height: 10px;
  margin-top: 13px;
  border-top: 5px dotted black;
}

.theme-panel-line-two {
  width: 105px;
  height: 10px;
  margin-top: 13px;
  border-top: 5px dashed black;
}

.theme-panel-line-three {
  width: 105px;
  height: 20px;
  margin-top: 3px;
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

.theme-panel-input-radius {
  width: 158px;
  margin-left: -44px;
}

.theme-panel-img {
  font-size: 82px;
  width: 72px;
  height: 56px;
  border-radius: 5px;
}

.theme-panel-img-border {
  position: absolute;
  width: 72px;
  height: 56px;
  cursor: pointer;
  border-radius: 5px;
}

.theme-panel-img-border:hover {
  box-shadow: 1px 1px 1px 2px rgb(94, 183, 242);
}

.themePanelImgOutline {
  box-shadow: 1px 1px 1px 2px rgb(94, 183, 242);
}

.theme-panel-img-out {
  position: relative;
  width: 72px;
  height: 88px;
  display: inline-block;
  margin-left: 7px;
}

.theme-panel-img-type {
  position: absolute;
  bottom: -21px;
  left: -11px;
  width: 95px;
  height: 10px;
  text-align: center;
}

/deep/ .mapgis-ui-collapse-header {
  font-weight: bold;
}

/deep/ .mapgis-ui-collapse > .mapgis-ui-collapse-item > .mapgis-ui-collapse-header {
  color: #666666;
}

/deep/ .mapgis-ui-collapse > .mapgis-ui-collapse-item > .mapgis-ui-collapse-header .mapgis-ui-collapse-arrow {
  left: 238px;
}

/deep/ .mapgis-ui-collapse > .mapgis-ui-collapse-item > .mapgis-ui-collapse-header {
  padding: 0 0 0 10px;
  border-left: 1px solid rgb(204, 204, 204);
  border-radius: 0 !important;
  width: 240px;
  height: 20px;
  margin-left: 1px;
}

/deep/ .mapgis-ui-collapse {
  background-color: transparent;
  border-radius: 0;
  border: none;
}

/deep/ .mapgis-ui-collapse > .mapgis-ui-collapse-item {
  border: none;
}

/deep/ .mapgis-ui-collapse-item:last-child > .mapgis-ui-collapse-content {
  border: none;
}

.theme-panel-color-outer {
  width: 157px;
  height: 32px;
  margin-left: -13px;
  margin-top: 10px;
  border: 1px solid var(--border-color-base);
  border-radius: 4px;
}

/deep/ .mapgis-ui-select-selection__rendered {
  margin-right: 31px !important;
}

.theme-panel-options {
  width: 300px;
  min-height: 710px;
  margin-top: 8px;
  padding-top: 1px;
  margin-left: -4px;
}

.theme-panel-head {
  width: 308px;
  height: 248px;
  margin-top: -18px;
  padding-top: 14px;
  margin-left: -14px;
}

/deep/ .mapgis-ui-collapse-content > .mapgis-ui-collapse-content-box {
  padding: 16px 16px 0 16px;;
}

.range-theme-num {
  width: 44px;
  padding: 0 2px;
}

.theme-panel-list-symbol {
  border-top: 1px solid rgb(93, 93, 93);
  border-left: 1px solid rgb(93, 93, 93);
  border-right: 1px solid rgb(93, 93, 93);
}

.theme-panel-list {
  border-top: 1px solid rgb(93, 93, 93);
  border-left: 1px solid rgb(93, 93, 93);
  border-right: 1px solid rgb(93, 93, 93);
}

.panelListFirst {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.panelListLast {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 1px solid rgb(93, 93, 93);
}

.theme-panel-radius {
  border-radius: 10px;
  border: 3px solid rgb(208, 208, 208);
  background: rgb(228, 228, 228);
}

.theme-panel-icon-slider {
  margin-left: 12px;
}

.theme-panel-input-icon-number {
  margin-top: 5px;
  width: 60px;
}

.theme-panel-icon-title {
  margin-top: 9px;
  margin-left: 8px;
}

.range-theme-list-item {
  width: 100%;
  height: 44px;
}

/deep/ .mapgis-ui-list-bordered .mapgis-ui-list-item {
  padding: 0;
}

.theme-panel-td-input-num {
  width: 28%;
}

.theme-panel-td-checkbox, .theme-panel-td-index {
  padding-top: 10px;
}

.theme-panel-td-range > .theme-panel-input-wrong {
  left: 33px;
  top: 4px;
  height: 29px;
}

.theme-panel-input-wrong {
  position: absolute;
  left: 54px;
  top: 12px;
  width: 20px;
  height: 20px;
  z-index: 100;
}

.theme-panel-td-add {
  width: 10%;
  cursor: pointer;
}

.theme-panel-img-add {
  width: 16px;
}

.theme-panel-td-delete {
  width: 11%;
  cursor: pointer;
}

.theme-panel-radius-out {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  height: 100%;
  padding-left: 1px;
  padding-top: 8px;
}

.theme-panel-td-range > img {
  padding-top: 5px;
}

.theme-panel-td-range.theme-panel-td-input-num {
  padding-top: 4px;
  width: 23% !important;
}
</style>