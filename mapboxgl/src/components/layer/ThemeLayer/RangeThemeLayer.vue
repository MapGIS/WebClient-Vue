<template>
  <div>
    <ThemePanel
        v-if="!resetPanel"
        v-show="showPanelFlag"
        :title="title"
        :data-source="dataSource"
        :fields="fields"
        :labelFields="allFields"
        :colors="colors"
        :dataType="dataType"
        :checkBoxArr="checkBoxArr"
        :icons="icons"
        :panelProps="panelPropsDefault"
        :textFonts="textFonts"
        :themeDefaultType="themeDefaultType"
        :themeType="themeTypeArrCopy"
        :iconUrl="iconUrl"
        :isGradient="isGradient"
        :isSingle="isSingle"
        @closePanel="$_closePanel"
        @panelClick="$_panelClick"
        @change="$_selectChange"
        @gradientChange="$_singleChangedOut"
        @lineColorChanged="$_lineColorChanged"
        @opacityChanged="$_opacityChanged"
        @outerLineOpacityChanged="$_outerLineOpacityChanged"
        @iconSizeChanged="$_radiusChanged"
        @radiusChanged="$_radiusChanged"
        @lineWidthChanged="$_lineWidthChanged"
        @selectTextChanged="$_selectTextChanged"
        @fontSizeChanged="$_fontSizeChanged"
        @yOffsetTextChanged="$_yOffsetTextChanged"
        @xOffsetTextChanged="$_xOffsetTextChanged"
        @textPaddingChanged="$_textPaddingChanged"
        @textRotationChanged="$_textRotationChanged"
        @haloColorChanged="$_haloColorChanged"
        @haloWidthChanged="$_haloWidthChanged"
        @clickIcon="$_clickIcon"
        @singleChanged="$_singleChanged"
        @clickSingle="$_clickSingle"
        @clickGradient="$_clickGradient"
        @fontColorChanged="$_fontColorChanged"
        @lineStyleChanged="$_lineStyleChanged"
        @xOffsetChanged="$_xOffsetChanged"
        @yOffsetChanged="$_yOffsetChanged"
        @outerLineColorChanged="$_outerLineColorChanged"
        @fontChanged="$_fontChanged"
        @themeTypeChanged="$_themeTypeChanged"
    >
      <div slot="legend">
        <mapgis-ui-row>
          <div class="theme-panel-list" v-for="(data,index) in dataSourceCopy" :key="index" :class="{panelListFirst: index === 0,panelListLast: index === dataSourceCopy.length - 1}">
            <div class="range-theme-list-item">
              <div class="theme-panel-td theme-panel-td-border-right theme-panel-td-index">
                {{ index }}
              </div>
              <div class="theme-panel-td theme-panel-td-border-right theme-panel-td-checkbox">
                <mapgis-ui-checkbox
                    :value="{item:data,color:colors[index]}"
                    :checked="checkBoxArr[index]"
                    @change="$_checkboxChecked">
                </mapgis-ui-checkbox>
              </div>
              <div class="theme-panel-td theme-panel-td-border-right">
                <div class="theme-panel-color-picker">
                  <colorPicker class="picker" v-model="colors[index]"
                               @change="$_changeColor(index)"/>
                </div>
              </div>
              <div class="theme-panel-td theme-panel-td-input-num">
                <img alt="数据错误" class="theme-panel-input-wrong" v-if="index === 0 && startNumWrong" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAypJREFUeF7tmc9LlEEYx7/zuu+7JkFhRWU6Glg7mwRBEYFBRSJaHToUgRBEQUQEHTrUIUwPQRFE0CE8RBFEYHQoKQOLIuwQBV7SfTczc3YT+iVBkO686zux2GFb3teb8y7zvu8fsPN8PvN9ZucHQcg/EnJ+RAKiBITcQNQCIQ9AtAhGLRC1QMgNRC0QRACGGrC0UpqdhiStEpghQN/vvLiyZRJ/VNejPAEfaxbV5WOzjwBsKoaVwJBpirbGMXxTKUG5gHSdeV0ScsoH8gHj4oDWAmxq2QASXpAS8muSO6t0FyDnAZxmXFTpLuAngGofyEnGxRqtBaSoNUqARh/I94yLjVoLsKn1BsBWL0gC8irBczv0FlBn9YOgzQfyIeNiv+4C7oKgwxOS4BabEEe1FjDfPkBKeTWZcc5oLSBFrW4CdHpCSpxnGXFRawE2jZ8G5DVvAfIkyzg3tBaQpuZhCXLHcyco0ZHMiHtaC/hA4/tcyD5PSJe0s2zuqdYCbBprBoxBL0jDldvWZ53CPkHZp/w0OEqtDbPAsCdhBWFsPJdWRg+ovxX+XF+1ekbmJ70gY6ZYqf19wHgDKnOuNe0lYHaxiDeNQGidgAKcTa1fAJaUgE4xLpaphC+MpXwN+CfgE4C1JbBjjAu/U+KCeQlKwDsAm0uo3jIuPE+JC0YfVAJS1BwgIC3FYBJyIMmd1oWE9frtoBLQC+BgSUG9jItDoRCQpvEeCXn8f1jSw3juRCgE2NS6BOBsCexlxsW5UAhI08rdEu6zYlgCoyXBZ56HQkABMk2tC0XrwP0EF92q4QPbBwQB6jdmIP8CkYAyMhAlIIjJsOvNY5DGEUh37pGUGGkQ9zabcG6qrkd5AlK1sZ3EMF54gUrX3ZXM5l+qlKBcgE3jg4Bs9oYkrxnPbddcgPkdIMu9IeUPxp0VmguwvgCo8YHU/3ncptZjAHt8BDxhXOzVOgHz3QpXAE3ruBjRWkABbrgW1YZhdgGkfQ5W9ruu09WUxZRK+OgsENSVmOpZnm885fuAcoKPWiBqgYAeRsqpDaI1oJxmI4haogQEYb2cxowSUE6zEUQtfwEJOe5BvxJGeQAAAABJRU5ErkJggg=="/>
                <img alt="数据错误" class="theme-panel-input-wrong" v-if="index > 0 && (index - 1) === numWrong" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAypJREFUeF7tmc9LlEEYx7/zuu+7JkFhRWU6Glg7mwRBEYFBRSJaHToUgRBEQUQEHTrUIUwPQRFE0CE8RBFEYHQoKQOLIuwQBV7SfTczc3YT+iVBkO686zux2GFb3teb8y7zvu8fsPN8PvN9ZucHQcg/EnJ+RAKiBITcQNQCIQ9AtAhGLRC1QMgNRC0QRACGGrC0UpqdhiStEpghQN/vvLiyZRJ/VNejPAEfaxbV5WOzjwBsKoaVwJBpirbGMXxTKUG5gHSdeV0ScsoH8gHj4oDWAmxq2QASXpAS8muSO6t0FyDnAZxmXFTpLuAngGofyEnGxRqtBaSoNUqARh/I94yLjVoLsKn1BsBWL0gC8irBczv0FlBn9YOgzQfyIeNiv+4C7oKgwxOS4BabEEe1FjDfPkBKeTWZcc5oLSBFrW4CdHpCSpxnGXFRawE2jZ8G5DVvAfIkyzg3tBaQpuZhCXLHcyco0ZHMiHtaC/hA4/tcyD5PSJe0s2zuqdYCbBprBoxBL0jDldvWZ53CPkHZp/w0OEqtDbPAsCdhBWFsPJdWRg+ovxX+XF+1ekbmJ70gY6ZYqf19wHgDKnOuNe0lYHaxiDeNQGidgAKcTa1fAJaUgE4xLpaphC+MpXwN+CfgE4C1JbBjjAu/U+KCeQlKwDsAm0uo3jIuPE+JC0YfVAJS1BwgIC3FYBJyIMmd1oWE9frtoBLQC+BgSUG9jItDoRCQpvEeCXn8f1jSw3juRCgE2NS6BOBsCexlxsW5UAhI08rdEu6zYlgCoyXBZ56HQkABMk2tC0XrwP0EF92q4QPbBwQB6jdmIP8CkYAyMhAlIIjJsOvNY5DGEUh37pGUGGkQ9zabcG6qrkd5AlK1sZ3EMF54gUrX3ZXM5l+qlKBcgE3jg4Bs9oYkrxnPbddcgPkdIMu9IeUPxp0VmguwvgCo8YHU/3ncptZjAHt8BDxhXOzVOgHz3QpXAE3ruBjRWkABbrgW1YZhdgGkfQ5W9ruu09WUxZRK+OgsENSVmOpZnm885fuAcoKPWiBqgYAeRsqpDaI1oJxmI4haogQEYb2cxowSUE6zEUQtfwEJOe5BvxJGeQAAAABJRU5ErkJggg=="/>
                <mapgis-ui-input v-if="dataSourceCopy.length === 1 || (dataSourceCopy.length > 1 && index === 0)"
                                 class="range-theme-num"
                                 @click="$_inputClick('start')"
                                 @change="$_inputStartChange" v-model="startData">
                </mapgis-ui-input>
                <mapgis-ui-input v-if="index > 0" class="range-theme-num"
                                 @click="$_inputClick(index - 1)"
                                 @change="$_inputStartChange" v-model="dataSourceCopy[index - 1]">
                </mapgis-ui-input>
              </div>
              <div class="theme-panel-td" style="width: 3%">
                ~
              </div>
              <div class="theme-panel-td theme-panel-td-input-num theme-panel-td-border-right">
                <img alt="数据错误" class="theme-panel-input-wrong" v-if="index < dataSourceCopy.length - 1 && dataSourceCopy.length > 1 && index === numWrong" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAypJREFUeF7tmc9LlEEYx7/zuu+7JkFhRWU6Glg7mwRBEYFBRSJaHToUgRBEQUQEHTrUIUwPQRFE0CE8RBFEYHQoKQOLIuwQBV7SfTczc3YT+iVBkO686zux2GFb3teb8y7zvu8fsPN8PvN9ZucHQcg/EnJ+RAKiBITcQNQCIQ9AtAhGLRC1QMgNRC0QRACGGrC0UpqdhiStEpghQN/vvLiyZRJ/VNejPAEfaxbV5WOzjwBsKoaVwJBpirbGMXxTKUG5gHSdeV0ScsoH8gHj4oDWAmxq2QASXpAS8muSO6t0FyDnAZxmXFTpLuAngGofyEnGxRqtBaSoNUqARh/I94yLjVoLsKn1BsBWL0gC8irBczv0FlBn9YOgzQfyIeNiv+4C7oKgwxOS4BabEEe1FjDfPkBKeTWZcc5oLSBFrW4CdHpCSpxnGXFRawE2jZ8G5DVvAfIkyzg3tBaQpuZhCXLHcyco0ZHMiHtaC/hA4/tcyD5PSJe0s2zuqdYCbBprBoxBL0jDldvWZ53CPkHZp/w0OEqtDbPAsCdhBWFsPJdWRg+ovxX+XF+1ekbmJ70gY6ZYqf19wHgDKnOuNe0lYHaxiDeNQGidgAKcTa1fAJaUgE4xLpaphC+MpXwN+CfgE4C1JbBjjAu/U+KCeQlKwDsAm0uo3jIuPE+JC0YfVAJS1BwgIC3FYBJyIMmd1oWE9frtoBLQC+BgSUG9jItDoRCQpvEeCXn8f1jSw3juRCgE2NS6BOBsCexlxsW5UAhI08rdEu6zYlgCoyXBZ56HQkABMk2tC0XrwP0EF92q4QPbBwQB6jdmIP8CkYAyMhAlIIjJsOvNY5DGEUh37pGUGGkQ9zabcG6qrkd5AlK1sZ3EMF54gUrX3ZXM5l+qlKBcgE3jg4Bs9oYkrxnPbddcgPkdIMu9IeUPxp0VmguwvgCo8YHU/3ncptZjAHt8BDxhXOzVOgHz3QpXAE3ruBjRWkABbrgW1YZhdgGkfQ5W9ruu09WUxZRK+OgsENSVmOpZnm885fuAcoKPWiBqgYAeRsqpDaI1oJxmI4haogQEYb2cxowSUE6zEUQtfwEJOe5BvxJGeQAAAABJRU5ErkJggg=="/>
                <img alt="数据错误" class="theme-panel-input-wrong" v-if="dataSourceCopy.length === 1 || (index === dataSourceCopy.length - 1 && dataSourceCopy.length > 1) && endNumWrong" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAypJREFUeF7tmc9LlEEYx7/zuu+7JkFhRWU6Glg7mwRBEYFBRSJaHToUgRBEQUQEHTrUIUwPQRFE0CE8RBFEYHQoKQOLIuwQBV7SfTczc3YT+iVBkO686zux2GFb3teb8y7zvu8fsPN8PvN9ZucHQcg/EnJ+RAKiBITcQNQCIQ9AtAhGLRC1QMgNRC0QRACGGrC0UpqdhiStEpghQN/vvLiyZRJ/VNejPAEfaxbV5WOzjwBsKoaVwJBpirbGMXxTKUG5gHSdeV0ScsoH8gHj4oDWAmxq2QASXpAS8muSO6t0FyDnAZxmXFTpLuAngGofyEnGxRqtBaSoNUqARh/I94yLjVoLsKn1BsBWL0gC8irBczv0FlBn9YOgzQfyIeNiv+4C7oKgwxOS4BabEEe1FjDfPkBKeTWZcc5oLSBFrW4CdHpCSpxnGXFRawE2jZ8G5DVvAfIkyzg3tBaQpuZhCXLHcyco0ZHMiHtaC/hA4/tcyD5PSJe0s2zuqdYCbBprBoxBL0jDldvWZ53CPkHZp/w0OEqtDbPAsCdhBWFsPJdWRg+ovxX+XF+1ekbmJ70gY6ZYqf19wHgDKnOuNe0lYHaxiDeNQGidgAKcTa1fAJaUgE4xLpaphC+MpXwN+CfgE4C1JbBjjAu/U+KCeQlKwDsAm0uo3jIuPE+JC0YfVAJS1BwgIC3FYBJyIMmd1oWE9frtoBLQC+BgSUG9jItDoRCQpvEeCXn8f1jSw3juRCgE2NS6BOBsCexlxsW5UAhI08rdEu6zYlgCoyXBZ56HQkABMk2tC0XrwP0EF92q4QPbBwQB6jdmIP8CkYAyMhAlIIjJsOvNY5DGEUh37pGUGGkQ9zabcG6qrkd5AlK1sZ3EMF54gUrX3ZXM5l+qlKBcgE3jg4Bs9oYkrxnPbddcgPkdIMu9IeUPxp0VmguwvgCo8YHU/3ncptZjAHt8BDxhXOzVOgHz3QpXAE3ruBjRWkABbrgW1YZhdgGkfQ5W9ruu09WUxZRK+OgsENSVmOpZnm885fuAcoKPWiBqgYAeRsqpDaI1oJxmI4haogQEYb2cxowSUE6zEUQtfwEJOe5BvxJGeQAAAABJRU5ErkJggg=="/>
                <mapgis-ui-input class="range-theme-num"
                                 @change="$_inputEndChange"
                                 @click="$_inputClick(index)"
                                 v-model="dataSourceCopy[index]"
                                 v-if="index < dataSourceCopy.length - 1 && dataSourceCopy.length > 1">
                </mapgis-ui-input>
                <mapgis-ui-input class="range-theme-num"
                                 @change="$_inputEndChange"
                                 @click="$_inputClick('end')"
                                 v-model="endData"
                                 v-if="dataSourceCopy.length === 1 || (index === dataSourceCopy.length - 1 && dataSourceCopy.length > 1)">
                </mapgis-ui-input>
              </div>
              <div class="theme-panel-td theme-panel-td-add theme-panel-td-border-right" @click="$_addRange(index)">
                <!--                  <mapgis-ui-iconfont type="mapgis-tianjiamulu" />-->
                <img class="theme-panel-img-add" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABEZJREFUWEe1V01sVUUU/s68vtomxY2BWMVEEwNRU9/rzLxdVVi4EAjGRdlIVARd4EZAILIBE6PBqDX4kxjE/7iAhbHiT2IMGOvGzkxfjaXWhXHhT6CykSZN2r45Zl7ufbnvcu/70Xo3792ZM9/57jlnvjlD6PJxzq313t8khFgP4GZmvgbAvBDiEjNPSinnu4GkTowjp6NCiFFm3tRqDTN/BuDzYrE4XiqVfmuH35JAcMzMxwCMAljbDiw1fxnA+0T0npRyOm9tLoHJyclNQoiTAG7t0nGW+T6l1CtZE5kEjDF7iej19AIi+sp7P0tEF4hoFsCs956ZeWOhUNgYfoko/N6f4eyYUuqZqzDTA9baRwC8kxwnoovM/KxS6rVOomGM2UNEJwD0p+x3KaXebcJOvhhjRonodGrRB729vQeHhoYupp2HGgljWZVvjBkkoi8B3Jlcx8w7tNZn4rFGCpxzJWauppxkhi3YGGMOENHh8J+Zj2utX8qKjrX2KIBQyI2HiMpxYTYIWGtfBrAvYTeulMrKZd3EOXcu3pJEdF5KuTkvPc6555j56cT8mFJqf3ivE5ienl6/srISvv666IvC/r1Xa/1TC9COCQQMa60BoCK8yz09PeWgE3UC1tqDAF6InTHzg1rrj1oVXDcRiHw8DuDNBOZ+pdRYTOB7AJVo8lOl1PZWzrtNQYxljPmFiG6phz5KGznnbmfmmaz8rGYEItInmXlPjNvX1zcYCGxn5k8S4X9Ca/3G/xGBSF3PxdhCiK2BwKPMfCoe9N5vrlQq56O87SSi3Xlkkrughc0ppdSHYb5arW6o1WpzCdtdZK09BOB4PEhE64KwVKvVG2u1WpDbNe2i0Wb+SqFQuK1cLv8+MTGxpr+//++E/aFAoGkHLC4uXjsyMnIlOglDbXR7Cqb5zBPRHeGj8gg0aX84VMrl8s8BJaidEGLbf0mB9/5srJKZKZiamtrivQ9NRP1J1sBq74K8IgxNx6XELngqT9eThLoVomgbvsjMB5L1VhciY8xZItoaCcQZKeWOdoX3bwgYY+aIaEPADq2b1npbTKCpASGiLVLKL1YzBdbaJilm5rreZB5GAL5VSt29ygTyD6NIdJqOYyJqmYpuUuCcO83MobGNn+bjOCqQrhoSa+1OALFk743VLh21jhuSKApPAhhLghDR81LKI1npCGoZxoPKZc1nNCKh+B7TWr/V2AmdMA41ERFpWZgxlnPuvqgDuiuFf1gp1eg76rsui3lWZxzZfRwaKO/9N8Vi8Y+FhYU/w/jAwMDg8vLyDUKIewCUADyQwv0rHGpSyvG0v9yLSU6H3E4erppn5jlm3l2pVL7LWtzuahYK82EAD8X9YhcMFgG8WigUTuTVSG4K0k6ipjXcGULz0u5y+iMRfQ3gbaXUD+0Id3Q7ToLMzMxcv7S0JL336xJHdf16DuDC8PDwr+2cJuf/AZGKXgkO+31+AAAAAElFTkSuQmCC" alt="新增分段">
              </div>
              <div class="theme-panel-td theme-panel-td-delete" @click="$_deleteRange(index)">
                <!--                  <mapgis-ui-iconfont type="mapgis-shanchu" />-->
                <img class="theme-panel-img-add" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA7lJREFUWEfFV02MFEUU/l737GGJSIzIBXCBgwknd7qK2T2sXOCKikYhKMarJGtI9OJP5CeAF0kIG+BqFAgL/nLGi+5hd6zXs55MPAiiXgBDlkXmsNP9SE26NzU93Ts725tQSV+q3qvv66qv6n1FWGabmppaOzg4uBvAPgAviMh6InrWpovIf0R0D8AfACabzeaNsbGx+eVMTb2CmHk7EY2LyH4Az/SKT8bvE9EVEZlQSv2+VM6SBJj5BIBxAE8vEzgb9gCAJfFpUX4hAWb+GcBLKwTOpv2ilNqZN1cuAWa+C2B9NkFE5omo7ny/JhrYISK19COitTlg95RSz2X7uwgw800AW3ImuNhqtT4bGRmx44VtZmZma6VSOQ7g7ZygW0qprW5/B4EwDK+KyBuZRLsa40qpyX62g5ntaZkA0PHXRHQtCII307kWCSSC+yQDclQpdawf4GwsMx8BcDTTfzIVZpuAPWoApl21i8hNrfW2MuBprjHmTyJyl96ejlF7RNsEwjA8LyLvuWBRFNVqtVpbZGVbvV7f4ft+vWPviS4EQXCIjDHriOgvAOvSABE5rbX+sCywm2+M+YKIPnD65kRkiMIwPCgiXzkDDxcWFraPjo7+s5oEpqenNw0MDNhb8alFARK9Q8z8DYDXHbDCS6MsoZzL7VtLIARQdZZ/Qmv9flmwvHxjzFlbV5yxhtXAbSLa7BB4S2t9udFobInj2B6hd0uSuaSUal9KxpgDRHTJwfrbrsD/ANY4nUNa69vMfA7AoZLgaXr7PjHGPJ8IPu1/1EXA9/1Nw8PD/xZcICvl0yYwOzu7MYoiV9yPurbA87y91Wr1B4vEzNcB7FkpapL3ped5x6rV6q1Go/FqHMffZ7egQ4RE9HkQBB+XBM1ND8PwlIh81CFCZr6S2Ky0/yellLVeq96Y+QaAXc7Ek1YDewF85yzLfBRFL/Yqu/2ys2Xa9/3fMl7hNUrMpr2KXb93USl1sF+QpeKZ+euMR7jfbDaHCosRgP39eoAiAok3sFu92CgtRonau8oxgLtKqQ2rsQrMfCdjTDrLcULCOuAnY0jSv8xzwtaYxHG8r19vYD2A53mTGSNioTqKXZ4pLXLEp1ut1pleZdqW3UqlcjhT+9N/7HLGRba8yBk/BNAQkdnEwk0lM49Zi0VEw0llXaz5joa6HLEdK3yYFDjkFWky64Q7TkOPs/vknmaOMNPH6QHXN/ZYijkiulz6ceqCWPPqed7LIvIKgG0Fz3Nrv3+M4/i61npuOfv1GEgrvUth6rD9AAAAAElFTkSuQmCC" alt="删除分段">
              </div>
            </div>
          </div>
        </mapgis-ui-row>
      </div>
    </ThemePanel>
  </div>
</template>

<script>
import ThemePanel from "./ThemePanel";
import BaseLayer from "./BaseLayer";

export default {
  name: "mapgis-igs-range-theme-layer",
  inject: ["mapbox", "map"],
  mixins: [BaseLayer],
  components: {
    ThemePanel
  },
  props: {
    panelProps: {
      type: Object,
      default() {
        return {}
      }
    },
    themeDefaultType: {
      type: String,
      default: "分段专题图"
    }
  },
  watch: {
    startData: {
      handler: function () {
        if ((this.dataSourceCopy.length === 1 && Number(this.startData) >= Number(this.endData)) ||
            (this.dataSourceCopy.length > 1 && Number(this.startData) >= Number(this.dataSourceCopy[0]))) {
          //输入错误，改变输入框样式
          this.startNumWrong = true;
        } else {
          this.$_removeInputWrong();
        }
      }
    },
    endData: {
      handler: function () {
        if ((this.dataSourceCopy.length === 1 && Number(this.startData) >= Number(this.endData)) ||
            (this.dataSourceCopy.length > 1 && Number(this.endData) < Number(this.dataSourceCopy[this.dataSourceCopy.length - 1]))) {
          //输入错误，改变输入框样式
          this.endNumWrong = true;
        } else {
          this.$_removeInputWrong();
        }
      }
    },
    dataSourceCopy: {
      handler: function () {
        if (this.dataInit) {
          if(!this.addRange){
            let index = 0;
            for (let i = 0; i < this.dataSource.length; i++) {
              if (Number(this.dataSource[i]) !== Number(this.dataSourceCopy[i])) {
                index = i;
              }
            }

            if (index === 0 && Number(this.dataSourceCopy[index]) > Number(this.startData) && Number(this.dataSourceCopy[index]) < Number(this.dataSourceCopy[index + 1])) {
              this.$_setPaint(index);
            }else if (index === 0 && this.dataSourceCopy.length === 2 && Number(this.dataSourceCopy[index]) > Number(this.startData) && Number(this.dataSourceCopy[index]) < Number(this.endData)) {
              this.$_setPaint(index);
            } else if (index === this.dataSourceCopy.length && Number(this.dataSourceCopy[index]) > Number(this.dataSourceCopy[index - 1]) && Number(this.dataSourceCopy[index]) < Number(this.endData)) {
              this.$_setPaint(index);
            } else if (Number(this.dataSourceCopy[index - 1]) < Number(this.dataSourceCopy[index]) && Number(this.dataSourceCopy[index]) < Number(this.dataSourceCopy[index + 1])) {
              this.$_setPaint(index);
            } else {
              //输入错误，改变输入框样式
              this.$_inputWrong(index);
            }
          }
        }
      },
      deep: true
    }
  },
  data() {
    return {
      title: "分段专题图",
      themeType: "range",
      dataSourceCopy: undefined,
      dataInit: false,
      numWrong: -1,
      resetNum: true,
      endData: 0,
      endDataCopy: 0,
      startData: 0,
      startDataCopy: 0,
      startNumWrong: false,
      endNumWrong: false,
      offsetText: [0, 0],
      panelPropsDefault: {},
      addRange: false
    }
  },
  created() {
    this.$_formatProps();
  },
  mounted() {
    this.$_mount();
  },
  destroyed() {
    this.$_removeLayer();
  },
  methods: {
    $_deleteRange(index){
      if(this.rangeLevel > 2){
        this.$_removeIcon();
        this.rangeLevel--;
        this.addRange = true;
        if(index === 0){
          let endData = this.dataSourceCopy.splice(index,1);
          this.dataSource.splice(index,1);
          this.colors.splice(index,1);
          this.checkBoxArr.splice(index,1);
          this.$_setRangeColor(this.colors[index],this.startData,endData);
        }else if(index === this.dataSourceCopy.length - 1){
          this.dataSourceCopy.splice(index,1);
          this.dataSource.splice(index,1);
          this.colors.splice(index,1);
          this.checkBoxArr.splice(index,1);
          this.$_setRangeColor(this.colors[index - 1],this.dataSourceCopy[index - 1],this.endData);
        }else {
          let endData = this.dataSourceCopy.splice(index,1);
          this.dataSource.splice(index,1);
          this.colors.splice(index,1);
          this.checkBoxArr.splice(index,1);
          this.$_setRangeColor(this.colors[index],this.dataSourceCopy[index - 1],endData);
        }
        this.$nextTick(function () {
          this.addRange = false;
        });
        this.$_setDataSourceLocal();
      }
    },
    $_addRange(index){
      this.$_removeIcon();
      this.rangeLevel++;
      this.addRange = true;
      let startData = Number(this.dataSourceCopy[index]);
      let endData = Number(this.dataSourceCopy[index + 1]);
      if(index < this.dataSourceCopy.length - 1){
        if( startData < endData){
          let addNum = (startData + endData)/2;
          this.dataSourceCopy.splice(index + 1,0,addNum);
          this.dataSource.splice(index + 1,0,addNum);
          let newColors = this.$_gradientColor(this.colors[index],this.colors[index + 1],2);
          this.colors.splice(index + 1,0,newColors[1]);
          this.checkBoxArr.splice(index + 1,0,true);
          this.$_setRangeColor(newColors[1],startData,endData);
        }
      }else {
        let addNum = (endData - startData) + endData;
        this.colors.push(this.colors[index]);
        this.checkBoxArr.push(true);
        this.dataSourceCopy.push(addNum);
        this.dataSource.push(addNum);
      }
      this.$nextTick(function () {
        this.addRange = false;
      });
      this.$_setDataSourceLocal();
    },
    $_setDataSourceLocal(){
      if(!window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.dataSourceCopy){
        window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.dataSourceCopy = {};
        window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.startData = {};
        window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.endData = {};
      }
      window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.dataSourceCopy[this.selectValue] = this.dataSourceCopy;
      window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.startData[this.selectValue] = this.startData;
      window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.endData[this.selectValue] = this.endData;
    },
    removeLayer() {
      this.$_removeLayer();
    },
    toggleLayer() {
      this.$_toggleLayer();
    },
    $_outerLineColorChanged(color) {
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty("line-color", color, this.lineId, this.lineLayer);
          break;
        case "circle":
          this.$_setPaintProperty("circle-stroke-color", color, this.layerIdCopy + "_" + this.$_getThemeName(), window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()]);
          break;
      }
    },
    $_fontChanged(font) {
      this.textFont = font;
      this.$_setLayOutProperty("text-font", [this.textFont,this.textFont], this.textId, this.textLayer);
    },
    $_lineWidthChanged(lineWidth) {
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty("line-width", lineWidth, this.lineId, this.lineLayer);
          break;
        case "line":
          this.$_setPaintProperty("line-width", lineWidth, this.lineId, this.lineLayer);
          break;
        case "circle":
          this.$_setPaintProperty("circle-stroke-width", lineWidth, this.lineId, this.lineLayer);
          break;
      }
    },
    $_outerLineOpacityChanged(opacity) {
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty("line-opacity", opacity, this.lineId, this.lineLayer);
          break;
        case "circle":
          this.$_setPaintProperty("circle-stroke-opacity", opacity, this.layerIdCopy + "_" + this.$_getThemeName(), window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()]);
          break;
      }
    },
    $_opacityChangedCallBack(opacity) {
      let opacityType = "";
      switch (this.dataType) {
        case "fill":
          opacityType = "fill-opacity";
          break
        case "line":
          opacityType = "line-opacity";
          break;
        case "circle":
          opacityType = "circle-opacity";
          break;
      }
      this.$_setPaintProperty(opacityType, opacity);
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
    $_panelClick() {
      if (this.numWrong >= 0 && this.resetNum) {
        this.dataSourceCopy[this.numWrong] = this.dataSource[this.numWrong];
        this.numWrong = -1;
      }
    },
    $_changeColor(index) {
      this.isGradient = false;
      this.$_setColorsToLocal(this.colors);
      this.$_removeIcon();
      let changeFlag = this.checkBoxArr[index];
      if(changeFlag){
        let startData = this.$_getStartEndData(index).startData;
        if(index === 0){
          startData = startData - (this.dataSourceCopy[1] - this.dataSourceCopy[0]);
        }
        this.$_setRangeColor(this.colors[index],startData,this.$_getStartEndData(index).endData);
      }
    },
    $_inputStartChange() {
      this.direction = "start";
    },
    $_inputEndChange() {
      this.direction = "end";
    },
    $_removeInputWrong() {
      this.numWrong = -1;
      this.startNumWrong = false;
      this.endNumWrong = false;
    },
    $_inputWrong(index) {
      this.numWrong = index;
    },
    $_setPaint(index) {
      this.$_removeIcon();
      this.$_removeInputWrong();
      this.$_setRangeColor(this.colors[index],this.$_getStartEndData(index).startData,this.$_getStartEndData(index).endData,true);
      this.$_setRangeColor(this.colors[index + 1],this.$_getStartEndData(index + 1).startData,this.$_getStartEndData(index + 1).endData);
      this.dataSource[index] = Number(this.dataSourceCopy[index]);
    },
    $_checkboxChecked(e) {
      let value = e.target.value.item;
      let color = e.target.value.color;
      let index = 0;
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (Number(value) === Number(this.dataSourceCopy[i])) {
          index = i;
          break;
        }
      }
      if (index >= 0) {
        this.$set(this.checkBoxArr, index, !this.checkBoxArr[index]);
      }
      this.$_checked(this.checkBoxArr, index, color);
    },
    /*
    * 多选框业务实现
    * @param checkBoxArr 多选框的选中状态数组，true为选中，false为未选中
    * @param index 当前点被点击的复选框的index
    * @param checkColor 当前点击的复选框的颜色
    * **/
    $_checked(checkBoxArr, index, checkColor) {
      let color;
      if(!checkBoxArr[index]){
        color = "#ffffff";
      }else {
        color = checkColor;
      }
      this.$_setCheckBoxToLocal(checkBoxArr);
      this.$_removeIcon();
      this.$_setRangeColor(color,this.$_getStartEndData(index).startData,this.$_getStartEndData(index).endData);
      this.showVector = true;
      this.changeLayerProp = true;
      this.changeLayerId = this.layerIdCopy;
    },
    $_getStartEndData(index){
      let startData,endData;
      if(index === 0){
        startData = this.startData;
        endData = this.dataSourceCopy[index];
      }else if(index === this.dataSourceCopy.length - 1){
        startData = this.dataSourceCopy[index - 1];
        endData = this.endData;
      }else {
        startData = this.dataSourceCopy[index - 1];
        endData = this.dataSourceCopy[index];
      }
      return {
        startData: Number(startData),
        endData: Number(endData)
      }
    },
    $_setRangeColor(color,startData,endData,noPaint){
      let paintColor = window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()].paint[this.dataType + "-color"];
      let length = (paintColor.length - 1)/2;
      for (let i = 0;i <length;i++){
        if(paintColor[2 + i * 2 + 1] >= startData && paintColor[2 + i * 2 + 1] < endData){
          if(i === 0){
            paintColor.splice(2,1,color);
          }
          paintColor.splice(2 + (i + 1) * 2,1,color);
        }
      }
      window.originThemeData[this.layerIdCopy][this.themeType + "_" + this.selectKey] = paintColor;
      if(!noPaint){
        this.$_setPaintByType(paintColor,true);
      }else {
        window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()].paint[this.dataType + "-color"] = paintColor;
      }
    },
    /*
    * 字段选择的回调函数，在该回调函数中应该重置绘制参数window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()].paint
    * @param colors 针对该字段的颜色信息
    * **/
    $_selectChangeCallBack(colors) {
      this.dataInit = false;
      this.$_getDataFromLocal(this.dataSource,true);
      this.$nextTick(function () {
        this.dataInit = true;
      });
    },
    /*
    * 取得color列表的方法，该方法必须返回一个originColors对象
    * @param colors 一个空的mapbox绘制规则对象，调用者需要自行指定绘制规则
    * @param dataSource 要素信息，绘制规则使用
    * @param startColor 渐变开始颜色，可自行指定
    * @param endColor 渐变结束颜色，可自行指定
    * @param key 绘制规则针对的关键字
    * **/
    $_getColorsCallBack(colors, dataSource, startColor, endColor, key,features) {
      let checkArr = [], colorList = [];
      let gradient;
      if(endColor.indexOf(",") > -1){
        gradient = endColor.split(",");
        this.rangeLevel = gradient.length;
        this.dataSource = this.$_getData(this.dataCopy.features, this.selectValue);
        let dataSourceCopy = [];
        for (let i = 0; i < this.dataSource.length; i++) {
          dataSourceCopy.push(this.dataSource[i]);
        }
        this.dataSourceCopy = dataSourceCopy;

        dataSource = this.dataSourceCopy;
      }else {
        gradient = this.$_gradientColor(startColor, endColor, dataSource.length);
      }
      colors = {
        "property": key,
        "stops": []
      };
      for (let i = 0; i < dataSource.length; i++) {
        colors.stops.push([dataSource[i], gradient[i]]);
        colorList.push(gradient[i]);
        checkArr.push(true);
      }
      this.checkArr = checkArr;
      return {
        checkArr: checkArr,
        colors: colors,
        colorList: colorList
      }
    },
    $_getDataFromLocal(dataSource,refreshData){
      let dataSourceCopyProps;
      if (
          window.originLayer[this.layerIdCopy] &&
          window.originLayer[this.layerIdCopy].hasOwnProperty("panelProps") &&
          window.originLayer[this.layerIdCopy].panelProps.hasOwnProperty(this.themeType) &&
          window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("dataSourceCopy") &&
          window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.dataSourceCopy.hasOwnProperty(this.selectValue) &&
          !refreshData
      ) {
        let panelProps =
            window.originLayer[this.layerIdCopy].panelProps[this.themeType]
                .panelProps;
        if (panelProps.hasOwnProperty("dataSourceCopy")) {
          dataSourceCopyProps = panelProps.dataSourceCopy[this.selectValue];
          this.startData = panelProps.startData[this.selectValue];
          this.endData = panelProps.endData[this.selectValue];
        }
      }
      if (dataSourceCopyProps) {
        this.dataSourceCopy = dataSourceCopyProps;
      } else {
        let dataSourceCopy = [];
        for (let i = 0; i < dataSource.length; i++) {
          dataSourceCopy.push(dataSource[i]);
        }
        this.dataSourceCopy = dataSourceCopy;
      }
    },
    /*
    * 初始化专题图样式的业务逻辑
    * @param geojson geojson数据
    * @fillColors 处理好的颜色信息
    * **/
    $_initThemeCallBack(geojson, fillColors, dataSource,minzoom,maxzoom) {
      this.$_getDataFromLocal(dataSource);
      this.$nextTick(function () {
        this.dataInit = true;
      });
      fillColors = this.$_editColor(fillColors);
      if (geojson.features.length > 0 && (geojson.features[0].geometry.type === "MultiPolygon" || geojson.features[0].geometry.type === "Polygon")) {
        this.dataType = 'fill';
        if(!window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()]){
          window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()] = {
            id: this.layerIdCopy + "_分段专题图",
            type: 'fill',
            source: this.source_vector_Id, //必须和上面的layerVectorId一致
            layout: {
              'visibility': "visible"
            },
            paint: {
              'fill-antialias': true, //抗锯齿，true表示针对边界缝隙进行填充
              'fill-color': fillColors, //颜色
              'fill-opacity': this.opacity, //透明度
              'fill-outline-color': '#fff', //边线颜色，没错,确实没有边线宽度这个选项
            },
            minzoom: minzoom,
            maxzoom: maxzoom
          }
          this.$_addLineLayer(minzoom,maxzoom);
        }
      } else if (geojson.features.length > 0 && (geojson.features[0].geometry.type === "MultiPoint" || geojson.features[0].geometry.type === "Point")) {
        this.dataType = 'circle';
        if(!window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()]){
          window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()] = {
            id: this.layerIdCopy + "_分段专题图",
            type: 'circle',
            source: this.source_vector_Id, //必须和上面的layerVectorId一致
            layout: {
              'visibility': "visible"
            },
            paint: {
              'circle-color': fillColors, //颜色
              'circle-opacity': this.opacity, //透明度
              'circle-stroke-opacity': this.outerLineOpacity, //透明度
              'circle-radius': this.radius, //透明度
              'circle-stroke-color': this.outerLineColor,//边线颜色，没错,确实没有边线宽度这个选项
              'circle-stroke-width': this.lineWidth,
              'circle-translate': this.offset,
            },
            minzoom: minzoom,
            maxzoom: maxzoom
          }
        }
      } else if (geojson.features.length > 0 && geojson.features[0].geometry.type === "LineString") {
        this.dataType = 'line';
        if(!window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()]){
          window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()] = {
            id: this.layerIdCopy + "_分段专题图",
            type: 'line',
            source: this.source_vector_Id, //必须和上面的layerVectorId一致
            layout: {
              'visibility': "visible"
            },
            paint: {
              'line-color': fillColors, //颜色
              'line-opacity': this.opacity, //透明度
              'line-width': this.lineWidth,
            },
            minzoom: minzoom,
            maxzoom: maxzoom
          }
        }
      }
      if (this.source_vector_layer_Id && !window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()]["source-layer"]) {
        window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()]["source-layer"] = this.source_vector_layer_Id;
      }
      this.title = "分段" + "_" + this.layerIdCopy;
      if(!window.originThemeData[this.layerIdCopy][this.themeType + "_" + this.selectKey]){
        window.originThemeData[this.layerIdCopy][this.themeType + "_" + this.selectKey] = fillColors;
      }
      this.$_addTextLayer(minzoom,maxzoom);
      if(this.dataType === "fill"){
        if(!window.originLayer[this.layerIdCopy].layerOrder){
          window.originLayer[this.layerIdCopy].layerOrder = [this.layerIdCopy,this.layerIdCopy + "_" + this.$_getThemeName(),this.lineId,this.textId];
        }
      }else {
        if(!window.originLayer[this.layerIdCopy].layerOrder){
          window.originLayer[this.layerIdCopy].layerOrder = [this.layerIdCopy,this.layerIdCopy + "_" + this.$_getThemeName(),this.textId];
        }
      }
    },
    $_editGeoJSON(geojson) {
      return geojson;
    }
  }
}
</script>

<style scoped>
.theme-panel-td-border-right {
  border-right: 1px solid rgb(217, 217, 217);
}

.theme-panel-td {
  position: relative;
  display: inline-block;
  text-align: center;
  width: 10%;
  height: 44px;
  line-height: 2;
  float: left;
  padding-top: 6px;
}

.theme-panel-color-picker {
  cursor: pointer;
  display: inline-block;
  width: 10px;
  height: 10px;
}

.theme-panel-td-add{
  width: 9%;
  cursor: pointer;
}

.theme-panel-img-add{
  width: 16px;
}

.theme-panel-td-delete{
  width: 7%;
  cursor: pointer;
}

.theme-panel-color-picker .picker {
  position: absolute;
  top: 16px;
  right: 7px;
}

.theme-panel-color-picker .picker .colorBtn {
  margin-left: 20px;
}

.range-theme-num {
  width: 64px;
}

.range-theme-list-item {
  width: 100%;
  height: 44px;
}

.theme-panel-list{
  border-top: 1px solid rgb(217, 217, 217);
  border-left: 1px solid rgb(217, 217, 217);
  border-right: 1px solid rgb(217, 217, 217);
}

.panelListFirst{
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.panelListLast{
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: 1px solid rgb(217, 217, 217);
}

/deep/ .mapgis-ui-list-bordered .mapgis-ui-list-item {
  padding: 0;
}

.theme-panel-td-input-num {
  width: 25%;
}

.theme-panel-td-checkbox, .theme-panel-td-index {
  padding-top: 10px;
}
.theme-panel-input-wrong{
  position: absolute;
  left: 54px;
  top: 12px;
  width: 20px;
  height: 20px;
  z-index: 100;
}
</style>