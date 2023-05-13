import { some, VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import {
  DirectionsIcon,
  FastBackwardIcon,
  FastForwardIcon,
  FullscreenIcon,
  LiveIcon,
  PauseIcon,
  PlayIcon,
  RefreshIcon,
  SettingFillIcon,
  ShareFillIcon,
  SmallScreenIcon,
  SpeedArrowIcon,
} from '@public/icons'
import { setSpanViewPlayer } from '@redux/commonReducer'
import { AppState } from '@redux/store'
import {
  MetaVideoData,
  resetVideoPlayer,
  setMetaVideoData,
  setPlayerVideo,
  setQuality,
  setVideoData,
} from '@redux/videoReducer'
import { API_PATHS } from '@utility/API_PATH'
import { formatTimeVideo } from '@utility/helper'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import Popper from '../Popper'
import ShareContent from '../ShareModal/ShareContent'
import SettingController from './SettingController'
import SliderRange from './SliderRange'
import VideoJS from './VideoJS'
import VolumeBox from './VolumeBox'

export interface VideoOptions {
  sources: string
  autoplay?: boolean
  controls?: boolean
  responsive?: boolean
  preload?: boolean
  fluid?: boolean
  aspectRatio?: string
  poster?: string
}
interface Props {
  className?: string
  videoData?: VideoObject
  contentInfo?: any
  videoOptions?: VideoOptions
  onBackward?:
    | { onClick: () => void; disabled?: boolean; className?: string }
    | some
  onForward?:
    | { onClick: () => void; disabled?: boolean; className?: string }
    | some
  onEnded?: () => void
  playerReady?: (e: any) => void
  wrapper?: (e: MetaVideoData) => React.ReactNode
  loading?: boolean
  isLive?: boolean
}

const VideoBox = (props: Props) => {
  const {
    videoData,
    videoOptions,
    className = '',
    onBackward,
    onForward,
    onEnded,
    playerReady,
    wrapper,
    loading,
    isLive,
  } = props

  const { isLogin } = useGeneralHook()
  const { metadata, dataVideo, player } = useSelector(
    (state: AppState) => state.videoPlayer,
    shallowEqual
  )

  const [openSetting, setOpenSetting] = useState(false)

  const prePaused = useRef<boolean>(true)
  const trackingRef = useRef<any>(null)
  const refQualityLevels = useRef<any>(null)
  const refCloseControl = useRef<any>(null)
  const insertTimeRef = useRef<any>(null)
  const qualityControl = refQualityLevels.current
  const [loaded, setLoaded] = useState(false)

  const { dispatch } = useGeneralHook()

  const handle = useFullScreenHandle()

  const { active, enter, exit } = handle

  const [showControls, setShowControls] = useState(true)
  const [shareVideo, setShareVideo] = useState(false)

  const { currentTime, durationVideo } = useMemo(() => {
    if (!player) {
      return { currentTime: '00:00', durationVideo: '00:00' }
    }
    return {
      currentTime: formatTimeVideo(dataVideo.currentTime),
      durationVideo: formatTimeVideo(dataVideo.duration),
    }
  }, [player, dataVideo.currentTime, dataVideo.duration])

  const handlePlayerError = (playerVideo) => {
    const error = playerVideo.error()
    console.log('error', error)

    if (error) {
      dispatch(
        setMetaVideoData({
          error: { code: error.code, message: error.message },
        })
      )
    }
  }

  const insertTimeHistory = useCallback(
    (value) => {
      //insert time
      const callback = () => {
        if (value && value?.play_ && videoData?.id && isLogin) {
          try {
            if (!value.paused()) {
              dispatch(
                fetchThunk({
                  url: API_PATHS.users.cache.insertHistory,
                  method: 'post',
                  data: {
                    videoId: videoData?.id,
                    currentTime: value!.currentTime(),
                  },
                })
              )
            }
          } catch {}
        }
      }
      insertTimeRef.current && clearInterval(insertTimeRef.current)
      callback()
      insertTimeRef.current = setInterval(() => {
        try {
          callback()
        } catch (err) {}
      }, 10000)
    },
    [dispatch, isLogin, videoData?.id]
  )

  const handlePlayerReady = useCallback(
    async (playerVideo, qualityLevels) => {
      setTimeout(() => {
        playerVideo.muted(false)
      }, 100)
      dispatch(setPlayerVideo(playerVideo))
      refQualityLevels.current = qualityLevels
      playerReady && playerReady(playerVideo)
      qualityLevels.on('change', function (event) {
        dispatch(setQuality(qualityLevels[qualityLevels.selectedIndex]?.height))
      })
      // qualityLevels.on('addqualitylevel', function (event) {
      // let qualityLevel = event.qualityLevel;
      // if (qualityLevel.height >= 720) {
      //   qualityLevel.enabled = true;
      // } else {
      //   qualityLevel.enabled = false;
      // }
      // })
      let timer: any = null
      let totalTime = 0
      let seeking = 0
      let waiting = 0
      let startTime = 0
      let init_time = 0
      let buffer_times_over_3s = 0
      let first_time = true
      playerVideo.on('loadedmetadata', async () => {
        setTimeout(() => {
          playerVideo.play()
        })
        dispatch(
          setVideoData({
            duration: playerVideo.duration(),
            currentTime: playerVideo.currentTime(),
            error: undefined,
          })
        )
        dispatch(
          setMetaVideoData({
            volume: playerVideo.volume(),
            ended: false,
          })
        )
        // get time history played before
        if (isLogin && videoData?.id && !isLive) {
          const json = await dispatch(
            fetchThunk({
              url: API_PATHS.users.cache.get({
                filter: `HISTORY_${videoData?.id}`,
              }),
              method: 'get',
            })
          )
          const historyTime = json?.data?.data?.[0]?.currentTime
          if (
            historyTime &&
            historyTime < playerVideo.duration() - 20 &&
            first_time
          ) {
            playerVideo.currentTime(historyTime)
            first_time = false
          }
        }
        insertTimeHistory(playerVideo)

        //end event Tracking KPI
        trackingRef.current && clearInterval(trackingRef.current)
        seeking = 0
        waiting = 0
        startTime = 0
        init_time = 0
        totalTime = 0
        buffer_times_over_3s = 0
        const json = await dispatch(
          fetchThunk({
            url: API_PATHS.kpi.init,
            method: 'post',
            data: {
              video_id: videoData?.id,
              channel_id: videoData?.channel?.id,
              play_url: videoOptions?.sources,
              os_version: '1.0',
              os_type: 'wapsite',
              source: 'source',
              'user-agent': navigator.userAgent || '',
              identity: 'identity',
            },
          })
        )
        const settings = json?.data?.data
        if (json?.status === 200 && settings) {
          trackingRef.current = setInterval(() => {
            if (playerVideo && playerVideo.player_) {
              try {
                dispatch(
                  fetchThunk({
                    url: API_PATHS.kpi.trace,
                    method: 'post',
                    data: {
                      token: settings?.token,
                      duration_watching: totalTime,
                      current_time: playerVideo!.currentTime(),
                      pause_times: playerVideo!.paused() ? 1 : 0,
                      seek_times: seeking,
                      wait_times: waiting,
                      init_time: init_time,
                      buffer_times_over_3s,
                      bandwidth_avg: 0,
                      bandwidth: 0,
                      duration_buffer: 0,
                    },
                  })
                )
              } catch (err) {}
              startTime = 0
            }
          }, settings.frequency * 1000)
        }
      })
      playerVideo.on('play', () => {
        timer = setInterval(function () {
          totalTime += 1
        }, 1000)
      })
      playerVideo.on('pause', () => {
        if (timer) clearInterval(timer)
      })

      playerVideo.on('volumechange', () => {
        dispatch(
          setMetaVideoData({
            volume: playerVideo.volume(),
          })
        )
      })
      playerVideo.on('ratechange', () => {
        dispatch(
          setMetaVideoData({
            playbackRate: playerVideo.playbackRate(),
          })
        )
      })
      playerVideo.on('timeupdate', () => {
        if (!isLive) {
          dispatch(
            setVideoData({
              duration: playerVideo.duration(),
              currentTime: playerVideo.currentTime(),
            })
          )
          dispatch(
            setMetaVideoData({
              ended: false,
            })
          )
        }
      })

      playerVideo.on('canplay', () => {
        setLoaded(true)
        init_time = playerVideo!.currentTime() - startTime
        if (init_time > 3) {
          buffer_times_over_3s++
        }
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
          setVideoData({
            loadedTime: Math.round(end),
          })
        )
      })

      playerVideo.on('ended', () => {
        //end event insert TIme
        insertTimeRef.current && clearInterval(insertTimeRef.current)

        //end event Tracking KPI
        trackingRef.current && clearInterval(trackingRef.current)
        seeking = 0
        waiting = 0
        startTime = 0
        init_time = 0
        totalTime = 0
        buffer_times_over_3s = 0
        //---------
        dispatch(
          setMetaVideoData({
            ended: true,
          })
        )
        setShowControls(true)
        onEnded && onEnded()
      })
      playerVideo.on('seeked', function () {
        seeking++
      })
      playerVideo.on('waiting', function () {
        waiting++
        startTime = playerVideo!.currentTime()
      })
    },
    [
      dispatch,
      insertTimeHistory,
      isLive,
      isLogin,
      onEnded,
      playerReady,
      videoData?.channel?.id,
      videoData?.id,
      videoOptions?.sources,
    ]
  )

  const onReload = useCallback(
    (e) => {
      if (player?.player_) {
        // player.pause()
        player.load()
        // player.play().catch((e) => {
        //   /* error handler */
        //   console.error(e)
        // })
        dispatch(
          setMetaVideoData({
            ended: false,
          })
        )
      }
    },
    [dispatch, player]
  )
  const onPlay = useCallback(
    (e) => {
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
    [player]
  )

  const onFastBackward = (e) => {
    if (player?.player_) {
      player?.currentTime(player?.currentTime() - 10)
    }
  }

  const onFastForward = (e) => {
    if (player?.player_) {
      player?.currentTime(player?.currentTime() + 10)
    }
  }

  const onTimeUpdate = useCallback(
    (value) => {
      try {
        if (player && value < player.duration()) {
          setVideoData({
            currentTime: value,
          })
          dispatch(
            setVideoData({
              currentTime: value,
            })
          )
          player?.currentTime(value)
        }
      } catch (error) {
        console.log(error, 'error')
      }
    },
    [dispatch, player]
  )

  useEffect(() => {
    if (player?.player_ && videoOptions?.sources) {
      player.src(videoOptions?.sources)
      player.load()
      // player.play()
    }
  }, [player, videoOptions?.sources])

  useEffect(() => {
    dispatch(resetVideoPlayer())
    return () => {
      dispatch(resetVideoPlayer())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!videoOptions?.sources && !loading) {
    return (
      <div className="flex w-full items-center justify-center border border-bg2 p-[1px] xl:h-[462px] 2xl:h-[625px]">
        <p className="text-2xl">
          <FormattedMessage id="invalidVideo" />
        </p>
      </div>
    )
  }

  return (
    <FullScreen
      handle={handle}
      className={
        'relative z-30 flex w-full items-center justify-center overflow-hidden border border-bg2'
      }
    >
      <div
        id="video-component"
        className={
          'flex w-full items-center justify-center p-[1px] ' + (className || '')
        }
      >
        <VideoJS
          key={videoData?.id}
          options={{
            controls: false,
            // responsive: true,
            preload: true,
            fluid: true,
            aspectRatio: '16:9',
            muted: true,
            ...videoOptions,
            autoplay: true,
          }}
          onReady={handlePlayerReady}
          onError={handlePlayerError}
        />
      </div>
      <div
        onMouseEnter={() => {
          setShowControls(true)
        }}
        onMouseLeave={() => {
          if (!player?.paused() && isLive && !metadata.ended) {
            setShowControls(false)
          }
        }}
      >
        {active && (
          <>
            <div
              className={
                ' absolute right-2 top-2 z-10 flex h-12 max-h-12 w-28 items-center justify-center'
              }
              style={{ height: 'calc(100% - 48px)' }}
            >
              <button
                className="btn h-12 w-12 rounded-full bg-bg2 p-2"
                onClick={() => {
                  setShareVideo(true)
                }}
              >
                <ShareFillIcon />
              </button>
            </div>
          </>
        )}
        {shareVideo && (
          <div className="absolute top-1/2 left-1/2 z-max flex h-[252px] w-[515px] -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-xl bg-black">
            <ShareContent
              onClose={() => {
                setShareVideo(false)
              }}
              shareUrl={videoData?.linkShare}
            />
          </div>
        )}

        <div
          className={
            'absolute inset-0 z-0 ' +
            (metadata.ended
              ? ''
              : (showControls || openSetting) && !metadata.error
              ? ' animate-fade-in '
              : ' animate-fade-out ') +
            (metadata.error ? 'hidden' : '')
          }
          onClick={(e) => {
            refCloseControl.current && clearTimeout(refCloseControl.current)
          }}
        >
          {wrapper && wrapper(metadata)}
          {/* Process Control Button */}
          {!metadata.ended && (
            <div
              onClick={onPlay}
              className={
                ' absolute left-0 top-0 bottom-12 right-0 flex h-full w-full items-center justify-center'
              }
            />
          )}

          {/* Bottom Controller*/}
          <div
            className={
              'absolute bottom-0 left-0 right-0 z-10 flex h-12 items-center px-4'
            }
            style={{
              background:
                'linear-gradient(180deg, rgba(0, 0, 0, 0) 16.67%, #000000 100%)',
            }}
          >
            {/*Pause or play*/}
            {metadata.ended ? (
              <button onClick={onReload} className="p-3">
                <RefreshIcon />
              </button>
            ) : (
              <button onClick={onPlay} className="p-3">
                {player?.player_ && player?.paused() ? (
                  <PlayIcon />
                ) : (
                  <PauseIcon id="pause-icon-video-box" />
                )}
              </button>
            )}

            {onForward && (
              <button
                disabled={onForward.disabled === true ? true : false}
                onClick={async () => {
                  if (active) {
                    await exit()
                  }
                  const timer = setTimeout(() => {
                    onForward.onClick && onForward.onClick()
                    clearTimeout(timer)
                  }, 500)
                }}
                className={
                  'p-3 disabled:cursor-default disabled:text-neutral-200'
                }
              >
                <SpeedArrowIcon />
              </button>
            )}
            {!isLive && (
              <>
                {/* 10s back*/}
                <button onClick={onFastBackward} className="p-3">
                  <FastBackwardIcon />
                </button>

                {/* 10s forward*/}
                <button onClick={onFastForward} className="p-3">
                  <FastForwardIcon />
                </button>
              </>
            )}
            {/* Volume controller*/}
            <VolumeBox
              value={metadata.volume}
              onChange={(e) => {
                player?.volume(e)
              }}
            />
            {/* Display live label*/}
            {isLive && (
              <div className="flex items-center rounded bg-red py-1 px-3 font-bold uppercase">
                <LiveIcon className={'scale-75'} />
                <FormattedMessage id="live" />
              </div>
            )}
            {/* Display currentTime*/}
            {!isLive && (
              <span>
                {currentTime}&nbsp;/&nbsp;
                {durationVideo}
              </span>
            )}
            <div className="flex-1" />
            {/* Setting */}
            <>
              <Popper
                open={openSetting}
                rootId="expand-content-player"
                setOpen={setOpenSetting}
                className={'p-3'}
                options={{ placement: 'top-end' }}
                wrapper={
                  <div
                    className={
                      'transition-all ' +
                      (openSetting ? 'rotate-45' : 'rotate-0')
                    }
                  >
                    <SettingFillIcon />
                  </div>
                }
                classNamePaper="z-50 mt-3 overflow-hidden"
              >
                <div className="rounded-md bg-bg2">
                  <SettingController qualityControlRef={qualityControl} />
                </div>
              </Popper>
            </>
            {!active && (
              <button
                className={'p-3'}
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch(setSpanViewPlayer())
                }}
              >
                <div>
                  <DirectionsIcon />
                </div>
              </button>
            )}

            {active ? (
              <button
                className="p-3"
                onClick={(e) => {
                  exit()
                }}
              >
                <SmallScreenIcon />
              </button>
            ) : (
              <button
                className="p-3"
                onClick={(e) => {
                  enter()
                }}
              >
                <FullscreenIcon />
              </button>
            )}
            {/* Process line bottom fullscreen*/}
            {!isLive && (
              <SliderRange
                min={0}
                max={dataVideo.duration || 100}
                values={[dataVideo.currentTime]}
                loadedTime={dataVideo.currentTime + dataVideo.loadedTime}
                onMouseDown={async () => {
                  prePaused.current = player?.paused()
                  !prePaused.current && player?.pause()
                }}
                onMouseUp={() => {
                  !prePaused.current &&
                    player?.play().catch((e) => {
                      /* error handler */
                      console.error(e)
                    })
                }}
                onChange={(value: number[]) => {
                  onTimeUpdate(value[0])
                }}
                className={
                  'range-sm absolute left-4 -top-3 right-4 flex h-6 cursor-pointer appearance-none items-center'
                }
                videoData={videoData}
              />
            )}
            {/* Fullscreen Controller*/}
          </div>
        </div>
      </div>
      <div id="expand-content-player" className="z-50" />
    </FullScreen>
  )
}

export default VideoBox
