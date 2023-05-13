import ProgressiveImg from '@common/components/ProgressiveImg'
import ShareModal from '@common/components/ShareModal'
import { PlayListObject, VideoObject } from '@common/constants'
import { CloseIcon, PlayIcon, RepeatIcon, ShuffleIcon } from '@public/icons'
import { MODE_PLAY } from '@utility/constant'
import { formatTimeVideo } from '@utility/helper'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { MODE_PLAYLIST } from '.'

interface Props {
  playlistInfo: PlayListObject
  listVideo: VideoObject[]
  onRemoveVideoOutofPlaylist: (value: VideoObject) => void
  episodeIndex: number
  setEpisodeIndex: (value: number) => void
  mode: MODE_PLAYLIST
  setMode: (value: MODE_PLAYLIST) => void
}

const ListVideoBox = (props: Props) => {
  const {
    listVideo,
    playlistInfo,
    episodeIndex,
    setEpisodeIndex,
    onRemoveVideoOutofPlaylist,
    mode,
    setMode,
  } = props

  const [openShare, setOpenShare] = useState(false)

  if (!listVideo.length) {
    return null
  }

  return (
    <>
      <div className="h-fit flex-col bg-bg2 pb-4">
        <div className="flex flex-col px-4 py-3">
          <p className="headline font-bold line-clamp-1">{playlistInfo.name}</p>
          <p className="mt-1 font-semibold text-neutral-400">
            {playlistInfo.channel?.name}&nbsp;•&nbsp;{episodeIndex + 1}/
            {playlistInfo.numVideo}
          </p>
        </div>
        <div className="divider "></div>
        <div className="item-center flex h-14 max-h-14 flex-1 p-4">
          <button
            className={mode === 'random' ? 'text-white' : 'text-neutral-200'}
            onClick={() => {
              setMode(mode === 'random' ? 'normal' : 'random')
              localStorage.setItem(
                MODE_PLAY,
                mode === 'random' ? 'normal' : 'random'
              )
            }}
          >
            <ShuffleIcon className="rotate-180" />
          </button>
          <button
            className={
              'ml-6 ' + (mode === 'loop' ? 'text-white' : 'text-neutral-200')
            }
            onClick={() => {
              setMode(mode === 'loop' ? 'normal' : 'loop')
              localStorage.setItem(
                MODE_PLAY,
                mode === 'loop' ? 'normal' : 'loop'
              )
            }}
          >
            <RepeatIcon />
          </button>
        </div>
        <div className="max flex flex-col overflow-auto">
          {listVideo?.map((item, index) => {
            return (
              <div
                key={item.id}
                className={
                  'flex cursor-pointer items-start justify-center py-1.5 hover:bg-neutral-100 ' +
                  (index === episodeIndex ? 'bg-neutral-100' : 'bg-bg2')
                }
                onClick={() => {
                  setEpisodeIndex(index)
                }}
              >
                <div className="self-center flex h-full w-10 items-center justify-center text-xs font-bold">
                  {episodeIndex === index ? (
                    <PlayIcon className="scale-50 text-neutral-400" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex h-full flex-1 items-center">
                  <div className="relative mr-3 flex h-full items-center rounded">
                    <ProgressiveImg
                      src={item.coverImage}
                      shape="rect_w"
                      alt="coverImage"
                      className="h-16 w-32 shrink-0 rounded"
                    />
                    <div className="caption1 absolute bottom-1 right-1 flex items-center justify-center rounded bg-black bg-opacity-60 p-1 text-xs">
                      {formatTimeVideo(item.duration)}
                    </div>
                  </div>
                  <div className="h-full flex-1">
                    <p className="caption1 font-bold  line-clamp-2">
                      {item.name}
                    </p>
                    <p className="caption1 font-medium text-neutral-500 line-clamp-2">
                      {item.playTimes}&nbsp;
                      <FormattedMessage id="viewNumber" />
                    </p>
                  </div>
                </div>
                <button
                  className="p-3 pt-0"
                  onClick={() => onRemoveVideoOutofPlaylist(item)}
                >
                  <CloseIcon />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <ShareModal
        open={openShare}
        onClose={setOpenShare}
        shareUrl={listVideo?.[episodeIndex]?.linkShare}
      />
    </>
  )
}

export default ListVideoBox
