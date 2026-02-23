# 部署指南

## 免费部署到 Vercel

### 方法一：通过 Vercel CLI 部署（推荐）

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
cd "C:\Users\111\Desktop\游戏网站"
vercel
```

4. **生产环境部署**
```bash
vercel --prod
```

### 方法二：通过 Vercel 网站部署

1. 访问 https://vercel.com
2. 注册/登录账号
3. 点击 "New Project"
4. 导入 Git 仓库或上传项目文件夹
5. 配置构建设置：
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. 点击 "Deploy"

### 方法三：通过 GitHub 集成部署（最推荐）

1. 将项目推送到 GitHub
2. 在 Vercel 中导入 GitHub 仓库
3. Vercel 会自动检测 Next.js 并配置
4. 每次推送代码会自动重新部署

## 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

```
NEXT_PUBLIC_APP_NAME=GameHub
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
NEXT_PUBLIC_IMAGE_QUALITY=80
CACHE_TTL=300
CACHE_MAX_SIZE=100
MAX_FILE_SIZE=104857600
ALLOWED_FILE_TYPES=.apk,.zip
```

## 注意事项

1. **数据库配置**：项目使用了 PostgreSQL，需要配置数据库连接
   - 可以使用 Vercel Postgres（免费额度）
   - 或者使用 Supabase、Neon 等免费 PostgreSQL 服务

2. **文件上传**：如果需要文件上传功能，需要配置对象存储
   - 可以使用 Vercel Blob
   - 或者使用 Cloudflare R2、AWS S3 等

3. **域名配置**：部署后可以绑定自定义域名

## 部署完成后

Vercel 会提供一个 `.vercel.app` 域名，例如：
`https://your-project-name.vercel.app`
