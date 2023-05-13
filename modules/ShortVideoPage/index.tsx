import ModalFullScreen from '@common/components/ModalFullScreen'
import Redirect from '@common/components/Redirect'
import ShareModal from '@common/components/ShareModal'
import VideoOptionPoper from '@common/components/VideoOptionPoper'
import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import useGetLinkVideo from '@common/hook/useGetLinkVideo'
import { FILTER_TYPE } from '@modules/SearchPage/constant'
import ShortVideoBox from '@modules/ShortVideoPage/ShortVideoBox'
import VolumeBox from '@modules/ShortVideoPage/VolumeBox'
import { CloseFillIcon, DownArrow, MoreIcon, UpArrow } from '@public/icons'
import { AppState } from '@redux/store'
import { API_PATHS } from '@utility/API_PATH'
import { SHORT_SLIDE_INDEX, SHORT_SLIDE_PAGE } from '@utility/constant'
import { FilterSearch } from 'pages/search'
import { useEffect, useMemo, useRef, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import useSWRInfinite from 'swr/infinite'
import ChannelFollow from './ChannelFollow'
import VideoDescription from './VideoDescription'
export interface MetaDataShort {
  volume: number
  playing: boolean
}

interface Props {}
const ShortVideoPage = (props: Props) => {
  const { dispatch, router, isLogin } = useGeneralHook()
  const { query } = router
  const {
    param = 'HOT',
    id,
    slideIndex = param === 'RECOMMEND_FOLLOW'
      ? ''
      : localStorage.getItem(SHORT_SLIDE_INDEX),
    pageSize = param === 'RECOMMEND_FOLLOW'
      ? ''
      : localStorage.getItem(SHORT_SLIDE_PAGE),
  } = query
  const [open, setOpen] = useState(false)

  const pageSizeSlide = useRef<number>(Number((pageSize as string) || 0))
  const currentSlide = useRef<number>(Number((slideIndex as string) || 0))

  const [indexSlide, setIndex] = useState(currentSlide.current % 12)
  const [action, setAction] = useState<
    'message' | 'share' | 'more' | undefined
  >(undefined)
  const ref = useRef<any>()

  const {
    data: listVideo = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) => {
      if (query.type === 'search') {
        const filterObj: FilterSearch = {
          term: query.term ? (query.term as string) : '',
          sort: query.sort ? (query.sort as string) : '',
          type: query.type ? (query.type as string) : '',
          time: query.time ? (query.time as string) : '',
          duration: query.duration ? (query.duration as string) : '',
        }
        return API_PATHS.search.index({
          query: filterObj.term,
          type: FILTER_TYPE.SHORT,
          page_token: pageSizeSlide.current + index,
          page_size: 12,
          filter: [
            filterObj.duration?.split(',')[0],
            filterObj.duration?.split(',')[1],
            filterObj.sort,
            filterObj.time,
          ].filter(Boolean),
        })
      }
      if (query.type === 'channel' && query.channelId) {
        return API_PATHS.channel.short({
          page_token: pageSizeSlide.current + index,
          page_size: 12,
          filter: [`CHANNEL_${query.channelId}`, query.filter].filter(Boolean),
        })
      }

      if (query.type === 'hashtag') {
        return API_PATHS.shorts.getListByTag({
          hashtag: query.hashtag,
          page_token: pageSizeSlide.current + index,
          page_size: 12,
        })
      }
      return isLogin || param !== 'RECOMMEND_FOLLOW'
        ? API_PATHS.shorts.list({
            page_token: pageSizeSlide.current + index,
            page_size: 12,
            filter: id ? `IDS_${id}` : isLogin ? param : 'HOT',
          })
        : null
    },
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateOnFocus: false,
      revalidateFirstPage: false,
      revalidateOnMount: true,
    }
  )

  const mappedData = useMemo(() => {
    return listVideo.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [listVideo])

  const currentData = mappedData[indexSlide]
  const nextData = mappedData[indexSlide + 1]
  const { url } = useGetLinkVideo({
    videoId: currentData?.id,
    optionsSWR: { refreshInterval: 60000 },
  })
  useGetLinkVideo({
    videoId: nextData?.id,
    optionsSWR: { refreshInterval: 60000 },
  })

  const [swiper, setSwiper] = useState<any>(null)
  const { metadata, player } = useSelector(
    (state: AppState) => state.shortVideo,
    shallowEqual
  )

  useEffect(() => {
    if (currentSlide?.current % 12 === 11) {
      setSize(2)
    } else {
      setSize(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param])

  const hanldeOnForward = () => {
    if (swiper) {
      swiper.slideNext()
    }
  }
  const hanldeOnBackward = () => {
    if (swiper) {
      swiper.slidePrev()
    }
  }

  const renderVolumeBox = () => {
    return (
      <VolumeBox
        mute={player && player.player_ && player.muted()}
        onChange={(mute) => {
          localStorage.setItem('SHORT_MUTED', `${mute}`)
          player && player.player_ && player.muted(mute)
        }}
      />
    )
  }
  const renderForward = () => {
    if (mappedData % 12 !== 12 && indexSlide === mappedData.length - 1) {
      return null
    }
    return (
      <button
        className="mt-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white bg-opacity-10 disabled:text-neutral-200"
        onClick={hanldeOnForward}
      >
        <DownArrow className="w- h-3" />
      </button>
    )
  }

  const renderBackward = () => {
    return (
      <>
        {indexSlide > 0 && (
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white bg-opacity-10 disabled:text-neutral-200"
            onClick={hanldeOnBackward}
          >
            <UpArrow />
          </button>
        )}
      </>
    )
  }
  const renderMoreOption = () => {
    return (
      <VideoOptionPoper
        className="mb-8 flex shrink-0 rotate-90 items-center justify-center rounded-full bg-white bg-opacity-10 disabled:text-neutral-200 md:mb-5 md:h-10 md:w-10 2xl:h-12 2xl:w-12"
        wrapper={<MoreIcon className="scale-150" />}
        classNamePaper="w-72"
        videoData={currentData}
        isShortCard={true}
      />
    )
  }

  const renderSwiper = () => {
    if (open) {
      return (
        <div>
          <Swiper
            initialSlide={indexSlide}
            direction={'vertical'}
            noSwiping
            noSwipingClass="swiper-slide"
            className="absolute inset-0 z-10 h-full rounded-none"
            modules={[Mousewheel, Keyboard]}
            mousewheel
            keyboard={{
              enabled: true,
            }}
            onSlideChange={(e) => {
              setIndex(e.activeIndex)
            }}
            touchRatio={0}
            onDoubleTap={(_, event) => {}}
            onSwiper={(s: any) => {
              setSwiper(s)
            }}
            onReachEnd={() => {
              setSize(size + 1)
            }}
          >
            {listVideo.map((value, sizeTmp) => {
              return value?.map((item: VideoObject, slideIndex) => {
                const pageSizeTmp = pageSizeSlide.current + sizeTmp
                return (
                  <SwiperSlide
                    key={item.id}
                    virtualIndex={sizeTmp * 12 + slideIndex}
                    className="relative rounded-none"
                  >
                    <div className={`h-full w-auto`}>
                      <ShortVideoBox
                        data={item}
                        src={url}
                        isModalMode
                        query={{
                          current: {
                            pageSize: pageSizeTmp,
                            slideIndex,
                          },
                          next:
                            slideIndex === value.length - 1
                              ? { pageSize: pageSizeTmp + 1, slideIndex: 0 }
                              : {
                                  pageSize: pageSizeTmp,
                                  slideIndex: slideIndex + 1,
                                },
                        }}
                      />
                    </div>
                  </SwiperSlide>
                )
              })
            })}
          </Swiper>
        </div>
      )
    } else {
      return null
    }
  }

  if (!!id && !mappedData.length && !isValidating) {
    return <Redirect />
  }

  if (
    param === 'RECOMMEND_FOLLOW' &&
    (isLogin ? !mappedData?.length && !isValidating : true)
  ) {
    return <ChannelFollow />
  }

  return (
    <>
      <div
        className="relative mx-auto flex flex-1 justify-center overflow-y-auto px-6 h-screen-head"
        ref={ref}
        id="short-list-scroll-wheel"
      >
        {!open && (
          <Swiper
            initialSlide={indexSlide}
            direction={'vertical'}
            noSwiping
            noSwipingClass="swiper-slide"
            slidesPerView={1.1}
            spaceBetween={20}
            className="absolute inset-0 z-10 h-full w-auto"
            modules={[Mousewheel, Keyboard]}
            mousewheel
            keyboard={{
              enabled: true,
            }}
            onSlideChange={(e) => {
              setIndex(e.activeIndex)
            }}
            onReachEnd={() => {
              setSize(size + 1)
            }}
            touchRatio={0}
            onDoubleTap={(_, event) => {}}
            onSwiper={setSwiper}
          >
            {listVideo.map((value, sizeTmp) => {
              return value?.map((item: VideoObject, slideIndex) => {
                const pageSizeTmp = pageSizeSlide.current + sizeTmp
                return (
                  <SwiperSlide
                    key={item.id}
                    virtualIndex={sizeTmp * 12 + slideIndex}
                    className="relative"
                  >
                    <ShortVideoBox
                      data={item}
                      src={url}
                      videoOnClick={() => {}}
                      setOpenComment={() => {
                        setOpen(true)
                      }}
                      onClickCommentBox={() => {
                        setOpen(true)
                      }}
                      query={{
                        current: {
                          pageSize: pageSizeTmp,
                          slideIndex,
                        },
                        next:
                          slideIndex === value.length - 1
                            ? { pageSize: pageSizeTmp + 1, slideIndex: 0 }
                            : {
                                pageSize: pageSizeTmp,
                                slideIndex: slideIndex + 1,
                              },
                      }}
                    />
                  </SwiperSlide>
                )
              })
            })}
          </Swiper>
        )}
      </div>
      <ModalFullScreen open={open} onClose={() => setOpen(false)}>
        <div className="h-full w-full overflow-hidden">
          <button
            className="absolute top-0 left-0 z-10 flex shrink-0 items-center justify-center rounded-full bg-white bg-opacity-10 text-white disabled:text-neutral-200 md:mt-2 md:ml-2 md:h-10 md:w-10 xl:mt-6 xl:ml-8 2xl:h-12 2xl:w-12"
            onClick={() => setOpen(false)}
          >
            <CloseFillIcon />
          </button>
          <div className=" max flex h-screen w-screen">
            <div className="flex h-screen flex-1 justify-between bg-black">
              <div className="flex flex-1 justify-center">{renderSwiper()}</div>
              <div className="z-10 flex h-full flex-col items-center justify-between p-4">
                {/* *************************************** || volumne || *************************************** */}
                <div>{renderVolumeBox()}</div>
                {/* *************************************** || next/prev || *************************************** */}
                <div className="flex flex-col">
                  <div>{renderBackward()}</div>
                  <div>{renderForward()}</div>
                </div>
                {/* *************************************** || more || *************************************** */}
                <div className="ml-3">{renderMoreOption()}</div>
              </div>
            </div>
            <div className="flex h-screen w-2/5 flex-col px-6 pb-2 md:px-12">
              <VideoDescription videoData={currentData} />
            </div>
          </div>
        </div>
      </ModalFullScreen>
      <ShareModal
        open={action === 'share'}
        onClose={() => setAction(undefined)}
        shareUrl={currentData?.linkShare}
      />
    </>
  )
}

export default ShortVideoPage
