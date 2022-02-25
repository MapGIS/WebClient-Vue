function getPopupStyle(style, pClass) {
  let containerStyle, titleStyle, rowStyle, fieldStyle, valueStyle;
  let containerClass, rowClass, titleClass, fieldClass, valueClass;

  function getStyle(style) {
    let styleStr = "";
    if (style && style instanceof Object) {
      Object.keys(style).forEach(function (key) {
        styleStr += key + ":" + style[key] + ";";
      });
    }
    return styleStr;
  }

  if (style && style.hasOwnProperty("containerStyle")) {
    containerStyle = getStyle(style.containerStyle);
  }

  if (pClass && pClass.hasOwnProperty("containerClass")) {
    containerClass = pClass.containerClass;
  }

  if (style && style.hasOwnProperty("rowStyle")) {
    rowStyle = getStyle(style.rowStyle);
  }

  if (pClass && pClass.hasOwnProperty("rowClass")) {
    rowClass = pClass.rowClass;
  }

  if (style && style.hasOwnProperty("titleStyle")) {
    titleStyle = getStyle(style.titleStyle);
  }

  if (pClass && pClass.hasOwnProperty("titleClass")) {
    titleClass = pClass.titleClass;
  }

  if (style && style.hasOwnProperty("fieldStyle")) {
    fieldStyle = getStyle(style.fieldStyle);
  }

  if (pClass && pClass.hasOwnProperty("fieldClass")) {
    fieldClass = pClass.fieldClass;
  }

  if (style && style.hasOwnProperty("valueStyle")) {
    valueStyle = getStyle(style.valueStyle);
  }

  if (pClass && pClass.hasOwnProperty("valueClass")) {
    valueClass = pClass.valueClass;
  }
  return {
    containerStyle: containerStyle,
    containerClass: containerClass,
    rowStyle: rowStyle,
    rowClass: rowClass,
    fieldStyle: fieldStyle,
    fieldClass: fieldClass,
    titleStyle: titleStyle,
    titleClass: titleClass,
    valueStyle: valueStyle,
    valueClass: valueClass,
  };
}

function getPopupField(alias, field) {
  if (alias && alias instanceof Object && alias.hasOwnProperty(field)) {
    field = alias[field];
  }
  return field;
}

function getPopupContainer(popupStyle) {
  return (
    "<div class='mapgis-popup-container " +
    popupStyle.containerClass +
    "' style='" +
    popupStyle.containerStyle +
    "'>"
  );
}

function getPopupTitle(popupStyle, title, rowContainerClass) {
  rowContainerClass = "mapgis-popup-row-container " + rowContainerClass;
  return (
    "<div class='mapgis-popup-title " +
    popupStyle.titleClass +
    "' style='" +
    popupStyle.titleStyle +
    "'>" +
    title +
    "</div><div class='" +
    rowContainerClass +
    "'>"
  );
}

function getPopupRows(
  fields,
  alias,
  popupStyle,
  feature,
  defaultField,
  rowClass,
  fieldClass,
  valueClass,
  before
) {
  let field,
    element = "";
  before = before || "";
  function getRow(popupStyle, field, value) {
    return (
      "<div class='" +
      rowClass +
      " " +
      popupStyle.rowClass +
      "' style='" +
      popupStyle.rowStyle +
      "'>" +
      before +
      "<span class='" +
      fieldClass +
      " " +
      popupStyle.fieldClass +
      "' style='" +
      popupStyle.fieldStyle +
      "' title='" +
      field +
      "'>" +
      field +
      "</span><span class='" +
      valueClass +
      " " +
      popupStyle.valueClass +
      "' style='" +
      popupStyle.valueStyle +
      "' title='" +
      value +
      "'>" +
      value +
      "</span></div>"
    );
  }
  if (fields && fields instanceof Array && fields.length > 0) {
    for (let i = 0; i < fields.length; i++) {
      field = getPopupField(alias, fields[i]);
      let value = feature.properties[fields[i]] || "无";
      element += getRow(popupStyle, field, value);
    }
  } else if (defaultField) {
    field = getPopupField(alias, defaultField);
    let value = feature.properties[defaultField] || "无";
    element += getRow(popupStyle, field, value);
  }
  return element;
}

function getDefaultPopup(
  fields,
  alias,
  style,
  pClass,
  title,
  feature,
  defaultField,
  popupStyle,
  rowClass,
  fieldClass,
  valueClass,
  before
) {
  let element = getPopupContainer(popupStyle);
  if (title) {
    element += getPopupTitle(popupStyle, title);
  }
  element += getPopupRows(
    fields,
    alias,
    popupStyle,
    feature,
    defaultField,
    rowClass,
    fieldClass,
    valueClass,
    before
  );
  if (title) {
    element += "</div></div>";
  } else {
    element += "</div>";
  }
  if (
    defaultField &&
    (!fields || (fields && fields instanceof Array && fields.length === 0))
  ) {
    element = element.replace(
      "mapgis-popup-row-container ",
      "mapgis-popup-row-container mapgis-popup-row-container-defaultField "
    );
  }
  return element;
}

function getPopupLeftHtml(
  fields,
  alias,
  style,
  pClass,
  title,
  feature,
  defaultField,
  popupStyle
) {
  let element = getPopupContainer(popupStyle),
    field;
  if (title) {
    element += getPopupTitle(
      popupStyle,
      title,
      "mapgis-popup-row-left-container"
    );
  }
  function getRow(popupStyle, field, value) {
    return (
      "<div class='mapgis-popup-row mapgis-popup-left-row " +
      popupStyle.rowClass +
      "' style='" +
      popupStyle.rowStyle +
      "'><div class='mapgis-popup-left-item mapgis-popup-left-field " +
      popupStyle.fieldClass +
      "' style='" +
      popupStyle.fieldStyle +
      "' title='" +
      field +
      "'>" +
      field +
      "</div><div class='mapgis-popup-left-item mapgis-popup-left-value mapgis-popup-ellipsis " +
      popupStyle.valueClass +
      "' style='" +
      popupStyle.valueStyle +
      "' title='" +
      value +
      "'>" +
      value +
      "</div></div>"
    );
  }
  //特例不提取
  if (fields && fields instanceof Array && fields.length > 0) {
    for (let i = 0; i < fields.length; i++) {
      field = getPopupField(alias, fields[i]);
      let value = feature.properties[fields[i]] || "无";
      element += getRow(popupStyle, field, value);
    }
  } else {
    field = getPopupField(alias, defaultField);
    let value = feature.properties[defaultField] || "无";
    element += getRow(popupStyle, field, value);
  }
  if (title) {
    element += "</div></div>";
  } else {
    element += "</div>";
  }
  return element;
}

/**
 * 生成mapbox的Popup页面
 * @param {String} type popup类型，必填，有left、underline、point、table、default五种
 * @param {Object} feature 一个要素，必填，根据要素生成popup中的内容
 * @param {Object} options 生成popup参数，选填，如下所示
 * {
 *     fields: [],//要显示的字段数组，["字段1","字段2","字段3"...]
 *     alias: [],//要显示的字段别名，["别名1","别名2","别名3"...]
 *     style: {//popup里的元素的样式
 *        containerStyle: {},//外边框样式
 *        rowStyle: {},//一行数据样式
 *        titleStyle: {},//title样式
 *        fieldStyle: {},//字段名样式
 *        valueStyle: {},//字段值样式
 *     },
 *     class: {//popup里的元素的class
 *         containerClass: "",//外边框Class
 *         rowClass: "",//一行数据的Class
 *         titleClass: "",//title的Class
 *         fieldClass: "",//字段名Class
 *         valueClass: "",//字段值的Class
 *     }
 * }
 * @param {String} currentField 专题图使用的参数，当前专题图的字段，选填
 * @returns {String} 生成的popup的html内容
 */
export function getPopupHtml(type, feature, options, currentField) {
  let element;
  let popupStyle = getPopupStyle(options.style, options.class);
  switch (type) {
    case "left":
      element = getPopupLeftHtml(
        options.fields,
        options.alias,
        options.style,
        options.class,
        options.title,
        feature,
        currentField,
        popupStyle
      );
      break;
    case "underline":
      element = getDefaultPopup(
        options.fields,
        options.alias,
        options.style,
        options.class,
        options.title,
        feature,
        currentField,
        popupStyle,
        "mapgis-popup-underline-row",
        "mapgis-popup-item mapgis-popup-underline-item mapgis-popup-field mapgis-popup-underline-field",
        "mapgis-popup-item mapgis-popup-underline-item mapgis-popup-value"
      );
      break;
    case "point":
      element = getDefaultPopup(
        options.fields,
        options.alias,
        options.style,
        options.class,
        options.title,
        feature,
        currentField,
        popupStyle,
        "mapgis-popup-point-row",
        "mapgis-popup-item mapgis-popup-point-item mapgis-popup-field mapgis-popup-point-field",
        "mapgis-popup-item mapgis-popup-point-item mapgis-popup-value mapgis-popup-point-value",
        "<span class='mapgis-popup-point'></span>"
      );
      break;
    case "table":
      element = getDefaultPopup(
        options.fields,
        options.alias,
        options.style,
        options.class,
        options.title,
        feature,
        currentField,
        popupStyle,
        "mapgis-popup-table-row",
        "mapgis-popup-item mapgis-popup-table-item mapgis-popup-field mapgis-popup-table-field",
        "mapgis-popup-item mapgis-popup-table-item mapgis-popup-value mapgis-popup-table-value"
      );
      break;
    case "default":
      element = getDefaultPopup(
        options.fields,
        options.alias,
        options.style,
        options.class,
        options.title,
        feature,
        currentField,
        popupStyle,
        "mapgis-popup-row",
        "mapgis-popup-item mapgis-popup-field",
        "mapgis-popup-item mapgis-popup-value"
      );
      break;
    default:
      element = getDefaultPopup(
        options.fields,
        options.alias,
        options.style,
        options.class,
        options.title,
        feature,
        currentField,
        popupStyle,
        "mapgis-popup-row",
        "mapgis-popup-item mapgis-popup-field",
        "mapgis-popup-item mapgis-popup-value"
      );
      break;
  }
  return element;
}
