import {BaseParameter} from "./index";
import {extend} from "@mapgis/webclient-es6-service/common";

class ObjectIdsParameter extends BaseParameter{
    constructor(options) {
        super();
        this.objectIds = [];

        extend(this,options);
    }
}

export {ObjectIdsParameter}
