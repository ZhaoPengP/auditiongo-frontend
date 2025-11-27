AuditionGo（中文鹦鹉团）官网开发任务清单

愿景与核心原则

- 面向全球用户的沉浸式互动社交元宇宙官方网站。
- 核心思想：松耦合、UI 和逻辑分离、代码清晰优雅、SSR 首屏极致优化。

技术栈与架构

- 框架：`Next.js`（App Router + SSR）+ `TypeScript` + `TailwindCSS`。
- 构建：优先探索 Next 与 `Vite` 的融合方案（研究 `vite-plugin-next` 或静态资源由 Vite 构建，SSR 由 Next 控制），给出技术决策与权衡。
- 包管理：`pnpm`。
- 代码规范：`ESLint` + `Prettier`（按 `.prettierrc` 指定规则）。
- 提交校验：`husky` + `lint-staged`，实现提交前自动代码规范校验与格式化。

设计与 UI 规范

- 字体：AlibabaPuHuiTi（优先本地引入，CDN 兜底）。
- 主题色：`#130830` 深色主题。
- 顶部导航背景色：`#000000` 80% 透明度，高度 `80px`，固定不随滚动消失。
- 间距：统一 Tailwind 间距刻度（如 `px-6`, `py-8` 等），页面布局上中下结构。
- 响应式：自适应 PC/平板/手机，导航在窄屏折叠为右侧抽屉。

目录结构建议（初稿）

```
src/
  app/                     # Next App Router 根目录
    layout.tsx             # 全局布局（上中下）
    page.tsx               # 欢迎页（/）
    home/page.tsx          # 首页（/home）
    data/page.tsx          # 游戏资料（/data）
    chat/page.tsx          # 偶像聊天室（/chat）
    community/page.tsx     # 创作社区（/community）
    channel/page.tsx       # 偶像频道（/channel）
    fans/page.tsx          # 粉丝圈（/fans）
  components/              # 通用组件（导航、底部、按钮、轮播、Tab等）
  features/                # 业务组件（欢迎页模块、首页模块等）
  styles/                  # 全局样式与 Tailwind 扩展
  lib/                     # 通用工具与逻辑（UI 与逻辑分离）
  i18n/                    # 文案与多语言配置（en, zh-CN, zh-TW, ja, ko）
public/                    # 字体、图片、视频等静态资源
```

多语言策略

- 默认语言 `en`，支持 `zh-CN`、`zh-TW`、`ja`、`ko`。
- 方案：`next-intl` 或 `next-i18next`，结合 App Router 的服务端渲染。
- 文案组织：以命名空间管理（如 `common`, `home`, `welcome`, `community` 等）。

# auditiongo-frontend

鹦鹉团官网
