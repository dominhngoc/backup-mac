import ActionBox from '@common/components/ActionBox'
import CommentsBox from '@common/components/CommentsBox'
import FollowBox from '@common/components/FollowBox'
import ShareModal from '@common/components/ShareModal'
import VideoBox from '@common/components/VideoBox'
import { some, VideoObject } from '@common/constants'
import useGetLinkVideo from '@common/hook/useGetLinkVideo'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { AppState } from '@redux/store'
import Head from 'next/head'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import EpisodeBox from './EpisodeBox'
interface Props {
  dataFilmSSR: some
  listFilmSSR: VideoObject[]
  dataRelatedVideoSSR: some[]
  dataCategorySSR: some[]
}

const MoviesDetailPage = (props: Props) => {
  const { dataFilmSSR = {}, listFilmSSR = [], dataCategorySSR = [] } = props
  const spanViewPlayer = useSelector(
    (state: AppState) => state.common.spanViewPlayer,
    shallowEqual
  )

  const [episodeIndex, setEpisodeIndex] = useState(0)
  const currentEpisode = listFilmSSR?.[episodeIndex]
  const [openShare, setOpenShare] = useState(false)
  const [openDesc, setOpenDesc] = useState(false)
  const { url, loading } = useGetLinkVideo({ videoId: currentEpisode?.id })
  const refLayout1 = useRef<any>(null)
  const refLayout2 = useRef<any>(null)
  const renderComment = () => (
    <>
      <div className="">
        <div className="mt-7  justify-between">
          <p className="text-xl font-semibold line-clamp-1">
            {currentEpisode?.name}
          </p>
        </div>
        <div className="mt-5 flex justify-between ">
          <div className="flex text-neutral-500">
            <p className="mr-2">
              {currentEpisode?.playTimes}
              &nbsp;
              <FormattedMessage id="viewNumber" />
            </p>
            <p className="mr-2">•</p>
            <p className="mr-2">{currentEpisode?.publishedTime}</p>
          </div>
          <ActionBox data={currentEpisode} setOpenShare={setOpenShare} />
        </div>

        <div className="divider mt-2" />
        <FollowBox channelData={dataFilmSSR?.channel} />
        <div className={`max-w-[730px] text-justify `}>
          {openDesc ? (
            <div className={`mt-3 text-sm text-neutral-500 line-clamp-2`}>
              {dataFilmSSR?.description}
            </div>
          ) : (
            <div className={`mt-3 text-sm text-neutral-500 line-clamp-3`}>
              {dataFilmSSR?.description}
            </div>
          )}
        </div>
        {dataFilmSSR.description && dataFilmSSR.description.length > 351 && (
          <div className="mt-1">
            <button
              className="text-sm uppercase text-neutral-300"
              onClick={() => setOpenDesc(!openDesc)}
            >
              <FormattedMessage id={openDesc ? 'showMore' : 'showLess'} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-8  rounded-2xl  bg-bg2 px-4">
        <CommentsBox
          type="PLAYLIST"
          contentId={dataFilmSSR?.id}
          total={currentEpisode?.commentCount}
        />
      </div>
      <ShareModal
        open={openShare}
        onClose={() => {
          setOpenShare(false)
        }}
        shareUrl={currentEpisode?.linkShare}
      />
    </>
  )

  return (
    <>
      <Head>
        <title>{dataFilmSSR?.name}</title>
      </Head>
      <MenuCategories hasDivider={true} listCategory={dataCategorySSR} />
      <div className="container mt-6 mb-5">
        <div className="flex">
          <div className="flex-1">
            <VideoBox
              onEnded={() => {
                if (episodeIndex >= listFilmSSR.length - 1) {
                  return
                }
                setEpisodeIndex(episodeIndex + 1)
              }}
              onBackward={{
                onClick: () => {
                  setEpisodeIndex(episodeIndex - 1)
                },
                disabled: listFilmSSR.length === 0 || episodeIndex === 0,
              }}
              onForward={{
                onClick: () => {
                  setEpisodeIndex(episodeIndex + 1)
                },
                disabled: episodeIndex >= listFilmSSR.length - 1,
              }}
              loading={loading}
              videoData={{
                ...currentEpisode,
                filmChannel: dataFilmSSR?.channel,
              }}
              videoOptions={{
                sources: url,
                autoplay: true,
                poster:
                  currentEpisode?.coverImage || '/icons/default_video.svg',
              }}
            />
            <div className="mt-6 flex">
              <div className="flex-1">{renderComment()}</div>
              <div
                ref={refLayout1}
                className={spanViewPlayer ? 'ml-5 h-[756px] w-[360px]' : ''}
              />
            </div>
          </div>
          <div
            ref={refLayout2}
            className={!spanViewPlayer ? 'ml-5 h-[756px] w-[360px]' : ''}
          />
        </div>
      </div>
      {refLayout1.current &&
        refLayout2.current &&
        createPortal(
          <EpisodeBox
            dataFilmSSR={dataFilmSSR}
            listFilmSSR={listFilmSSR}
            episodeIndex={episodeIndex}
            setEpisodeIndex={setEpisodeIndex}
          />,
          spanViewPlayer ? refLayout1.current : refLayout2.current
        )}
    </>
  )
}

export default MoviesDetailPage
