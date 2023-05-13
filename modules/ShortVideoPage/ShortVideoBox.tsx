// import Swiper styles
import FollowBox from '@common/components/FollowBox'
import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { some, VideoObject } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import VideoJS from '@common/VideoJS'
import {
  DefaultPosterShort,
  PauseIcon,
  PlayIcon,
  VolumeFillIcon,
  VolumeFillMuteIcon,
} from '@public/icons'
import {
  setDraggingProgressLine,
  setPlayerShort,
  setShortMetaData,
  setShortVideoData,
} from '@redux/shortsReducer'
import { AppState } from '@redux/store'
import { ROUTES, SHORT_SLIDE_INDEX, SHORT_SLIDE_PAGE } from '@utility/constant'
import { useCallback, useEffect, useRef, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import 'swiper/css'
import 'swiper/css/pagination'
import { useSwiperSlide } from 'swiper/react'
import { useCountdown } from 'usehooks-ts'
import ActionShortBox from './ActionShortBox'
import SliderRange from './SliderRange'

interface Props {
  src?: string
  data: VideoObject
  videoOnClick?: () => void
  setOpenComment?: () => void
  onClickCommentBox?: () => void
  isModalMode?: boolean
  query: some
}

const ShortVideoBox = (props: Props) => {
  const { data, src, setOpenComment, onClickCommentBox, isModalMode, query } =
    props
  const { isActive } = useSwiperSlide()
  const [show, setShow] = useState(false)
  const { dispatch, router } = useGeneralHook()
  const { metadata, player, videoData } = useSelector(
    (state: AppState) => state.shortVideo,
    shallowEqual
  )
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 3,
  })

  const prePaused = useRef<boolean>(true)

  const handlePlayerReady = async (playerVideo) => {
    dispatch(setPlayerShort(playerVideo))
    resetCountdown()
    startCountdown()
    playerVideo.loop(true)
    playerVideo.muted(localStorage.getItem('SHORT_MUTED') === 'true')
    playerVideo.on('pause', () => {
      dispatch(setShortMetaData({ playing: false }))
    })
    playerVideo.on('volumechange', () => {
      dispatch(setShortMetaData({ volume: playerVideo.volume() }))
    })
    playerVideo.on('play', () => {
      dispatch(setShortMetaData({ playing: true }))
    })
    playerVideo.on('canplaythrough', () => {})
    playerVideo.on('loadedmetadata', () => {
      setShow(true)
      dispatch(
        setShortMetaData({ volume: playerVideo.volume(), error: undefined })
      )
    })

    playerVideo.on('timeupdate', () => {
      try {
        dispatch(
          setShortVideoData({
            currentTime: playerVideo.currentTime(),
          })
        )
      } catch (error) {}
    })
    playerVideo.on('progress', (e) => {
      let range = 0
      const bf = playerVideo.buffered()
      const time = playerVideo.currentTime()
      if (bf.start(range) === bf.end(range)) {
        return
      }
      while (!(bf.start(range) <= time && time <= bf.end(range))) {
        range += 1
      }
      const end = bf.end(range)
      dispatch(
        setShortVideoData({
          loadedTime: end,
        })
      )
    })
    playerVideo.on('loadedmetadata', () => {
      dispatch(
        setShortVideoData({
          currentTime: playerVideo.currentTime(),
          duration: playerVideo.duration(),
          error: undefined,
        })
      )
    })
  }

  const handlePlayerError = (playerVideo) => {
    const error = playerVideo.error()
    if (error) {
      //error cannot reload
      dispatch(
        setShortMetaData({
          error: { code: error.code, message: error?.message },
        })
      )
    }
  }

  const onTimeUpdate = useCallback(
    (value) => {
      if (player) {
        player?.currentTime(value)
      }
    },
    [player]
  )

  const onPlay = useCallback(
    () => {
      if (player?.player_) {
        const paused = player?.paused()
        if (paused) {
          player?.play().catch((e) => {
            /* error handler */
            console.error(e)
          })
        } else {
          player?.pause()
        }
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [player]
  )

  const onMuteClick = () => {
    try {
      const tmp = player.muted()
      player.muted(!tmp)
      localStorage.setItem('SHORT_MUTED', `${!tmp}`)
    } catch (err) {
      console.log(err)
    }
  }

  const handleOnClickVideo = async () => {
    if (isModalMode) {
      onPlay()
    }
    {
      setOpenComment && setOpenComment()
    }
  }

  useEffect(() => {
    if (isActive) {
      router.replace(
        {
          query: {
            ...router.query,
            ...query.current,
          },
        },
        undefined,
        { shallow: true }
      )
      if (!router.query.type && router.query.param !== 'RECOMMEND_FOLLOW') {
        localStorage.setItem(
          SHORT_SLIDE_INDEX,
          query.next.slideIndex.toString()
        )
        localStorage.setItem(SHORT_SLIDE_PAGE, query.next.pageSize.toString())
      }
    } else {
      setShow(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  return (
    <div
      className="relative my-auto flex h-full w-full"
      onMouseOver={() => {
        resetCountdown()
      }}
      onMouseMove={() => {
        if (count) {
          startCountdown()
        } else {
          resetCountdown()
          startCountdown()
        }
      }}
      onMouseLeave={() => {
        startCountdown()
      }}
    >
      <div
        className={`relative flex h-full w-full items-center justify-center `}
      >
        {!!isModalMode && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 ">
            {player?.player_ && player?.paused() ? (
              <button className="flex shrink-0 scale-[2] items-center justify-center rounded-full bg-black bg-opacity-30 sm:h-10 sm:w-10 2xl:h-12 2xl:w-12">
                <PlayIcon className="sm:scale-75 2xl:scale-100" />
              </button>
            ) : (
              <button className="flex shrink-0 scale-[2] animate-fade-out items-center justify-center rounded-full bg-black bg-opacity-30 sm:h-10 sm:w-10 2xl:h-12 2xl:w-12">
                <PauseIcon className="sm:scale-75 2xl:scale-100" />
              </button>
            )}
          </div>
        )}
        {!isModalMode && isActive && (
          <button
            id="play-pause-btn"
            onClick={onPlay}
            className={
              'absolute top-6 left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 bg-opacity-30 transition-all ' +
              (count > 0 ? 'opacity-100' : 'opacity-0')
            }
          >
            {player?.player_ && player?.paused() ? (
              <PlayIcon id="play-icon-video-box" />
            ) : (
              <PauseIcon id="pause-icon-video-box" />
            )}
          </button>
        )}
        {!isModalMode && isActive && (
          <button
            onClick={onMuteClick}
            className={
              'absolute top-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 bg-opacity-30 transition-all ' +
              (count > 0 ? 'opacity-100' : 'opacity-0')
            }
          >
            {player && player.player_ && player?.muted() ? (
              <VolumeFillMuteIcon className="scale-75" />
            ) : (
              <VolumeFillIcon className="scale-75" />
            )}
          </button>
        )}
        {src && isActive ? (
          <div
            onClick={handleOnClickVideo}
            onDoubleClick={setOpenComment}
            className="h-full w-full min-w-[45vh]"
          >
            <VideoJS
              containerProps={{
                style: {
                  height: '100%',
                  padding: 0,
                },
              }}
              elProp={{
                autoPlay: true,
                className:
                  'w-full h-full p-0 object-cover pointer-events-none bg-transparent overflow-hidden ' +
                  (!!isModalMode ? 'rounded-none' : 'rounded-3xl'),
              }}
              options={{
                autoplay: true,
                controls: false,
                preload: true,
                fluid: true,
                sources: [
                  {
                    src: src,
                  },
                ],
                poster: data.firstFrameImage || (
                  <DefaultPosterShort
                    className={'sm:rounded-lg 2xl:rounded-2xl'}
                  />
                ),
              }}
              onReady={handlePlayerReady}
              onError={handlePlayerError}
            />
          </div>
        ) : (
          <ProgressiveImg
            shape="rect_h"
            src={data.firstFrameImage}
            alt="coverImage"
            placeholder={data.coverImage}
            className={
              'h-full w-full overflow-hidden object-cover ' +
              (!!isModalMode ? 'rounded-none' : 'rounded-3xl')
            }
          />
        )}
        <div
          className="absolute left-0 bottom-0 flex w-full flex-col justify-end pb-2 sm:px-3 2xl:px-5"
          style={{
            background:
              'linear-gradient(180deg, rgba(31, 33, 40, 0) 2.65%, rgba(0, 0, 0, 0.8) 67.35%)',
            minHeight: 250,
          }}
        >
          {!isModalMode && (
            <div className="z-10 pr-14 headline lg:pr-0">
              <span className="mr-2">{data.name}</span>
              {data?.hashtag?.split(',').map(
                (hashtag, index) =>
                  hashtag && (
                    <MyLink
                      key={index}
                      href={{
                        pathname: ROUTES.shorts.hashtags,
                        query: {
                          hashtag: hashtag,
                        },
                      }}
                      className="font-semibold"
                    >
                      #{hashtag}{' '}
                    </MyLink>
                  )
              )}
            </div>
          )}
          {!isModalMode && (
            <div className="z-10 w-full">
              <FollowBox channelData={data.channel} />
            </div>
          )}
          <div className="mb-2 h-[36px] overflow-hidden">
            {isActive && src && videoData.duration > 60 && (
              <SliderRange
                hiddenThumb={metadata.playing}
                min={0}
                max={videoData.duration || 1}
                values={[
                  Math.min(
                    Math.round(videoData.currentTime),
                    videoData.duration
                  ),
                ]}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  prePaused.current = player?.paused()
                  !prePaused.current && player?.pause()
                  dispatch(setDraggingProgressLine(true))
                }}
                onChange={(value: number[]) => {
                  onTimeUpdate(value[0])
                  !prePaused.current &&
                    player?.play().catch((e) => {
                      console.error(e)
                    })
                  setTimeout(() => {
                    dispatch(setDraggingProgressLine(false))
                  }, 500)
                }}
                className={
                  'hover-slider range-sm z-30 flex w-auto translate-y-1/2 animate-fade-in cursor-pointer items-center'
                }
              />
            )}
          </div>
        </div>
      </div>
      {!isModalMode && (
        <div className="z-1 absolute right-0 bottom-24 p-3 lg:relative lg:bottom-0 lg:self-end">
          <ActionShortBox
            isActive={isActive}
            data={data}
            setOpenComment={setOpenComment}
            setOpenShare={() => {}}
            onClickCommentBox={onClickCommentBox}
          />
        </div>
      )}
    </div>
  )
}

export default ShortVideoBox
