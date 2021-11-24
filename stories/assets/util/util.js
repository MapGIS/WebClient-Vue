export function formatObjectToHtml(obj) {
    let objStr = "{\n";
    Object.keys(obj).forEach(function (key) {
        if(obj[key] instanceof Object){
            objStr += formatObject(key, obj[key], "   ", "    ");
        }else {
            objStr += formatObject(key, obj[key]);
        }
    });
    objStr += '}';
    return objStr;
}

function formatObject(key, value, beforeKey, afterKey, ObjInArr) {
    let objStr = "";
    beforeKey = beforeKey || "";
    afterKey = afterKey || "";
    ObjInArr = ObjInArr || "";
    if(value instanceof Array){
        objStr += "  \'" + key + "\': [\n";
        for (let i = 0; i < value.length;i++){
            if(value[i] instanceof Object){
                objStr += formatObject("", value[i], "    ");
            }else if(typeof value === 'string') {
                objStr += "     \'" + value + "\',\n";
            }else if(typeof value === 'number') {
                objStr += "     \'" + value + ",\n";
            }
        }
        objStr += "  ],\n";
    } else if(value instanceof Object){
        if(key === ""){
            objStr += "      {\n";
            Object.keys(value).forEach(function (OKey) {
                if(value[OKey] instanceof Object){
                    objStr += "   ";
                    objStr += formatObject(OKey, value[OKey], "    ", "        ", "    ");
                }else {
                    objStr += formatObject(OKey, value[OKey], "    ");
                }
            });
            objStr += "      },\n";
        }else {
            objStr += beforeKey + "  \'" + key + "\': {\n";
            Object.keys(value).forEach(function (OKey) {
                objStr += formatObject(OKey, value[OKey], "    ", "", ObjInArr);
            });
            objStr += afterKey + "  },\n";
        }
    }else {
        if(typeof value === 'string'){
            objStr += ObjInArr + beforeKey + "     \'" + key + "\': \'" + value + "\',\n";
        }else if(typeof value === 'number'){
            objStr += ObjInArr + beforeKey + "     \'" + key + "\': " + value + ",\n";
        }
    }
    return objStr;
}