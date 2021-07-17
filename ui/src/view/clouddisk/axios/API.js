/**
 * @author 潘卓然
 * @date 2019/06/05
 */
import axios from "axios";
import config from "./config";

import Qs from "qs";
// import {_httpAuthorization} from '../cos/qiniu';
const clone = require("clone");

class API {
  constructor(view) {
    this.view = view;
    this.config = clone(config);
  }

  put(url, param) {
    return this._request(url, "put", param);
  }

  post(url, param) {
    return this._request(url, "post", param);
  }

  get(url, param) {
    if (param) {
      url = url + "?" + Qs.stringify(param);
    }

    /*         if (/(qiniu.com|qbox.me)/g.test(url)) { // 七牛api
                    this.setAuthorization(_httpAuthorization(url));
                } */
    return this._request(url, "get");
  }

  delete(url, param) {
    if (param) {
      url = url + "?" + Qs.stringify(param);
    }
    return this._request(url, "delete");
  }

  setBaseUrl(url) {
    this.config.baseURL = url;
  }

  setAuthorization(authorization) {
    this.config.headers.Authorization = authorization;
  }

  setContentType(type) {
    this.config.headers["Content-Type"] = type;
  }

  setTransformRequest(f) {
    this.config.transformRequest = [f];
  }

  _request(url, type, param) {
    this.view && this.view.$Loading.start();

    this.config.method = type;

    let request;
    if (type === "get") {
      request = axios.get(url, this.config);
    } else if (type === "delete") {
      request = axios.delete(url, this.config);
    } else {
      request = axios[type](url, param, this.config);
    }

    /* request.then((response) => {
            this.view && this.view.$Loading.finish();
        }).catch((error) => {
            this.view && this.view.$Loading.error();
        }); */
    return request;
  }
}

export default API;
