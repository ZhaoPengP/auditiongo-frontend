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
  output: process.platform === 'win32' ? undefined : 'standalone',
  distDir: '.next',
  // 解决Windows系统上的符号链接权限问题
  // 在Windows上禁用standalone模式，避免符号链接创建失败
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

  // 注意：在Windows平台上使用默认构建模式，不使用standalone以避免符号链接权限问题

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
