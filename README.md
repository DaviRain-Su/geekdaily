# 极客日报 - 技术文章聚合平台

一个基于 Next.js 构建的技术文章聚合平台，从极客日报 API 获取并展示技术文章。

## 功能特性

### 核心功能
- 📰 **文章浏览**: 分页显示技术文章列表
- 🔍 **搜索功能**: 支持标题、作者、内容搜索
- ⭐ **文章收藏**: 本地收藏喜欢的文章
- 🔗 **社交分享**: 分享到微信、微博等平台
- 📱 **响应式设计**: 完美适配移动端和桌面端

### 用户体验
- 🎨 **深色模式**: 自动适应系统主题
- 📝 **文本展开**: 长文本悬停查看完整内容
- ⚡ **性能优化**: 使用 Vercel Speed Insights
- 🔒 **CORS 代理**: 解决跨域访问问题

### 开发特性
- 📊 **性能监控**: 开发环境实时性能面板
- 🐛 **错误处理**: 优雅的错误边界
- 📈 **分析集成**: Vercel Analytics
- 🚀 **SEO 优化**: 完整的元数据和结构化数据

## 技术栈

- **框架**: Next.js 15.3.4 (App Router)
- **UI**: React 19 + TypeScript
- **样式**: Tailwind CSS v4
- **部署**: Vercel
- **分析**: Vercel Analytics & Speed Insights

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 环境变量

创建 `.env.local` 文件（参考 `.env.example`）：

```env
# API 代理设置（可选）
NEXT_PUBLIC_USE_API_PROXY=true

# 自定义 API 端点（可选）
NEXT_PUBLIC_API_ENDPOINT=http://your-api-endpoint
```

## 部署

### 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 使用默认配置部署

详细部署说明请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 项目结构

```
geekdaily/
├── app/
│   ├── api/              # API 路由（CORS 代理）
│   ├── components/       # React 组件
│   ├── hooks/           # 自定义 Hooks
│   ├── lib/             # 工具函数
│   ├── types/           # TypeScript 类型
│   ├── layout.tsx       # 根布局
│   ├── page.tsx         # 首页
│   └── globals.css      # 全局样式
├── public/              # 静态资源
├── middleware.ts        # Next.js 中间件
└── package.json         # 项目配置
```

## 主要功能说明

### 搜索功能
- 实时搜索过滤
- 支持多字段搜索
- 搜索结果高亮显示

### 收藏功能
- 使用 localStorage 持久化
- 批量分享收藏文章
- 收藏列表管理

### 分享功能
- 支持多平台分享
- 微信二维码分享
- 批量分享功能

### 性能监控
- 开发环境性能面板
- Core Web Vitals 监控
- 网络状态显示

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

---

使用 Next.js 构建 | 部署在 Vercel
