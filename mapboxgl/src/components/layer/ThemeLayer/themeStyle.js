//单值专题图属性
let uniqueTheme = {
    //当前激活的专题图字段
    field: "",
    //专题图类型
    type: "unique",
    //是否开启高亮
    isHoverAble: false,
    //是否有开启弹窗
    isPopUpAble: false,
    //图层透明度0-100
    opacity: 100,
    //专题图是否显示或隐藏
    visible: true,
    //高亮样式
    highlightStyle: {
        //高亮时是否显示填充颜色
        isShowFill: true,
        //高亮时的填充颜色
        color: "",
        //高亮填充颜色的透明度
        opacity: "",
        //高亮时是否显示外边线，仅点、多边形有用
        isShowBorder: true,
        //外边线颜色
        borderColor: "",
        //外边线宽度
        borderWidth: "",
        //外边线样式，仅多边形有用
        borderStyle: "",
        //高亮边线的透明度
        borderOpacity: "",
    },
    //专题图样式
    style: {
        //填充颜色颜色
        color: "",
        //线宽，仅对线有用
        width: "",
        //是否有外边线，仅点、多边形有用
        border: true,
        //外边线颜色
        borderColor: "",
        //外边线宽度
        borderWidth: "",
        //外边线样式，仅多边形有用
        borderStyle: "",
        //线样式，仅线有用
        lineStyle: "",
        //半径，仅点、符号有用
        radius: "",
        //是否启用阴影
        shadow: false,
        //阴影模糊度
        shadowBlur: "",
        //阴影颜色
        shadowColor: "",
        //阴影X轴偏移
        shadowOffsetX: "",
        //阴影Y周偏印
        shadowOffsetY: "",
        //整体X轴偏移
        offsetX: "",
        //整体Y轴偏移
        offsetY: "",
        //是否启用文字标签
        idShowFont: false,
        //字体
        fontFamily: "",
        //字体颜色
        fontColor: "",
        //字体大小
        fontSize: "",
        //文字间距
        fontSpacing: "",
        //文字X轴偏移
        fontXOffset: "",
        //文字Y轴偏移
        fontYOffset: "",
        //是否启用图标或填充图案
        isShowSymbol: false,
        //符号Url或者名称
        symbol: "",
        //图标颜色
        symbolColor: "",
        //旋转角度
        symbolRotate: "",
        //符号大小
        symbolSize: "",
        //符号X轴偏移
        symbolXOffset: "",
        //符号Y轴偏移
        symbolYOffset: "",
    },
    //field字段所对应的值得专题图样式，不写则默认用style的
    //假设field叫武汉区名称
    styleGroups: [{
        value: "武昌区",
        style: {
            //设定填充颜色
            color: "#FF0000"
        }
    },{
        value: "洪山区",
        style: {
            //设定填充颜色
            color: "#00FF00"
        }
    }]
}

//分段专题图
let rangeTheme = {
    //当前激活的专题图字段
    field: "",
    //专题图类型
    type: "range",
    //是否开启高亮
    isHoverAble: false,
    //是否有开启弹窗
    isPopUpAble: false,
    //图层透明度0-100
    opacity: 100,
    //专题图是否显示或隐藏
    visible: true,
    //高亮样式
    highlightStyle: {
        //高亮时是否显示填充颜色
        isShowFill: true,
        //高亮时的填充颜色
        color: "",
        //高亮填充颜色的透明度
        opacity: "",
        //高亮时是否显示外边线，仅点、多边形有用
        isShowBorder: true,
        //外边线颜色
        borderColor: "",
        //外边线宽度
        borderWidth: "",
        //外边线样式，仅多边形有用
        borderStyle: "",
        //高亮边线的透明度
        borderOpacity: "",
    },
    //专题图样式
    style: {
        //填充颜色颜色
        color: "",
        //线宽，仅对线有用
        width: "",
        //是否有外边线，仅点、多边形有用
        isShowBorder: true,
        //外边线颜色
        borderColor: "",
        //外边线宽度
        borderWidth: "",
        //外边线样式，仅多边形有用
        borderStyle: "",
        //线样式，仅线有用
        lineStyle: "",
        //半径，仅点、符号有用
        radius: "",
        //是否启用阴影
        shadow: false,
        //阴影模糊度
        shadowBlur: "",
        //阴影颜色
        shadowColor: "",
        //阴影X轴偏移
        shadowOffsetX: "",
        //阴影Y周偏印
        shadowOffsetY: "",
        //整体X轴偏移
        offsetX: "",
        //整体Y轴偏移
        offsetY: "",
        //是否启用文字标签
        idShowFont: false,
        //字体
        fontFamily: "",
        //字体颜色
        fontColor: "",
        //字体大小
        fontSize: "",
        //文字间距
        fontSpacing: "",
        //文字X轴偏移
        fontXOffset: "",
        //文字Y轴偏移
        fontYOffset: "",
        //是否启用图标或填充图案
        isShowSymbol: false,
        //符号Url或者名称
        symbol: "",
        //图标颜色
        symbolColor: "",
        //旋转角度
        symbolRotate: "",
        //符号大小
        symbolSize: "",
        //符号X轴偏移
        symbolXOffset: "",
        //符号Y轴偏移
        symbolYOffset: "",
    },
    //field字段所对应的值得专题图样式，不写则默认用style的
    //假设field叫面积
    styleGroups: [{
        //起始值
        start: 0,
        //结束值
        end: 30,
        //分段样式
        style: {
            //设定填充颜色
            color: "#FF0000"
        }
    },{
        //起始值
        start: 31,
        //结束值
        end: 100,
        //分段样式
        style: {
            //设定填充颜色
            color: "#00FF00"
        }
    }]
}

//统一专题图
let uniformTheme = {
    //当前激活的专题图字段
    field: "",
    //专题图类型
    type: "uniform",
    //是否开启高亮
    isHoverAble: false,
    //是否有开启弹窗
    isPopUpAble: false,
    //图层透明度0-100
    opacity: 100,
    //专题图是否显示或隐藏
    visible: true,
    //高亮样式
    highlightStyle: {
        //高亮时是否显示填充颜色
        isShowFill: true,
        //高亮时的填充颜色
        color: "",
        //高亮填充颜色的透明度
        opacity: "",
        //高亮时是否显示外边线，仅点、多边形有用
        isShowBorder: true,
        //外边线颜色
        borderColor: "",
        //外边线宽度
        borderWidth: "",
        //外边线样式，仅多边形有用
        borderStyle: "",
        //高亮边线的透明度
        borderOpacity: "",
    },
    //专题图样式
    style: {
        //填充颜色颜色
        color: "",
        //线宽，仅对线有用
        width: "",
        //是否有外边线，仅点、多边形有用
        border: true,
        //外边线颜色
        borderColor: "",
        //外边线宽度
        borderWidth: "",
        //外边线样式，仅多边形有用
        borderStyle: "",
        //线样式，仅线有用
        lineStyle: "",
        //半径，仅点、符号有用
        radius: "",
        //是否启用阴影
        shadow: false,
        //阴影模糊度
        shadowBlur: "",
        //阴影颜色
        shadowColor: "",
        //阴影X轴偏移
        shadowOffsetX: "",
        //阴影Y周偏印
        shadowOffsetY: "",
        //整体X轴偏移
        offsetX: "",
        //整体Y轴偏移
        offsetY: "",
        //是否启用文字标签
        idShowFont: false,
        //字体
        fontFamily: "",
        //字体颜色
        fontColor: "",
        //字体大小
        fontSize: "",
        //文字间距
        fontSpacing: "",
        //文字X轴偏移
        fontXOffset: "",
        //文字Y轴偏移
        fontYOffset: "",
        //是否启用图标或填充图案
        isShowSymbol: false,
        //符号Url或者名称
        symbol: "",
        //图标颜色
        symbolColor: "",
        //旋转角度
        symbolRotate: "",
        //符号大小
        symbolSize: "",
        //符号X轴偏移
        symbolXOffset: "",
        //符号Y轴偏移
        symbolYOffset: "",
    }
}

//符号专题图，仅点有效
let symbolTheme = {
    //当前激活的专题图字段
    field: "",
    //专题图类型
    type: "symbol",
    //是否开启高亮
    isHoverAble: false,
    //是否有开启弹窗
    isPopUpAble: false,
    //图层透明度0-100
    opacity: 100,
    //专题图是否显示或隐藏
    visible: true,
    //专题图样式
    style: {
        //是否启用文字标签
        idShowFont: false,
        //字体
        fontFamily: "",
        //字体颜色
        fontColor: "",
        //字体大小
        fontSize: "",
        //文字间距
        fontSpacing: "",
        //文字X轴偏移
        fontXOffset: "",
        //文字Y轴偏移
        fontYOffset: "",
        //是否启用图标或填充图案
        isShowSymbol: false,
        //符号Url或者名称
        symbol: "",
        //图标颜色
        symbolColor: "",
        //旋转角度
        symbolRotate: "",
        //符号大小
        symbolSize: "",
        //符号X轴偏移
        symbolXOffset: "",
        //符号Y轴偏移
        symbolYOffset: "",
    },
    //field字段所对应的值得专题图样式，不写则默认用style的
    //假设field叫单价
    styleGroups: [{
        //起始值
        start: 0,
        //结束值
        end: 30,
        //分段样式，注意不可更改符号
        style: {
            //设定符号大小
            symbolSize: 10
        }
    },{
        //起始值
        start: 31,
        //结束值
        end: 100,
        style: {
            //设定符号大小
            symbolSize: 20
        }
    }]
}

//热力专题图，仅点有效
let heatmapTheme = {
    //当前激活的专题图字段
    field: "",
    //专题图类型
    type: "heatmap",
    //图层透明度0-100
    opacity: 100,
    //专题图是否显示或隐藏
    visible: true,
    //专题图样式
    style: {
        //热力图颜色，可不填，会用默认颜色#BED2EF,#86FD86,#ECFD43,#FEB028,#FF0000
        color: "",
        //热力半径
        radius: 40
    },
    //定义特定分段的热力权重
    styleGroups: [{
        //权重起始值
        start: 0,
        //权重结束值
        end: 30,
        //热力样式
        style: {
            //颜色
            color: ""
        }
    },{
        //权重起始值
        start: 0,
        //权重结束值
        end: 30,
        //热力样式
        style: {
            //颜色
            color: ""
        }
    }]
}