const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 配置代理选项
const proxyOptions = {
  changeOrigin: true,
  secure: true,
  logLevel: 'debug'
};

const backendUrl = process.env.BACKEND_URL || 'https://fit-web-six.vercel.app/';
const frontendUrl = process.env.FRONTEND_URL || 'https://persona-plus-onboard.vercel.app/';

// 创建后台代理中间件（用于静态资源）
const backendProxy = createProxyMiddleware({
  target: backendUrl,
  ...proxyOptions
});

// 中间件：检查静态资源请求是否来自 /admin 页面
app.use((req, res, next) => {
  const referer = req.get('referer') || '';
  const pathname = req.path;
  
  // 如果请求来自 /admin 页面，且是静态资源（assets, static 等），也代理到后台
  if (referer.includes('/admin') && (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/static/') ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)
  )) {
    // 代理到后台项目
    return backendProxy(req, res, next);
  }
  
  next();
});

// 将 /admin 路径的请求转发到后台项目（包括所有子路径）
app.use('/admin', createProxyMiddleware({
  target: backendUrl,
  ...proxyOptions,
  pathRewrite: {
    '^/admin': '' // 移除 /admin 前缀
  }
}));

// 将其他路径转发到前台项目
app.use('/', createProxyMiddleware({
  target: frontendUrl,
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

