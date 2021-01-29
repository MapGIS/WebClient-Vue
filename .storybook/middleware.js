/* const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function expressMiddleware(router) {
  router.use(
    "localhost",
    createProxyMiddleware({
      target: `http://develop.smaryun.com:8899`, // 服务器 api地址
      changeOrigin: true,
    })
  );
};
 */