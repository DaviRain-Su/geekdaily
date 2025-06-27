# 部署指南

## 部署到 Vercel

### 1. 准备工作

确保你的代码已经推送到 GitHub、GitLab 或 Bitbucket。

### 2. 在 Vercel 上部署

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "New Project"
3. 导入你的 Git 仓库
4. Vercel 会自动检测 Next.js 项目，使用默认配置即可
5. 点击 "Deploy"

### 3. 环境变量（可选）

如果需要自定义配置，可以在 Vercel 项目设置中添加以下环境变量：

- `NEXT_PUBLIC_USE_API_PROXY`: 设置为 `true`（生产环境默认使用代理）
- `NEXT_PUBLIC_API_ENDPOINT`: 如果 API 地址发生变化，可以在这里配置

### 4. 域名配置

1. 在 Vercel 项目设置中，进入 "Domains" 部分
2. 添加你的自定义域名
3. 按照指示配置 DNS 记录

## CORS 问题说明

本项目已经通过以下方式解决了 CORS 问题：

1. **API 代理路由**: `/app/api/geekdailies/route.ts` 
   - 在服务器端代理请求到实际的 API
   - 自动添加必要的 CORS 头

2. **智能 API 客户端**: `/app/lib/api.ts`
   - 生产环境自动使用代理
   - 开发环境可以选择直连或使用代理

3. **中间件**: `/middleware.ts`
   - 为所有 API 路由添加 CORS 头
   - 添加安全相关的 HTTP 头

## 性能优化

部署后会自动启用以下优化：

1. **Vercel Speed Insights**: 自动收集性能数据
2. **Vercel Analytics**: 用户访问分析
3. **边缘缓存**: API 响应缓存 5 分钟
4. **图片优化**: Next.js 自动图片优化

## 监控和调试

1. **性能监控**: 在 Vercel 仪表板查看 Speed Insights
2. **访问分析**: 在 Analytics 面板查看用户数据
3. **错误日志**: 在 Functions 日志中查看 API 错误

## 常见问题

### Q: 部署后无法获取数据？
A: 检查以下几点：
- API 服务器是否正常运行
- 检查 Vercel Functions 日志是否有错误
- 确认环境变量配置正确

### Q: 如何更新 API 地址？
A: 在 Vercel 项目设置中添加 `NEXT_PUBLIC_API_ENDPOINT` 环境变量

### Q: 如何禁用代理直连 API？
A: 设置 `NEXT_PUBLIC_USE_API_PROXY=false`（不推荐，会有 CORS 问题）

## 本地开发

```bash
# 安装依赖
npm install

# 开发模式（使用代理）
npm run dev

# 开发模式（直连 API，需要 API 支持 CORS）
NEXT_PUBLIC_USE_API_PROXY=false npm run dev

# 构建
npm run build

# 生产模式运行
npm start
```