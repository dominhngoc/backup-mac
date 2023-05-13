import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { VideoObject } from '@common/constants'
import { CloseIcon, MoreIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { formatTimeVideo } from '@utility/helper'
import { FormattedMessage } from 'react-intl'

export const VideoCardHistorySkeleton = () => {
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
  data: VideoObject
  onDelete: (value: VideoObject) => void
}

const VideoCardHistory = (props: Props) => {
  const { data, onDelete } = props
  return (
    <div className="mt-3 flex">
      <MyLink
        href={{
          pathname: ROUTES.video.detail,
          query: {
            id: data.id,
            slug: [data.slug],
          },
        }}
        className="relative mr-4 h-28 w-52"
      >
        <ProgressiveImg
          src={data?.coverImage}
          className="h-full w-full rounded object-cover"
          shape="rect_w"
        />
        <div className="caption1 absolute bottom-2 right-2 rounded bg-black bg-opacity-60 px-1 py-0.5">
          {formatTimeVideo(data.duration)}
        </div>
      </MyLink>
      <div className="flex-1">
        <MyLink
          href={{
            pathname: ROUTES.video.detail,
            query: {
              id: data.id,
              slug: [data.slug],
            },
          }}
        >
          <div className="flex-1">
            <p className="headline break-all font-bold line-clamp-1">
              {data.name}
            </p>
            <div className="body mt-1 flex flex-1 gap-1 break-all text-neutral-400">
              {data?.channel?.name && (
                <p className="break-words line-clamp-1">
                  {data?.channel?.name}
                </p>
              )}
              <p className="flex-none line-clamp-1">
                {data?.channel?.name ? (
                  <>
                    &nbsp;•&nbsp; {data.playTimes}&nbsp;
                    <FormattedMessage id="viewNumber" />
                  </>
                ) : (
                  <>
                    {data.playTimes}&nbsp;
                    <FormattedMessage id="viewNumber" />
                  </>
                )}
              </p>
            </div>
            <div className={'text-neutral-400'}>{data.publishedTime}</div>
          </div>
        </MyLink>
      </div>
      <div className="h-fit cursor-pointer" onClick={() => onDelete(data)}>
        <CloseIcon />
      </div>
    </div>
  )
}

export default VideoCardHistory
