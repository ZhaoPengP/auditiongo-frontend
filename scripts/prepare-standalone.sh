#!/bin/bash
# 准备 standalone 构建用于本地运行
# 这个脚本会创建必要的符号链接，使 standalone 构建能够访问静态文件

STANDALONE_DIR=".next/standalone"
STATIC_DIR=".next/static"
PUBLIC_DIR="public"

# 检查 standalone 目录是否存在
if [ ! -d "$STANDALONE_DIR" ]; then
    echo "❌ 错误: $STANDALONE_DIR 目录不存在，请先运行 pnpm build"
    exit 1
fi

# 创建符号链接到 .next/static
if [ ! -L "$STANDALONE_DIR/.next/static" ]; then
    echo "📦 创建 .next/static 符号链接..."
    cd "$STANDALONE_DIR"
    mkdir -p .next
    ln -sf "../../.next/static" .next/static
    cd - > /dev/null
fi

# 创建符号链接到 public
if [ ! -L "$STANDALONE_DIR/public" ]; then
    echo "📦 创建 public 符号链接..."
    cd "$STANDALONE_DIR"
    ln -sf "../../public" public
    cd - > /dev/null
fi

echo "✅ Standalone 构建准备完成！"
echo ""
echo "现在可以运行:"
echo "  cd $STANDALONE_DIR && node server.js"
echo "或者使用:"
echo "  pnpm start:standalone"

