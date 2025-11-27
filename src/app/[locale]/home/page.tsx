'use client'
// 首页：三个模块的基础结构与交互占位
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import ImageViewer from '@/components/ImageViewer'
import SvgIcon from '@/components/SvgIcon'
import VideoOverlay from '@/components/VideoOverlay'
import { getMessages } from '@/lib/i18n'
import figure_zh from '@/moke/figure_zh.json'
import figure_en from '@/moke/figure_en.json'
import figure_ja from '@/moke/figure_ja.json'
import figure_ko from '@/moke/figure_ko.json'
import figure_zh_TW from '@/moke/figure_zh_TW.json'

// 模块三：当前选中分类

export default function HomePage() {
  // 创建视频元素引用数组
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  // 模块一：当前选中步骤
  const [active, setActive] = useState(0)
  // 模块二：当前选中团体
  const [activeGroup, setActiveGroup] = useState(6)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  // 模块三：当前选中分类
  const [activeCategory, setActiveCategory] = useState([0, 0])
  // 分类展开状态管理，初始化为空数组，稍后在组件中同步
  const [expandedCategories, setExpandedCategories] = useState<boolean[]>([])

  // 视频遮罩层状态
  const [isVideoOverlayVisible, setIsVideoOverlayVisible] = useState(false)
  // 打开视频遮罩层
  const openVideoOverlay = () => setIsVideoOverlayVisible(true)
  // 关闭视频遮罩层
  const closeVideoOverlay = () => setIsVideoOverlayVisible(false)
  const { locale } = useParams() as { locale: string }
  const messages = getMessages(locale)

  const router = useRouter()

  // 模块一数据占位
  const steps = [
    {
      id: '01',
      // title: messages?.home?.steps?.step01?.title || '制作AI偶像',
      title: '自由打造虚拟偶像团体',
      desc:
        messages?.home?.steps?.step01?.desc ||
        '使用创作工具生成 AI 偶像形象与设定',
      src: '/video/video1.mp4',
    },
    {
      id: '02',
      // title: messages?.home?.steps?.step02?.title || '组建偶像团队',
      title: '轻松制造歌舞作品',
      desc: messages?.home?.steps?.step02?.desc || '与伙伴共同组建多人成员团队',
      src: '/video/video14.mp4',
    },
    {
      id: '03',
      title: '游戏玩法内容',
      desc: messages?.home?.steps?.step03?.desc || '编排舞步并创作原创歌曲',
      src: '/video/video29.mp4',
    },
    {
      id: '04',
      title: '玩家实时交互',
      desc: messages?.home?.steps?.step04?.desc || '设计搭配团队演出服装',
      src: '/video/video30.mp4',
    },
    {
      id: '05',
      title: '一键生成演艺节目',
      desc: messages?.home?.steps?.step05?.desc || '组织线上线下的演出活动',
      src: '/video/video27.mp4',
    },
    {
      id: '06',
      title: '参与全球总选活动',
      desc: messages?.home?.steps?.step06?.desc || '年度评选，粉丝参与投票',
      src: '/video/video23.mp4',
    },
  ]

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
              introduction: item.introduction,
              groupIcon: item.groupIcon,
              children: [],
            }
          }
          acc[group].children.push({
            id: item.id,
            name: item.mainCharacter || item.chineseNickname || item.roleName,
          })
          return acc
        },
        {} as Record<
          string,
          {
            groupName?: string
            introduction?: string | null
            groupIcon?: string
            children: { id: number; name: string }[]
          }
        >
      )

      // 转换为二维数组格式
      return Object.values(groupedData)
    }
    return []
  }

  const [groupTabs] = useState(getInitialTeamMembers())
  // 模块三团体占位
  const categoryTabs = [
    {
      id: '01',
      title: '游戏玩法',
      icon: '/image/common/ic1.png',
      children: [
        {
          id: '011',
          title: '游戏玩法',
          image: '/image/home/video1478.png',
          video: '/video/video1478.mp4',
        },
        {
          id: '012',
          title: '游戏内容',
          image: '/image/home/video1806.png',
          video: '/video/video1806.mp4',
        },
      ],
    },
    {
      id: '02',
      title: '偶像',
      icon: '/image/common/ic2.png',
      children: [
        {
          id: '021',
          title: 'MV',
          image: '/image/common/p3.png',
        },
        {
          id: '022',
          title: '播客',
          image: '/image/home/video1478.png',
          video: '/video/video1478.mp4',
        },
        {
          id: '023',
          title: '直播',
          image: '/image/home/video1806.png',
          video: '/video/video1806.mp4',
        },
        {
          id: '024',
          title: '短剧',
          image: '/image/common/p3.png',
        },
      ],
    },
    {
      id: '03',
      title: '其他',
      icon: '/image/common/ic3.png',
      children: [
        {
          id: '031',
          title: '游戏玩法',
          image: '/image/common/p1.png',
        },
        {
          id: '032',
          title: '游戏内容',
          image: '/image/common/p2.png',
        },
      ],
    },
  ]
  // 组件挂载时设置初始展开状态
  useEffect(() => {
    // 使用setTimeout确保在下一个渲染周期执行，避免级联渲染警告
    setTimeout(() => {
      // 直接在setTimeout回调中计算展开状态，避免useMemo相关的React Compiler警告
      setExpandedCategories(categoryTabs.map(() => true))
    }, 0)
  }, []) // 依赖项为空数组，因为categoryTabs是常量

  // 当active状态改变时，自动播放当前选中的视频
  useEffect(() => {
    // 暂停所有视频，确保按顺序处理
    const pausePromises = videoRefs.current.map((video) => {
      if (video) return video.pause()
      return Promise.resolve()
    })

    // 等待所有暂停操作完成后再播放当前视频
    Promise.all(pausePromises).then(() => {
      const activeVideo = videoRefs.current[active]
      if (activeVideo) {
        // 确保视频已经加载
        activeVideo.load()

        // 安全地播放视频，处理Promise
        const playPromise = activeVideo.play()
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log('视频播放可能被浏览器策略阻止，这是正常现象:', err)
          })
        }
      }
    })

    // 组件卸载时暂停所有视频
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) video.pause()
      })
    }
  }, [active])

  const handleCommunity = (path: string) => {
    router.push(`/${locale}/${path}`)
  }
  const handleBlog = (path: string) => {
    router.push(`/${locale}/${path}`)
  }
  const [isGroupInfoVisible, setIsGroupInfoVisible] = useState(false)
  const showGroupInfo = (show: boolean) => {
    if (show) {
      setIsAnimating(true)
      setIsFadingOut(false)
      setIsGroupInfoVisible(true)
      setTimeout(() => setIsAnimating(false), 500)
    } else {
      // 动画完成后再隐藏组件
      setTimeout(() => {
        setIsGroupInfoVisible(false)
        setIsAnimating(false)
      }, 0)
    }
  }
  const [currentVideo, setCurrentVideo] = useState('')

  return (
    <div className="space-y-16 max-w-7xl mx-auto pb-20 pt-[40px]">
      {/* 模块一 */}
      <section>
        {/* <h2 className="text-[40px] font-bold text-center">
          {messages?.home?.title || '全球领先沉浸式互动社交元宇宙'}
        </h2> */}
        <Image
          src="/image/home/bg2.png"
          alt="bg2"
          width={536}
          height={173}
          className="w-[536px] h-[173px] mx-auto"
        />
        <div className="mt-[-20]">
          <div className="flex flex-1 items-center justify-between w-full h-[366px] px-4">
            {steps.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => setActive(idx)}
                className="flex flex-col items-center h-full hidden-last cursor-pointer"
              >
                {/* 左侧 6 个圆形按钮（点状边框，虚线中轴）*/}
                <div className="h-[170px] w-full flex flex-col items-center justify-center relative">
                  {/* <span
                    className={`befer-line pointer-events-none absolute top-[84px] h-0 border-t-4 border-dotted border-white/30 ease-in duration-300 ${active === idx ? 'left-[-100vw] w-[50vw]' : 'left-[-100vw] w-[50vw]'} ${active - 1 === idx ? 'left-[140px] w-27' : 'left-[138px] w-18'}`}
                  /> */}
                  <div
                    className={`relative flex items-center justify-center rounded-full bg-no-repeat bg-size-[100%_100%] ease-in duration-300 ${
                      active === idx
                        ? 'border-white h-32 w-32 bg-[url("/image/home/bg20.png")]'
                        : 'border-white/50 h-26 w-26 bg-[url("/image/home/bg19.png")]'
                    }`}
                  >
                    <div
                      className={`text-sm font-bold w-[80px] text-center ${active === idx ? 'mt-[-8px]' : ''}`}
                    >
                      <p
                        className={`z-[10] h-[22px] ${active === idx ? 'relative text-[22px] mb-5' : ''}`}
                      >
                        {s.id}
                      </p>
                      {active === idx && (
                        <>
                          <Image
                            src="/image/common/bg3.png"
                            alt="bg3"
                            width={118}
                            height={20}
                            className="w-[98px] h-[20px] absolute top-[calc(50%_-_30px)] left-[calc(50%_-_48px)] z-[4]"
                          />
                          <SvgIcon
                            src="/svg/start.svg"
                            alt="start"
                            width={24}
                            height={24}
                            className="w-[14px] h-[14px] absolute top-[calc(50%_-_12px)] left-[calc(50%_-_8px)] z-[4]"
                          />
                          <Image
                            src="/image/home/bg21.png"
                            alt="bg3"
                            width={236}
                            height={137}
                            className="absolute top-[calc(50%_-_40px)] left-[calc(50%_-_58px)] z-[3] transform scale-170"
                          />
                        </>
                      )}
                      <p
                        className={`text-[14px] text-center font-thin ${active === idx ? '' : 'mt-2'}`}
                      >
                        {s.title}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`line line-test pointer-events-none absolute top-[84px] ease-in duration-300 ${active === idx ? 'left-[210px] w-27' : 'left-[138px] w-18'} ${active - 1 === idx ? 'left-[140px] w-27' : 'left-[138px] w-18'}`}
                  />
                </div>
                <div className="h-[172px] flex items-center justify-center">
                  <div
                    className={`relative bg-white/10 ease-in duration-300 mt-4 ${active === idx ? 'h-[172px] w-[272px] active-border' : 'h-[103px] w-[158px]'}`}
                    onClick={() => {
                      setCurrentVideo(s.src)
                      openVideoOverlay()
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[idx] = el
                      }}
                      src={s.src}
                      loop={true}
                      muted
                      className="w-full h-full object-cover relative z-[2]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Image
        src="/image/home/bg14.png"
        alt="bg3"
        width={459}
        height={150}
        className="w-[459px] h-[150px] mx-auto"
      />
      {/* 模块二：团体介绍 */}
      <section className='relative bg-[url("/image/home/bg13.png")] bg-no-repeat bg-cover bg-size-[100%_100%] p-7'>
        <Image
          src="/image/home/bg17.png"
          alt="bg17"
          width={144}
          height={440}
          className="absolute top-[200px] right-[-50px] w-[144px] h-[440px] mx-auto"
        />
        <Image
          src="/image/home/bg22.png"
          alt="bg18"
          width={42}
          height={204}
          className="absolute left-[-50px] w-[42px] h-[204px] mx-auto"
        />
        <div className="mb-4 flex gap-3">
          {/* {groupTabs.map((g, i) => (
            <button
              key={g.groupName}
              onClick={() => setActiveGroup(i)}
              className={`rounded px-3 py-2 cursor-pointer ${
                activeGroup === i ? 'btn-tab' : 'bg-white/10'
              }`}
            >
              {g.groupName}
            </button>
          ))} */}
          <div className='flex align-center justify-evenly bg-[url("/image/home/bg4.png")] bg-no-repeat bg-cover bg-size-[100%_100%] h-[170px] w-[220px]'>
            <button
              onClick={() => setActiveGroup(6)}
              className={`rounded h-[32px] px-3  mt-[122px] text-[14px] py-1 cursor-pointer hover:text-[#33E11F] ${
                activeGroup === 6 ? 'btn-tab1' : 'bg-black'
              }`}
            >
              {groupTabs[6].groupName}
            </button>
            <button
              onClick={() => setActiveGroup(5)}
              className={`rounded h-[32px] px-3 mt-[122px] text-[14px] py-1 cursor-pointer hover:text-[#33E11F] ${
                activeGroup === 5 ? 'btn-tab1' : 'bg-black'
              }`}
            >
              {groupTabs[5].groupName}
            </button>
          </div>
          <div className='flex align-center justify-evenly bg-[url("/image/home/bg5.png")] bg-no-repeat bg-cover bg-size-[100%_100%] h-[170px] w-[220px]'>
            <button
              onClick={() => setActiveGroup(3)}
              className={`rounded h-[32px] px-3 mt-[122px] text-[14px] py-1 cursor-pointer hover:text-[#33E11F] ${
                activeGroup === 3 ? 'btn-tab1' : 'bg-black'
              }`}
            >
              {groupTabs[3].groupName}
            </button>

            <button
              onClick={() => setActiveGroup(4)}
              className={`rounded h-[32px] px-3 mt-[122px] text-[14px] py-1 cursor-pointer hover:text-[#33E11F] ${
                activeGroup === 4 ? 'btn-tab1' : 'bg-black'
              }`}
            >
              {groupTabs[4].groupName}
            </button>
          </div>
          <div className='flex align-center justify-evenly bg-[url("/image/home/bg6.png")] bg-no-repeat bg-cover bg-size-[100%_100%] h-[170px] w-[336px]'>
            <button
              onClick={() => setActiveGroup(2)}
              className={`rounded h-[32px] px-3 mt-[122px] text-[14px] py-1 cursor-pointer hover:text-[#33E11F] ${
                activeGroup === 2 ? 'btn-tab1' : 'bg-black'
              }`}
            >
              {groupTabs[2].groupName}
            </button>

            <button
              onClick={() => setActiveGroup(1)}
              className={`rounded h-[32px] px-3 mt-[122px] text-[14px] py-1 cursor-pointer hover:text-[#33E11F] ${
                activeGroup === 1 ? 'btn-tab1' : 'bg-black'
              }`}
            >
              {groupTabs[1].groupName}
            </button>

            <button
              onClick={() => setActiveGroup(0)}
              className={`rounded h-[32px] px-3 mt-[122px] text-[14px] py-1 cursor-pointer hover:text-[#33E11F] ${
                activeGroup === 0 ? 'btn-tab1' : 'bg-black'
              }`}
            >
              {groupTabs[0].groupName}
            </button>
          </div>
          <div className='flex align-center justify-evenly bg-[url("/image/home/bg15.png")] bg-no-repeat bg-cover bg-size-[100%_100%] h-[170px] w-[320px]'>
            <button className="rounded h-[32px] px-3 mt-[122px] text-[14px] py-1 cursor-pointer bg-black">
              敬请期待
            </button>
          </div>
        </div>
        <div
          className="relative h-[647px] w-full bg-[url('/image/home/bg12.png')] bg-no-repeat bg-size-[100%_100%] cursor-pointer rounded-[10px]"
          onClick={() => showGroupInfo(true)}
        >
          {/* 使用动画状态控制，而不是直接条件渲染 */}
          {(isGroupInfoVisible || isFadingOut) && (
            <div
              className={`absolute top-0 cursor-pointer left-0 w-full h-full bg-black/60 z-[100] rounded-[10px] ${isFadingOut ? 'animate-fadeOut' : 'animate-fadeIn'}`}
              onClick={() => showGroupInfo(false)}
            >
              <Image
                src="/image/home/bg8.png"
                alt="avatar"
                width={496}
                height={434}
                className={`h-[434px] w-[496px] absolute top-[100px] left-[100px] rounded-[10px] ${isFadingOut ? 'animate-slideOutLeft' : 'animate-slideInLeft'}`}
              />
              {/* 右侧悬浮蒙版 */}
              <div
                className={`absolute top-0 right-0 w-[395px] h-full bg-black/60 bg-[url('/image/home/bg25.png')] bg-no-repeat bg-size-[100%_100%] p-4 rounded-[10px] ${isFadingOut ? 'animate-slideOutRight' : 'animate-slideInRight'}`}
              >
                <div className="w-[180px] h-[180px] rounded-full mx-auto flex items-center justify-center bg-[url('/image/home/bg24.png')] bg-size-[110%_110%] bg-no-repeat bg-center">
                  <Image
                    src={groupTabs[activeGroup].groupIcon || ''}
                    alt="avatar"
                    width={118}
                    height={118}
                    className="h-[118px] w-[118px]"
                  />
                </div>
                <div className="mb-2 text-lg font-bold text-center text-white mt-[20px]">
                  {groupTabs[activeGroup].groupName}
                </div>
                <div className="mb-4 text-sm text-white/80 px-[20px]">
                  {groupTabs[activeGroup].introduction}
                </div>
                <div className="flex gap-3 px-[20px] justify-center mt-[20px]">
                  <a
                    className="rounded border border-white px-3 py-2 w-[120px] text-center h-[40px] cursor-pointer"
                    onClick={() => handleCommunity('/fans')}
                  >
                    {messages?.home?.['team-home']}
                  </a>
                  {/* <a
                className="rounded border border-white px-3 py-2 w-[120px] text-center h-[40px] cursor-pointer"
                onClick={() => handleBlog('/fans')}
              >
                Blog 博客
              </a> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 模块三：博客区 */}
      <section>
        <div className="mt-20 mb-20">
          <div className="mx-auto flex items-center justify-center h-[46px] w-[264px] bg-[url('/image/common/bg3.png')] bg-no-repeat bg-size-[264px_46px]">
            <h2 className=" text-2xl font-bold text-white">博客精选</h2>
          </div>
        </div>
        <div className="flex">
          <div className="w-[926px] h-[494px] bg-white/10">
            <ImageViewer
              imageUrl={
                categoryTabs[activeCategory[0]]?.children[activeCategory[1]]
                  .image
              }
              videoUrl={
                categoryTabs[activeCategory[0]]?.children[activeCategory[1]]
                  .video
              }
              alt="avatar"
              width={926}
              height={494}
              onVideoClick={(value) => {
                setCurrentVideo(value)
                openVideoOverlay()
              }}
              className="h-[494px] w-[926px]"
            />
          </div>
          <div className="w-[40px] bg-[#0D37C8] flex flex-col items-center justify-around">
            {[1, 2, 3].map((i) => (
              <Image
                key={i}
                src={`/image/home/text1.png`}
                alt="avatar"
                width={28}
                height={92}
                className="h-[92px] w-[28px]"
              />
            ))}
          </div>
          <ul className="w-[316px] h-[494px] bg-white/10 p-5 bg-[url('/image/home/bg16.png')] bg-no-repeat bg-size-[100%_100%] overflow-auto">
            {categoryTabs.map((item, i) => (
              <div
                key={item.id}
                className={`rounded-[8px] bg-white overflow-hidden mb-[10px] bg-no-repeat bg-position-[100%_100%] ${i === 0 ? 'bg-[url("/image/home/bg26.png")]' : i === 1 ? 'bg-[url("/image/home/bg27.png")]' : 'bg-[url("/image/home/bg28.png")]'}`}
              >
                <li
                  key={item.id}
                  className={`h-[60px] flex items-center justify-between px-[20px] cursor-pointer ${i === 0 ? 'bg2' : i === 1 ? 'bg3' : 'bg4'}`}
                  onClick={() => {
                    // 切换展开状态
                    setExpandedCategories((prev) => {
                      const newState = [...prev]
                      newState[i] = !prev[i]
                      return newState
                    })
                  }}
                >
                  <p className="text-[22px]">{item.title}</p>
                  <div className="flex items-center">
                    {/* 显示展开/折叠图标 */}
                    {item.children && item.children.length > 0 && (
                      <SvgIcon
                        src="/svg/up.svg"
                        className={`w-[12px] h-[12px] transform transition-transform text-[#999] duration-300 ${expandedCategories[i] ? '' : 'rotate-[180deg]'}`}
                      />
                    )}
                  </div>
                </li>
                {/* 只有当展开状态为true且有children时才显示子类别列表 */}
                {expandedCategories[i] &&
                  item.children &&
                  item.children.length > 0 && (
                    <ul className="transform transition-transform duration-300 pb-[10px]">
                      {categoryTabs[i].children.map((child, index) => (
                        <li
                          key={child.id}
                          className={`h-[40px] w-full px-[20px] flex items-center justify-between text-[14px] text-[#fff] cursor-pointer ${i === activeCategory[0] && activeCategory[1] === index ? 'bg1' : ''} hover-bg`}
                          onClick={(e) => {
                            // 阻止事件冒泡，避免触发父级点击事件
                            e.stopPropagation()
                            setActiveCategory([i, index])
                          }}
                        >
                          <p
                            className={`text-[#333] ${i === activeCategory[0] && activeCategory[1] === index ? 'font-bold' : ''}`}
                          >
                            {child.title}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                <style>
                  {`
                    .bg1{
                      background: linear-gradient(90deg, rgba(67, 255, 98, 0.2) 0%, rgba(235, 255, 82, 0) 64%, rgba(235, 255, 82, 0.197) 64%, rgba(199, 222, 28, 0) 64%);
                      border-left: 2px solid #86F419;
                    }
                    .bg2{
                      background: linear-gradient(90deg, #00DDF6 3%, #99FC84 118%, rgba(235, 255, 82, 0.9851) 118%, rgba(199, 222, 28, 0) 118%);
                    }
                    .bg3{
                      background: linear-gradient(90deg, #4A99FE 3%, #7CD2FF 118%, rgba(235, 255, 82, 0.9851) 118%, rgba(199, 222, 28, 0) 118%);
                    }
                    .bg4{
                      background: linear-gradient(90deg, #8D7CFF 3%, #9889FF 118%, rgba(235, 255, 82, 0.9851) 118%, rgba(199, 222, 28, 0) 118%);
                    }
                    .hover-bg:hover{
                      background: linear-gradient(90deg, rgba(67, 255, 98, 0.2) 0%, rgba(235, 255, 82, 0) 64%, rgba(235, 255, 82, 0.197) 64%, rgba(199, 222, 28, 0) 64%);
                    }
                  `}
                </style>
              </div>
            ))}
          </ul>
        </div>
      </section>
      <VideoOverlay
        isVisible={isVideoOverlayVisible}
        onClose={closeVideoOverlay}
        videoSrc={currentVideo}
        title={steps[active].title}
        subtitle={steps[active].desc}
      />
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slideOutLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(30%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(30%);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fadeOut {
          animation: fadeOut 0.5s ease-out forwards;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out forwards;
        }
        .animate-slideOutLeft {
          animation: slideOutLeft 0.5s ease-out forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
        }
        .animate-slideOutRight {
          animation: slideOutRight 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
