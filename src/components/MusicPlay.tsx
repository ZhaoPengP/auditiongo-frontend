import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import Image from 'next/image'
import SvgIcon from './SvgIcon'

interface Song {
  id: string
  title: string
  src?: string
  cover?: string
}

interface MusicPlayerProps {
  songs: Song[]
  onSongSelect?: (songId: string) => void
  progressColor?: string
  progressBgColor?: string
}

interface MusicPlayerRef {
  playSong: (index: number) => void
}

const MusicPlayer = forwardRef<MusicPlayerRef, MusicPlayerProps>(
  (
    {
      songs,
      onSongSelect,
      progressColor = '#ffffff',
      progressBgColor = '#404040',
    },
    ref
  ) => {
    const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(
      null
    )
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState('00:00')
    const [duration, setDuration] = useState('00:00')
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // 当前歌曲
    const currentSong =
      currentSongIndex !== null ? songs[currentSongIndex] : null

    // 播放指定歌曲
    const playSong = (index: number) => {
      if (audioRef.current) {
        // 重置进度
        setProgress(0)
        // 设置当前歌曲索引
        setCurrentSongIndex(index)
        // 更新audio源
        audioRef.current.src = currentSong?.src || '/misce/1.mp3' // 默认音频文件
        // 播放
        audioRef.current.play()
        setIsPlaying(true)
        // 重置时间显示
        setCurrentTime('00:00')
        setDuration('00:00')
        // 触发回调
        if (onSongSelect) {
          onSongSelect(songs[index].id)
        }
      }
    }

    // 切换播放/暂停
    const togglePlay = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          if (currentSongIndex === null && songs.length > 0) {
            playSong(0) // 播放第一首
          } else {
            audioRef.current.play()
          }
        }
        setIsPlaying(!isPlaying)
      }
    }

    // 上一曲
    const playPrevious = () => {
      if (songs.length === 0) return
      const newIndex =
        currentSongIndex === null || currentSongIndex === 0
          ? songs.length - 1
          : currentSongIndex - 1
      playSong(newIndex)
    }

    // 下一曲
    const playNext = () => {
      if (songs.length === 0) return
      const newIndex =
        currentSongIndex === null || currentSongIndex === songs.length - 1
          ? 0
          : currentSongIndex + 1
      playSong(newIndex)
    }

    // 格式化时间为 MM:SS 格式
    const formatTime = (seconds: number): string => {
      if (isNaN(seconds)) return '00:00'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // 更新进度条和时间显示
    const updateProgress = () => {
      if (audioRef.current) {
        const percent =
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        setProgress(isNaN(percent) ? 0 : percent)
        setCurrentTime(formatTime(audioRef.current.currentTime))
        setDuration(formatTime(audioRef.current.duration))
      }
    }

    // 拖动进度条
    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (audioRef.current) {
        const newTime =
          (parseFloat(e.target.value) / 100) * audioRef.current.duration
        audioRef.current.currentTime = newTime
        setProgress(parseFloat(e.target.value))
      }
    }

    // 监听音频事件
    useEffect(() => {
      const audio = audioRef.current
      if (audio) {
        // 更新播放进度
        const handleTimeUpdate = () => updateProgress()

        // 加载元数据，获取音频总时长
        const handleLoadedMetadata = () => {
          setDuration(formatTime(audio.duration))
        }

        // 播放结束处理
        const handleEnded = () => {
          setIsPlaying(false)
          // 自动播放下一曲
          playNext()
        }

        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('ended', handleEnded)

        return () => {
          audio.removeEventListener('timeupdate', handleTimeUpdate)
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
          audio.removeEventListener('ended', handleEnded)
        }
      }
    }, [currentSongIndex])

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      playSong,
    }))

    return (
      <div className="w-full bg-[#282A32] rounded-lg p-4">
        {/* 音频元素（隐藏） */}
        <audio ref={audioRef} />

        <div className="flex items-center gap-4">
          {/* 歌曲封面 */}
          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-700">
            {currentSong?.cover ? (
              <Image
                src={currentSong.cover}
                alt={currentSong.title}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src="/image/data/music.png"
                alt="music cover"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* 播放控制和进度条 */}
          <div className="flex-1 flex flex-col gap-2">
            {/* 播放控制按钮 */}
            <div className="flex items-center gap-4">
              <button
                onClick={playPrevious}
                className="text-white hover:text-[#33E11F] transition-colors"
                aria-label="Previous song"
              >
                <SvgIcon src="/svg/15298.svg" width={20} height={20} />
              </button>
              <button
                onClick={togglePlay}
                className="text-white hover:text-[#33E11F] transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <SvgIcon src="/svg/stop-music.svg" width={24} height={24} />
                ) : (
                  <SvgIcon src="/svg/play-music.svg" width={24} height={24} />
                )}
              </button>
              <button
                onClick={playNext}
                className="text-white hover:text-[#33E11F] transition-colors"
                aria-label="Next song"
              >
                <SvgIcon src="/svg/15300.svg" width={20} height={20} />
              </button>
            </div>

            {/* 进度条和时间显示 */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                style={{
                  backgroundImage: `linear-gradient(to right, ${progressColor} 0%, ${progressColor} ${progress}%, ${progressBgColor} ${progress}%, ${progressBgColor} 100%)`,
                  // Webkit内核浏览器滑块样式
                  WebkitAppearance: 'none',
                }}
              />
              <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background: ${progressColor};
                  cursor: pointer;
                  border: none;
                }
                input[type='range']::-moz-range-thumb {
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background: ${progressColor};
                  cursor: pointer;
                  border: none;
                }
              `}</style>
              <div className="flex justify-between mt-1 text-xs text-gray-300">
                <span>{currentTime}</span>
                <span>{duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

MusicPlayer.displayName = 'MusicPlayer'

export default MusicPlayer
