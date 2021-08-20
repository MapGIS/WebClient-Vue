<template>
  <div>
    <ThemePanel
        ref="themePanel"
        v-if="!resetPanel"
        v-show="showPanelFlag"
        :title="title"
        :data-source="dataSource"
        :fields="fields"
        :labelFields="allFields"
        :colors="colors"
        :dataType="themeType"
        :checkBoxArr="checkBoxArr"
        :showOutLineColor="false"
        :showRange="showRange"
        :icons="icons"
        :panelProps="panelPropsDefault"
        :textFonts="textFonts"
        :themeDefaultType="themeDefaultType"
        :themeType="themeTypeArrCopy"
        :activeKey="activeKey"
        :iconUrl="iconUrl"
        :defaultIconValue="defaultIconValue"
        @iconLoaded="$_iconLoaded"
        @oneColorChanged="$_oneColorChanged"
        @checked="$_checked"
        @closePanel="$_closePanel"
        @panelClick="$_panelClick"
        @change="$_selectChange"
        @gradientChange="$_gradientChange"
        @lineColorChanged="$_lineColorChanged"
        @opacityChanged="$_opacityChanged"
        @radiusChanged="$_radiusChanged"
        @rotationChanged="$_rotationChanged"
        @xOffsetChanged="$_xOffsetChanged"
        @yOffsetChanged="$_yOffsetChanged"
        @lineWidthChanged="$_lineWidthChanged"
        @fontColorChanged="$_fontColorChanged"
        @haloColorChanged="$_haloColorChanged"
        @haloWidthChanged="$_haloWidthChanged"
        @fontSizeChanged="$_fontSizeChanged"
        @yOffsetTextChanged="$_yOffsetTextChanged"
        @xOffsetTextChanged="$_xOffsetTextChanged"
        @textPaddingChanged="$_textPaddingChanged"
        @textRotationChanged="$_textRotationChanged"
        @selectTextChanged="$_selectTextChanged"
        @beginSearch="$_beginSearch"
        @singleChanged="$_singleChanged"
        @clickIcon="$_clickIcon"
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
              <div class="theme-panel-td theme-panel-td-border-right">
                <div class="theme-panel-color-picker" @click="$_showRadius(index)">
                  <div class="theme-panel-radius" :style="{width: 20 - (10 / dataSourceCopy.length) * (dataSourceCopy.length - index) + 'px',height: 20 - (10 / dataSourceCopy.length) * (dataSourceCopy.length - index) + 'px',marginTop: (10 / dataSourceCopy.length) * (dataSourceCopy.length - index) / 2 + 'px',marginLeft: (10 / dataSourceCopy.length) * (dataSourceCopy.length - index) / 2 + 'px'}"/>
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
                                 v-if="index < dataSourceCopy.length && dataSourceCopy.length > 1">
                </mapgis-ui-input>
              </div>
              <div class="theme-panel-td theme-panel-td-add theme-panel-td-border-right" @click="$_addRange(index)">
                <img class="theme-panel-img-add" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABEZJREFUWEe1V01sVUUU/s68vtomxY2BWMVEEwNRU9/rzLxdVVi4EAjGRdlIVARd4EZAILIBE6PBqDX4kxjE/7iAhbHiT2IMGOvGzkxfjaXWhXHhT6CykSZN2r45Zl7ufbnvcu/70Xo3792ZM9/57jlnvjlD6PJxzq313t8khFgP4GZmvgbAvBDiEjNPSinnu4GkTowjp6NCiFFm3tRqDTN/BuDzYrE4XiqVfmuH35JAcMzMxwCMAljbDiw1fxnA+0T0npRyOm9tLoHJyclNQoiTAG7t0nGW+T6l1CtZE5kEjDF7iej19AIi+sp7P0tEF4hoFsCs956ZeWOhUNgYfoko/N6f4eyYUuqZqzDTA9baRwC8kxwnoovM/KxS6rVOomGM2UNEJwD0p+x3KaXebcJOvhhjRonodGrRB729vQeHhoYupp2HGgljWZVvjBkkoi8B3Jlcx8w7tNZn4rFGCpxzJWauppxkhi3YGGMOENHh8J+Zj2utX8qKjrX2KIBQyI2HiMpxYTYIWGtfBrAvYTeulMrKZd3EOXcu3pJEdF5KuTkvPc6555j56cT8mFJqf3ivE5ienl6/srISvv666IvC/r1Xa/1TC9COCQQMa60BoCK8yz09PeWgE3UC1tqDAF6InTHzg1rrj1oVXDcRiHw8DuDNBOZ+pdRYTOB7AJVo8lOl1PZWzrtNQYxljPmFiG6phz5KGznnbmfmmaz8rGYEItInmXlPjNvX1zcYCGxn5k8S4X9Ca/3G/xGBSF3PxdhCiK2BwKPMfCoe9N5vrlQq56O87SSi3Xlkkrughc0ppdSHYb5arW6o1WpzCdtdZK09BOB4PEhE64KwVKvVG2u1WpDbNe2i0Wb+SqFQuK1cLv8+MTGxpr+//++E/aFAoGkHLC4uXjsyMnIlOglDbXR7Cqb5zBPRHeGj8gg0aX84VMrl8s8BJaidEGLbf0mB9/5srJKZKZiamtrivQ9NRP1J1sBq74K8IgxNx6XELngqT9eThLoVomgbvsjMB5L1VhciY8xZItoaCcQZKeWOdoX3bwgYY+aIaEPADq2b1npbTKCpASGiLVLKL1YzBdbaJilm5rreZB5GAL5VSt29ygTyD6NIdJqOYyJqmYpuUuCcO83MobGNn+bjOCqQrhoSa+1OALFk743VLh21jhuSKApPAhhLghDR81LKI1npCGoZxoPKZc1nNCKh+B7TWr/V2AmdMA41ERFpWZgxlnPuvqgDuiuFf1gp1eg76rsui3lWZxzZfRwaKO/9N8Vi8Y+FhYU/w/jAwMDg8vLyDUKIewCUADyQwv0rHGpSyvG0v9yLSU6H3E4erppn5jlm3l2pVL7LWtzuahYK82EAD8X9YhcMFgG8WigUTuTVSG4K0k6ipjXcGULz0u5y+iMRfQ3gbaXUD+0Id3Q7ToLMzMxcv7S0JL336xJHdf16DuDC8PDwr+2cJuf/AZGKXgkO+31+AAAAAElFTkSuQmCC" alt="新增分段">
              </div>
              <div class="theme-panel-td theme-panel-td-delete" @click="$_deleteRange(index)">
                <img class="theme-panel-img-add" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA7lJREFUWEfFV02MFEUU/l737GGJSIzIBXCBgwknd7qK2T2sXOCKikYhKMarJGtI9OJP5CeAF0kIG+BqFAgL/nLGi+5hd6zXs55MPAiiXgBDlkXmsNP9SE26NzU93Ts725tQSV+q3qvv66qv6n1FWGabmppaOzg4uBvAPgAviMh6InrWpovIf0R0D8AfACabzeaNsbGx+eVMTb2CmHk7EY2LyH4Az/SKT8bvE9EVEZlQSv2+VM6SBJj5BIBxAE8vEzgb9gCAJfFpUX4hAWb+GcBLKwTOpv2ilNqZN1cuAWa+C2B9NkFE5omo7ny/JhrYISK19COitTlg95RSz2X7uwgw800AW3ImuNhqtT4bGRmx44VtZmZma6VSOQ7g7ZygW0qprW5/B4EwDK+KyBuZRLsa40qpyX62g5ntaZkA0PHXRHQtCII307kWCSSC+yQDclQpdawf4GwsMx8BcDTTfzIVZpuAPWoApl21i8hNrfW2MuBprjHmTyJyl96ejlF7RNsEwjA8LyLvuWBRFNVqtVpbZGVbvV7f4ft+vWPviS4EQXCIjDHriOgvAOvSABE5rbX+sCywm2+M+YKIPnD65kRkiMIwPCgiXzkDDxcWFraPjo7+s5oEpqenNw0MDNhb8alFARK9Q8z8DYDXHbDCS6MsoZzL7VtLIARQdZZ/Qmv9flmwvHxjzFlbV5yxhtXAbSLa7BB4S2t9udFobInj2B6hd0uSuaSUal9KxpgDRHTJwfrbrsD/ANY4nUNa69vMfA7AoZLgaXr7PjHGPJ8IPu1/1EXA9/1Nw8PD/xZcICvl0yYwOzu7MYoiV9yPurbA87y91Wr1B4vEzNcB7FkpapL3ped5x6rV6q1Go/FqHMffZ7egQ4RE9HkQBB+XBM1ND8PwlIh81CFCZr6S2Ky0/yellLVeq96Y+QaAXc7Ek1YDewF85yzLfBRFL/Yqu/2ys2Xa9/3fMl7hNUrMpr2KXb93USl1sF+QpeKZ+euMR7jfbDaHCosRgP39eoAiAok3sFu92CgtRonau8oxgLtKqQ2rsQrMfCdjTDrLcULCOuAnY0jSv8xzwtaYxHG8r19vYD2A53mTGSNioTqKXZ4pLXLEp1ut1pleZdqW3UqlcjhT+9N/7HLGRba8yBk/BNAQkdnEwk0lM49Zi0VEw0llXaz5joa6HLEdK3yYFDjkFWky64Q7TkOPs/vknmaOMNPH6QHXN/ZYijkiulz6ceqCWPPqed7LIvIKgG0Fz3Nrv3+M4/i61npuOfv1GEgrvUth6rD9AAAAAElFTkSuQmCC" alt="删除分段">
              </div>
            </div>
            <div class="range-theme-list-item" style="border-top: 1px solid rgb(217, 217, 217)" v-if="radiusIndex === index">
              <mapgis-ui-row>
                <mapgis-ui-col :span="5">
                  <p class="theme-panel-icon-title">图标半径</p>
                </mapgis-ui-col>
                <mapgis-ui-col :span="14">
                  <mapgis-ui-slider
                      :min="0"
                      :max="20"
                      v-model="radiusArr[index]"
                      class="theme-panel-slider theme-panel-icon-slider"
                  />
                </mapgis-ui-col>
                <mapgis-ui-col :span="3">
                  <mapgis-ui-input-number
                      v-model="radiusArr[index]"
                      class="theme-panel-input-number theme-panel-input-icon-number"/>
                </mapgis-ui-col>
              </mapgis-ui-row>
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
  name: "mapgis-igs-symbol-theme-layer",
  inject: ["mapbox", "map"],
  mixins: [BaseLayer],
  components: {
    ThemePanel
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
            this.$_removeInputWrong();
            if (index === 0 && Number(this.dataSourceCopy[index]) > Number(this.startData) && Number(this.dataSourceCopy[index]) < Number(this.dataSourceCopy[index + 1])) {
              this.$_setIconSize();
            }else if (index === 0 && this.dataSourceCopy.length === 2 && Number(this.dataSourceCopy[index]) > Number(this.startData) && Number(this.dataSourceCopy[index]) < Number(this.endData)) {
              this.$_setIconSize();
            } else if (index === this.dataSourceCopy.length && Number(this.dataSourceCopy[index]) > Number(this.dataSourceCopy[index - 1]) && Number(this.dataSourceCopy[index]) < Number(this.endData)) {
              this.$_setIconSize();
            } else if (Number(this.dataSourceCopy[index - 1]) < Number(this.dataSourceCopy[index]) && Number(this.dataSourceCopy[index]) < Number(this.dataSourceCopy[index + 1])) {
              this.$_setIconSize();
            } else {
              //输入错误，改变输入框样式
              this.$_inputWrong(index);
            }
          }
        }
      },
      deep: true
    },
    radiusArr: {
      handler: function () {
        if(this.dataInit && !this.addRange){
          this.$_setIconSize();
        }
      }
    }
  },
  data() {
    return {
      title: "符号专题图",
      themeType: "symbol",
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
      hasString: false,
      showRange: false,
      radius: 0.5,
      fontSize: 11,
      offset: [0, 1.5],
      offsetText: [0, 0],
      textPadding: 0.05,
      textRotation: 0,
      haloColor: "#FFFFFF",
      haloWidth: 0,
      panelPropsDefault: {
        "icon-size" : 1
      },
      activeKey: ['2'],
      iconsJson: undefined,
      defaultIconValue: undefined,
      radiusIndex: undefined,
      radiusArr:[],
      addRange: false
    }
  },
  props: {
    icons: {
      type: Array
    },
    panelProps: {
      type: Object,
      default(){
        return {
        }
      }
    },
    themeDefaultType: {
      type: String,
      default: "符号专题图"
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
    $_setIconSize(){
      let radiusArr = [];
      for (let i =0;i<this.radiusArr.length;i++){
        let index = typeof this.radiusArr[i] === 'number' ? this.radiusArr[i] : this.radiusArr[i][0];
        radiusArr.push(index);
      }
      let iconSize = ["case"];
      iconSize.push(["<", ["to-number",["get", this.selectValue]], Number(this.startData)]);
      iconSize.push(1);
      for (let i = 0;i < this.dataSourceCopy.length;i++){
        iconSize.push(["<=", ["to-number",["get", this.selectValue]], Number(this.dataSourceCopy[i])]);
        iconSize.push(radiusArr[i]);
      }
      iconSize.push(1);
      this.$_setLayOutProperty("icon-size",iconSize,this.layerIdCopy + "_" + this.$_getThemeName(),window.originLayer[this.layerIdCopy][this.layerIdCopy + this.$_getThemeName()]);
    },
    $_removeIcon() {
      let themeId = this.layerIdCopy + "_" + this.$_getThemeName();
      let paintName;
      switch (this.dataType) {
        case "fill":
          paintName = "fill-pattern";
          break;
        case "line":
          paintName = "line-pattern";
          break;
      }
      if (window.originLayer[this.layerIdCopy][themeId].paint[paintName]) {
        if (this.map.getLayer(themeId)) {
          this.map.removeLayer(themeId);
          delete window.originLayer[this.layerIdCopy][themeId].paint[paintName];
          this.map.addLayer(window.originLayer[this.layerIdCopy][themeId]);
        }
      }
    },
    $_deleteRange(index){
      if(this.rangeLevel > 2){
        this.$_removeIcon();
        this.rangeLevel--;
        this.addRange = true;
        this.dataSourceCopy.splice(index - 1,1);
        this.$_setDataSource();
        this.checkBoxArr.splice(index,1);
        this.radiusArr.splice(index,1);
        window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusArr = this.radiusArr;
        if(this.radiusIndex && this.radiusIndex >= index){
          this.radiusIndex--;
        }
        if(!window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.dataSourceCopy){
          window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.dataSourceCopy = {};
        }
        window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.dataSourceCopy[this.selectValue] = this.dataSourceCopy;
        if(this.radiusIndex >= index){
          if(window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("radiusIndex") &&
              window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusIndex.hasOwnProperty(this.selectValue)
          ){
            window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusIndex[this.selectValue]--;
          }
        }
        this.$_setIconSize();
        this.$nextTick(function () {
          this.addRange = false;
        });
      }
    },
    $_addRange(index){
      this.$_removeIcon();
      this.addRange = true;
      let startData = Number(this.dataSourceCopy[index]);
      let endData
      if(this.dataSourceCopy.length === 2){
        endData = this.endData;
      }else {
        endData = Number(this.dataSourceCopy[index + 1]);
      }
      if(index < this.dataSourceCopy.length - 1){
        if( startData < endData){
          let addNum = (startData + endData)/2;
          this.dataSourceCopy.splice(index + 1,0,addNum);
          this.$_setDataSource();
          this.radiusArr.splice(index + 1,0,this.radiusArr[index]);
          this.checkBoxArr.splice(index + 1,0,true);
          this.rangeLevel++;
        }
      }else {
        let addNum = (this.dataSourceCopy[index] - this.dataSourceCopy[index - 1]) + this.dataSourceCopy[index];
        this.checkBoxArr.push(true);
        this.radiusArr.splice(index + 1,0,this.radiusArr[index]);
        this.dataSourceCopy.push(addNum);
        this.$_setDataSource();
        this.endData = addNum;
        this.rangeLevel++;
      }
      if(!window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusArr){
        window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusArr = {};
      }
      window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusArr[this.selectValue] = this.radiusArr;
      if(!window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.endData){
        window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.endData = {};
      }
      window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.endData[this.selectValue] = this.endData;
      if(!window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.dataSourceCopy){
        window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.dataSourceCopy = {};
      }
      window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.dataSourceCopy[this.selectValue] = this.dataSourceCopy;
      if(this.radiusIndex >= index){
        if(window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("radiusIndex") &&
            window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusIndex.hasOwnProperty(this.selectValue)
        ){
          window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusIndex[this.selectValue]++;
        }
      }
      if(this.radiusIndex && this.radiusIndex >= index){
        this.radiusIndex++;
      }
      this.$nextTick(function () {
        this.addRange = false;
      });
    },
    hideLayer(){
      this.$_hideLayer();
    },
    $_hideLayer(){
      this.$_setLayOutProperty("visibility","none",this.layerIdCopy + "_symbol",window.originLayer[this.layerIdCopy][this.layerIdCopy + "_symbol"]);
    },
    removeLayer() {
      this.$_removeLayer();
    },
    $_showRadius(index){
      if(this.radiusIndex === index){
        this.radiusIndex = undefined;
      }else {
        this.radiusIndex = index;
      }
      if(!window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("radiusIndex")){
        window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusIndex = {};
      }
      window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusIndex[this.selectValue] = this.radiusIndex;
    },
    toggleLayer() {
      this.$_toggleLayer();
    },
    $_beginSearch(key, operate, value) {
      let newData = [], colors;
      switch (operate) {
        case "=":
          newData = [];
          for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i] === value) {
              newData.push(value);
            }
          }
          break;
        case "like":
          newData = [];
          for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].indexOf(value) >= 0) {
              newData.push(this.dataSource[i]);
            }
          }
          break;
      }
      this.dataSource = newData;
      this.dataBack = newData;
      colors = this.$_editColor();
      this.$_setPaintProperty("icon-color", colors);
    },
    $_iconLoaded(json){
      this.iconsJson = json;
    },
    $_fontColorChanged(color) {
      this.$_setPaintProperty("text-color", color);
    },
    $_haloColorChanged(color) {
      this.$_setPaintProperty("text-halo-color", color);
    },
    $_haloWidthChanged(color) {
      this.$_setPaintProperty("text-halo-width", color);
    },
    $_fontSizeChanged(fontSize) {
      this.$_setLayOutProperty("text-size", fontSize);
    },
    $_setTextOffSet(offsetText){
      let textOffset = ["case"];
      textOffset.push(["<", ["to-number",["get", this.selectValue]], this.startData]);
      textOffset.push(["literal",[offsetText[0],0.5 + offsetText[1]]]);
      for (let i = 0;i < this.dataSourceCopy.length;i++){
        textOffset.push(["<=", ["to-number",["get", this.selectValue]], this.dataSourceCopy[i]]);
        textOffset.push(["literal",[offsetText[0],(i + 2)/2 + offsetText[1]]]);
      }
      textOffset.push(["literal",[offsetText[0],0.5 + offsetText[1]]]);
      if(!window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.textOffset){
        window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.textOffset = {}
      }
      window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.textOffset[this.selectValue] = textOffset;
      if(!window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps["text-offset"]){
        window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps["text-offset"] = {}
      }
      window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps["text-offset"][this.selectValue] = offsetText;
      return textOffset;
    },
    $_yOffsetTextChanged(offset) {
      this.offsetText[1] = offset;
      this.map.setLayoutProperty([this.layerIdCopy + "_" + this.$_getThemeName()],"text-offset",this.$_setTextOffSet(this.offsetText));
    },
    $_xOffsetTextChanged(offset) {
      this.offsetText[0] = offset;
      this.map.setLayoutProperty([this.layerIdCopy + "_" + this.$_getThemeName()],"text-offset",this.$_setTextOffSet(this.offsetText));
    },
    $_textPaddingChanged(textPadding) {
      this.textPadding = textPadding;
      this.$_setLayOutProperty("text-letter-spacing", textPadding);
    },
    $_textRotationChanged(textRotation) {
      this.textRotation = textRotation;
      this.$_setLayOutProperty("text-rotate", textRotation);
    },
    $_selectTextChanged(value) {
      this.selectText = value;
      this.$_setLayOutProperty("text-field", '{' + value + '}');
    },
    $_radiusChanged(radius) {
      this.$_setLayOutProperty("icon-size", radius);
    },
    $_rotationChanged(rotation) {
      this.$_setLayOutProperty("icon-rotate", rotation);
    },
    $_xOffsetChanged(xOffset) {
      this.offset[0] = xOffset;
      this.$_setLayOutProperty("icon-offset", this.offset);
    },
    $_yOffsetChanged(yOffset) {
      this.offset[1] = yOffset;
      this.$_setLayOutProperty("icon-offset", this.offset);
    },
    $_singleChanged(startColor, endColor) {
      this.$_gradientChange(startColor, endColor);
    },
    $_fontChanged(font){
      this.textFont = font;
      this.$_setLayOutProperty("text-font",[this.textFont,this.textFont],this.layerIdCopy + "_" + this.$_getThemeName(),window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()]);
    },
    $_clickIcon(icon) {
      let hasIcon = this.map.hasImage(icon);
      if (hasIcon) {
        this.$_setLayOutProperty("icon-image", icon);
      }
    },
    $_gradientChange(startColor, endColor) {
      this.showVector = false;
      this.startColor = startColor;
      this.endColor = endColor;
      this.$_getColors(this.dataSource, startColor, endColor, this.selectKey, false, true);
      let colors = this.$_editColor();
      this.$_setPaintProperty('icon-color', colors);
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
      this.$_oneColorChanged(index, this.colors[index]);
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
    /*
    * 从data里面获取colors信息，如果index, color有值，则更新colors，此方法必须被重载
    * @param index 被改变颜色的数据index
    * @param color 被改变的颜色
    * **/
    /*
    * 修改单一属性的颜色的回调方法
    * @param colors 颜色信息
    * **/
    $_oneColorChangedCallBack(colors) {
      colors = this.$_editColor();
      this.$_setPaintProperty('icon-color', colors);
    },
    /*
    * 改变透明度的回调方法
    * @param opacity 透明度
    * **/
    $_opacityChangedCallBack(opacity) {
      this.$_setPaintProperty('icon-opacity', opacity);
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
    $_checked() {
      let newColors = this.$_editColor();
      this.$_setPaintProperty('icon-color', newColors);
      this.changeLayerProp = true;
      this.changeLayerId = this.layerIdCopy;
    },
    $_changeOriginLayer() {
    },
    /*
    * 字段选择的回调函数，在该回调函数中应该重置绘制参数window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()].paint
    * @param colors 针对该字段的颜色信息
    * **/
    $_selectChangeCallBack() {
      this.dataInit = false;
      this.radiusIndex = undefined;
      this.radiusArr = [];
      this.dataSourceCopy = this.dataSource;
      if (window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("endData") &&
          window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.endData.hasOwnProperty(this.selectValue)){
        this.endData = window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.endData[this.selectValue];
      }
      if (window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("radiusArr") &&
          window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusArr.hasOwnProperty(this.selectValue)) {
        this.radiusArr = window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusArr[this.selectValue];
      }else {
        for (let i = 0; i < this.dataSourceCopy.length; i++) {
          this.radiusArr.push([i + 2]);
        }
        window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusArr[this.selectValue] = this.radiusArr;
      }
      if (window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("icon-size") &&
          window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps["icon-size"].hasOwnProperty(this.selectValue)){
        let iconSize = window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps["icon-size"][this.selectValue];
        this.$_setLayOutProperty("icon-size",iconSize,this.layerIdCopy + "_" + this.$_getThemeName(),window.originLayer[this.layerIdCopy][this.layerIdCopy + this.$_getThemeName()]);
      }else {
        this.$_setIconSize();
      }
      if (window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("radiusIndex") &&
          window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusIndex.hasOwnProperty(this.selectValue)) {
        this.radiusIndex = window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusIndex[this.selectValue];
      }else {
        this.radiusIndex = undefined;
      }
      if (window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("textOffset") &&
          window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.textOffset.hasOwnProperty(this.selectValue)) {
        let textOffset = window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.textOffset[this.selectValue];
        this.offsetText = window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps["text-offset"][this.selectValue];
        this.$refs.themePanel.xOffsetText = this.offsetText[0];
        this.$refs.themePanel.yOffsetText = -this.offsetText[1];
        this.map.setLayoutProperty([this.layerIdCopy + "_" + this.$_getThemeName()],"text-offset",textOffset);
      }else {
        this.offsetText = [0,0];
        this.$refs.themePanel.xOffsetText = 0;
        this.$refs.themePanel.yOffsetText = 0;
      }
      this.$nextTick(function () {
        this.dataInit = true;
      });
      if(this.selectText){
        window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()].layout["text-field"] = '{' + this.selectText + '}';
        this.map.setLayoutProperty(this.layerIdCopy + "_" + this.$_getThemeName(), "text-field", window.originLayer[this.layerIdCopy][this.layerIdCopy + "_" + this.$_getThemeName()].layout["text-field"]);
      }
    },
    $_editColor(dataBack) {
      dataBack = dataBack || this.dataBack;
      let newColors = ['match', ['get', this.selectKey]], Index = 0;
      if(dataBack.length === 1){
        newColors.push(dataBack[0], this.colors[0]);
        newColors.push("#FFF");
      }else if (!this.hasString) {
        for (let i = 0; i < dataBack.length; i++) {
          if (Number(dataBack[i]) >= Number(this.dataSourceCopy[Index])) {
            Index++;
          }
          if (this.checkBoxArr[Index]) {
            newColors.push(dataBack[i], this.colors[Index]);
          } else {
            newColors.push(dataBack[i], "#FFF");
          }
        }
        newColors.push("#FFF");
      } else {
        for (let i = 0; i < dataBack.length; i++) {
          if (this.checkBoxArr[i]) {
            newColors.push(dataBack[i], this.colors[i]);
          } else {
            newColors.push(dataBack[i], "#FFF");
          }
        }
        newColors.push("#FFF");
      }
      return newColors;
    },
    /*
    * 取得color列表的方法，该方法必须返回一个originColors对象
    * @param colors 一个空的mapbox绘制规则对象，调用者需要自行指定绘制规则
    * @param dataSource 要素信息，绘制规则使用
    * @param startColor 渐变开始颜色，可自行指定
    * @param endColor 渐变结束颜色，可自行指定
    * @param key 绘制规则针对的关键字
    * **/
    $_getColorsCallBack(colors, dataSource, startColor, endColor, key) {
      let checkArr = [], colorList = [];
      let gradient = this.$_gradientColor(startColor, endColor, dataSource.length);
      colors = ['match', ['get', key]];
      for (let i = 0; i < dataSource.length; i++) {
        if (dataSource[i] !== "") {
          colors.push(dataSource[i]);
          colors.push(gradient[i]);
          colorList.push(gradient[i]);
          checkArr.push(true);
        }
      }
      colors.push("#FFFFFF");

      return {
        checkArr: checkArr,
        colors: colors,
        colorList: colorList
      }
    },
    /*
    * 初始化专题图样式的业务逻辑
    * @param geojson geojson数据
    * @fillColors 处理好的颜色信息
    * **/
    $_initThemeCallBack(geojson, fillColors, dataSource,minzoom,maxzoom) {
      this.radiusArr = [];
      this.radiusIndex = undefined;
      if(window.originLayer[this.layerIdCopy].panelProps.hasOwnProperty(this.themeType)){
        if (window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("radiusArr") &&
            window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusArr.hasOwnProperty(this.selectValue)) {
          this.radiusArr = window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusArr[this.selectValue];
        }else {
          for (let i = 0; i < this.dataSourceCopy.length; i++) {
            this.radiusArr.push([i + 1]);
          }
          window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusArr[this.selectValue] = this.radiusArr;
        }
        if (window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("icon-size") &&
            window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps["icon-size"].hasOwnProperty(this.selectValue)){
          let iconSize = window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps["icon-size"][this.selectValue];
          this.$_setLayOutProperty("icon-size",iconSize,this.layerIdCopy + "_" + this.$_getThemeName(),window.originLayer[this.layerIdCopy][this.layerIdCopy + this.$_getThemeName()]);
        }else {
          this.$_setIconSize();
        }
        if (window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("radiusIndex") &&
            window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusIndex.hasOwnProperty(this.selectValue)) {
          this.radiusIndex = window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.radiusIndex[this.selectValue];
        }
        if (window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("dataSourceCopy") &&
            window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.dataSourceCopy.hasOwnProperty(this.selectValue)) {
          this.dataSourceCopy = window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.dataSourceCopy[this.selectValue];
        }
        if (window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.hasOwnProperty("textOffset") &&
            window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.textOffset.hasOwnProperty(this.selectValue)) {
          let textOffset = window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps.textOffset[this.selectValue];
          this.offsetText = window.originLayer[this.layerIdCopy].panelProps[this.themeType].panelProps["text-offset"][this.selectValue];
          this.$refs.themePanel.xOffsetText = this.offsetText[0];
          this.$refs.themePanel.yOffsetText = -this.offsetText[1];
          this.map.setLayoutProperty([this.layerIdCopy + "_" + this.$_getThemeName()],"text-offset",textOffset);
        }else {
          this.offsetText = [0,0];
          this.$refs.themePanel.xOffsetText = 0;
          this.$refs.themePanel.yOffsetText = 0;
        }
      }else {
        let dataSourceCopy = [];
        for (let i = 0; i < dataSource.length; i++) {
          dataSourceCopy.push(dataSource[i]);
          this.radiusArr.push([i + 1]);
        }
        //这里规则仅支持小于，大于的话全会背第一个大鱼号的规则覆盖
        let iconSize = ["case"];
        iconSize.push(["<", ["to-number",["get", this.selectValue]], this.startData]);
        iconSize.push(1);
        for (let i = 0;i < dataSource.length;i++){
          iconSize.push(["<=", ["to-number",["get", this.selectValue]], dataSource[i]]);
          iconSize.push(i + 2);
        }
        iconSize.push(1);
        let offset = ["case"];
        offset.push(["<", ["to-number",["get", this.selectValue]], this.startData]);
        offset.push(["literal",[0,0.5]]);
        for (let i = 0;i < dataSource.length;i++){
          offset.push(["<=", ["to-number",["get", this.selectValue]], dataSource[i]]);
          offset.push(["literal",[0,(i + 2)/2]]);
        }
        offset.push(["literal",[0,0.5]]);
        this.dataSourceCopy = dataSourceCopy;
        let vm = this;
        let interval = setInterval(function () {
          if(vm.iconsJson){
            let keyArr = [];
            Object.keys(vm.iconsJson).forEach(function (key) {
              keyArr.push(key);
            });
            vm.defaultIconValue = keyArr[0] ? keyArr[0] : '';
            if(!window.originLayer[vm.layerIdCopy][vm.layerIdCopy + "_" + vm.$_getThemeName()]){
              window.originLayer[vm.layerIdCopy][vm.layerIdCopy + "_" + vm.$_getThemeName()] = {
                'id': vm.layerIdCopy + "_符号专题图",
                'source': vm.source_vector_Id,
                'type': 'symbol',
                'layout': {
                  'icon-image': vm.defaultIconValue,
                  'icon-size': iconSize,
                  "text-field": '',
                  'text-size': vm.fontSize,
                  'text-letter-spacing': vm.textPadding,
                  'text-offset': offset,
                  'text-font': [vm.textFonts[0],vm.textFonts[0]],
                  'text-rotate': vm.textRotation,
                  'visibility': 'visible'
                },
                'paint': {
                  'icon-opacity': vm.opacity,
                  'text-color': '#000000',
                  "text-halo-color": vm.haloColor,
                  "text-halo-width": vm.haloWidth
                },
                minzoom: minzoom,
                maxzoom: maxzoom
              };
              if(vm.source_vector_layer_Id){
                window.originLayer[vm.layerIdCopy][vm.layerIdCopy + "_" + vm.$_getThemeName()]["source-layer"] = vm.source_vector_layer_Id;
              }
              vm.title = "等级符号" + "_" + vm.layerIdCopy;
              vm.map.addLayer(window.originLayer[vm.layerIdCopy][vm.layerIdCopy + "_" + vm.$_getThemeName()],vm.upLayer);
              window.originLayer[vm.layerIdCopy].layerOrder = [vm.layerIdCopy,vm.layerIdCopy + "_" + vm.$_getThemeName()];
              vm.$_setLayerOrder();
            }
            clearInterval(interval);
          }
        },10);
      }
      this.$nextTick(function () {
        this.dataInit = true;
      });
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
  width: 100%;
  height: 100%;
  padding-left: 5px;
  padding-top: 8px;
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
  right: 4px;
}

.theme-panel-color-picker .picker .colorBtn {
  margin-left: 20px;
}

.range-theme-num {
  width: 64px;
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

.theme-panel-radius{
  border-radius: 10px;
  border: 3px solid rgb(208,208,208);
  background: rgb(228,228,228);
}

.theme-panel-icon-slider{
  margin-left: 12px;
}

.theme-panel-input-icon-number{
  margin-top: 5px;
  width: 60px;
}

.theme-panel-icon-title{
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
  width: 30%;
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