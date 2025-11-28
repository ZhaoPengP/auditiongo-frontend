'use client'
// 团体介绍页面：包含标签导航、宣传区域、成员列表、视频区域、歌曲列表和博客区域
import { useState, useMemo, useRef } from 'react'
import Image from 'next/image'
import ImageViewer from '@/components/ImageViewer'
import SvgIcon from '@/components/SvgIcon'
import VideoOverlay from '@/components/VideoOverlay'
import MusicPlayer from '@/components/MusicPlay'
import { useParams, useRouter } from 'next/navigation'
import { getMessages } from '@/lib/i18n'
import figure_zh from '@/moke/figure_zh.json'
import figure_en from '@/moke/figure_en.json'
import figure_ja from '@/moke/figure_ja.json'
import figure_ko from '@/moke/figure_ko.json'
import figure_zh_TW from '@/moke/figure_zh_TW.json'

export default function DataPage() {
  const { locale } = useParams() as { locale: string }
  const messages = getMessages(locale)

  // 直接在组件顶层计算分组数据作为初始状态
  const getInitialTeamMembers = () => {
    let figureData = figure_zh
    if (locale === 'en') {
      figureData = figure_en
    } else if (locale === 'ja') {
      figureData = figure_ja
    } else if (locale === 'ko') {
      figureData = figure_ko
    } else if (locale === 'zh-TW') {
      figureData = figure_zh_TW
    }
    if (Array.isArray(figureData)) {
      // 使用reduce按groupName分组
      const groupedData = figureData.reduce(
        (acc, item) => {
          const group = item.groupName || '未知组'
          if (!acc[group]) {
            acc[group] = {
              groupName: item.groupName,
              id: item.groupName,
              groupIcon: item.groupIcon,
              children: [],
            }
          }
          acc[group].children.push({ id: item.id, roleName: item.roleName })
          return acc
        },
        {} as Record<
          string,
          {
            groupName?: string
            id?: string
            groupIcon?: string
            children: {
              id: number
              roleName: string
            }[]
          }
        >
      )

      // 转换为二维数组格式
      return Object.values(groupedData)
    }
    return []
  }

  const [groupTabs] = useState(getInitialTeamMembers())

  // 成员数据
  const members = [
    { id: 'felix', name: 'Felix' },
    { id: 'odin', name: 'Odin' },
    { id: 'lucas', name: 'Lucas' },
    { id: 'allen', name: 'Allen' },
    { id: 'maxx', name: 'Maxx' },
  ]

  // 歌曲数据
  const songs = [
    {
      id: '1',
      title: messages?.data?.songs?.song1 || '心太軟心太軟',
      src: '/misce/1.mp3',
      cover: '/image/data/music.png',
    },
    {
      id: '2',
      title: messages?.data?.songs?.song2 || '心太軟心太軟心太軟',
      src: '/misce/1.mp3',
      cover: '/image/data/music.png',
    },
    {
      id: '3',
      title: messages?.data?.songs?.song3 || '心太軟心太軟心太軟心太軟',
      src: '/misce/1.mp3',
      cover: '/image/data/music.png',
    },
  ]

  // 博客数据
  const blogs = [
    {
      id: '1',
      title: messages?.data?.blogs?.title || '打造专属的选秀平台，完美的体验',
      date: '2025-01-21',
      image: '/image/data/video3715.png',
      video: '/video/video3715.mp4',
    },
    {
      id: '2',
      title: messages?.data?.blogs?.title || '打造专属的选秀平台，完美的体验',
      date: '2025-01-21',
      image: '/image/data/video5525.png',
      video: '/video/video5525.mp4',
    },
  ]

  const router = useRouter()

  // 播放指定歌曲
  const playSong = (index: number) => {
    if (musicPlayerRef.current) {
      musicPlayerRef.current.playSong(index)
    }
  }

  const openGameIntroduction = () => {
    router.push(`/${locale}/data/game-introduction`)
  }
  const openTeamIntroduction = () => {
    router.push(`/${locale}/data/team-introduction`)
  }

  // 状态管理
  const [activeGroup, setActiveGroup] = useState(0)
  const [isVideoOverlayVisible, setIsVideoOverlayVisible] = useState(false)
  // 定义MusicPlayer组件的ref类型
  interface MusicPlayerRefType {
    playSong: (index: number) => void
  }
  const musicPlayerRef = useRef<MusicPlayerRefType | null>(null)

  // 控制视频遮罩层
  const openVideoOverlay = () => setIsVideoOverlayVisible(true)
  const closeVideoOverlay = () => setIsVideoOverlayVisible(false)
  const [currentVideo, setCurrentVideo] = useState('/video/video15.mp4')

  return (
    <div className="mx-auto pb-10 pt-[20px]">
      {/* 团体标签导航栏 */}
      <section>
        <Image
          src="/image/home/bg14.png"
          alt="bg2"
          width={459}
          height={150}
          className="w-[459px] h-[150px] mx-auto mt-[40px]"
        />
        <div className="h-[880px] rounded-lg w-100vw mt-[-80px]">
          <div className="flex gap-4 overflow-x-auto py-2 mb-6 lg:w-[1248px] mx-auto pt-30">
            {groupTabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveGroup(index)}
                className={`rounded px-3 py-2 cursor-pointer ${
                  activeGroup === index ? 'btn-tab' : 'bg-white/10'
                }`}
              >
                {tab.groupName}
              </button>
            ))}
          </div>
          <div className="lg:w-[1248px] h-[100px] bg-white/20 mx-auto border border-white/30 rounded-lg relative">
            <Image
              src="/image/data/bg2.png"
              width={1148}
              height={100}
              alt="logo"
              className="w-[1148px]"
            ></Image>
            <div className="absolute top-26 right-0 w-[290px] h-[400px] bg-[#006D45] border border-white/30 rounded-lg px-[30px] py-[20px]">
              <div className="flex items-center w-[50%]">
                <Image
                  src={groupTabs[activeGroup].groupIcon || ''}
                  width={290}
                  height={30}
                  sizes="290px"
                  className="w-[full]"
                  alt="logo"
                ></Image>
                {/* <h2 className="text-white text-[22px] ml-5">
                  {groupTabs[activeGroup].groupName}
                </h2> */}
              </div>
              <ul className="text-white">
                {groupTabs[activeGroup].children.map((member) => (
                  <li
                    key={member.id}
                    className="text-white mt-[10px] bg-[#005033] px-[15px] py-[5px] rounded-md h-[40px] flex items-center justify-between cursor-pointer"
                    onClick={() => openTeamIntroduction()}
                  >
                    {member.roleName}
                    <SvgIcon src="/svg/right.svg" width={10} height={10} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 主要内容区域 */}
      <section>
        <div className="lg:w-[1248px] mx-auto">
          {/* 宣传和歌曲 */}
          <section>
            <div className="flex justify-between mt-[40px] h-[600px]">
              {/* 宣传区域 */}
              <div className="w-[800px] rounded-lg relative">
                <h3 className="mb-6 text-[16px] inline-block bg-[url('/image/home/test2.png')] bg-no-repeat text-[28px] px-[28px] min-w-[204px] h-[68px]">
                  {groupTabs[activeGroup].groupName || ''}
                  {messages?.data?.titles?.['promo-video'] || '宣传视频'}
                </h3>
                <video
                  src="/video/video15.mp4"
                  className="w-[780px] h-[512px] rounded-lg object-cover"
                ></video>
                <div
                  className="absolute top-[55%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] cursor-pointer"
                  onClick={openVideoOverlay}
                >
                  <SvgIcon
                    src="/svg/play.svg"
                    width={62}
                    height={62}
                    className="w-[62px] h-[62px] text-white"
                  />
                </div>
              </div>
              {/* 歌曲 */}
              <div className="w-[424px] h-[600px] rounded-lg relative">
                <h3 className="mb-6 text-[16px] inline-block bg-[url('/image/home/test2.png')] bg-no-repeat text-[28px] px-[28px] min-w-[204px] h-[68px]">
                  {messages?.data?.titles?.['popular-songs'] || '热门歌曲'}
                </h3>
                <ul className="text-white bg-[#282A32] px-[35px] py-[30px] rounded-md h-[500px] overflow-y-auto">
                  {[1, 2].map((song) => (
                    <li
                      key={song}
                      className="text-white h-[110px] flex items-center border-b border-white/30 last:border-b-0"
                    >
                      <Image
                        src="/image/data/music.png"
                        width={86}
                        height={86}
                        alt="music"
                        className="w-[86px] h-[86px]"
                      ></Image>
                      <ul>
                        {songs.map((item, idx) => (
                          <li
                            key={item.id}
                            className="mt-[10px] text-[14px] flex items-center justify-between ml-[10px] w-[256px] first:mt-0 group cursor-pointer hover:text-[#33E11F] transition-colors"
                            onClick={() => playSong(idx)}
                          >
                            <span className="w-[200px] overflow-hidden whitespace-nowrap text-ellipsis">
                              {item.title}
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <SvgIcon
                                src="/svg/play.svg"
                                width={22}
                                height={22}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>

                <div className="absolute bottom-0 left-0 w-full border-t border-white/30">
                  <MusicPlayer
                    songs={songs}
                    ref={musicPlayerRef}
                    onSongSelect={(songId) => {
                      console.log('播放歌曲:', songId)
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="mt-[40px] h-[400px]">
              <h3 className="mb-6 text-[16px] inline-block bg-[url('/image/home/test2.png')] bg-no-repeat text-[28px] px-[28px] min-w-[204px] h-[68px]">
                {messages?.data?.titles?.['group-blogs'] || '团体博客'}
              </h3>
              <ul className="text-white mt-[20px] rounded-md flex items-center gap-[10px]">
                {blogs.map((blog) => (
                  <li
                    key={blog.id}
                    className="text-white h-[110px] cursor-pointer"
                  >
                    <ImageViewer
                      imageUrl={blog.image}
                      videoUrl={blog.video}
                      onVideoClick={(value) => {
                        setCurrentVideo(value)
                        openVideoOverlay()
                      }}
                      width={285}
                      height={200}
                      alt="blog"
                      className="w-[285px] h-[200px]"
                    />
                    <div className="">
                      <h4 className="text-[14px] mt-[15px]">{blog.title}</h4>
                      <p className="text-[12px]">{blog.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </section>
      {/* 右侧悬浮层 */}
      <div className="fixed right-[10px] top-[10%] w-auto flex flex-col items-center h-[100px]">
        <button className="w-full h-[36px] bg-[#282A32] text-white rounded-[4px] btn-tab px-[20px] cursor-pointer">
          {messages?.data?.blogs?.['team-intro']}
        </button>
        <button
          className="w-full h-[36px] bg-[#282A32] text-white rounded-[4px] mt-[14px] px-[20px] cursor-pointer hover:text-[#33E11F]"
          onClick={() => openGameIntroduction()}
        >
          {messages?.data?.blogs?.['game-intro']}
        </button>
      </div>
      {/* 视频遮罩层组件 */}
      <VideoOverlay
        isVisible={isVideoOverlayVisible}
        onClose={closeVideoOverlay}
        videoSrc={currentVideo}
        title={`${groupTabs[activeGroup].groupName || ''} - ${messages?.data?.titles?.['promo-video'] || '宣传视频'}`}
        subtitle={messages?.data?.blogs?.['video-subtitle']}
        autoPlay={true}
        loop={true}
        muted={true}
      />
    </div>
  )
}
