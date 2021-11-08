# Antd Design Less -> Mapgis UI Scss

## antd 
``` less
// Grid system
@grid-columns: 24;
@grid-gutter-width: 0;

// Layout
@layout-body-background: #f0f2f5;
@layout-header-background: #001529;
@layout-footer-background: @layout-body-background;
``` 

``` js
// antd 配置
const ANTD = {
  primary: {
    color: '#1890ff',
    warning: '#faad14',
    success: '#52c41a',
    error: '#f5222d',
    light: {
      menuColors: ['#000c17', '#001529', '#002140']
    },
    dark: {
      menuColors: ['#000c17', '#001529', '#002140']
    },
    night: {
      menuColors: ['#151515', '#1f1f1f', '#1e1e1e']
    }
  },
  theme: {
    dark: {
      'layout-body-background': '#f0f2f5',
    },
    light: {
      'layout-body-background': '#f0f2f5',
    },
    night: {
      'layout-body-background': '#000',
    }
  }
}
module.exports = ANTD
```

### 优缺点
优势
1. 简单容易上手
2. 使用antd-内置的机制来处理样式
   
缺点
1. 无法大量自定义拓展样式
2. 无法解决一些ant-design-vue本身的缺陷 table性能，pagenation的联动

## Mapgis-UI

``` scss
// Grid system
$grid-columns: 24;
$grid-gutter-width: 0;

// Layout
$layout-background: var(--layout-background);
$layout-shadow: var(--shadow);
$layout-sider-background: var(--sider-background);
``` 

``` json
// ui\src\util\style\theme\theme.json
[
  {
    "title": "经典深色",
    "label": "dark",
    "style": "dark",
  },
  {
    "title": "经典浅色",
    "label": "light",
    "style": "light",
    "shadow": "#E2E4E7",
  },
  {
    "title": "经典暖灰",
    "label": "warmGray",
    "shadow": "#242424",
  }
]
```

### 优缺点
优势
1. ant-design-vue的`超集`，直接继承和沿用antd的特性,
2. 除了常规主题颜色切换的方式，提供高度个性化的布局的切换，不是网上常见的admin的风格，而是 `桌面端 ribbon`、`移动端 抽屉`、`浏览器端bootstrap`的跨平台布局
3. 使用sass 全平台·`移动端`·`桌面端`·`浏览器端`    Vue/React/Ang 多框架支撑
4. 在antd 300多的样式上`拓展了400多`的全新样式
5. 封装了`专属mapgis`的高级组件如  ribbon桌面布局、datastore组件、igserver组件
   
缺点
1. 需要node-sass、 sass的依赖，该依赖需要环境`安装c++依赖`
2. 拓展样式的`精细度不够`，需要实际项目提升

# Less -> Sass

常见替换原则
| 场景         | 描述 | 规则                                                                                 |
| :----------- | :--- | :----------------------------------------------------------------------------------- |
| 样式内嵌引入 |      | @import 'path/to/xx.less'  ---> @import 'path/to/xx.scss'                            |
| 变量声明     |      | @xxx-color --> $blue-6: var(--primary-color);                                        |
| 变量替换     |      | @xxx-color --> $xxx=color                                                            |
| 类替换       |      | .@{table-prefix-cls} --> .#{$table-prefix-cls}                                       |
| 类加法       |      | @tab-prefix-cls: ~'@{ant-prefix}-tabs'; ---> $tab-prefix-cls: $ant-prefix + "-tabs"; |
|样式穿透||/deep/ ---> ::v-deep|

## 函数
``` scss
// http://www.a4z.cn/fe/2018/11/12/sass-scss/

// b 的主要功能是包裹一层特定命名前缀（mapgis-ui）的封装类
@mixin b($block) {
  $N: $namespace +'-'+ $block !global;
  .#{$N} {
    @content;
  }
}

// e 的主要功能是按照 指定的分隔符进行子模块的分类
@mixin e($element, $separator: $element-separator) {
  $E: $element !global;
  $selector: &;
  $currentSelector: "";
    @each $unit in $element {
        $currentSelector: #{$currentSelector + "." + $N + $separator+$unit+','};
    }

  @at-root {
    #{$currentSelector} {
      @content;
    }
  }
}

@mixin when($state){
    @at-root{
        &.#{$state-prefix+$state}{
            @content
        }
    }
};

@mixin m($modifier){
    $selector: &;
    $currentSelector :"";
    @each $unit in $modifier {
        $currentSelector: #{$currentSelector + & + $modifier-separator+$unit+','};
    }
    @at-root {
        #{$currentSelector} {
          @content;
        }
      }
}
```