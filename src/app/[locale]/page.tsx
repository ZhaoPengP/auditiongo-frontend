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

import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react'
import { EffectCoverflow, Mousewheel, EffectCards } from 'swiper/modules'
import 'swiper/css/effect-cards'
import 'swiper/css/effect-coverflow'
import 'swiper/css'
import 'swiper/css/pagination'

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
        label: 'AI虚拟人创造',
        description: '',
        image: '/image/common/1.png',
      },
      {
        id: 'ugc-smart',
        label: 'AI 生歌及谱面生成',
        description: '',
        image: '/image/common/2.png',
      },
      {
        id: 'clothing-design',
        label: '偶像练习室 UGC MV创作',
        description: '(舞步排练、舞台灯光道具UGC)',
        image: '/image/common/3.png',
      },
      {
        id: 'mv-play',
        label: 'UGC服饰设计',
        description: '(异形异构)',
        image: '/image/common/4.png',
      },
      {
        id: 'idol-interaction',
        label: 'AI UGC 综艺、走秀',
        description: '',
        image: '/image/common/5.png',
      },
    ],
    [messages]
  )

  // 顶部（欢迎页专用）
  const TopBar = useMemo(
    () => (
      <div className="header-fixed">
        <div className="mx-auto flex h-[0.8rem] items-center justify-between text-white pl-[0.3rem] ">
          {/* 左边 logo + slogan */}
          <div className="flex items-center gap-3">
            <Image
              src="/image/common/logo.png"
              alt="logo"
              width={116}
              height={64}
              className="h-[0.64rem] w-[1.16rem] mr-[0.1rem]"
            />
            <Image
              src="/image/common/slogan.png"
              alt="slogan"
              width={174}
              height={55}
              className="h-[0.55rem] w-[1.74rem]"
            />
          </div>
          {/* 右边进入官网按钮 */}
          <Link
            href={`/${locale}/home`}
            target="_blank"
            className="text-[0.22rem] w-[2.09rem] h-[0.8rem] flex items-center justify-center bg-[url('/image/common/bg4.png')] bg-no-repeat bg-size-[2.09rem_0.8rem] bg-center"
          >
            <b className="text-[0.22rem] animate-[pulse-scale_0.8s_ease-in-out_infinite_alternate]">
              {messages.welcome.enter}
            </b>
          </Link>
        </div>
      </div>
    ),
    [messages, locale]
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
      showScrollIcon ? (
        <div className="animate-bounce mt-[0.3rem]">
          <SvgIcon
            src="/svg/scroll-down.svg"
            className="text-white w-[0.6rem] h-[0.6rem]"
          />
        </div>
      ) : (
        <div className="mt-[0.6rem] w-[0.6rem] h-[0.6rem]"></div>
      ),
    [showScrollIcon]
  )
  // 下载
  const DownloadApp = useMemo(
    () => (
      <div className="relative flex items-center justify-between bg-[url('/image/common/bg13.png')] bg-no-repeat bg-size-[100%_100%] py-[0.2rem] px-[0.4rem]">
        <div className="flex items-center">
          <Image
            src="/image/common/scan1.png"
            alt="scan"
            width={138}
            height={132}
            className="h-[1.32rem] w-[1.38rem] aspect-[1/1]"
          />
          <p className="w-[2.0rem] text-[0.14rem] text-bg h-[1.32rem] text-center">
            扫码下载游戏
          </p>
          <style>
            {`
          .text-bg{
            background: linear-gradient(180deg, #00DDF6 -19%, #99FC84 142%, rgba(235, 255, 82, 0.9851) 142%, rgba(199, 222, 28, 0) 142%);
          }
          `}
          </style>
        </div>
        <Image
          src="/image/common/pc.png"
          alt="scan"
          width={138}
          height={132}
          className="h-[1.32rem] w-[1.38rem] ml-[0.1rem] aspect-[138/132]"
        />
        <div className="ml-[0.1rem]">
          <Image
            src="/image/common/apply1.png"
            alt="scan"
            width={130}
            height={61}
            className="h-[0.61rem] w-[1.3rem] aspect-[138/61]"
          />
          <Image
            src="/image/common/android3.png"
            alt="scan"
            width={130}
            height={61}
            className="h-[0.61rem] w-[1.3rem] mt-[0.1rem] aspect-[138/61]"
          />
        </div>
      </div>
    ),
    []
  )

  const videoSrc = 'https://webyyt.48.cn/owebtest/video1.mp4'

  return (
    <div className="min-h-screen bg-black text-white relative">
      {TopBar}
      <Swiper
        modules={[EffectCoverflow, Mousewheel]}
        direction="vertical"
        mousewheel={{
          enabled: true,
          sensitivity: 1,
          thresholdDelta: 50, // 设置触发滚轮事件的最小滚动距离
          releaseOnEdges: true, // 在边缘释放鼠标滚轮
        }}
        speed={1000} // 设置过渡动画持续时间为2秒
        slidesPerView={1}
        spaceBetween={0}
        className="w-full h-[100vh]"
      >
        <SwiperSlide
          key={1}
          className="h-[100%] w-full flex items-center justify-center"
        >
          {/* 第一屏：视频背景 + 中央文案与播放按钮 */}
          <section className="relative flex h-[100vh] w-full items-center justify-center overflow-hidden">
            {/* 视频占位，实际使用时替换为 <video> 资源 */}
            <video loop autoPlay muted className="w-full h-full object-cover">
              <source src={videoSrc} type="video/mp4" />
            </video>
            {/* 8+ */}
            <AgeRecommendations className="bottom-[3.8rem] left-[1.0rem]" />
            <div className="absolute flex flex-col items-center justify-center bottom-[0.4rem]">
              {/* 下载 */}
              {DownloadApp}
              {/* 滚动图标 */}
              {ScrollIcon}
            </div>
          </section>
        </SwiperSlide>

        <SwiperSlide
          key={2}
          className="h-[100%] w-full flex items-center justify-center"
        >
          {/* 第二屏：功能特色 + 轮播 + 6 个 Tab */}
          <section className="relative w-full h-[100vh] overflow-hidden bg-[url('/image/common/bg10.png')] bg-no-repeat bg-size-[100%_100%]">
            {/* 标题“功能特色”，背后 290:138 背景图占位 */}
            <div className="mx-auto px-[0.16rem] pb-[1.80rem] h-[100%]">
              <FeatureCarousel
                items={featureItems}
                titlePrefix="ELEMENTAL"
                titleSuffix={messages.welcome.features}
                carouselHeight="h-[60.0rem]"
                onChange={(index, item) => {}}
              />
            </div>
            {/* <Image
              src="/image/common/bg2.png"
              alt="line"
              width={293}
              height={747}
              className="w-[29.3rem] h-[74.7rem] absolute top-[2.0rem] left-0"
            />
            <Image
              src="/image/common/bg1.png"
              alt="line"
              width={551}
              height={614}
              className="w-[55.1rem] h-[61.4rem] absolute bottom-[2.0rem] right-0 z-[-1]"
            /> */}
            <div className="absolute right-[0rem] bottom-[0.8rem] bg-[url('/image/common/bg12.png')] bg-no-repeat bg-size-[100%_100%] w-[1.5rem] py-[0.16rem] px-[0.08rem]">
              <Image
                src="/image/common/scan.png"
                alt="apply"
                width={138}
                height={138}
                className="w-[1.38rem] h-[1.38rem] cursor-pointer"
              />
              <Image
                src="/image/common/pc1.png"
                alt="apply"
                width={137}
                height={93}
                className="w-[1.37rem] h-[0.93rem] mt-[0.2rem] cursor-pointer"
              />
              <Image
                src="/image/common/apply2.png"
                alt="apply"
                width={137}
                height={50}
                className="w-[1.37rem] h-[0.50rem] mt-[0.2rem] cursor-pointer"
              />
              <Image
                src="/image/common/android2.png"
                alt="apply"
                width={137}
                height={50}
                className="w-[1.37rem] h-[0.50rem] mt-[0.2rem] cursor-pointer"
              />
            </div>
          </section>
        </SwiperSlide>
        {/* <SwiperSlide
          key={3}
          className="h-[100%] w-full flex items-center justify-center"
        >
          <section className="relative w-full h-[100vh] overflow-hidden">
            <Swiper
              effect={'cards'}
              grabCursor={true}
              modules={[EffectCards]}
              className="mySwiper"
            >
              {featureItems.map((item, index) => (
                <SwiperSlide
                  key={item.id}
                  className="h-[100%] w-full flex items-center justify-center"
                >
                  <div className="relative w-full max-w-[65.0rem] mx-auto">
                    <Image
                      src={item.image || ''}
                      alt={item.label || ''}
                      width={650}
                      height={430}
                      className="w-[65.0rem] h-[43.0rem]"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        </SwiperSlide> */}
      </Swiper>
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
            <div className="mx-auto flex h-[2.0rem] items-center text-white pl-[3.0rem] ">
              <Image
                src="/image/common/logo.png"
                alt="logo"
                width={116}
                height={64}
                className="h-[6.4rem] w-[11.6rem]"
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
