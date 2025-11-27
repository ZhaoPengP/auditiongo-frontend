'use client'
// 欢迎页：首屏视频背景，顶部左侧仅 logo + slogan，右侧仅"进入官网"按钮
import { useMemo, Suspense, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import FeatureCarousel from '@/components/FeatureCarousel'
import AgeRecommendations from '@/components/AgeRecommendations'
import { getMessages, Locale } from '@/lib/i18n'
import SvgIcon from '@/components/SvgIcon'

// 内部组件，包含所有需要客户端数据的逻辑
function WelcomeContent() {
  // 6s 自动轮播
  // 轮播的自动播放由组件内部控制，这里无需额外状态与定时器

  const searchParams = useSearchParams()
  // Get locale from search params or use default
  // 使用固定默认值避免hydration mismatch，只在客户端使用navigator.language
  const supportedLocales: Locale[] = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko']
  const locale = supportedLocales.includes(
    (searchParams.get('locale') || navigator.language) as Locale
  )
    ? ((searchParams.get('locale') || navigator.language) as Locale)
    : 'en'
  const messages = getMessages(locale)
  // 生成多语言的featureItems数组
  const featureItems = useMemo(
    () => [
      {
        id: 'ai-idol',
        label: messages.features['ai-idol'],
        image: '/image/common/p1.png',
      },
      {
        id: 'mv-element',
        label: messages.features['mv-element'],
        image: '/image/common/p2.png',
      },
      {
        id: 'boy-group',
        label: messages.features['boy-group'],
        image: '/image/common/p3.png',
      },
      {
        id: 'girl-group',
        label: messages.features['girl-group'],
        image: '/image/common/p1.png',
      },
      {
        id: 'idol-creation',
        label: messages.features['idol-creation'],
        image: '/image/common/p2.png',
      },
      {
        id: 'training',
        label: messages.features['training'],
        image: '/image/common/p3.png',
      },
    ],
    [messages]
  )

  // 顶部（欢迎页专用）
  const TopBar = useMemo(
    () => (
      <div className="header-fixed">
        <div className="mx-auto flex h-20 items-center justify-between text-white pl-[30px] ">
          {/* 左边 logo + slogan */}
          <div className="flex items-center gap-3">
            <Image
              src="/image/common/logo.png"
              alt="logo"
              width={116}
              height={64}
              className="h-[64px] w-[116px] mr-[10px]"
            />
            <Image
              src="/image/common/slogan.png"
              alt="slogan"
              width={174}
              height={55}
              className="h-[55px] w-[174px]"
            />
          </div>
          {/* 右边进入官网按钮 */}
          <Link
            href={`/${locale}/home`}
            target="_blank"
            className="text-sm w-[209px] h-[80px] flex items-center justify-center bg-[url('/image/common/bg4.png')] bg-no-repeat bg-size-[209px_49px] bg-center"
          >
            <b className="text-[22px] animate-[pulse-scale_0.8s_ease-in-out_infinite_alternate]">
              {messages.welcome.enter}
            </b>
          </Link>
        </div>
      </div>
    ),
    [messages, locale]
  )
  // 下载
  const DownloadApp = useMemo(
    () => (
      <div className="absolute bottom-40 flex w-[277px] h-[195px] items-center justify-between bg-[url('/image/common/download-bg.png')] bg-no-repeat bg-size-[277px_195px]">
        <Image
          src="/image/common/bg9.png"
          alt="logo"
          width={70}
          height={20}
          className="absolute top-[56px] left-[10px] h-[30px] w-[90px] aspect-[95/34]"
        />
        <p className="absolute top-[90px] left-[10px] text-[12px] text-[#3D3D3D] text-center">
          欢迎加入AuditionGo
        </p>
        <div className="absolute left-[10px] bottom-[10px] flex w-[226px] h-[65px] items-center justify-between">
          <div>
            <Image
              src="/image/common/pc.png"
              alt="logo"
              width={66}
              height={66}
              className="h-[66px] w-[66px]"
            />
          </div>
          <div className="h-[66px] flex flex-col justify-between">
            <Image
              src="/image/common/android.png"
              alt="logo"
              width={83}
              height={30}
              className="h-[30px] w-[83px]"
            />
            <Image
              src="/image/common/appStore.png"
              alt="logo"
              width={83}
              height={30}
              className="h-[30px] w-[83px]"
            />
          </div>
          <Image
            src="/image/common/pc.png"
            alt="logo"
            width={66}
            height={66}
            className="h-[66px] w-[66px]"
          />
        </div>
      </div>
    ),
    []
  )

  const [showScrollIcon, setShowScrollIcon] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // 判断是否在首屏（滚动距离小于视口高度的10%）
      const isFirstScreen = window.scrollY < window.innerHeight * 0.1
      setShowScrollIcon(isFirstScreen)
    }

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll)

    // 清理函数
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const ScrollIcon = useMemo(
    () =>
      showScrollIcon && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <SvgIcon
            src="/svg/scroll-down.svg"
            size={48}
            className="text-white"
          />
        </div>
      ),
    [showScrollIcon]
  )
  const videoSrc = '/video/video1.mp4'

  return (
    <div className="min-h-screen bg-black text-white">
      {TopBar}
      {/* 第一屏：视频背景 + 中央文案与播放按钮 */}
      <section className="relative flex h-[100vh] w-full items-center justify-center overflow-hidden ">
        {/* 视频占位，实际使用时替换为 <video> 资源 */}
        <video loop autoPlay muted className="w-full h-full object-cover">
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* 8+ */}
        <AgeRecommendations className="bottom-44 left-10" />
        {/* 下载 */}
        {DownloadApp}
        {/* 滚动图标 */}
        {ScrollIcon}
      </section>

      {/* 第二屏：功能特色 + 轮播 + 6 个 Tab */}
      <section className="relative w-full overflow-hidden">
        {/* 标题“功能特色”，背后 290:138 背景图占位 */}
        <div className="mx-auto max-w-7xl px-4 pb-[180px] bg-[url('/image/common/w-bg.png')] bg-bottom bg-no-repeat bg-position-[0_124%]">
          <FeatureCarousel
            items={featureItems}
            titlePrefix="ELEMENTAL"
            titleSuffix={messages.welcome.features}
            carouselHeight="h-[600px]"
            onChange={(index, item) => {}}
          />
        </div>
        <Image
          src="/image/common/bg2.png"
          alt="line"
          width={293}
          height={747}
          className="w-[293px] h-[747px] absolute top-[20px] left-0"
        />
        <Image
          src="/image/common/bg1.png"
          alt="line"
          width={551}
          height={614}
          className="w-[551px] h-[614px] absolute bottom-[20px] right-0"
        />
        <div className="absolute right-[280px] transform -translate-y-[-100px]">
          {DownloadApp}
        </div>
      </section>
    </div>
  )
}

// 主页面组件，使用 Suspense 包装内部组件
export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white">
          <div className="header-fixed">
            <div className="mx-auto flex h-20 items-center text-white pl-[30px] ">
              <Image
                src="/image/common/logo.png"
                alt="logo"
                width={116}
                height={64}
                className="h-[64px] w-[116px]"
              />
            </div>
          </div>
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  )
}
