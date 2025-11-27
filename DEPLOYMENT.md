# 部署指南

## 需要部署的文件/目录

### ✅ 推荐方式：使用 Standalone 独立构建

**部署目录：** `.next/standalone/` 目录 + 静态文件

**完整部署包包括：**

1. `.next/standalone/` - 独立运行包（包含 server.js、node_modules 等）
2. `.next/static/` - 静态资源（JS、CSS 等）
3. `public/` - 公共静态文件（图片、字体等）

---

## 📦 方式一：Jenkins 自动部署

### 1. Jenkins 配置

#### 需要的插件

- NodeJS Plugin（用于 Node.js 环境）
- Pipeline Plugin（如果使用 Jenkinsfile）

#### 环境变量

- `NODE_VERSION`: Node.js 版本（建议 20+）
- `PORT`: 服务端口（默认 3000）
- `DEPLOY_DIR`: 服务器部署目录

### 2. Jenkinsfile 使用

项目根目录已包含 `Jenkinsfile`，配置了完整的构建和部署流程：

```groovy
// 主要步骤：
1. Checkout - 拉取代码
2. Install Dependencies - 安装依赖（使用 pnpm）
3. Build - 构建项目
4. Prepare Deployment Package - 准备部署包
5. Deploy - 部署到服务器
```

### 3. 修改配置

在 `Jenkinsfile` 中修改以下配置：

```groovy
environment {
    DEPLOY_DIR = '/var/www/your-app'  // 修改为你的部署目录
    PORT = '3000'                      // 修改为你的端口
}

// 修改服务器连接信息
ssh user@your-server  // 修改 user 和 your-server
```

---

## 📦 方式二：手动部署

### 步骤 1: 本地打包准备

```bash
# 1. 构建项目
pnpm build

# 2. 准备部署包（会自动打包所有需要的文件）
bash scripts/deploy-prepare.sh
```

这会创建一个 `dist/standalone/` 目录，包含所有部署所需的文件。

### 步骤 2: 上传到服务器

```bash
# 将 dist/standalone 目录上传到服务器
scp -r dist/standalone/* user@your-server:/var/www/your-app/
```

或使用其他工具（FTP、rsync 等）上传 `dist/standalone/` 目录。

### 步骤 3: 在服务器上运行

```bash
# SSH 连接到服务器
ssh user@your-server

# 进入部署目录
cd /var/www/your-app

# 方式 1: 使用启动脚本
./start.sh

# 方式 2: 直接运行
export PORT=3000
export HOSTNAME=0.0.0.0
node server.js

# 方式 3: 使用 PM2（推荐生产环境）
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # 设置开机自启
```

---

## 🔧 服务器环境要求

### 必需

- **Node.js**: 版本 >= 18（建议 20+）
- **内存**: 至少 512MB（建议 1GB+）
- **端口**: 确保端口（默认 3000）未被占用

### 可选（推荐）

- **PM2**: 进程管理工具
- **Nginx**: 反向代理
- **SSL 证书**: HTTPS 支持

---

## 🌐 Nginx 反向代理配置（推荐）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🐳 Docker 部署（可选）

如果使用 Docker，可以创建 Dockerfile：

```dockerfile
FROM node:20-alpine

WORKDIR /app

# 复制部署包
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

CMD ["node", "server.js"]
```

构建和运行：

```bash
docker build -t your-app .
docker run -p 3000:3000 your-app
```

---

## 📝 环境变量配置

如果需要环境变量，可以在服务器上创建 `.env` 文件或在启动时设置：

```bash
# .env 文件
PORT=3000
HOSTNAME=0.0.0.0
NODE_ENV=production

# 启动时使用
export PORT=3000
node server.js
```

---

## 🔍 验证部署

部署完成后，访问：

- `http://your-server-ip:3000`
- 或通过 Nginx 代理的域名访问

检查日志：

```bash
# PM2 日志
pm2 logs your-app

# 直接运行时的日志
# 查看终端输出
```

---

## ❓ 常见问题

### 1. 静态资源 404

确保部署时包含了 `.next/static` 和 `public` 目录。

### 2. 端口被占用

修改启动脚本中的 `PORT` 环境变量，或使用其他端口。

### 3. 内存不足

增加服务器内存，或使用 PM2 的集群模式（已在 ecosystem.config.js 中配置）。

---

## 📞 需要帮助？

查看部署包的 `DEPLOY.md` 文件，或检查 Jenkins 构建日志。
