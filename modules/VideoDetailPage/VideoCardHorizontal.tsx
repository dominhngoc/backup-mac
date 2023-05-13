import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import VideoOptionPoper from '@common/components/VideoOptionPoper'
import { some } from '@common/constants'
import { ROUTES } from '@utility/constant'
import { formatTimeVideo } from '@utility/helper'
import { FormattedMessage } from 'react-intl'

export const VideoCardHorizontalSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="relative h-[198px] w-full bg-bg2" />
      <div className="flex items-center p-3">
        <div className="avatar mr-3 h-8 w-8 bg-bg2" />
        <div className="flex flex-1 flex-col">
          <div className="mb-1 mr-1 h-4 w-3/4 rounded bg-bg2" />
          <div className="h-4 w-3/5 rounded bg-bg2" />
        </div>
      </div>
    </div>
  )
}

interface Props {
  data: some | any
}

const VideoCardHorizontal = (props: Props) => {
  const { data } = props
  return (
    <div className="flex h-20 ">
      <div
        className="flex w-full items-start justify-center px-0 "
        title={data.name}
      >
        <MyLink
          href={{
            pathname: ROUTES.video.detail,
            query: {
              id: data.id,
              slug: [data.slug],
            },
          }}
          className="relative mr-3 rounded"
        >
          <ProgressiveImg
            src={data.coverImage}
            shape="rect_w"
            alt="coverImage"
            className="h-20 w-36 shrink-0 rounded object-cover"
          />
          <div className="caption1 absolute bottom-1.5 right-1.5 flex items-center justify-center rounded bg-black bg-opacity-60 px-1 py-0.5">
            {formatTimeVideo(data.duration)}
          </div>
        </MyLink>
        <div className="w-40 flex-1">
          <MyLink
            href={{
              pathname: ROUTES.video.detail,
              query: {
                id: data.id,
                slug: [data.slug],
              },
            }}
            className="caption1 font-bold line-clamp-2"
          >
            {data.name}
          </MyLink>
          <MyLink
            href={{
              pathname: ROUTES.channel.detail,
              query: { id: data?.channel?.id },
            }}
            className={'caption1 my-1 text-neutral-500 line-clamp-1'}
          >
            {data?.channel?.name || ''}
          </MyLink>
          <p className="caption1 text-neutral-500 line-clamp-1">
            {data.playTimes}&nbsp;
            <FormattedMessage id="viewNumber" />
            &nbsp;•&nbsp;
            {data.publishedTime}
          </p>
        </div>
      </div>
      <VideoOptionPoper classNamePaper="w-72" videoData={data} />
    </div>
  )
}
export default VideoCardHorizontal
