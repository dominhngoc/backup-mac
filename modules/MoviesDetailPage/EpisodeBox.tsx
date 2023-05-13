import ProgressiveImg from '@common/components/ProgressiveImg'
import ShareModal from '@common/components/ShareModal'
import { some, VideoObject } from '@common/constants'
import { PlayIcon, SpeedArrowIcon } from '@public/icons'
import { formatTimeVideo } from '@utility/helper'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  dataFilmSSR: some
  listFilmSSR: VideoObject[]
  episodeIndex: number
  setEpisodeIndex: (value: number) => void
}

const EpisodeBox = (props: Props) => {
  const { dataFilmSSR, listFilmSSR, episodeIndex, setEpisodeIndex } = props
  const [openShare, setOpenShare] = useState(false)

  return (
    <>
      <div className="flex h-12 max-h-12 items-center rounded-lg bg-bg2 px-4">
        <p className="flex-1 font-bold caption1">{dataFilmSSR.name}</p>
        <p className="ml-4 font-bold text-neutral-500 caption1">
          <FormattedMessage id="episode" /> {episodeIndex + 1}/
          {dataFilmSSR.numVideo}
        </p>
      </div>
      <div className="divider "></div>
      <div className="item-center flex bg-bg2 p-4">
        <button
          className={
            episodeIndex === 0 ? 'mr-6 text-neutral-200' : 'mr-6 text-white'
          }
          disabled={episodeIndex === 0}
          onClick={() => {
            setEpisodeIndex(episodeIndex - 1)
          }}
        >
          <SpeedArrowIcon className="rotate-180" />
        </button>
        <button
          className={
            episodeIndex === listFilmSSR?.length - 1
              ? 'text-neutral-200'
              : 'text-white'
          }
          disabled={episodeIndex === listFilmSSR?.length - 1}
          onClick={() => {
            setEpisodeIndex(episodeIndex + 1)
          }}
        >
          <SpeedArrowIcon />
        </button>
      </div>
      <div className="max flex flex-col overflow-auto">
        {listFilmSSR?.map((item, index) => {
          return (
            <div
              key={item.id}
              className={
                'flex cursor-pointer items-start justify-center py-2 ' +
                (index === episodeIndex ? 'bg-neutral-100' : 'bg-bg2')
              }
              onClick={() => {
                setEpisodeIndex(index)
              }}
            >
              <div className="flex h-full w-10 items-center justify-center self-center text-xs font-bold">
                {episodeIndex === index ? (
                  <PlayIcon className="scale-50 text-neutral-400" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="flex h-full flex-1 items-start">
                <div className="relative mr-3 overflow-hidden rounded">
                  <ProgressiveImg
                    src={item.coverImage}
                    shape="rect_w"
                    alt="coverImage"
                    className="h-17 w-32 shrink-0 rounded"
                  />
                  <div className="absolute bottom-1 right-1 flex items-center justify-center rounded bg-black bg-opacity-60 px-1 caption1">
                    {formatTimeVideo(item.duration)}
                  </div>
                </div>
                <div className="h-full flex-1 pr-4">
                  <p className="font-bold caption1  line-clamp-2">
                    {item.name}
                  </p>
                  <p className="font-medium text-neutral-500 caption1 line-clamp-2">
                    {item.playTimes}&nbsp;
                    <FormattedMessage id="viewNumber" />
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <ShareModal
        open={openShare}
        onClose={setOpenShare}
        shareUrl={listFilmSSR?.[episodeIndex]?.linkShare}
      />
    </>
  )
}

export default EpisodeBox
