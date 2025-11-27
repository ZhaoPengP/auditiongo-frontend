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
          className="fixed bottom-20 right-0 z-[1000] flex w-[229px] h-[257px] items-center justify-between bg-[url('/image/common/bg5.png')] bg-no-repeat bg-size-[229px_257px] cursor-pointer"
          onClick={() => setIsShow(true)}
        >
          <p className="absolute top-[50px] left-[30px] text-[18px] text-[#fff] text-center">
            游戏下载
          </p>
          <p className="absolute top-[104px] left-[30px] text-[14px] text-[#3D3D3D] text-center">
            欢迎加入AuditionGo
          </p>
          <div className="absolute left-[20px] top-[140px] flex w-[190px] h-[65px] items-center justify-between">
            <div>
              <Image
                src="/image/common/bg8.png"
                alt="logo"
                width={66}
                height={66}
                className="h-[66px] w-[66px]"
              />
            </div>
            <div className="h-[66px] flex flex-col justify-between">
              <Image
                src="/image/common/android.png"
                alt="logo"
                width={83}
                height={30}
                className="h-[30px] w-[83px]"
              />
              <Image
                src="/image/common/appStore.png"
                alt="logo"
                width={83}
                height={30}
                className="h-[30px] w-[83px]"
              />
            </div>
            <Image
              src="/image/common/bg7.png"
              alt="logo"
              width={32}
              height={66}
              className="h-[66px] w-[32px]"
            />
          </div>
        </div>
      )}
      {isShow && (
        <div
          className="fixed bottom-20 right-0 z-[1000] flex w-[160px] h-[130px] cursor-pointer"
          onClick={() => setIsShow(false)}
        >
          <SvgIcon
            src="/svg/15602.svg"
            alt="logo"
            width={160}
            height={130}
            className="h-[130px] w-[160px] cursor-pointer"
          />
        </div>
      )}
    </>
  )
}
