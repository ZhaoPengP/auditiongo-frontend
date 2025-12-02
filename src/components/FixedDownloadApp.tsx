'use client'

import Image from 'next/image'
import { useState } from 'react'
import SvgIcon from '@/components/SvgIcon'

export default function FixedDownloadApp() {
  const [isShow, setIsShow] = useState(true)
  return (
    <>
      {!isShow && (
        <div
          className="fixed right-0 bottom-[80px] bg-[url('/image/common/bg12.png')] bg-no-repeat bg-size-[100%_100%] w-[150px] py-4 px-2"
          onClick={() => setIsShow(true)}
        >
          <Image
            src="/image/common/scan.png"
            alt="apply"
            width={138}
            height={138}
            className="w-[138px] h-[138px] cursor-pointer"
          />
          <Image
            src="/image/common/pc1.png"
            alt="apply"
            width={137}
            height={93}
            className="w-[137px] h-[93px] mt-2 cursor-pointer"
          />
          <Image
            src="/image/common/apply2.png"
            alt="apply"
            width={137}
            height={50}
            className="w-[137px] h-[50px] mt-2 cursor-pointer"
          />
          <Image
            src="/image/common/android2.png"
            alt="apply"
            width={137}
            height={50}
            className="w-[137px] h-[50px] mt-2 cursor-pointer"
          />
        </div>
      )}
      {isShow && (
        <div
          className="fixed bottom-20 right-0 z-[1000] flex w-[190px] h-[130px] cursor-pointer"
          onClick={() => setIsShow(false)}
        >
          <SvgIcon
            src="/svg/15602.svg"
            alt="logo"
            width={160}
            height={130}
            className="h-[130px] w-[160px] cursor-pointer transform scale-170"
          />
        </div>
      )}
    </>
  )
}
