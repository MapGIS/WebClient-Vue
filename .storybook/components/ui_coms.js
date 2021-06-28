import "ant-design-vue/dist/antd.css";

export { MapgisIconfont } from "../../mapboxgl/src/components/UI/iconfont";

import { default as Slider } from "ant-design-vue/es/slider";

import { default as InputNumber } from "ant-design-vue/es/input-number";

import { default as Select } from "ant-design-vue/es/select";
let SelectOption = Select.Option;
let SelectOptGroup = Select.OptGroup;

import { default as Input } from "ant-design-vue/es/input";
let InputGroup = Input.Group;
let InputSearch = Input.Search;
let InputTextArea = Input.TextArea;
let InputPassword = Input.Password;

import { default as Card } from "ant-design-vue/es/card";

import { default as Button } from "ant-design-vue/es/button";

import { default as Table } from "ant-design-vue/es/table";
import { Row, Col } from "ant-design-vue/es/grid";
import { default as Checkbox } from "ant-design-vue/es/checkbox";
let CheckboxGroup = Checkbox.Group;
import { default as Popconfirm } from "ant-design-vue/es/popconfirm";

export { Slider };
export { InputNumber };
export { Select, SelectOption, SelectOptGroup };
export { Input, InputGroup, InputSearch, InputTextArea, InputPassword };
export { Card };
export { Button };
export { Table };
export { Row, Col };
export { Checkbox, CheckboxGroup };
export { Popconfirm };

export { default as Tree } from "ant-design-vue/es/tree/Tree";
export { default as DirectoryTree } from "ant-design-vue/es/tree/DirectoryTree";
