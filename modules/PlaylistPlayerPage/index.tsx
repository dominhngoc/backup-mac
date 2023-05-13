import ActionBox from '@common/components/ActionBox'
import CommentsBox from '@common/components/CommentsBox'
import FollowBox from '@common/components/FollowBox'
import ShareModal from '@common/components/ShareModal'
import VideoBox from '@common/components/VideoBox'
import { PlayListObject, some, VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import useGetLinkVideo from '@common/hook/useGetLinkVideo'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { AppState } from '@redux/store'
import { API_PATHS } from '@utility/API_PATH'
import { MODE_PLAY } from '@utility/constant'
import { getRandomIndex } from '@utility/helper'
import Head from 'next/head'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import ListVideoBox from './ListVideoBox'

interface Props {
  playlistInfo: PlayListObject
  listVideoSSR: VideoObject[]
  dataRelatedVideoSSR: some[]
  dataCategorySSR: some[]
}

export type MODE_PLAYLIST = 'normal' | 'random' | 'loop'

const PlaylistPlayerPage = (props: Props) => {
  const { dataCategorySSR, listVideoSSR, playlistInfo } = props
  const { dispatch, confirmDialog, intl, isLogin, setMessage } =
    useGeneralHook()

  const spanViewPlayer = useSelector(
    (state: AppState) => state.common.spanViewPlayer,
    shallowEqual
  )
  const player = useSelector(
    (state: AppState) => state.videoPlayer.player,
    shallowEqual
  )

  const { promptConfirmation, close } = confirmDialog

  const [episodeIndex, setEpisodeIndex] = useState(
    localStorage.getItem(MODE_PLAY) === 'random'
      ? getRandomIndex([], listVideoSSR.length - 1)
      : 0
  )
  const [mode, setMode] = useState<MODE_PLAYLIST>(
    (localStorage.getItem(MODE_PLAY) as MODE_PLAYLIST) || 'normal'
  )
  const [deletedVideo, setDeletedVideo] = useState<number[]>([])
  const currentEpisode = listVideoSSR?.[episodeIndex]
  const [openShare, setOpenShare] = useState(false)
  const [openDesc, setOpenDesc] = useState(false)
  const refLayout1 = useRef<any>(null)
  const refLayout2 = useRef<any>(null)

  const { url, loading } = useGetLinkVideo({ videoId: currentEpisode?.id })

  const onRemoveVideoOutofPlaylist = useCallback(
    async (value: VideoObject) => {
      if (isLogin) {
        const confirm = await promptConfirmation({
          warning: true,
          title: intl.formatMessage({ id: 'deleteVideoPlaylistTitle' }),
          message: (
            <>
              <FormattedMessage
                id="deleteConfirm"
                values={{
                  name: <strong className="text-white">{value?.name}</strong>,
                }}
              />
              <br />
              <FormattedMessage id="noteDelete" />
            </>
          ),
          okText: 'deleteVideo',
        })
        if (confirm) {
          try {
            const json = await dispatch(
              fetchThunk(
                {
                  url: API_PATHS.playlists.toggleVideo,
                  method: 'POST',
                  data: {
                    id: playlistInfo?.id,
                    status: 0,
                    video_id: value?.id,
                  },
                },
                true
              )
            )
            setMessage({ message: json.data?.message })
            if (json.status === 200) {
              setDeletedVideo((old) => [...old, value.id])
              if (value.id === currentEpisode?.id) {
                setEpisodeIndex(0)
              }
            }
          } catch (e: any) {
            setMessage({ message: e.response?.data?.message })
          }
        }
        close()
      } else {
        dispatch(setOpenLoginDialog(true))
      }
    },
    [
      isLogin,
      promptConfirmation,
      intl,
      close,
      dispatch,
      playlistInfo?.id,
      setMessage,
      currentEpisode?.id,
    ]
  )

  const renderComment = () => (
    <>
      <div className="">
        <div className="mt-7  justify-between">
          {/* <div className="mb-2">
            <p className="text-xs font-bold text-primary">
              #1 TRONG DANH MỤC ÂM NHẠC THỊNH HÀNH
            </p>
          </div> */}
          <p className="font-semibold headline">{currentEpisode?.name}</p>
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
        <FollowBox channelData={currentEpisode?.channel} />
        <div className={`max-w-[730px] text-justify `}>
          {openDesc ? (
            <div className={`mt-3 text-sm text-neutral-500`}>
              {currentEpisode?.description}
            </div>
          ) : (
            <div className={`mt-3 text-sm text-neutral-500 line-clamp-3`}>
              {currentEpisode?.description}
            </div>
          )}
        </div>
        {currentEpisode?.description &&
          currentEpisode?.description.length > 351 && (
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
      <div className="mt-8  rounded-2xl  bg-bg2 px-4">
        <CommentsBox
          type="PLAYLIST"
          contentId={playlistInfo?.id}
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

  useEffect(() => {
    if (player?.play_) {
      player?.loop(mode === 'loop')
    }
  }, [mode, player])

  return (
    <>
      <Head>
        <title>{playlistInfo?.name}</title>
      </Head>
      <MenuCategories hasDivider={true} listCategory={dataCategorySSR} />
      <div className="container mt-6 mb-5">
        <div className="flex">
          <div className="flex-1">
            <VideoBox
              onEnded={() => {
                if (episodeIndex >= listVideoSSR.length - 1) {
                  return
                }
                setEpisodeIndex(episodeIndex + 1)
              }}
              onBackward={{
                onClick: () => {
                  setEpisodeIndex(episodeIndex - 1)
                },
                disabled: listVideoSSR.length === 0 || episodeIndex === 0,
              }}
              onForward={{
                onClick: () => {
                  setEpisodeIndex(episodeIndex + 1)
                },
                disabled: episodeIndex >= listVideoSSR.length - 1,
              }}
              loading={loading}
              videoData={currentEpisode}
              videoOptions={{
                sources: url,
                autoplay: true,
                poster:
                  currentEpisode?.coverImage || '/icons/default_video.svg',
              }}
              playerReady={(player) => {
                player.on('ended', () => {
                  const modeTmp = localStorage.getItem(
                    MODE_PLAY
                  ) as MODE_PLAYLIST
                  if (modeTmp === 'random') {
                    setEpisodeIndex((old) => {
                      return getRandomIndex([old], listVideoSSR?.length - 1)
                    })
                  }
                })
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
          <ListVideoBox
            playlistInfo={playlistInfo}
            listVideo={listVideoSSR.filter((v) => !deletedVideo.includes(v.id))}
            episodeIndex={episodeIndex}
            setEpisodeIndex={setEpisodeIndex}
            onRemoveVideoOutofPlaylist={onRemoveVideoOutofPlaylist}
            mode={mode}
            setMode={setMode}
          />,
          spanViewPlayer ? refLayout1.current : refLayout2.current
        )}
    </>
  )
}

export default PlaylistPlayerPage
