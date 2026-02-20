# 安卓游戏下载站

一个基于 Next.js + Tailwind CSS + Prisma 的安卓游戏下载网站，包含前端用户浏览和后端管理功能。

## ✨ 功能特性

### 前端用户端
- 🎮 游戏列表展示
- 🔍 实时搜索功能
- 📱 游戏详情页
- 📥 一键下载APK

### 后端管理端
- 📊 游戏管理仪表盘
- 📤 游戏上传功能
- ✏️ 游戏信息编辑
- 🚀 一键上下架
- 🗑️ 游戏删除功能

## 🛠 技术栈

- **前端**: Next.js 14 (App Router) + Tailwind CSS
- **后端**: Node.js + Prisma
- **数据库**: SQLite
- **UI组件**: Lucide React 图标库

## 📦 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 初始化数据库
```bash
npx prisma migrate dev --name init
```

### 3. 开发模式
```bash
npm run dev
# 访问 http://localhost:3000
```

### 4. 生产构建
```bash
npm run build
```

### 5. 启动生产服务器
```bash
npm run start
# 或双击 start.bat 文件
```

## 📁 项目结构

```
├── app/
│   ├── api/           # API 路由
│   ├── admin/         # 管理端页面
│   ├── games/         # 游戏详情页
│   ├── globals.css    # 全局样式
│   ├── layout.js      # 根布局
│   └── page.js        # 首页
├── prisma/            # Prisma 配置
├── public/            # 静态资源
│   └── uploads/       # 上传文件
├── package.json       # 项目配置
├── tailwind.config.js # Tailwind 配置
└── start.bat          # 快速启动脚本
```

## 🎨 设计特色

- 🚀 现代科技感 UI
- 🌙 深色模式友好
- 🔮 玻璃态设计
- ✨ 流畅动画效果
- 📱 响应式布局

## 🌐 部署方案

### 本地部署
1. 运行 `npm run build` 构建生产版本
2. 运行 `npm run start` 启动服务器

### 云服务器部署
1. 上传构建后的文件到服务器
2. 安装 Node.js 环境
3. 运行 `npm run start` 启动服务

### 平台部署
- **Vercel**: 官方推荐，支持一键部署
- **Netlify**: 支持静态网站托管
- **GitHub Pages**: 适合静态内容

## 📄 API 文档

### 用户端 API
- `GET /api/games` - 获取游戏列表
- `GET /api/games/[id]` - 获取游戏详情

### 管理端 API
- `GET /api/admin/games` - 获取所有游戏
- `POST /api/admin/upload` - 上传游戏
- `PUT /api/admin/games/[id]/publish` - 更新游戏状态
- `DELETE /api/admin/games/[id]` - 删除游戏

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
