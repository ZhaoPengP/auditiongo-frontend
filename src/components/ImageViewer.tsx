import React, { useState, useRef } from 'react'
import Image from 'next/image'
import SvgIcon from './SvgIcon'

interface ImageViewerProps {
  imageUrl: string // 图片地址（必需）
  videoUrl?: string // 视频地址（可选）
  onVideoClick?: (videoUrl: string) => void // 视频点击回调
  width?: number | string // 图片宽度
  height?: number | string // 图片高度
  alt?: string // 图片alt文本
  className?: string // 自定义类名
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl,
  videoUrl,
  onVideoClick,
  width = '100%',
  height = 'auto',
  alt = 'Image',
  className = '',
}) => {
  // 状态管理
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // 关闭弹窗 - 提前声明以解决变量引用问题
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // 处理ESC键关闭弹窗
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        handleCloseModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey)
      document.body.classList.add('modal-open')
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.classList.remove('modal-open')
    }
  }, [isModalOpen, handleCloseModal])

  // 处理图片点击
  const handleImageClick = () => {
    if (videoUrl) {
      if (onVideoClick) {
        // 有视频地址且提供了回调，触发回调
        try {
          onVideoClick(videoUrl)
        } catch (error) {
          console.error('Error in video click callback:', error)
        }
      } else {
        console.warn('Video URL provided but no onVideoClick callback function')
        // 即使没有回调，也可以打开放大弹窗作为后备
        setIsModalOpen(true)
      }
    } else {
      // 没有视频地址，打开放大弹窗
      setIsModalOpen(true)
    }
  }

  // 点击弹窗外区域关闭
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) {
      handleCloseModal()
    }
  }

  return (
    <div className="relative">
      {/* 图片显示区域 */}
      <div
        className={`relative cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
        onClick={handleImageClick}
        style={{ width, height, position: 'relative' }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 ease-out"
          priority
        />

        {/* 图片悬停效果 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

        {/* 视频播放图标（如果有视频地址） */}
        {videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="rounded-full transition-colors transform hover:scale-110 duration-300">
              <SvgIcon
                src="/svg/play.svg"
                alt="Play"
                width={34}
                height={34}
                className="text-black"
              />
            </div>
          </div>
        )}
      </div>

      {/* 图片放大弹窗 */}
      {isModalOpen && !videoUrl && (
        <div
          ref={modalRef}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={handleModalClick}
        >
          {/* 关闭按钮 - 更大、更明显 */}
          <button
            className="absolute top-6 right-6 md:top-10 md:right-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 transition-all duration-300 transform hover:scale-110 hover:rotate-90 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              handleCloseModal()
            }}
            aria-label="关闭"
            title="关闭"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {/* <SvgIcon
              src="/svg/15583.svg"
              alt="Close"
              width={28}
              height={28}
              className="text-white"
            /> */}
          </button>

          {/* 点击图片本身也关闭弹窗 */}
          <div
            className="max-w-full max-h-[80vh] object-contain cursor-pointer transition-transform duration-300 hover:scale-[1.02] animate-zoom-in"
            onClick={(e) => {
              e.stopPropagation()
              handleCloseModal()
            }}
            title="点击关闭"
          >
            <Image
              src={imageUrl}
              alt={alt}
              className="max-w-full max-h-[80vh] object-contain"
              width={2000}
              height={2000}
              quality={100}
              loading="lazy"
            />
          </div>

          {/* 全局样式 */}
          <style jsx global>{`
            .modal-open {
              overflow: hidden;
              touch-action: none;
            }

            /* 动画效果 */
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes zoomIn {
              from {
                transform: scale(0.95);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }

            .animate-fade-in {
              animation: fadeIn 0.2s ease-out;
            }

            .animate-zoom-in {
              animation: zoomIn 0.3s ease-out;
            }

            /* 响应式调整 */
            @media (max-width: 768px) {
              .modal-open {
                -webkit-overflow-scrolling: touch;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}

export default ImageViewer
