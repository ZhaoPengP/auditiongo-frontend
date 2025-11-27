pipeline {
    agent any
    
    environment {
        NODE_VERSION = '20'  // Node.js 版本
        PORT = '3000'        // 服务端口
        DEPLOY_DIR = '/var/www/auditiongo'  // 部署目录
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📦 拉取代码...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📥 安装依赖...'
                sh '''
                    # 检查 pnpm 是否安装
                    if ! command -v pnpm &> /dev/null; then
                        npm install -g pnpm
                    fi
                    pnpm install --frozen-lockfile
                '''
            }
        }
        
        stage('Build') {
            steps {
                echo '🔨 构建项目...'
                sh '''
                    pnpm build
                '''
            }
        }
        
        stage('Prepare Deployment Package') {
            steps {
                echo '📦 准备部署包...'
                sh '''
                    # 创建部署目录
                    mkdir -p dist
                    
                    # 复制 standalone 目录
                    cp -r .next/standalone dist/
                    
                    # 复制静态文件和 public 目录
                    cp -r .next/static dist/standalone/.next/
                    cp -r public dist/standalone/
                    
                    # 创建启动脚本
                    cat > dist/standalone/start.sh << 'EOF'
#!/bin/bash
export NODE_ENV=production
export PORT=${PORT:-3000}
export HOSTNAME=${HOSTNAME:-0.0.0.0}
node server.js
EOF
                    chmod +x dist/standalone/start.sh
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 部署到服务器...'
                sh '''
                    # 停止旧服务
                    ssh user@your-server "cd ${DEPLOY_DIR} && pm2 stop your-app || true"
                    
                    # 备份旧版本
                    ssh user@your-server "cd ${DEPLOY_DIR} && [ -d current ] && mv current backup-\$(date +%Y%m%d-%H%M%S) || true"
                    
                    # 上传新版本
                    scp -r dist/standalone/* user@your-server:${DEPLOY_DIR}/current/
                    
                    # 启动服务
                    ssh user@your-server "cd ${DEPLOY_DIR}/current && pm2 start start.sh --name your-app || pm2 restart your-app"
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ 部署成功！'
        }
        failure {
            echo '❌ 部署失败！'
        }
        always {
            // 清理工作空间
            cleanWs()
        }
    }
}

