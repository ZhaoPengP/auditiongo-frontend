'use client'
// 视频遮罩层组件：全屏视频背景 + 半透明遮罩 + 标题文字
// 支持控制显示/隐藏和关闭功能
import { useRef, useState, useEffect } from 'react'

interface VideoOverlayProps {
  // 是否显示遮罩层
  isVisible: boolean
  // 关闭遮罩层的回调
  onClose: () => void
  // 视频源地址
  videoSrc?: string
  // 视频自动播放
  autoPlay?: boolean
  // 视频循环
  loop?: boolean
  // 视频静音
  muted?: boolean
  // 标题文字
  title: string
  // 副标题文字
  subtitle: string
  // 标题样式类名
  titleClassName?: string
  // 副标题样式类名
  subtitleClassName?: string
  // 遮罩层透明度 (0-1)
  overlayOpacity?: number
  // 遮罩层颜色
  overlayColor?: string
  // 容器样式类名
  containerClassName?: string
  // 内容区域样式类名
  contentClassName?: string
}

export default function VideoOverlay({
  isVisible,
  onClose,
  videoSrc = '/video/welcome.mp4', // 默认视频路径
  autoPlay = true,
  loop = true,
  muted = true,
  title,
  subtitle,
  titleClassName = 'text-[22px] font-bold text-white',
  subtitleClassName = 'text-[14px] text-white/80',
  containerClassName = '',
  contentClassName = '',
}: VideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)

  // 处理视频播放控制和键盘事件
  useEffect(() => {
    const handleLoadedData = () => {
      setIsReady(true)
    }

    const video = videoRef.current
    if (video) {
      video.addEventListener('loadeddata', handleLoadedData)

      // 当遮罩层显示时控制视频播放
      if (isVisible && autoPlay) {
        video.play().catch((error) => {
          console.warn('视频自动播放失败:', error)
        })
      } else {
        video.pause()
      }

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
        video.pause() // 清理时暂停视频
      }
    }
  }, [isVisible, autoPlay])

  // 处理ESC键关闭
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // 防止背景滚动
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = '' // 恢复滚动
    }
  }, [isVisible, onClose])

  // 点击遮罩层背景关闭
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  // 如果不可见则不渲染
  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 w-full h-full flex items-center justify-center overflow-hidden backdrop-blur ${containerClassName}`}
      onClick={handleBackdropClick}
    >
      {/* 关闭按钮 */}
      <button
        className="absolute top-6 right-6 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer transform transition-transform hover:scale-110"
        onClick={onClose}
        aria-label="关闭视频"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="flex flex-col items-center justify-center auto w-[1200px]">
        {/* 视频背景 */}
        <div className="inset-0 z-0 w-full h-[700px] mx-auto">
          <video
            ref={videoRef}
            className="inset-0 w-full h-full"
            autoPlay={false} // 由useEffect控制播放
            loop={loop}
            muted={muted}
            controls={true} // 自定义控制
            playsInline
            aria-hidden="true"
          >
            <source src={videoSrc} type="video/mp4" />
            您的浏览器不支持视频标签。
          </video>
        </div>
        {/* 内容区域 - 标题和副标题 */}
        <div
          className={`relative z-20 flex flex-col w-full px-4 py-8 ${contentClassName}`}
          onClick={(e) => e.stopPropagation()} // 防止点击内容区关闭
        >
          <h1 className={`mb-4 animate-fade-in ${titleClassName}`}>{title}</h1>
          <p
            className={`max-w-full animate-fade-in-delay ${subtitleClassName}`}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* 加载状态指示（可选） */}
      {!isReady && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
