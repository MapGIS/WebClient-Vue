import {BaseParameter} from "./index";
import {extend} from "@mapgis/webclient-es6-service/common";

class SQLParameter extends BaseParameter{
    constructor(options) {
        super();
        this.where = undefined;

        extend(this,options);
    }
}

export {SQLParameter}