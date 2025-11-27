/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // 启用移动优先的设计理念
  darkMode: 'media',
  theme: {
    // 默认断点设置为移动优先
    screens: {
      // 小屏幕移动设备
      xs: '360px',
      // 标准移动端断点
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      // 添加安全区域相关的配置
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      // 确保基础容器宽度在移动端为100%
      width: {
        full: '100%',
      },
      // 基础字体大小响应式
      fontSize: {
        base: ['16px', '1.5'],
      },
      // 基础间距
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem',
      },
    },
  },
  // 移动端优化配置
  plugins: [
    function ({ addUtilities, addBase, addComponents }) {
      // 添加基础样式确保移动端宽度100%
      addBase({
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          width: '100%',
          height: '100%',
          '-webkit-text-size-adjust': '100%',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        body: {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
          position: 'relative',
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
        // 确保图片在移动端正确缩放
        img: {
          maxWidth: '100%',
          height: 'auto',
        },
        // 确保表单元素在移动端可用
        'input, textarea, select': {
          maxWidth: '100%',
        },
      })

      // 添加通用组件样式
      addComponents({
        '.container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          '@screen sm': {
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
          '@screen md': {
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
        },
        '.mobile-full-width': {
          width: '100%',
        },
      })

      // 添加移动端优化工具类
      addUtilities({
        '.content-auto': {
          'content-visibility': 'auto',
        },
        // 移动端触摸优化
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        // 防止文本选择
        '.no-select': {
          '-webkit-user-select': 'none',
          'user-select': 'none',
        },
        // 滚动优化
        '.smooth-scroll': {
          '-webkit-overflow-scrolling': 'touch',
        },
        // 移动端触摸目标大小优化
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
          padding: '0.5rem',
        },
        // 确保元素不超出视口
        '.overflow-hidden': {
          overflow: 'hidden',
        },
      })
    },
  ],
  // 为移动设备优化
  future: {
    hoverOnlyWhenSupported: true,
  },
}
