'use client'
import SvgIcon from '@/components/SvgIcon'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { getMessages } from '@/lib/i18n'
import figure_zh from '@/moke/figure_zh.json'
import figure_en from '@/moke/figure_en.json'
import figure_ja from '@/moke/figure_ja.json'
import figure_ko from '@/moke/figure_ko.json'
import figure_zh_TW from '@/moke/figure_zh_TW.json'

export default function TeamIntroduction() {
  const { locale } = useParams() as { locale: string }
  const messages = getMessages(locale)
  const teamMembers = [
    {
      name: 'FELIX1',
      role: '产品经理',
      image: '/image/data/bg5.png',
    },
    {
      name: 'FELIX2',
      role: '产品经理',
      image: '/image/data/bg5.png',
    },
    {
      name: 'FELIX3',
      role: '产品经理',
      image: '/image/data/bg5.png',
    },
    {
      name: 'FELIX4',
      role: '产品经理',
      image: '/image/data/bg5.png',
    },
    {
      name: 'FELIX5',
      role: '产品经理',
      image: '/image/data/bg5.png',
    },
    {
      name: 'FELIX6',
      role: '产品经理',
      image: '/image/data/bg5.png',
    },
  ]
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  )
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 1080
  )
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
              children: [],
            }
          }
          acc[group].children.push({
            id: item.id,
            roleName: item.roleName,
            headicon: item.headicon,
            mainCharacter: item.mainCharacter,
            chineseNickname: item.chineseNickname,
            age: item.age,
            birthdayZodiac: item.birthdayZodiac,
            mbti: item.mbti,
            bloodType: item.bloodType,
            specialty: item.specialty,
            interests: item.interests,
            musicType: item.musicType,
            dislikedFood: item.dislikedFood,
            likedFood: item.likedFood,
            fears: item.fears,
            weaknesses: item.weaknesses,
            introduction: item.introduction,
            biography: item.biography,
          })
          return acc
        },
        {} as Record<
          string,
          {
            groupName?: string
            id?: string
            children: {
              id: number
              roleName: string
              headicon: string
              mainCharacter: string
              chineseNickname: string | null
              age: number
              birthdayZodiac: string
              mbti: string
              bloodType: string
              specialty: string
              interests: string
              musicType: string
              dislikedFood: string
              likedFood: string
              fears: string
              weaknesses: string
              introduction: string | null
              biography: string | null
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

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth, window.innerHeight, 11111)
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // 切换团队成员索引的函数
  const changeActiveIndex = (direction?: number, groupIndex?: number) => {
    // 只有在索引实际变化时才触发动画
    let shouldChange = false
    if (groupIndex || groupIndex === 0) {
      setActiveIndex(groupIndex)
    } else {
      if (direction === 0 && activeIndex > 0) {
        setActiveIndex((prevIndex) => prevIndex - 1)
      } else if (
        direction === 1 &&
        activeIndex < groupTabs[activeGroup].children.length - 1
      ) {
        setActiveIndex((prevIndex) => prevIndex + 1)
      }
    }
    shouldChange = true

    if (shouldChange) {
      // 先设置动画状态为true
      setIsAnimating(true)

      // 使用setTimeout确保状态更新后动画能正确显示
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }
  }

  const [activeGroup, setActiveGroup] = useState(0)
  //   固定图标
  const fixedIcon = useMemo(() => {
    return (
      <div className="fixed top-[50%] right-[2%] w-[48px] h-[116px] z-[9]">
        <a href={`/${locale}/chat`} className="inline-block">
          <SvgIcon src="/svg/weixin.svg" width={48} height={48} />
        </a>
        <a href={`/${locale}/fans`} className="mt-[20px] inline-block">
          <SvgIcon src="/svg/fensiquan.svg" width={48} height={48} />
        </a>
      </div>
    )
  }, [])
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    // 页面加载后触发动画
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 0) // 动画持续时间

    return () => clearTimeout(timer)
  }, [])

  const router = useRouter()
  const goBack = () => {
    console.log(router)
    router.back()
  }
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <div className="w-[57%] aspect-[800/945] bg-[url('/image/data/bg5.png')] min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] bg-cover bg-auto bg-center">
        <div
          className={`absolute top-[32%] left-[2%] w-[50%] bg-[url('/image/data/FELIX.png')] bg-size-[100%_100%] bg-center aspect-[667/175] transition-all duration-300 ${isAnimating ? 'opacity-[0.5] translate-x-[-80px] blur-[5px]' : 'opacity-100 translate-x-0 blur-0'}`}
        ></div>
        <div
          className={`absolute top-[16%] left-[13%] w-[50%] bg-[url('/image/data/role.png')] bg-size-[100%_100%] bg-center aspect-[670/794] z-[9] transition-all duration-300 ${isAnimating ? 'opacity-[0.5] translate-x-[-80px] blur-[5px]' : 'opacity-100 translate-x-0 blur-0'}`}
        ></div>
        <div className="absolute bottom-[6%] left-[46%] w-[140px] h-[60px] z-[9]">
          {/* 上一个按钮 */}
          <button
            onClick={() => changeActiveIndex(0)}
            disabled={activeIndex === 0}
            className={`cursor-pointer`}
          >
            <SvgIcon
              src={`/svg/${activeIndex === 0 ? '15476' : '15477'}.svg`}
              width={60}
              height={60}
              className={`transform ${activeIndex === 0 ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>

          {/* 下一个按钮 */}
          <button
            onClick={() => changeActiveIndex(1)}
            disabled={
              activeIndex === groupTabs[activeGroup].children.length - 1
            }
            className={`ml-[20px] cursor-pointer`}
          >
            <SvgIcon
              src={`/svg/${activeIndex === groupTabs[activeGroup].children.length - 1 ? '15476' : '15477'}.svg`}
              width={60}
              height={60}
              className={`transform ${activeIndex === groupTabs[activeGroup].children.length - 1 ? 'rotate-0' : 'rotate-180'}`}
            />
          </button>
        </div>
        {/* <Image
          src="/image/data/back.png"
          alt="back"
          width={66}
          height={66}
          className="absolute bottom-10 left-20 cursor-pointer"
          onClick={() => goBack()}
        /> */}
        <div className="mt-[40px] w-[80%] mx-auto">
          <div className="flex flex-wrap">
            {groupTabs.map((tab, index) => (
              <div
                key={tab.id}
                className={`rounded px-2 py-2 cursor-pointer mr-[20px] mt-[10px] hover:text-[#33e11f] ${
                  activeGroup === index ? 'btn-tab' : 'bg-black'
                }`}
                onClick={() => {
                  setActiveGroup(index)
                  changeActiveIndex(undefined, 0)
                }}
              >
                {tab.groupName}
              </div>
            ))}
          </div>
          <SvgIcon
            src="/svg/15598.svg"
            width={48}
            height={48}
            className="cursor-pointer mt-5"
            onClick={() => goBack()}
          />
        </div>
      </div>
      <div className="w-[43%] h-[calc(100vh-80px)] bg-[#fff]">
        <div className="w-full h-full py-[50px] pl-[40px] overflow-auto pr-[30px] flex flex-col justify-between overflow-hidden">
          <div className="w-full pl-[40px]">
            <Image
              src="/image/data/bg7.png"
              alt="bg7"
              width={112}
              height={10}
              className="absolute top-[20px] right-[34px] w-[112px] h-[10px]"
            />
            <Image
              src="/image/data/bg7.png"
              alt="bg7"
              width={112}
              height={10}
              className="absolute top-[92px] right-[-40px] w-[112px] h-[10px] transform rotate-[90deg]"
            />
            <h1 className="text-[30px] font-bold text-[#005033] flex items-center">
              {messages?.data?.teamIntroduction?.title || '团队成员'}
              <SvgIcon
                src="/svg/down.svg"
                className="w-[30px] h-[30px] ml-[10px]"
              />
            </h1>
            <div className="w-full flex flex-wrap mt-[20px] ">
              {groupTabs[activeGroup].children.map((member, index) => (
                <div
                  key={index}
                  className={` mr-[6px] mt-[6px] cursor-pointer`}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image
                    src={
                      groupTabs[activeGroup].children[index].headicon ||
                      '/image/data/role/Suki.png'
                    }
                    onClick={() => changeActiveIndex(undefined, index)}
                    alt={index.toString()}
                    width={101}
                    height={86}
                    className={`w-[101px] h-[86px] box-border object-cover hover:border-[#33E11F] ${index === activeIndex ? 'border-[4px] border-[#33E11F]' : 'border-[4px]'}`}
                  />
                </div>
              ))}
            </div>
            <div
              className={`w-[85%] mt-[40px] ml-[20px] relative transition-all duration-500 ease-out ${isAnimating ? 'opacity-0 translate-y-[10px] blur-[3px] scale-98' : 'opacity-100 translate-y-0 blur-0 scale-100'}`}
            >
              <div className="w-full flex justify-between pb-[20px] border-b-[1px] border-[#EEEEEE] transition-all duration-500 ease-out">
                <div className="text-center">
                  <p className="text-[24px] font-bold text-[#333]">
                    {groupTabs[activeGroup].children[activeIndex].age ||
                      messages?.data?.none}
                  </p>
                  <p className="text-[16px] font-bold text-[#333]">
                    {messages?.data?.teamIntroduction?.age || '年龄'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[24px] font-bold text-[#333]">
                    {groupTabs[activeGroup].children[activeIndex]
                      .birthdayZodiac || messages?.data?.none}
                  </p>
                  <p className="text-[16px] font-bold text-[#333]">
                    {messages?.data?.teamIntroduction?.birthdayZodiac ||
                      '生日/星座'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[24px] font-bold text-[#333]">
                    {groupTabs[activeGroup].children[activeIndex].mbti ||
                      messages?.data?.none}
                  </p>
                  <p className="text-[16px] font-bold text-[#333]">
                    {messages?.data?.teamIntroduction?.mbti || 'MBTI'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[24px] font-bold text-[#333]">
                    {groupTabs[activeGroup].children[activeIndex].bloodType ||
                      messages?.data?.none}
                  </p>
                  <p className="text-[16px] font-bold text-[#333]">
                    {messages?.data?.teamIntroduction?.bloodType || '血型'}
                  </p>
                </div>
              </div>
              <div className="w-full flex justify-between items-start mt-[20px]">
                <div className="flex w-[38%]">
                  <p className="text-[14px] text-left w-[100px] font-bold text-[#999999]">
                    {messages?.data?.teamIntroduction?.specialty || '特长'}
                  </p>
                  <p className="text-[14px] font-bold text-[#333] w-[calc(100%-100px)]">
                    {groupTabs[activeGroup].children[activeIndex].specialty ||
                      messages?.data?.none}
                  </p>
                </div>
                <div className="flex w-[58%]">
                  <p className="text-[14px] text-left w-[100px] font-bold text-[#999]">
                    {messages?.data?.teamIntroduction?.interests || '兴趣爱好'}
                  </p>
                  <p className="text-[14px] font-bold text-[#333] w-[calc(100%-100px)] text-left">
                    {groupTabs[activeGroup].children[activeIndex].interests ||
                      messages?.data?.none}
                  </p>
                </div>
              </div>
              <div className="flex mt-[20px] text-left">
                <p className="text-[14px] text-left w-[100px] font-bold text-[#999]">
                  {messages?.data?.teamIntroduction?.musicType || '喜欢的音乐'}
                </p>
                <p className="text-[14px] font-bold text-[#333] w-[calc(100%-100px)]">
                  {groupTabs[activeGroup].children[activeIndex].musicType ||
                    messages?.data?.none}
                </p>
              </div>
              <div className="flex mt-[20px] text-left">
                <p className="text-[14px] text-left w-[100px] font-bold text-[#999]">
                  {messages?.data?.teamIntroduction?.likedFood || '喜欢的食物'}
                </p>
                <p className="text-[14px] font-bold text-[#333] w-[calc(100%-100px)]">
                  {groupTabs[activeGroup].children[activeIndex].likedFood ||
                    messages?.data?.none}
                </p>
              </div>
              <div className="flex mt-[20px] text-left">
                <p className="text-[14px] text-left w-[100px] font-bold text-[#999]">
                  {messages?.data?.teamIntroduction?.dislikedFood ||
                    '讨厌的食物'}
                </p>
                <p className="text-[14px] font-bold text-[#333] w-[calc(100%-100px)]">
                  {groupTabs[activeGroup].children[activeIndex].dislikedFood ||
                    messages?.data?.none}
                </p>
              </div>
              <div className="flex mt-[20px] text-left">
                <p className="text-[14px] text-left w-[100px] font-bold text-[#999]">
                  {messages?.data?.teamIntroduction?.fears || '恐惧事物'}
                </p>
                <p className="text-[14px] font-bold text-[#333] w-[calc(100%-100px)]">
                  {groupTabs[activeGroup].children[activeIndex].fears ||
                    messages?.data?.none}
                </p>
              </div>
              <div className="flex mt-[20px] text-left border-b-[1px] border-[#EEEEEE] pb-[20px]">
                <p className="text-[14px] text-left w-[100px] font-bold text-[#999]">
                  {messages?.data?.teamIntroduction?.weaknesses ||
                    '不擅长的事情'}
                </p>
                <p className="text-[14px] font-bold text-[#333] w-[calc(100%-100px)]">
                  {groupTabs[activeGroup].children[activeIndex].weaknesses ||
                    messages?.data?.none}
                </p>
              </div>
              <div className="flex mt-[20px] text-left">
                <p className="text-[14px] text-left w-[100px] font-bold text-[#999]">
                  {messages?.data?.teamIntroduction?.introduction || '简介'}
                </p>
                <p className="text-[14px] font-bold text-[#333] w-[calc(100%-100px)]">
                  {groupTabs[activeGroup].children[activeIndex].introduction ||
                    messages?.data?.none}
                </p>
              </div>
              <div className="flex mt-[20px] text-left">
                <p className="text-[14px] text-left w-[100px] font-bold text-[#999]">
                  {messages?.data?.teamIntroduction?.biography || '人物小传'}
                </p>
                <p className="text-[14px] font-bold text-[#333] w-[calc(100%-100px)]">
                  {groupTabs[activeGroup].children[activeIndex].biography ||
                    messages?.data?.none}
                </p>
              </div>
              <div className="flex mt-[20px] text-left">
                <p className="text-[14px] text-left w-[100px] font-bold text-[#999]"></p>
                <p className="text-[14px] font-bold text-[#333] w-[calc(100%-100px)]">
                  <button
                    onClick={() => setIsPlaying((prevState) => !prevState)}
                    className="p-2 focus:outline-none"
                  >
                    <SvgIcon
                      src={
                        isPlaying
                          ? '/svg/play-music.svg'
                          : '/svg/stop-music.svg'
                      }
                      width={28}
                      height={28}
                    />
                  </button>
                </p>
              </div>
              <Image
                src="/image/data/bg6.png"
                alt="15472"
                width={479}
                height={380}
                className="absolute top-[20%] right-[-35%] w-[80%] aspect-auto"
              />
            </div>
          </div>
          <div
            className={`w-full flex justify-end transition-all duration-300 ${isAnimating ? 'opacity-[0.5] translate-y-[50px] blur-[5px]' : 'opacity-100 translate-y-0 blur-0'}`}
          >
            <Image
              src="/image/data/bg8.png"
              alt="bg8"
              width={300}
              height={300}
              className="flex items-end justify-end"
            />
          </div>
        </div>
      </div>
      {fixedIcon}
    </div>
  )
}
