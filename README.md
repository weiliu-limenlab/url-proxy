# URL Proxy Server

一个基于 Express.js 的代理服务器，用于将 `/admin` 路径转发到后台项目，其他路径转发到前台项目。

## 功能特性

- 将 `/admin` 路径的请求转发到后台项目
- 将其他路径的请求转发到前台项目
- 支持 Vercel 部署
- 支持环境变量配置

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 设置环境变量（可选，创建 `.env` 文件）：
```
BACKEND_URL=https://your-backend-project.vercel.app
FRONTEND_URL=https://your-frontend-project.vercel.app
```

3. 启动服务器：
```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

## Vercel 部署

1. 将项目推送到 GitHub

2. 在 Vercel 中导入项目

3. 配置环境变量：
   - `BACKEND_URL`: 后台项目的 URL
   - `FRONTEND_URL`: 前台项目的 URL

4. 部署

## 配置说明

### 环境变量

- `BACKEND_URL`: 后台项目的完整 URL（默认: `https://your-backend-project.vercel.app`）
- `FRONTEND_URL`: 前台项目的完整 URL（默认: `https://your-frontend-project.vercel.app`）
- `PORT`: 服务器端口（Vercel 会自动设置）

### 路径重写

默认情况下，`/admin` 路径会被转发到后台项目。如果你需要保留 `/admin` 前缀，可以修改 `server.js` 中的 `pathRewrite` 配置。

## 健康检查

访问 `/health` 端点可以检查服务器状态。

