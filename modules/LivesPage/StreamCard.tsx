import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import VideoOptionPoper from '@common/components/VideoOptionPoper'
import { LiveIcon, MoreIcon, ViewIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { FormattedMessage } from 'react-intl'

const StreamCard = ({ data, type = 'HOT', isLive = false }) => {
  return (
    <>
      <div className="w-full" title={data.name}>
        <MyLink
          href={{
            pathname: ROUTES.live.detail,
            query: {
              id: data.id,
            },
          }}
        >
          <div className="relative mb-3  flex max-w-full flex-col sm:h-[188px] sm:w-[330px] lg:h-[165px] lg:w-[290px] xl:h-[188px] xl:w-[353px] 2xl:h-[188px]  2xl:w-[353px]">
            <ProgressiveImg
              src={data?.coverImage}
              shape="rect_w"
              className="h-full w-full rounded-md object-cover"
              alt="coverImage"
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-20 p-4 pt-11"
              style={{
                background:
                  'linear-gradient(180deg, rgba(16, 16, 16, 0) 0%, #000000 90%)',
              }}
            />
            {type === 'HOT' && (
              <div className="absolute top-2 left-2 flex">
                <div className="flex  h-6 items-center rounded bg-red py-1 px-2 font-bold uppercase caption1">
                  <LiveIcon className={'mr-1 scale-75'} />
                  <FormattedMessage id="live" />
                </div>
                <div className="ml-1 flex h-6 items-center rounded bg-black bg-opacity-60 py-1 px-2 caption1">
                  <ViewIcon />
                  &nbsp;
                  {data?.viewerCount}
                </div>
              </div>
            )}
          </div>
        </MyLink>
        <div>
          <div className="flex pr-3">
            <MyLink
              href={{
                pathname: ROUTES.channel.detail,
                query: { id: data.channel?.id },
              }}
            >
              <ProgressiveImg
                src={data.channel?.avatarImage}
                alt="avatarImage"
                className="avatar h-8 w-8"
              />
            </MyLink>
            <div className="ml-3 flex-1">
              <MyLink
                href={{
                  pathname: ROUTES.live.detail,
                  query: {
                    id: data.id,
                  },
                }}
              >
                <span className="font-bold headline line-clamp-2 ">
                  {data.name}
                </span>
              </MyLink>
              <div className="flex flex-1 flex-col flex-wrap text-neutral-500">
                <MyLink
                  href={{
                    pathname: ROUTES.channel.detail,
                    query: { id: data.channel?.id },
                  }}
                >
                  <p className="my-1 mr-1 caption1 line-clamp-2">
                    {data?.channel?.name}
                  </p>
                </MyLink>
                <MyLink
                  href={{
                    pathname: ROUTES.live.detail,
                    query: {
                      id: data.id,
                    },
                  }}
                >
                  <p className="caption1">
                    {data.viewerCount}&nbsp;
                    <FormattedMessage id="view" />
                    &nbsp;&nbsp;•&nbsp;&nbsp;
                    {data.publishedTime}
                  </p>
                </MyLink>
              </div>
            </div>
            <VideoOptionPoper
              wrapper={<MoreIcon className="scale-125" />}
              classNamePaper="w-72"
              videoData={data}
              isLive={isLive}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default StreamCard
