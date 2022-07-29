## 1、基本方法

`mapgisui`提供了`setTheme`方法，用于指定主题、定制自定义样式。

### setTheme方法使用：

#### 1、参数说明

`setTheme`方法接收2个参数（`themeStyle`、`payload`），具体说明如下

| 参数         | 说明                                                         | 备注  |
| :----------- | :---------------------------------------------------------- | :--------- |
| `themeStyle`   | 第一个参数用于指定主题，支持传入两种格式：**字符串**或**对象**          | 字符串格式即为3种主题类型：'light'、'dark'、'technology'，对象格式即为样式变量对象，详见下面示例     |
| `payload`      | 第二个参数用于定制自定义样式，如主题色等信息                 |  |

#### 2、使用示例

引入`mapgisui`后即可使用该方法

示例1：`themeStyle`传入字符串：

```javascript
import mapgisui from '@mapgis/webclient-vue-ui'

mapgisui.setTheme('dark', {
  colorGroup:["#8dc1a9", "#759aa0", "#00cbf0", "#e69d87", "#ea7e53"],
  dangerColor:'#A61D24'
})
```

示例2：`themeStyle`传入对象：

```javascript
import mapgisui from '@mapgis/webclient-vue-ui'

mapgisui.setTheme({
    "title": "科技风格",
    "label": "technology",
    "style": "technology",
    "shadow": "#242424",
    "deepShadow": "rgb(0, 0, 0, 0.45)",
    "textColor": "rgba(225, 225, 225, 0.7)",
    "textColorSecondary": "rgba(255, 255, 255, 0.45)",
    "background": "#081a37e6",
    "backgroundLight": "#142745e6",
    "backgroundBase": "rgba(0, 0, 0, 0.08)",
    "selectedColor": "#00cbf026",
    "hoverColor": "#5eb7f2",
    "clickColor": "#2276bf",
    "successColor": "#49AA19",
    "successBgColor": "#324528",
    "successBorderColor": "#389E0D",
    "infoColor": "#00CBF0",
    "infoBgColor": "#122D36",
    "infoBorderColor": "#008BA3",
    "warningColor": "#D89614",
    "warningBgColor": "#4E4127",
    "warningBorderColor": "#D48806",
    "dangerColor": "#A61D24",
    "errorBgColor": "#44292A",
    "errorBorderColor": "#D9363E",
    "iconColorHover": "rgba(255, 255, 255, 0.75)",
    "headingColor": "rgba(225, 225, 225, 1)",
    "disabledTextColor": "rgba(225, 225, 225, 0.3)",
    "borderColorBase": "rgba(255, 255, 255, 0.15)",
    "componentBackground": "rgba(255, 255, 255, 0.04)",
    ...
})
```

#### 3、主题色修改

可通过传入`setTheme`的第二个参数`payload`来指定新的主题色

其中`colorGroup`为颜色列表，该数组的**第一项**即为新的主题色

如下示例将暗色风的主题色从`#1890ff`切换为`#8dc1a9`：

```javascript
import mapgisui from '@mapgis/webclient-vue-ui'

mapgisui.setTheme('dark', {
  colorGroup:["#8dc1a9", "#1890ff", "#00cbf0", "#e69d87", "#ea7e53"] // 将待切换的主题色'#1890ff'置为第一项
})
```

## 2、全局引入时指定主题

项目全局引入`mapgisui`时也可以指定主题样式等信息

具体示例如下,在项目的主文件中引入并指定主题：

```javascript
// main.js
import mapgisui from '@mapgis/webclient-vue-ui'

Vue.use(mapgisui, {
  theme: 'technology',
  payload: {
    colorGroup:["#8dc1a9", "#1890ff", "#00cbf0", "#e69d87", "#ea7e53"]
  }
})
```

通过填写`Vue.use(mapgisui)`的第二个参数载荷来指定主题，支持填写该对象的两个key：`theme`和`payload`，这两项分别对应上文[`setTheme`方法](theme_switch.html#settheme方法使用)的2个参数，用法完全相同