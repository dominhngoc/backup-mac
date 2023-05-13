import api from '@common/api'
import ActionBox from '@common/components/ActionBox'
import CommentsBox from '@common/components/CommentsBox'
import FollowBox from '@common/components/FollowBox'
import ShareModal from '@common/components/ShareModal'
import VideoBox from '@common/components/VideoBox'
import { some, VideoObject } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import useGetLinkVideo from '@common/hook/useGetLinkVideo'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { AppState } from '@redux/store'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import useSWRInfinite from 'swr/infinite'
import EndedWrapperVideoBox from '../../common/components/VideoBox/EndedWrapperVideoBox'
import RelativeVideoBox from './RelativeVideoBox'
import { createPortal } from 'react-dom'
import Head from 'next/head'
interface Props {
  dataVideoSSR: VideoObject
  dataRelatedVideoSSR: some[]
  dataCategorySSR: some[]
}

const VideoDetailPage = (props: Props) => {
  const { dataVideoSSR, dataRelatedVideoSSR, dataCategorySSR } = props
  const { router } = useGeneralHook()
  const spanViewPlayer = useSelector(
    (state: AppState) => state.common.spanViewPlayer,
    shallowEqual
  )
  const { query, pathname } = router
  const videoId = query?.id as any
  const { url, loading } = useGetLinkVideo({ videoId })
  const [openShare, setOpenShare] = useState(false)
  const [openDesc, setOpenDesc] = useState(false)
  const refLayout1 = useRef<any>(null)
  const refLayout2 = useRef<any>(null)
  const {
    data: dataRelatedVideoCSR = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      dataVideoSSR
        ? API_PATHS.videos.related({
            page_size: 12,
            page_token: index + 1,
            id: dataVideoSSR?.id,
            channel_id: dataVideoSSR?.channel?.id,
            category_id: dataVideoSSR?.categoryId,
          })
        : null,
    async (url) => {
      const json = await api({ url, method: 'get' })
      return json?.data?.data?.[0]?.contents
    },
    { revalidateAll: false, revalidateFirstPage: false }
  )
  const mappedDataRelatedVideo = useMemo(() => {
    return dataRelatedVideoCSR?.reduce(
      (v, c) => [...v, ...c],
      dataRelatedVideoSSR
    )
  }, [dataRelatedVideoCSR, dataRelatedVideoSSR])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 290 * 2 &&
        dataRelatedVideoSSR.length > 0 &&
        !isValidating &&
        dataRelatedVideoCSR?.every((item) => item.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [dataRelatedVideoCSR, dataRelatedVideoSSR, isValidating, setSize, size]
  )

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  const renderComment = useCallback(
    () => (
      <>
        <div className="">
          <div className="justify-between">
            <p className="text-xl font-semibold line-clamp-1">
              {dataVideoSSR?.name}
            </p>
          </div>
          <div className="mt-5 flex justify-between">
            <div className="flex text-neutral-500">
              <p className="mr-2">
                {dataVideoSSR?.playTimes}
                &nbsp;
                <FormattedMessage id="viewNumber" />
              </p>
              <p className="mr-2">•</p>
              <p className="mr-2">{dataVideoSSR?.publishedTime}</p>
            </div>
            <ActionBox data={dataVideoSSR} setOpenShare={setOpenShare} />
          </div>

          <div className="divider mt-2" />
          <FollowBox channelData={dataVideoSSR?.channel} />
          <div className={`max-w-[730px] text-justify `}>
            <div
              className={`mt-3 text-sm text-neutral-500 line-clamp-${
                openDesc ? 999999 : 3
              } `}
            >
              {dataVideoSSR?.description}
            </div>
          </div>
          {dataVideoSSR.description && dataVideoSSR.description.length > 400 && (
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

        <div className="mt-8 rounded-2xl bg-bg2 px-4">
          <CommentsBox
            type="PLAYLIST"
            contentId={dataVideoSSR?.id}
            total={dataVideoSSR.commentCount}
          />
        </div>
        {openShare && (
          <ShareModal
            open={openShare}
            onClose={() => {
              setOpenShare(false)
            }}
            shareUrl={dataVideoSSR?.linkShare}
          />
        )}
      </>
    ),
    [dataVideoSSR, openDesc, openShare]
  )

  if (!videoId || pathname === ROUTES.live.index) {
    return null
  }

  return (
    <>
      <Head>
        <title>{dataVideoSSR.name}</title>
      </Head>
      <MenuCategories hasDivider={true} listCategory={dataCategorySSR} />
      <div className="container mt-6 mb-5">
        <div className="flex">
          <div className="flex-1">
            <VideoBox
              key={'videoBox'}
              onBackward={{}}
              onForward={{
                onClick: () => {
                  const video = dataRelatedVideoSSR[0]
                  router.push({
                    pathname: ROUTES.home + `/video/${video.id}/${video.slug}`,
                  })
                },
              }}
              wrapper={(metadata) =>
                metadata.ended && (
                  <EndedWrapperVideoBox listVideo={mappedDataRelatedVideo} />
                )
              }
              videoData={dataVideoSSR}
              videoOptions={{
                sources: url,
                autoplay: true,
                poster: dataVideoSSR?.coverImage || '/icons/default_video.svg',
              }}
              loading={loading}
            />
            <div className="mt-6 flex">
              <div className="flex-1">{renderComment()}</div>
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
          <RelativeVideoBox
            data={mappedDataRelatedVideo}
            loading={isValidating}
            size={size}
            className="w-full"
          />,
          spanViewPlayer ? refLayout1.current : refLayout2.current
        )}
    </>
  )
}

export default VideoDetailPage
