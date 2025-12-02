/** @type {import('next').NextConfig} */
import path from 'path'

const nextConfig = {
  // 1. 静态资源和图片优化配置
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.your-cdn.com',
      },
    ],
    unoptimized: process.env.NODE_ENV !== 'production',
    dangerouslyAllowSVG: true,
  },

  // 2. 打包输出配置
  output: 'standalone',
  distDir: '.next',
  // 这些设置将在现有的experimental配置中添加
  reactStrictMode: true,

  // 3. Turbopack 配置
  // 注意：Turbopack 会自动读取 tsconfig.json 中的 paths 配置
  // 如果需要额外的别名配置，可以在 turbopack 中设置
  turbopack: {
    resolveAlias: {
      '@': path.join(__dirname, 'src'),
      '@components': path.join(__dirname, 'src/components'),
      '@i18n': path.join(__dirname, 'src/i18n'),
      '@lib': path.join(__dirname, 'src/lib'),
    },
  },

  // 4. 实验性功能配置
  experimental: {
    // 其他优化配置
    optimizePackageImports: ['lodash', 'react-icons'],
  },

  // 解决Windows系统上的符号链接权限问题
  // 将outputFileTracingRoot移到顶层配置
  outputFileTracingRoot: process.cwd(),
  // 禁用符号链接，强制使用文件复制
  outputFileTracingExcludes: {
    '*': ['node_modules/.pnpm/**'],
  },

  // 5. 环境变量配置
  env: {
    // ...
    // API_BASE_URL: process.env.API_BASE_URL || 'https://api.example.com',
  },

  // 6. 其他优化
  compress: true,
  poweredByHeader: false,
}

// 导出配置
export default nextConfig
