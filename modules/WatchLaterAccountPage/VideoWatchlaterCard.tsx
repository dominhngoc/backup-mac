import MyLink from '@common/components/MyLink'
import Popper from '@common/components/Popper'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { VideoObject } from '@common/constants'
import { DeleteIcon, MoreIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { formatTimeVideo } from '@utility/helper'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

export const VideoWatchlaterCardSekeleton = () => {
  return (
    <div className="mt-3 flex animate-pulse flex-row rounded-sm ">
      <div className="h-28 w-52 rounded-md bg-neutral-100" />
      <div className="ml-2 flex flex-1 flex-col">
        <div className="h-2.5 w-3/4 bg-neutral-100" />
        <div className="mt-2 h-2.5 w-full bg-neutral-100" />
        <div className="mt-2 h-2.5 w-1/5 bg-neutral-100" />
      </div>
    </div>
  )
}

interface Props {
  videoData: VideoObject
  onClick?: () => void
  onDelete: (value: VideoObject) => void
  index?: number
  isActive?: boolean
}

const VideoWatchlaterCard = (props: Props) => {
  const { onClick, onDelete, index, isActive, videoData } = props
  const [openPopper, setOpenPopper] = useState(false)

  return (
    <div
      className={
        'flex w-full cursor-pointer rounded-xl p-2 hover:bg-bg2 ' +
        (isActive ? 'bg-bg2' : '')
      }
      title={videoData?.name}
    >
      {index && (
        <div
          className="caption1 flex h-full items-center p-3 pl-1"
          onClick={() => {
            onClick && onClick()
          }}
        >
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
        <div className="relative h-16 w-32">
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
        classNamePaper="w-72"
      >
        <button
          className="subtitle flex w-full items-center px-5 py-3"
          onClick={() => {
            onDelete(videoData)
          }}
        >
          <DeleteIcon className="mr-2" />
          <FormattedMessage id="deleteOutList" />
        </button>
      </Popper>
    </div>
  )
}
export default VideoWatchlaterCard
