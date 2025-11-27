'use client'

import Image from 'next/image'
import { inflate } from 'zlib'

interface AgeRecommendationsProps {
  className?: string
}

export default function AgeRecommendations({
  className,
}: AgeRecommendationsProps) {
  if (!className) {
    return null
  }
  return (
    <div
      className={`absolute flex flex-col justify-center items-center w-[54px] h-[64px] bg-[#fff] rounded ${className}`}
    >
      <Image
        src="/image/common/8+.png"
        alt="logo"
        width={45}
        height={45}
        className="h-[45px] w-[45px]"
      />
      <p className="text-black text-[10px]">适龄提示</p>
    </div>
  )
}
