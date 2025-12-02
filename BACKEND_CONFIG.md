# 后台项目配置指南

当后台项目通过代理服务器在 `/admin` 路径下访问时，可能需要做一些配置调整。具体配置取决于你的后台项目类型和 `KEEP_ADMIN_PREFIX` 设置。

## 配置场景

### 场景 1: `KEEP_ADMIN_PREFIX=false` (默认，推荐)

**代理行为：**
- 访问 `https://proxy-domain.com/admin` → 转发到后台项目的 `/`
- 访问 `https://proxy-domain.com/admin/dashboard` → 转发到后台项目的 `/dashboard`

**后台项目需要的配置：**

#### 1. React / Vue / Angular 等 SPA 项目

**路由配置（React Router 示例）：**
```javascript
// 不需要特殊配置，路由从根路径开始
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</BrowserRouter>
```

**静态资源路径配置：**

如果使用 Vite：
```javascript
// vite.config.js
export default {
  base: '/', // 保持默认，因为路径会被重写
  build: {
    assetsDir: 'assets',
  }
}
```

如果使用 Create React App：
```json
// package.json
{
  "homepage": "/"
}
```

#### 2. Next.js 项目

**不需要特殊配置**，Next.js 会自动处理。

**如果使用 `basePath`：**
```javascript
// next.config.js
module.exports = {
  // 不需要设置 basePath，因为路径会被重写
}
```

---

### 场景 2: `KEEP_ADMIN_PREFIX=true`

**代理行为：**
- 访问 `https://proxy-domain.com/admin` → 转发到后台项目的 `/admin`
- 访问 `https://proxy-domain.com/admin/dashboard` → 转发到后台项目的 `/admin/dashboard`

**后台项目需要的配置：**

#### 1. React / Vue / Angular 等 SPA 项目

**路由配置（React Router 示例）：**
```javascript
// 需要设置 basename
<BrowserRouter basename="/admin">
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</BrowserRouter>
```

**静态资源路径配置：**

如果使用 Vite：
```javascript
// vite.config.js
export default {
  base: '/admin/', // 设置 base 路径
  build: {
    assetsDir: 'assets',
  }
}
```

如果使用 Create React App：
```json
// package.json
{
  "homepage": "/admin"
}
```

#### 2. Next.js 项目

**需要设置 `basePath`：**
```javascript
// next.config.js
module.exports = {
  basePath: '/admin',
  // 其他配置...
}
```

---

## 通用配置建议

### 1. CORS 配置（如果后台项目有 API）

如果后台项目提供 API 服务，可能需要允许代理服务器的域名：

```javascript
// Express.js 示例
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-proxy-domain.vercel.app',
    'https://url-proxy-xi.vercel.app' // 你的代理域名
  ],
  credentials: true
}));
```

### 2. 静态资源路径

**推荐使用相对路径：**
```html
<!-- ✅ 推荐 -->
<script src="./assets/index.js"></script>
<link rel="stylesheet" href="./assets/index.css">

<!-- ❌ 不推荐（绝对路径） -->
<script src="/assets/index.js"></script>
<link rel="stylesheet" href="/assets/index.css">
```

### 3. API 请求路径

如果后台项目需要调用自己的 API：

```javascript
// ✅ 推荐：使用相对路径或环境变量
const API_BASE = process.env.REACT_APP_API_BASE || '';
fetch(`${API_BASE}/api/users`);

// ❌ 不推荐：硬编码绝对路径
fetch('/api/users'); // 这会被代理到前台项目
```

### 4. 环境变量配置

在后台项目的构建配置中添加：

```bash
# .env.production
REACT_APP_API_BASE=/admin/api  # 如果 KEEP_ADMIN_PREFIX=true
# 或
REACT_APP_API_BASE=/api        # 如果 KEEP_ADMIN_PREFIX=false
```

---

## 检查清单

- [ ] 确认 `KEEP_ADMIN_PREFIX` 的值（`true` 或 `false`）
- [ ] 根据场景配置路由的 `basename` 或 `basePath`
- [ ] 配置静态资源的 `base` 路径（如果需要）
- [ ] 检查 API 请求路径是否正确
- [ ] 测试静态资源（CSS、JS、图片）是否能正常加载
- [ ] 测试路由跳转是否正常
- [ ] 检查 CORS 配置（如果有 API）

---

## 常见问题

### Q: 静态资源加载失败（404）

**A:** 检查静态资源的路径配置：
- 如果 `KEEP_ADMIN_PREFIX=false`，确保静态资源使用相对路径或根路径
- 如果 `KEEP_ADMIN_PREFIX=true`，确保设置了正确的 `base` 路径

### Q: 路由跳转后页面空白

**A:** 检查路由配置：
- React Router: 确保设置了正确的 `basename`
- Next.js: 确保设置了 `basePath`

### Q: API 请求失败

**A:** 
- 检查 API 路径是否正确
- 检查 CORS 配置是否允许代理域名
- 使用相对路径或环境变量配置 API 基础路径

---

## 推荐配置

**推荐使用 `KEEP_ADMIN_PREFIX=false`**，因为：
1. 后台项目不需要特殊配置
2. 路由和静态资源路径更简单
3. 更容易维护

只有在后台项目**必须**在 `/admin` 路径下运行时，才使用 `KEEP_ADMIN_PREFIX=true`。

