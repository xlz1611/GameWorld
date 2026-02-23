# GameHub - 安卓游戏下载网站

一个现代化、高性能的安卓游戏下载网站，使用 Next.js、React 和 Tailwind CSS 构建。

## 功能特性

- 🎮 游戏列表展示，支持分类筛选和搜索
- 🔍 智能搜索功能，带搜索历史记录
- ⭐ 游戏收藏和下载历史管理
- 📱 响应式设计，适配移动端和桌面端
- 🎨 现代化 UI 设计，带有流畅的动画和过渡效果
- ⚡ 高性能优化，包括代码分割和图片优化
- 🔒 安全防护，包括 XSS 攻击防护
- ♿ 可访问性支持，包括 ARIA 标签和键盘导航
- 📊 用户评论和评分系统

## 技术栈

- **前端框架**: Next.js (App Router)
- **UI 库**: React
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **状态管理**: React Hooks (useState, useEffect, useCallback, useMemo)
- **数据存储**: LocalStorage (客户端缓存)
- **API**: 自定义 Next.js API 路由

## 项目结构

```
├── app/
│   ├── api/             # API 路由
│   ├── components/       # 可复用组件
│   │   ├── layout/       # 布局组件
│   │   ├── ui/           # UI 组件
│   │   └── features/     # 功能组件
│   ├── games/            # 游戏详情页面
│   ├── ranking/          # 排行榜页面
│   ├── settings/         # 设置页面
│   ├── globals.css       # 全局样式
│   ├── layout.js         # 根布局
│   └── page.js           # 首页
├── prisma/              # Prisma ORM
├── public/              # 静态资源
├── .gitignore           # Git 忽略文件
├── package.json         # 项目配置
├── tailwind.config.js   # Tailwind 配置
└── vercel.json          # Vercel 部署配置
```

## 快速开始

### 前提条件

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装

1. 克隆项目仓库

```bash
git clone <repository-url>
cd gamehub
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

4. 打开浏览器访问

```
http://localhost:3000
```

## 构建与部署

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 部署到 Vercel

1. 登录 Vercel 账户
2. 导入项目仓库
3. 配置构建命令和输出目录
4. 点击部署

## 主要组件

### 布局组件
- `Navbar` - 顶部导航栏，包含菜单和搜索功能
- `Hero` - 首页英雄区域，包含网站标题和搜索框
- `MobileNav` - 移动端底部导航栏

### UI 组件
- `GameCard` - 游戏卡片，显示游戏信息和操作按钮
- `Pagination` - 分页控件，用于切换不同页码

### 功能组件
- `TrendingGames` - 热门游戏排行榜
- `GameReviews` - 游戏评论和评分系统

## 贡献

欢迎贡献代码、提出问题和功能请求！请确保遵循项目的代码风格和提交规范。

## 许可证

MIT License
