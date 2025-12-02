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
KEEP_ADMIN_PREFIX=false  # 是否保留 /admin 前缀，默认为 false
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
   - `KEEP_ADMIN_PREFIX`: 是否保留 `/admin` 前缀（可选，默认为 `false`）

4. 部署

## 配置说明

### 环境变量

- `BACKEND_URL`: 后台项目的完整 URL（默认: `https://your-backend-project.vercel.app`）
- `FRONTEND_URL`: 前台项目的完整 URL（默认: `https://your-frontend-project.vercel.app`）
- `KEEP_ADMIN_PREFIX`: 是否保留 `/admin` 前缀（可选，默认为 `false`）
  - `false`（默认）: 访问 `/admin` 时，会转发到后台项目的 `/` 路径
  - `true`: 访问 `/admin` 时，会转发到后台项目的 `/admin` 路径
- `PORT`: 服务器端口（Vercel 会自动设置）

### 路径重写

默认情况下，`/admin` 路径会被转发到后台项目，并且会移除 `/admin` 前缀（转发到后台的 `/` 路径）。

如果你的后台项目需要保留 `/admin` 前缀，可以设置环境变量 `KEEP_ADMIN_PREFIX=true`。

### 故障排除

如果访问 `/admin` 时返回 404 错误，但静态资源（CSS、JS）能正常加载：

1. **检查后台项目路由**: 确认后台项目是否有对应的路由处理请求
2. **尝试保留前缀**: 设置 `KEEP_ADMIN_PREFIX=true`，看看是否解决问题
3. **查看日志**: 在 Vercel 的部署日志中查看代理请求的详细信息

## 健康检查

访问 `/health` 端点可以检查服务器状态。

