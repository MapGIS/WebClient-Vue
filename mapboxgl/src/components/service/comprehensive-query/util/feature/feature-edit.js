import * as Zondy from '@mapgis/webclient-es6-service';
export default class FeatureEdit {
    /**
     * 要素修改
     * @param {object} params
     * @param {string} params.gdbp gdbp地址
     * @param {string} params.featureSet featureSet对象
     * @param {string|null} params.ip
     * @param {string|null} params.port
     * @param {boolean|null} params.updateAttribute
     * @param {boolean|null} params.updateGeometry
     * @param {boolean|null} params.updateGeomInfo
     */
    update(params) {
        if (!params || !params.gdbp || !params.featureSet) {
            return;
        }
        const tempParams = {};
        tempParams.gdbp = params.gdbp;
        tempParams.featureSet = params.featureSet;
        tempParams.ip = params.ip;
        tempParams.port = params.port;
        tempParams.guid = params.guid || '__readonly_user__';
        tempParams.updateAttribute =
            params.updateAttribute != undefined ? params.updateAttribute : true;
        tempParams.updateGeometry =
            params.updateGeometry != undefined ? params.updateGeometry : true;
        tempParams.updateGeomInfo =
            params.updateGeomInfo != undefined ? params.updateGeomInfo : true;
        const editService = new Zondy.MRFS.EditLayerFeature(tempParams.gdbp, {
            ip: tempParams.ip,
            port: tempParams.port,
            guid: tempParams.guid,
            updateAttribute: tempParams.updateAttribute,
            updateGeometry: tempParams.updateGeometry
        });
        const promise = new Promise((resolve, reject) => {
            editService.update(tempParams.featureSet, data => {
                if (data) {
                    resolve(data);
                }
                else {
                    resolve(undefined);
                }
            });
        });
        return promise.then(data => {
            return data;
        });
    }
}
