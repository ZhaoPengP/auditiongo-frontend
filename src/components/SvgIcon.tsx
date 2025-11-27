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
    return (
      <svg
        width={finalWidth}
        height={finalHeight}
        fill={fill !== undefined ? fill : 'currentColor'}
        stroke={stroke !== undefined ? stroke : undefined}
        strokeWidth={strokeWidth !== undefined ? strokeWidth : undefined}
        className={className}
        viewBox="0 0 24 24" // 默认viewBox，确保图标可以正确缩放
        preserveAspectRatio="none" // 允许SVG完全伸展以填满容器，实现自适应展开
        {...props}
        // 使用 src 作为 data-src 属性以便调试
        data-src={src}
      >
        {/* 使用 use 元素引用外部 SVG，这样可以应用外层的 fill 和 stroke 属性 */}
        {/* 注意：要完全控制颜色，建议使用 children 方式传入 SVG 内容 */}
        <use href={src} className="w-full h-full" width="100%" height="100%" />
      </svg>
    )
  }

  // 如果有 children，克隆并修改 SVG 元素的属性
  if (children && isValidElement(children)) {
    const svgElement = children as React.ReactElement<
      React.SVGProps<SVGSVGElement>
    >

    // 克隆 SVG 元素并添加/覆盖属性
    const clonedSvg = cloneElement(svgElement, {
      width: finalWidth,
      height: finalHeight,
      fill: fill !== undefined ? fill : svgElement.props.fill || 'currentColor',
      stroke: stroke !== undefined ? stroke : svgElement.props.stroke,
      strokeWidth:
        strokeWidth !== undefined ? strokeWidth : svgElement.props.strokeWidth,
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

  return null
}
