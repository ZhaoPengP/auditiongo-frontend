/* eslint-disable react-hooks/refs */
'use client'
// 功能特色轮播组件：顶部标题 + 轮播图 + 底部导航栏，支持双向联动
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import SvgIcon from './SvgIcon'

export type FeatureItem = {
  id: string
  label: string
  image?: string
  imageUrl?: string
  href?: string
}

export interface FeatureCarouselProps {
  // 功能项列表（对应底部的6个按钮）
  items: FeatureItem[]
  // 轮播自动播放间隔（毫秒），设为 0 或 undefined 则禁用自动播放
  interval?: number
  // 初始选中的索引
  defaultIndex?: number
  // 标题前缀（如 "ELEMENTAL"）
  titlePrefix?: string
  // 标题后缀（默认 "功能特色"）
  titleSuffix?: string
  // 轮播图高度
  carouselHeight?: string
  // 是否显示左右控制按钮
  showControls?: boolean
  // 选中项改变时的回调
  onChange?: (index: number, item: FeatureItem) => void
}

export default function FeatureCarousel({
  items,
  interval = 3000,
  defaultIndex = 0,
  titlePrefix = 'ELEMENTAL',
  titleSuffix = '功能特色',
  carouselHeight = 'h-[600px]',
  showControls = true,
  onChange,
}: FeatureCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startX = useRef(0)
  const isDragging = useRef(false)

  // 自动轮播
  // 基于依赖重置定时器：依赖于 interval、items.length
  useEffect(() => {
    // 清理旧定时器
    const timer = timerRef.current
    if (timer) {
      clearInterval(timer)
      timerRef.current = null
    }
    // 重新设置新定时器（仅当间隔有效且有多张图片时）
    if (interval && interval > 0 && items.length > 1) {
      const newTimer = setInterval(() => {
        setActiveIndex((i) => (i + 1) % items.length)
      }, interval)
      timerRef.current = newTimer
      return () => {
        clearInterval(newTimer)
        timerRef.current = null
      }
    }
    // 卸载时清理
    return () => {
      const cleanupTimer = timerRef.current
      if (cleanupTimer) {
        clearInterval(cleanupTimer)
        timerRef.current = null
      }
    }
  }, [interval, items.length])

  // 通知外部变化
  useEffect(() => {
    if (items[activeIndex]) {
      onChange?.(activeIndex, items[activeIndex])
    }
  }, [activeIndex, items, onChange])

  // 切换到指定索引
  const goToIndex = useCallback(
    (index: number) => {
      // 更新索引
      setActiveIndex(index)

      // 清除之前的定时器
      const timer = timerRef.current
      if (timer) {
        clearInterval(timer)
        timerRef.current = null
      }

      // 重新启动自动轮播计时
      // 确保从当前索引开始计算下一个位置
      if (interval && interval > 0 && items.length > 1) {
        // 先等待一次interval后再开始自动轮播，确保从当前位置开始
        const newTimer = setInterval(() => {
          // 使用闭包捕获最新的index值，确保从当前位置开始计算下一个索引
          setActiveIndex((current) => (current + 1) % items.length)
        }, interval)
        timerRef.current = newTimer
      }
    },
    [interval, items.length]
  )

  // 上一张
  const prev = useCallback(() => {
    // 调用goToIndex函数，它已经包含了清除和重置定时器的逻辑
    goToIndex((activeIndex - 1 + items.length) % items.length)
  }, [goToIndex, activeIndex, items.length])

  // 下一张
  const next = useCallback(() => {
    // 调用goToIndex函数，它已经包含了清除和重置定时器的逻辑
    goToIndex((activeIndex + 1) % items.length)
  }, [goToIndex, activeIndex, items.length])

  // 处理鼠标按下事件
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 更新ref值
    startX.current = e.clientX
    isDragging.current = true
    // 拖动时暂停自动轮播
    const timer = timerRef.current
    if (timer) {
      clearInterval(timer)
      timerRef.current = null
    }
  }, [])

  // 处理鼠标移动事件
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // 使用局部变量存储ref值，避免直接在条件判断中访问ref.current
    const draggingState = isDragging.current
    if (!draggingState) return
    // 这里可以添加拖动时的视觉反馈（如移动图片位置）
  }, [])

  // 处理鼠标释放事件
  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      // 使用局部变量存储ref值
      const draggingState = isDragging.current
      const startXValue = startX.current

      if (!draggingState) return

      const endX = e.clientX
      const diff = startXValue - endX
      const threshold = 50 // 最小拖动距离阈值

      // 根据拖动距离判断切换方向
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // 向左拖动，切换到下一张
          next()
        } else {
          // 向右拖动，切换到上一张
          prev()
        }
      }

      // 更新ref值
      isDragging.current = false
      // 重新启动自动轮播
      if (interval && interval > 0 && items.length > 1) {
        // 使用局部变量来存储和更新timerRef
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        timerRef.current = setInterval(() => {
          setActiveIndex((i) => (i + 1) % items.length)
        }, interval)
      }
    },
    [prev, next, interval, items.length]
  )

  // 处理鼠标离开事件
  const handleMouseLeave = useCallback(() => {
    // 更新ref值
    isDragging.current = false
    // 重新启动自动轮播
    if (interval && interval > 0 && items.length > 1) {
      // 使用局部变量来存储和更新timerRef
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      timerRef.current = setInterval(() => {
        setActiveIndex((i) => (i + 1) % items.length)
      }, interval)
    }
  }, [interval, items.length])

  // 处理鼠标悬停事件 - 暂停自动轮播
  const handleMouseEnter = useCallback(() => {
    // 清除定时器以暂停自动轮播
    const timer = timerRef.current
    if (timer) {
      clearInterval(timer)
      timerRef.current = null
    }
  }, [])

  // 处理鼠标离开容器事件 - 恢复自动轮播
  const handleCarouselMouseLeave = useCallback(() => {
    // 重新启动自动轮播
    if (interval && interval > 0 && items.length > 1) {
      // 使用局部变量来存储和更新timerRef
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      timerRef.current = setInterval(() => {
        setActiveIndex((i) => (i + 1) % items.length)
      }, interval)
    }
  }, [interval, items.length])

  // 切换到上一张（用于预览图片点击）
  const handlePrevClick = useCallback(() => {
    const newIndex = (activeIndex - 1 + items.length) % items.length
    // 调用goToIndex函数，它已经包含了清除和重置定时器的逻辑
    goToIndex(newIndex)
  }, [goToIndex, activeIndex, items.length])

  // 切换到下一张（用于预览图片点击）
  const handleNextClick = useCallback(() => {
    const newIndex = (activeIndex + 1) % items.length
    // 调用goToIndex函数，它已经包含了清除和重置定时器的逻辑
    goToIndex(newIndex)
  }, [goToIndex, activeIndex, items.length])

  const currentItem = items[activeIndex]
  // 计算上一张和下一张的索引
  // const prevIndex = (activeIndex - 1 + items.length) % items.length
  // const nextIndex = (activeIndex + 1) % items.length
  const prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
  const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
  const prevItem = items[prevIndex]
  const nextItem = items[nextIndex]

  // 渲染预览图片的辅助函数
  const renderPreviewImage = (
    item: FeatureItem | undefined,
    rotation: string,
    side: 'left' | 'right',
    onClick: () => void
  ) => {
    if (!item) return null

    return (
      <button
        onClick={onClick}
        className={`
          relative w-[25%] h-[85%] overflow-hidden rounded-lg
          transition-all duration-300 cursor-pointer z-0
          hover:scale-105 hover:z-20
        `}
        style={{
          transform: `perspective(1200px) rotateY(${rotation})`,
          transformStyle: 'preserve-3d',
          transformOrigin: side === 'left' ? 'right center' : 'left center',
        }}
        aria-label={`切换到 ${item.label}`}
      >
        {item.image || item.imageUrl ? (
          <Image
            src={item.image || item.imageUrl || ''}
            alt={item.label}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-white/10 flex items-center justify-center">
            <span className="text-sm text-white/60">{item.label}</span>
          </div>
        )}
        {/* 渐变遮罩，让边缘更自然，只显示部分内容 */}
        <div
          className={`absolute inset-0 ${
            side === 'left'
              ? 'bg-gradient-to-r from-black/80 via-black/40 to-transparent'
              : 'bg-gradient-to-l from-black/80 via-black/40 to-transparent'
          }`}
        />
      </button>
    )
  }

  return (
    <div className="w-full relative">
      {/* 标题区域 */}
      <div className="mt-20 mb-20">
        <div className="mx-auto flex items-center justify-center h-[46px] w-[264px] bg-[url('/image/common/bg3.png')] bg-no-repeat bg-size-[264px_46px]">
          <h2 className=" text-2xl font-bold text-white">游戏特色</h2>
        </div>
      </div>

      {/* 轮播图区域 - 三张图片并排显示 */}
      <div
        className={`relative w-full ${carouselHeight} mb-6 flex items-center justify-center gap-2`}
        style={{ perspective: '1500px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleCarouselMouseLeave}
      >
        {/* 左侧预览（上一张） */}
        {items.length > 1 &&
          renderPreviewImage(prevItem, '30deg', 'left', handlePrevClick)}

        {/* 中间主图 */}
        <div
          className="relative w-[80%] h-full rounded-lg overflow-hidden z-10 transition-all duration-300 shadow-2xl cursor-pointer"
          style={{ flexShrink: 0 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {currentItem?.image || currentItem?.imageUrl ? (
            <Image
              src={currentItem.image || currentItem.imageUrl || ''}
              alt={currentItem.label}
              fill
              className="w-[100%] h-[100%]"
              priority={activeIndex === 0}
            />
          ) : (
            <div className="w-full h-full bg-white/10 flex items-center justify-center">
              <span className="text-lg text-white/60">
                {currentItem?.label || '暂无图片'}
              </span>
            </div>
          )}

          {/* 指示器 */}
          {/* {items.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 z-20">
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`h-2 w-8 rounded transition-all ${
                    activeIndex === i ? 'bg-white w-12' : 'bg-white/40'
                  }`}
                  onClick={() => goToIndex(i)}
                  aria-label={`切换到 ${items[i].label}`}
                />
              ))}
            </div>
          )} */}
        </div>

        {/* 右侧预览（下一张） */}
        {items.length > 1 &&
          renderPreviewImage(nextItem, '-30deg', 'right', handleNextClick)}
      </div>

      {/* 底部导航栏 */}
      <div
        className="flex flex-wrap gap-3 justify-center mt-[40px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleCarouselMouseLeave}
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            className={`
              px-6 py-3 rounded-lg text-white text-sm font-medium transition-all cursor-pointer bg-white/10 hover-btn
              ${activeIndex === i ? `btn-tab` : ''}
            `}
            onClick={() => goToIndex(i)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 左右控制按钮 */}
      {showControls && items.length > 1 && (
        <>
          <button
            className="absolute inset-y-0 left-[-80px] flex items-center justify-center z-20 cursor-pointer"
            onClick={prev}
            aria-label="上一张"
          >
            <SvgIcon
              src="/svg/15583.svg"
              alt="prev"
              width={46}
              height={46}
              className="hover:transform hover:scale-130"
            />
          </button>
          <button
            className="absolute inset-y-0 right-[-80px] flex items-center justify-center z-20 cursor-pointer"
            onClick={next}
            aria-label="下一张"
          >
            <SvgIcon
              src="/svg/15583.svg"
              alt="next"
              width={46}
              height={46}
              className="transform rotate-180 hover:transform hover:scale-130"
            />
          </button>
        </>
      )}
    </div>
  )
}
