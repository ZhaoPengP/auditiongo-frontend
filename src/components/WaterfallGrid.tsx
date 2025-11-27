/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import SvgIcon from '@/components/SvgIcon'

interface WaterfallItem {
  id: string | number
  image?: string
  src?: string
  title: string
  type?: 'image' | 'video'
  height?: number
  aspectRatio?: number
  [key: string]: unknown
}

interface WaterfallGridProps {
  items?: WaterfallItem[]
  customRender?: (item: WaterfallItem, index: number) => React.ReactNode
  columnCount?: number
  gap?: number
  className?: string
  defaultImage?: string
  cardClassName?: string
  titleClassName?: string
  onItemClick?: (item: WaterfallItem, index: number) => void
}

// const defaultItems: WaterfallItem[] = [
//   {
//     id: 1,
//     image: '/image/data/bg2.png',
//     title: 'ALPHA 男子组合',
//     date: '2023-10-10'
//   },
//   {
//     id: 2,
//     image: '/image/data/group1.png',
//     title: 'Black Rose 概念照',
//     date: '2023-10-10'
//   },
//   {
//     id: 3,
//     image: '/image/community/img2.png',
//     title: 'B-Angels 最新舞台',
//     date: '2023-10-10'
//   },
//   {
//     id: 4,
//     image: '/image/data/group2.png',
//     title: 'Flash Girls 练习日常',
//     date: '2023-10-10'
//   },
//   {
//     id: 5,
//     image: '/image/community/img1.png',
//     title: 'Infinity 新歌发布',
//     date: '2023-10-10'
//   },
//   {
//     id: 6,
//     image: '/image/data/group3.png',
//     title: 'Boys Planet 成员互动',
//     date: '2023-10-10'
//   },
//   {
//     id: 7,
//     image: '/image/data/group1.png',
//     title: 'Boys Planet 成员互动',
//     date: '2023-10-10'
//   },
//   {
//     id: 8,
//     image: '/image/data/bg2.png',
//     title: 'ALPHA 男子组合',
//     date: '2023-10-10'
//   },
//   {
//     id: 9,
//     image: '/image/data/group1.png',
//     title: 'Black Rose 概念照',
//     date: '2023-10-10'
//   },
//   {
//     id: 10,
//     image: '/image/community/img2.png',
//     title: 'B-Angels 最新舞台',
//     date: '2023-10-10'
//   },
//   {
//     id: 11,
//     image: '/image/data/group2.png',
//     title: 'Flash Girls 练习日常',
//     date: '2023-10-10'
//   },
//   {
//     id: 12,
//     image: '/image/community/img1.png',
//     title: 'Infinity 新歌发布',
//     date: '2023-10-10'
//   },
//   {
//     id: 13,
//     image: '/image/data/group3.png',
//     title: 'Boys Planet 成员互动',
//     date: '2023-10-10'
//   },
//   {
//     id: 14,
//     image: '/image/data/group1.png',
//     title: 'Boys Planet 成员互动',
//     date: '2023-10-10'
//   },
// ];

export default function WaterfallGrid({
  items: initialItems = [],
  customRender,
  columnCount = 5,
  gap = 16,
  className = '',
  defaultImage = '/image/common/placeholder.png',
  cardClassName = '',
  titleClassName = '',
  onItemClick,
}: WaterfallGridProps) {
  const [items, setItems] = useState<WaterfallItem[]>(initialItems)

  // 当外部传入的initialItems变化时，更新内部items状态
  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])
  const [columns, setColumns] = useState<number>(columnCount)
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const [columnHeights, setColumnHeights] = useState<number[]>([])
  const [itemsByColumn, setItemsByColumn] = useState<WaterfallItem[][]>([])
  const [loadedImages, setLoadedImages] = useState<Set<string | number>>(
    new Set()
  )
  const [failedVideos, setFailedVideos] = useState<Set<string | number>>(
    new Set()
  )

  // 防抖函数
  const debounce = <T extends (...args: number[]) => void>(
    func: T,
    delay: number
  ) => {
    let timeoutId: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }
  // 响应式布局处理
  useEffect(() => {
    const updateColumns = (width: number) => {
      if (width < 480) {
        setColumns(2)
      } else if (width < 640) {
        setColumns(3)
      } else if (width < 1024) {
        setColumns(4)
      } else if (width < 1280) {
        setColumns(5)
      } else {
        setColumns(5)
      }
    }

    const debouncedHandleResize = debounce((width: number) => {
      setWindowWidth(width)
      updateColumns(width)
    }, 100)

    if (typeof window !== 'undefined') {
      const handleResize = () => {
        debouncedHandleResize(window.innerWidth)
      }

      window.addEventListener('resize', handleResize)
      updateColumns(window.innerWidth)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }

    return () => {}
  }, [columnCount])

  // 计算文字部分的预估高度（基于字体大小和内容长度）
  const calculateTextHeight = useCallback(
    (title: string, windowWidth: number) => {
      // 根据屏幕宽度估算标题高度
      if (windowWidth < 640) {
        // 移动端 - 更小的字体
        return Math.ceil(title.length / 25) * 16 // 每行约25字符，行高约16px
      } else if (windowWidth < 1024) {
        // 平板 - 中等字体
        return Math.ceil(title.length / 20) * 20 // 每行约20字符，行高约20px
      } else {
        // 桌面端 - 标准字体
        return Math.ceil(title.length / 15) * 20 // 每行约15字符，行高约20px
      }
    },
    []
  )

  // 媒体加载处理 - 精确计算图片/视频和文字的完整高度
  const handleMediaLoad = useCallback(
    (id: string | number, element: HTMLImageElement | HTMLVideoElement) => {
      setLoadedImages((prev) => new Set(prev).add(id))

      requestAnimationFrame(() => {
        const containerWidth = containerRef.current?.clientWidth || 1000
        const itemWidth = (containerWidth - 5 * (columns - 1)) / columns // 使用固定间距5px

        // 计算媒体高度
        const aspectRatio =
          element instanceof HTMLImageElement
            ? element.naturalHeight / element.naturalWidth
            : element.videoHeight / element.videoWidth
        const mediaHeight = itemWidth * aspectRatio

        // 找到对应项目，计算文字部分高度
        setItems((prevItems) =>
          prevItems.map((item) => {
            if (item.id !== id) return item

            // 计算文字部分高度（包括padding）
            const textHeight = calculateTextHeight(
              String(item.title || item.label),
              windowWidth
            )
            const paddingHeight =
              windowWidth < 640 ? 16 : windowWidth < 1024 ? 20 : 24 // 上下padding

            // 计算完整高度（媒体高度 + 文字高度 + padding）
            const totalHeight = mediaHeight + textHeight + paddingHeight

            return {
              ...item,
              height: mediaHeight, // 保持媒体高度单独存储
              totalHeight, // 新增总高度属性
              aspectRatio,
            }
          })
        )
      })
    },
    [columns, windowWidth, calculateTextHeight]
  )

  // 当窗口尺寸改变时重新计算图片和文字的完整高度
  useEffect(() => {
    if (!items.length || !loadedImages.size) return

    requestAnimationFrame(() => {
      const containerWidth = containerRef.current?.clientWidth || 1000
      const itemWidth = (containerWidth - 5 * (columns - 1)) / columns

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (!loadedImages.has(item.id) || !item.aspectRatio) return item

          // 重新计算图片高度
          const newImageHeight = itemWidth * item.aspectRatio

          // 重新计算文字部分高度（包括padding）
          const textHeight = calculateTextHeight(
            String(item.title || item.label),
            windowWidth
          )
          const paddingHeight =
            windowWidth < 640 ? 16 : windowWidth < 1024 ? 20 : 24 // 上下padding

          // 计算新的完整高度
          const newTotalHeight = newImageHeight + textHeight + paddingHeight

          return {
            ...item,
            height: newImageHeight, // 更新图片高度
            totalHeight: newTotalHeight, // 更新总高度
          }
        })
      )
    })
  }, [windowWidth, columns, loadedImages, calculateTextHeight])

  // 改进的见缝插入布局算法 - 实现真正的上下紧凑布局
  useEffect(() => {
    if (!items || items.length === 0 || columns <= 0) return

    // 初始化列
    const newItemsByColumn: WaterfallItem[][] = Array.from(
      { length: columns },
      () => []
    )
    const newColumnHeights: number[] = Array(columns).fill(0)

    // 对项目进行处理，确保已加载的项目优先获得正确高度
    const processedItems = items.map((item) => {
      // 使用总高度（包括文字）或默认值进行布局计算
      const baseHeight = item.height || 200 // 图片基础高度

      // 为未加载的项目估算文字高度
      if (!item.totalHeight) {
        const textHeight = calculateTextHeight(
          String(item.title || item.label),
          windowWidth
        )
        const paddingHeight =
          windowWidth < 640 ? 16 : windowWidth < 1024 ? 20 : 24
        const estimatedTotalHeight = baseHeight + textHeight + paddingHeight
        return { ...item, calculatedHeight: estimatedTotalHeight }
      }

      // 确保calculatedHeight是number类型
      return { ...item, calculatedHeight: Number(item.totalHeight) || 200 }
    })

    // 遍历所有项目，实现真正的见缝插入布局
    processedItems.forEach((item) => {
      // 找到当前高度最小的列 - 这是见缝插入的核心逻辑
      let minHeightColumn = 0
      for (let i = 1; i < columns; i++) {
        if (newColumnHeights[i] < newColumnHeights[minHeightColumn]) {
          minHeightColumn = i
        }
      }

      newItemsByColumn[minHeightColumn].push(item)

      // 使用完整高度（包括图片和文字）更新列高度，确保真正的紧凑布局
      newColumnHeights[minHeightColumn] += item.calculatedHeight
    })

    // 将计算结果暂存，避免在 effect 中直接 setState
    // 后续通过 useMemo 或外部事件触发更新，防止级联渲染
    const nextColumnHeights = newColumnHeights
    const nextItemsByColumn = newItemsByColumn

    // 使用微任务延迟更新，脱离当前渲染周期
    queueMicrotask(() => {
      setColumnHeights(nextColumnHeights)
      setItemsByColumn(nextItemsByColumn)
    })
  }, [items, columns, windowWidth, calculateTextHeight])

  // 使用useCallback优化渲染性能
  const renderDefaultItem = useCallback(
    (item: WaterfallItem, index: number) => {
      const handleClick = () => {
        if (onItemClick) {
          onItemClick(item, index)
        }
      }

      // 响应式padding和标题大小
      const getResponsiveClasses = () => {
        if (windowWidth < 640) {
          return {
            padding: 'p-2',
            titleSize: 'text-xs',
          }
        } else if (windowWidth < 1024) {
          return {
            padding: 'p-2.5',
            titleSize: 'text-sm',
          }
        } else {
          return {
            padding: 'p-3',
            titleSize: 'text-sm',
          }
        }
      }

      const responsiveClasses = getResponsiveClasses()
      const isLoaded = loadedImages.has(item.id)

      // 预估文字部分高度
      const estimatedTextHeight = calculateTextHeight(
        String(item.title || item.label),
        windowWidth
      )
      const paddingHeight =
        windowWidth < 640 ? 16 : windowWidth < 1024 ? 20 : 24
      const estimatedTotalHeight =
        (item.height || 200) + estimatedTextHeight + paddingHeight

      return (
        <div
          key={item.id}
          className={`overflow-hidden rounded-lg bg-black backdrop-blur-sm hover:bg-white/10 transition-all duration-300 ease-in-out cursor-pointer ${cardClassName}`}
          onClick={handleClick}
          role="article"
          aria-label={item.title}
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            width: '100%',
            minHeight: `${estimatedTotalHeight}px`, // 确保元素有足够高度容纳内容
          }}
        >
          <div
            className="relative w-full"
            style={{ height: item.height ? `${item.height}px` : '200px' }}
          >
            {/* 加载占位符 - 动态高度以保持布局稳定 */}
            {!isLoaded && (
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
              </div>
            )}
            {/* 根据类型渲染媒体内容 */}
            {item.type === 'video' && (
              <div
                className="relative w-full h-full relative"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div className="h-[16px] w-[16px] absolute top-2 right-2 z-10">
                  <SvgIcon
                    src="/svg/play.svg"
                    alt="Play"
                    width={16}
                    height={16}
                    className="text-black"
                  />
                </div>
                {/* 检查视频是否加载失败，如果失败则显示占位图片 */}
                {failedVideos.has(item.id) ? (
                  <Image
                    src={defaultImage}
                    alt={`${item.title} 的视频占位图`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full object-cover"
                    onLoad={(e) => {
                      const img = e.currentTarget as HTMLImageElement
                      handleMediaLoad(item.id, img)
                    }}
                  />
                ) : (
                  <>
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                      }}
                      preload="metadata"
                      muted // 添加muted属性以解决浏览器自动播放限制
                      onLoadedMetadata={(e) => {
                        const video = e.currentTarget as HTMLVideoElement
                        handleMediaLoad(item.id, video)
                        // console.log('视频元数据已加载:', item.id)
                      }}
                      onError={(e) => {
                        const error = e.currentTarget.error
                        console.error(
                          '视频加载错误:',
                          item.id,
                          error ? error.code : '未知错误'
                        )
                        // 视频加载失败时，添加到失败列表
                        setFailedVideos((prev) => new Set(prev).add(item.id))
                        // 同时将该项目标记为已加载，以避免布局闪烁
                        setLoadedImages((prev) => new Set(prev).add(item.id))
                      }}
                      onMouseEnter={(e) => {
                        // console.log('鼠标进入视频区域:', item.id)
                        // 鼠标悬停时播放视频
                        const video = e.currentTarget as HTMLVideoElement
                        // 确保视频已加载
                        if (video.readyState >= 2) {
                          // HAVE_CURRENT_DATA 或更高
                          video
                            .play()
                            .then(() => {
                              // console.log('视频开始播放:', item.id)
                            })
                            .catch((error) => {
                              console.error('视频播放失败:', item.id, error)
                              // 尝试先设置currentTime来触发加载
                              video.currentTime = 0.1
                              // 再次尝试播放
                              setTimeout(() => {
                                video.play().catch((err) => {
                                  console.error(
                                    '第二次播放尝试也失败:',
                                    item.id,
                                    err
                                  )
                                })
                              }, 100)
                            })
                        } else {
                          // console.log('视频尚未准备好播放，等待加载...')
                          // 触发加载
                          video.load()
                          const playWhenReady = () => {
                            video
                              .play()
                              .catch((err) =>
                                console.error('加载后播放失败:', err)
                              )
                            video.removeEventListener('canplay', playWhenReady)
                          }
                          video.addEventListener('canplay', playWhenReady)
                        }
                      }}
                      onMouseLeave={(e) => {
                        // 鼠标移出时暂停视频
                        const video = e.currentTarget as HTMLVideoElement
                        // console.log('鼠标离开视频区域，暂停播放:', item.id)
                        video.pause()
                      }}
                    >
                      <source src={item.src} type="video/mp4" />
                      您的浏览器不支持视频标签。
                    </video>
                    {/* 视频播放按钮覆盖层 */}
                    {/* <div className="absolute inset-0 flex items-center justify-center bg-black hover:bg-black/30 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-white ml-1"></div>
                      </div>
                    </div> */}
                  </>
                )}
              </div>
            )}
            {(item.type === 'image' || !item.type) && (
              <Image
                src={item.image || defaultImage}
                alt={item.title}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
                onLoad={(e) => {
                  const img = e.currentTarget as HTMLImageElement
                  handleMediaLoad(item.id, img)
                }}
                onError={(e) => {
                  // 图片加载失败时使用备用图片
                  const target = e.target as HTMLImageElement
                  if (target) {
                    target.src = defaultImage
                    handleMediaLoad(item.id, target)
                  }
                }}
              />
            )}
          </div>
          <div className={`${responsiveClasses.padding}`}>
            <h3
              className={`font-medium text-white truncate ${responsiveClasses.titleSize} ${titleClassName}`}
            >
              {item.title}
            </h3>
            <p className="text-white/50 text-xs">
              {item.date !== undefined && item.date !== null
                ? String(item.date)
                : ''}
            </p>
          </div>
        </div>
      )
    },
    [
      windowWidth,
      cardClassName,
      titleClassName,
      defaultImage,
      onItemClick,
      handleMediaLoad,
      loadedImages,
      failedVideos,
    ]
  )

  return (
    <div
      ref={containerRef}
      className={`flex justify-between ${className}`}
      style={{
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      {items.length > 0 ? (
        // 渲染每一列
        itemsByColumn.map((columnItems, columnIndex) => (
          <div
            key={`column-${columnIndex}`}
            className="flex flex-col"
            style={{
              width: `calc((100% - 15px * ${columns - 1}) / ${columns})`,
              maxWidth: `calc((100% - 15px * ${columns - 1}) / ${columns})`,
              gap: '15px', // 减小间距，使布局更紧凑
            }}
          >
            {/* 渲染列中的每个项目 */}
            {columnItems.map((item, itemIndex) => {
              const globalIndex = items.findIndex((i) => i.id === item.id)
              if (customRender) {
                return customRender(item, globalIndex)
              }
              return renderDefaultItem(item, globalIndex)
            })}
          </div>
        ))
      ) : (
        <div className="w-full py-12 text-center text-white/50">
          <p>暂无内容</p>
        </div>
      )}
    </div>
  )
}
