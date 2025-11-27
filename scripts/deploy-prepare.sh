#!/bin/bash
# 部署准备脚本：将 standalone 构建打包成可直接部署的包
# 使用方法: bash scripts/deploy-prepare.sh [输出目录]

set -e

OUTPUT_DIR="${1:-dist}"
STANDALONE_DIR=".next/standalone"
STATIC_DIR=".next/static"
PUBLIC_DIR="public"

echo "🚀 开始准备部署包..."

# 检查 standalone 目录是否存在
if [ ! -d "$STANDALONE_DIR" ]; then
    echo "❌ 错误: $STANDALONE_DIR 目录不存在，请先运行 pnpm build"
    exit 1
fi

# 创建输出目录
mkdir -p "$OUTPUT_DIR"
DEPLOY_DIR="$OUTPUT_DIR/standalone"

# 清理旧文件
if [ -d "$DEPLOY_DIR" ]; then
    echo "🗑️  清理旧的部署包..."
    rm -rf "$DEPLOY_DIR"
fi

# 复制 standalone 目录
echo "📦 复制 standalone 构建..."
cp -r "$STANDALONE_DIR" "$DEPLOY_DIR"

# 复制静态文件
echo "📁 复制静态文件..."
mkdir -p "$DEPLOY_DIR/.next"
cp -r "$STATIC_DIR" "$DEPLOY_DIR/.next/"

# 复制 public 目录
echo "📁 复制 public 目录..."
cp -r "$PUBLIC_DIR" "$DEPLOY_DIR/"

# 创建启动脚本
echo "📝 创建启动脚本..."
cat > "$DEPLOY_DIR/start.sh" << 'EOF'
#!/bin/bash
# Next.js Standalone 启动脚本

export NODE_ENV=production
export PORT=${PORT:-3000}
export HOSTNAME=${HOSTNAME:-0.0.0.0}

# 启动服务器
node server.js
EOF

chmod +x "$DEPLOY_DIR/start.sh"

# 创建 PM2 配置文件（可选）
echo "📝 创建 PM2 配置文件..."
cat > "$DEPLOY_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [{
    name: 'auditiongo',
    script: './server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}
EOF

# 创建部署说明文件
echo "📝 创建部署说明..."
cat > "$DEPLOY_DIR/DEPLOY.md" << 'EOF'
# 部署说明

## 目录结构

- `server.js` - 服务器入口文件
- `node_modules/` - 依赖包
- `.next/` - Next.js 构建文件
- `public/` - 静态资源
- `start.sh` - 启动脚本
- `ecosystem.config.js` - PM2 配置文件

## 部署步骤

### 方法 1: 使用启动脚本

```bash
./start.sh
```

### 方法 2: 直接运行

```bash
export PORT=3000
node server.js
```

### 方法 3: 使用 PM2

```bash
pm2 start ecosystem.config.js
```

## 环境变量

- `PORT` - 服务端口（默认: 3000）
- `HOSTNAME` - 监听地址（默认: 0.0.0.0）
- `NODE_ENV` - 环境变量（应设置为 production）

## 注意事项

1. 确保服务器已安装 Node.js（版本 >= 18）
2. 确保端口未被占用
3. 建议使用 PM2 或 systemd 管理进程
EOF

echo ""
echo "✅ 部署包准备完成！"
echo ""
echo "📦 部署包位置: $DEPLOY_DIR"
echo ""
echo "📋 部署步骤:"
echo "  1. 将 $DEPLOY_DIR 目录上传到服务器"
echo "  2. 进入部署目录"
echo "  3. 运行: ./start.sh 或 node server.js"
echo ""
echo "💡 提示: 查看 $DEPLOY_DIR/DEPLOY.md 了解详细部署说明"

