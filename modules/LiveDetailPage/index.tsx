import FollowBox from '@common/components/FollowBox'
import VideoBox from '@common/components/VideoBox'
import { some, VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import useGetLinkVideo from '@common/hook/useGetLinkVideo'
import MenuCategories from '@modules/HomePage/MenuCategories'
import RelativeVideoBox from '@modules/VideoDetailPage/RelativeVideoBox'
import { loadChatAccess } from '@redux/commonReducer'
import { AppState } from '@redux/store'
import { API_PATHS } from '@utility/API_PATH'
import Head from 'next/head'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import useSWRInfinite from 'swr/infinite'
import ActionBoxLive from './ActionBoxLive'
import LiveCommentBoxWeb from './LiveCommentBoxWeb'
import LiveCommentBoxWebNoAuth from './LiveCommentBoxWebNoAuth'

interface Props {
  dataVideoSSR: VideoObject | any
  dataRelatedVideoSSR: some[]
  dataCategoriesSSR: some[]
}

const LiveDetailPage = (props: Props) => {
  const { dataVideoSSR, dataRelatedVideoSSR, dataCategoriesSSR } = props
  const { dispatch, router, isLogin } = useGeneralHook()
  const spanViewPlayer = useSelector(
    (state: AppState) => state.common.spanViewPlayer
  )
  const { query } = router
  const videoId = query?.id as any
  const { url, loading } = useGetLinkVideo({ videoId, isLive: true })
  const [openDesc, setOpenDesc] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [showFormChat, setShowFormChat] = useState(true)
  const refLayout1 = useRef<any>(null)
  const refLayout2 = useRef<any>(null)

  const {
    data: dataRelatedVideoCSR = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index, previousPageData) => {
      if (dataRelatedVideoSSR.length < 12) return null
      if (index > 0 && previousPageData && !previousPageData.length) return null

      return dataVideoSSR?.channel?.id
        ? API_PATHS.videos.index({
            page_size: 12,
            page_token: index + 1,
            filter: `CHANNEL_${dataVideoSSR?.channel?.id},LATEST`,
          })
        : null
    },
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    { revalidateAll: false, revalidateFirstPage: false }
  )

  const mappedDataRelatedVideo = useMemo(() => {
    return dataRelatedVideoCSR
      .filter(Boolean)
      ?.reduce((v, c) => [...v, ...c], dataRelatedVideoSSR)
  }, [dataRelatedVideoCSR, dataRelatedVideoSSR])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 290 * 2 &&
        !isValidating
      ) {
        setSize(size + 1)
      }
    },
    [isValidating, setSize, size]
  )

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  useEffect(() => {
    dispatch(loadChatAccess())
  }, [dispatch, isLogin])

  const renderDescriptionLive = useMemo(
    () => (
      <div className="flex-1">
        <div className="mt-2">
          <p className="text-xl font-semibold line-clamp-1">
            {dataVideoSSR?.name}
          </p>
        </div>
        <div className="mt-4 flex justify-between">
          <p className="opacity-60">
            {Number(viewCount) > 0 && (
              <>
                {viewCount} <FormattedMessage id="peopleWatching" />
                &nbsp;•&nbsp;
              </>
            )}
            {dataVideoSSR?.publishedTime}
          </p>
          <ActionBoxLive data={dataVideoSSR} />
        </div>
        <div className="mt-3 h-[1px] w-full bg-white opacity-10"></div>
        <FollowBox channelData={dataVideoSSR?.channel} />
        <div className={`w-[730px] min-w-[730px] max-w-[730px] text-justify `}>
          {openDesc ? (
            <div className={`mt-3 text-sm text-neutral-500`}>
              {dataVideoSSR?.description}
            </div>
          ) : (
            <div className={`mt-3 text-sm text-neutral-500 line-clamp-3`}>
              {dataVideoSSR?.description}
            </div>
          )}
        </div>
        {dataVideoSSR.description && dataVideoSSR.description.length > 445 && (
          <div className="mt-1">
            <button
              className="text-sm uppercase text-neutral-300"
              onClick={() => setOpenDesc(!openDesc)}
            >
              <FormattedMessage id={!openDesc ? 'showMore' : 'showLess'} />
            </button>
          </div>
        )}
      </div>
    ),
    [dataVideoSSR, openDesc, viewCount]
  )

  const renderRelativeVideoBox = useMemo(
    () => (
      <RelativeVideoBox
        data={mappedDataRelatedVideo}
        loading={isValidating}
        size={size}
        title={<FormattedMessage id="relatedVideos" />}
      />
    ),
    [isValidating, mappedDataRelatedVideo, size]
  )

  if (!videoId) {
    return null
  }

  return (
    <>
      <Head>
        <title>{dataVideoSSR?.name}</title>
      </Head>
      <MenuCategories listCategory={dataCategoriesSSR} />
      <div className="container mt-6 mb-5">
        <div className="flex">
          <div className="flex-1">
            <VideoBox
              loading={loading}
              videoOptions={{
                sources: url,
                poster: dataVideoSSR.coverImage || '/icons/default_video.svg',
                autoplay: true,
              }}
              videoData={dataVideoSSR}
              isLive={true}
            />
            <div className="mt-6 flex">
              {renderDescriptionLive}
              <div
                ref={refLayout1}
                className={spanViewPlayer ? 'ml-5 w-[356px]' : ''}
              />
            </div>
          </div>
          <div
            ref={refLayout2}
            className={!spanViewPlayer ? 'ml-5 w-[356px]' : ''}
          />
        </div>
      </div>
      {refLayout1.current &&
        refLayout2.current &&
        createPortal(
          <>
            <div
              className="w-full border border-neutral-100"
              style={{ height: showFormChat ? 636 : 64 }}
            >
              {isLogin ? (
                <LiveCommentBoxWeb
                  showFormChat={showFormChat}
                  setShowFormChat={setShowFormChat}
                  liveData={dataVideoSSR}
                  total={dataVideoSSR.commentCount}
                  setViewCount={setViewCount}
                />
              ) : (
                <LiveCommentBoxWebNoAuth
                  showFormChat={showFormChat}
                  setShowFormChat={setShowFormChat}
                  liveData={dataVideoSSR}
                  total={dataVideoSSR.commentCount}
                  setViewCount={setViewCount}
                />
              )}
            </div>
            {mappedDataRelatedVideo.length > 0 && (
              <div className="mt-9">{renderRelativeVideoBox}</div>
            )}
          </>,
          spanViewPlayer ? refLayout1.current : refLayout2.current
        )}
    </>
  )
}

export default LiveDetailPage
