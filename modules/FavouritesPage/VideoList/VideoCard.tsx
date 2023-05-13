import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import VideoOptionPoper from '@common/components/VideoOptionPoper'
import { VideoObject } from '@common/constants'
import { ROUTES } from '@utility/constant'
import { formatTimeVideo } from '@utility/helper'
import { FormattedMessage } from 'react-intl'

export const VideoCardSkeleton = () => {
  return (
    <div className="gap flex animate-pulse flex-row rounded-sm">
      <div className=" mx-3 h-20 w-5/12 rounded-md bg-bg2" />
      <div className="w-1/2">
        <div className="flex p-2">
          <div className="flex flex-1 flex-col">
            <div className="avatar h-2.5 w-3/4 bg-bg2" />
            <div className="avatar ml-2 h-2.5 w-3/4 bg-bg2" />
            <div className="avatar ml-2 h-2.5 w-3/5 bg-bg2" />
          </div>
        </div>
      </div>
    </div>
  )
}
interface Props {
  data: VideoObject
}

const VideoCard = (props: Props) => {
  const { data } = props
  return (
    <div className="max-w-52 flex flex-col">
      <MyLink
        href={{
          pathname: ROUTES.video.detail,
          query: {
            id: data.id,
            slug: [data.slug],
          },
        }}
        className="min-h-48 w-full"
      >
        <div className="relative h-full w-full">
          <ProgressiveImg
            src={data?.coverImage}
            shape="rect_w"
            className="h-48 w-full rounded object-cover"
          />
          <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-60 px-1 py-0.5 caption1">
            {formatTimeVideo(data.duration)}
          </div>
        </div>
      </MyLink>
      <div className="mt-3 flex">
        <div className="flex-1 pr-2">
          <div className="flex">
            <MyLink
              href={{
                pathname: ROUTES.channel.detail,
                query: { id: data?.channel?.id },
              }}
              className={'avatar mr-3 h-8 w-8 object-cover'}
            >
              <ProgressiveImg
                src={data.channel?.avatarImage}
                alt="avatarImage"
                className="avatar h-8 w-8 shrink-0"
              />
            </MyLink>
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
                <p className="body font-bold headline  line-clamp-2">
                  {data.name}
                </p>
                <p className="text-neutral-500 caption1  line-clamp-1">
                  {data.channel?.name && <>{data.channel?.name}</>}
                </p>
                <p className="text-neutral-500 caption1">
                  {data.playTimes}&nbsp;
                  <FormattedMessage id="view" />
                  &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{data.publishedTime}
                </p>
              </div>
            </MyLink>
          </div>
        </div>
        <VideoOptionPoper classNamePaper="w-72" videoData={data} />
      </div>
    </div>
  )
}

export default VideoCard
