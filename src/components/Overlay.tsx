import React, { ReactNode } from 'react'

interface OverlayProps {
  isVisible: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  backdropClassName?: string
  contentClassName?: string
}

const Overlay: React.FC<OverlayProps> = ({
  isVisible,
  onClose,
  children,
  className = '',
  backdropClassName = '',
  contentClassName = '',
}) => {
  // 如果不可见，则不渲染组件
  if (!isVisible) {
    return null
  }

  // 处理背景点击事件，点击背景时关闭遮罩层
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 确保只在点击背景时关闭，而不是点击内容区域
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${backdropClassName}`}
      onClick={handleBackdropClick}
    >
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* 内容容器 */}
      <div
        className={`relative bg-white rounded-lg shadow-xl max-h-[90vh] overflow-auto ${contentClassName} ${className}`}
        // 阻止事件冒泡，避免点击内容区域时关闭遮罩层
        onClick={(e) => e.stopPropagation()}
      >
        {/* 自定义内容区域 */}
        {children}
      </div>

      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        aria-label="关闭"
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
    </div>
  )
}

export default Overlay
