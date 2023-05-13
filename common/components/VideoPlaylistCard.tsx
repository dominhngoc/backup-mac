import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { PlayListObject, VideoObject } from '@common/constants'
import { MoreIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { formatTimeVideo } from '@utility/helper'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import PlaylistVideoOptions from './PlaylistVideoOptions'
import Popper from './Popper'

export const VideoPlaylistSkeleton = () => {
  return (
    <div className="flex w-full animate-pulse p-2">
      <div className="h-16 w-32 rounded bg-bg2"></div>
      <div className="mx-3 flex-1">
        <div className="h-4 w-3/4 rounded bg-bg2" />
        <div className="mt-2 h-4 w-1/4 rounded bg-bg2" />
      </div>
    </div>
  )
}

interface Props {
  videoData: VideoObject
  playlistInfo: PlayListObject
  mutate?: any
  index?: number
}

const VideoPlaylistCard = (props: Props) => {
  const { mutate, index, videoData, playlistInfo } = props
  const [openPopper, setOpenPopper] = useState(false)

  return (
    <div
      className="flex w-full cursor-pointer rounded-xl p-2 hover:bg-bg2"
      title={videoData?.name}
    >
      {index && (
        <div className="caption1 flex h-full items-center p-3 pl-1">
          {index}
        </div>
      )}
      <MyLink
        className="flex flex-1"
        href={{
          pathname: ROUTES.video.detail,
          query: {
            id: videoData.id,
            slug: [videoData.slug],
          },
        }}
      >
        <div className="relative h-16 w-32 shrink-0">
          <ProgressiveImg
            src={videoData?.coverImage}
            shape="rect_w"
            className="h-full w-full rounded-md object-cover"
          />

          <div className="caption1 absolute bottom-2 right-2 h-6 rounded bg-black bg-opacity-60 p-1">
            {formatTimeVideo(videoData.duration)}
          </div>
        </div>
        <div className="mx-3">
          <p className="caption1">{videoData?.name}</p>
          <p className="caption1 text-neutral-500">
            {videoData?.playTimes}&nbsp;
            <FormattedMessage id="view" />
          </p>
        </div>
      </MyLink>
      <Popper
        open={openPopper}
        wrapper={<MoreIcon />}
        setOpen={setOpenPopper}
        classNamePaper="w-72 overflow-hidden"
      >
        <PlaylistVideoOptions
          videoData={videoData}
          playlistInfo={playlistInfo}
          onClose={setOpenPopper}
          mutate={mutate}
        />
      </Popper>
    </div>
  )
}
export default VideoPlaylistCard
