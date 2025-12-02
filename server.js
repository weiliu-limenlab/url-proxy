const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 配置代理选项
const proxyOptions = {
  changeOrigin: true,
  secure: true,
  logLevel: 'debug'
};

// 将 /admin 路径的请求转发到后台项目
app.use('/admin', createProxyMiddleware({
  target: process.env.BACKEND_URL || 'https://fit-web-six.vercel.app/',
  ...proxyOptions,
}));


// 将其他路径转发到前台项目
app.use('/', createProxyMiddleware({
  target: process.env.FRONTEND_URL || 'https://persona-plus-onboard.vercel.app/',
  ...proxyOptions
}));

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 获取端口，Vercel 会自动提供 PORT 环境变量
const PORT = process.env.PORT || 3000;

// 启动服务器（本地开发时）
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
  });
}

// 导出 app 供 Vercel 使用
module.exports = app;

