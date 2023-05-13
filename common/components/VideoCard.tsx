import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { VideoObject } from '@common/constants'
import { MoreIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { formatTimeVideo } from '@utility/helper'
import { numberFormatter } from '@utility/utils'
import { FormattedMessage } from 'react-intl'
import VideoOptionPoper from './VideoOptionPoper'

export const VideoCardSkeleton = () => {
  return (
    <div className="w-full animate-pulse ">
      <div className="w-full bg-bg2 sm:h-[188px] lg:h-[165px] xl:h-[188px] 2xl:h-[198px]" />
      <div className="flex items-center p-3">
        <div className="avatar mr-3 h-8 w-8 bg-bg2" />
        <div className="flex flex-1 flex-col ">
          <div className="mb-1 mr-1 h-4 w-3/4 rounded bg-bg2" />
          <div className="h-4 w-3/5 rounded bg-bg2" />
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
    <div className="w-full cursor-pointer" title={data?.name}>
      <MyLink
        className="w-full"
        href={{
          pathname: ROUTES.video.detail,
          query: {
            id: data.id,
            slug: [data.slug],
          },
        }}
      >
        <div className="relative w-full sm:h-[188px] lg:h-[165px] xl:h-[188px] 2xl:h-[198px] ">
          <ProgressiveImg
            src={data?.coverImage}
            shape="rect_w"
            className="h-full w-full rounded-md object-cover"
          />

          <div className="caption1 absolute bottom-2 right-2 h-6 rounded bg-black bg-opacity-60 p-1">
            {formatTimeVideo(data.duration)}
          </div>
        </div>
      </MyLink>
      <div className="flex p-3">
        <MyLink
          href={{
            pathname: ROUTES.channel.detail,
            query: { id: data?.channel?.id },
          }}
          className={'avatar mr-3 h-8 w-8 object-cover'}
        >
          <ProgressiveImg
            src={data?.channel?.avatarImage}
            isAvatar
            className="avatar h-8 w-8 object-cover"
          />
        </MyLink>

        <div
          className="mr-3 flex-1"
          style={{
            maxWidth: 'calc(100% - 76px)',
          }}
        >
          <MyLink
            className="headline break-all font-bold line-clamp-2"
            href={{
              pathname: ROUTES.video.detail,
              query: {
                id: data.id,
                slug: [data.slug],
              },
            }}
          >
            {data.name}
          </MyLink>

          <div className="text-neutral-500">
            <MyLink
              href={{
                pathname: ROUTES.channel.detail,
                query: { id: data?.channel?.id },
              }}
              className="caption1 my-1 break-all line-clamp-1"
            >
              {data.channel?.name && <>{data.channel.name}</>}
            </MyLink>
            <MyLink
              href={{
                pathname: ROUTES.video.detail,
                query: {
                  id: data.id,
                  slug: [data.slug],
                },
              }}
              className="caption1"
            >
              {data.status === 3 ? (
                <span className="caption1 text-neutral-500">
                  {data.reason && (
                    <FormattedMessage
                      id="rejectReason"
                      values={{ reason: data.reason }}
                    />
                  )}
                  &nbsp;•&nbsp;
                  <span>{data.publishedTime}</span>
                </span>
              ) : data.status === 1 ? (
                <span className="caption1 text-neutral-500">
                  <FormattedMessage id="approve" />
                  &nbsp;•&nbsp;
                  <span>{data.publishedTime}</span>
                </span>
              ) : (
                <>
                  {numberFormatter(data.playTimes, 1)}{' '}
                  <FormattedMessage id="viewNumber" />
                  &nbsp;•&nbsp;{data.publishedTime}
                </>
              )}
            </MyLink>
          </div>
        </div>
        <VideoOptionPoper
          wrapper={<MoreIcon className="scale-125" />}
          classNamePaper="w-72"
          videoData={data}
        />
      </div>
    </div>
  )
}
export default VideoCard
