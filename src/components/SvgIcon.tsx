'use client'
import Image from 'next/image'
// 通用 SVG 图标组件：支持改变颜色和大小，可通过路径或 children 传入 SVG
import { ReactNode, cloneElement, isValidElement } from 'react'

export interface SvgIconProps {
  // SVG 文件路径（从 public 文件夹根目录开始，如 "/globe.svg"）
  src?: string
  // 或者直接传入 SVG React 元素作为 children
  children?: ReactNode
  // 统一尺寸（宽高相同）
  size?: number
  // 或者分别设置宽高
  width?: number
  height?: number
  // 填充颜色（fill 属性，支持颜色值如 "#ff0000" 或 "red" 或 "currentColor"）
  fill?: string
  // 描边颜色（stroke 属性）
  stroke?: string
  // 描边宽度（strokeWidth 属性）
  strokeWidth?: number | string
  // 自定义 className（可用于 Tailwind 颜色类如 "text-blue-500"）
  className?: string
  // 其他 SVG 属性
  [key: string]: unknown
}

export default function SvgIcon({
  src,
  children,
  size,
  width,
  height,
  fill,
  stroke,
  strokeWidth,
  className = '',
  ...props
}: SvgIconProps) {
  // 计算实际宽高
  const finalWidth = width ?? size ?? 24
  const finalHeight = height ?? size ?? 24

  // 如果有 src，使用内联 SVG 元素替代 Image 组件，以支持颜色控制
  if (src) {
    // 确保src格式正确，火狐浏览器对href格式有严格要求
    // 对于外部文件使用直接路径，对于ID引用使用#开头

    return (
      <svg
        width={finalWidth}
        height={finalHeight}
        fill={fill !== undefined ? fill : 'currentColor'}
        stroke={stroke !== undefined ? stroke : undefined}
        strokeWidth={strokeWidth !== undefined ? strokeWidth : undefined}
        className={className}
        viewBox="0 0 24 24" // 默认viewBox，确保图标可以正确缩放
        preserveAspectRatio="xMidYMid meet" // 保持图标比例，确保在所有浏览器中正确显示
        {...props}
        // 使用 src 作为 data-src 属性以便调试
        data-src={src}
      >
        {/* 使用 use 元素引用外部 SVG，移除可能导致兼容性问题的className属性 */}
        {/* 火狐浏览器需要直接使用href而不是url()包装 */}
        <use href={src} width="100%" height="100%" />
      </svg>
    )
  }

  // 如果有 children，克隆并修改 SVG 元素的属性
  if (children && isValidElement(children)) {
    // 类型检查，确保是SVG元素
    if (
      children.type === 'svg' ||
      (typeof children.type === 'string' &&
        children.type.toLowerCase() === 'svg')
    ) {
      const svgElement = children as React.ReactElement<
        React.SVGProps<SVGSVGElement>
      >

      // 克隆 SVG 元素并添加/覆盖属性
      const clonedSvg = cloneElement(svgElement, {
        width: finalWidth,
        height: finalHeight,
        fill:
          fill !== undefined ? fill : svgElement.props.fill || 'currentColor',
        stroke: stroke !== undefined ? stroke : svgElement.props.stroke,
        strokeWidth:
          strokeWidth !== undefined
            ? strokeWidth
            : svgElement.props.strokeWidth,
        viewBox: svgElement.props.viewBox || '0 0 24 24', // 保留原viewBox或使用默认值
        preserveAspectRatio:
          svgElement.props.preserveAspectRatio || 'xMidYMid meet', // 确保图标完全显示
        className: [svgElement.props.className, className]
          .filter(Boolean)
          .join(' '),
        ...props,
      } as React.SVGProps<SVGSVGElement>)

      return clonedSvg
    }
  }

  // 添加降级处理：如果无法正确渲染SVG，返回一个简单的占位符
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: `${finalWidth}px`, height: `${finalHeight}px` }}
    >
      <svg
        width={finalWidth}
        height={finalHeight}
        viewBox="0 0 24 24"
        fill={fill !== undefined ? fill : 'currentColor'}
      >
        <rect width="24" height="24" fill="none" />
      </svg>
    </div>
  )
}
