import axios from "axios";
export default class DataSourceCatalog {
  /**
   * 获取数据源
   * @param {Object} param
   * @param {string} param.ip 服务器IP
   * @param {String} param.port 服务端口
   * @param {Boolean} param.isDetail 是否获取详情
   */
  static getDataSource({ ip, port, isDetail = false }) {
    const url = `${
      window.location.protocol
    }//${ip}:${port}/igs/rest/mrcs/datasource?f=json&${
      isDetail ? "getAtt" : "getAttr"
    }=true`;
    const promise = new Promise((resolve, reject) => {
      axios.get(url).then(
        res => {
          const { data } = res;
          if (!data) {
            resolve(undefined);
          } else {
            resolve(data);
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return promise.then(data => {
      return data;
    });
  }
  /**
   * 获取数据源下数据库
   * @param {Object} param
   * @param {string} param.ip 服务器IP
   * @param {Number} param.port 服务端口
   * @param {String} param.dataSource 数据源名称
   * @param {String} param.user 用户名
   * @param {String} param.password 密码
   */
  static getDataBase({ ip, port, dataSource, user, password }) {
    const url = `${window.location.protocol}//${ip}:${port}/igs/rest/mrcs/datasource/${dataSource}?user=${user}&psw=${password}&f=json`;
    const promise = new Promise((resolve, reject) => {
      axios.get(url).then(
        res => {
          const { data } = res;
          if (!data) {
            resolve(undefined);
          } else {
            resolve(data);
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return promise.then(data => {
      return data;
    });
  }
  /**
   * 获取GDBP下指定数据库指定类型的所有数据
   * @param {Object} param
   * @param {string} param.ip 服务器IP
   * @param {Number} param.port 服务端口
   * @param {String} param.gdbp 数据源/数据库
   * @param {String} param.type 数据类型
   * @param {String} param.user 用户名
   * @param {String} param.password 密码
   */
  static getGDBData({ ip, port, gdbp, type, user, password }) {
    const url = `${window.location.protocol}//${ip}:${port}/igs/rest/mrcs/datasource/${gdbp}/${type}?user=${user}&psw=${password}&containAll=false&f=json`;
    const promise = new Promise((resolve, reject) => {
      axios.get(url).then(
        res => {
          const { data } = res;
          if (!data) {
            resolve(undefined);
          } else {
            resolve(data);
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return promise.then(data => {
      return data;
    });
  }
}
