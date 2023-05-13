import FollowBox from '@common/components/FollowBox'
import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { VideoObject } from '@common/constants'
import useGetLinkVideo from '@common/hook/useGetLinkVideo'
import VideoJS from '@common/VideoJS'
import { ROUTES } from '@utility/constant'
export const ChanelCardSkeleton = ({ className = '' }) => {
  return (
    <div className={'mt-5 ml-5 animate-pulse ' + className}>
      <div className="h-105 w-60 shrink-0 rounded-xl bg-neutral-100 object-cover object-center" />
    </div>
  )
}
interface Props {
  touchedData?: VideoObject
  data: VideoObject
  onHover: (value?: VideoObject) => void
}

const ChannelCard = (props: Props) => {
  const { data, touchedData, onHover } = props
  const { url } = useGetLinkVideo({
    videoId: touchedData && !document.hidden ? touchedData?.id : null,
  })

  return (
    <div
      className="relative mt-5 ml-5 h-105 w-60 cursor-pointer overflow-hidden rounded-xl"
      onMouseEnter={() => {
        onHover(data)
      }}
      onMouseLeave={() => {
        onHover(undefined)
      }}
    >
      {touchedData?.id === data?.id && url && !document.hidden ? (
        <MyLink
          href={{
            pathname: ROUTES.channel.videos,
            query: { id: data?.channel?.id, type: 'shorts' },
          }}
          checkId
          className="h-full w-full"
        >
          <VideoJS
            containerProps={{
              style: {
                height: '100%',
                width: '100%',
                padding: 0,
              },
            }}
            elProp={{
              autoPlay: true,
              className:
                'w-full h-full p-0 object-cover pointer-events-none bg-transparent overflow-hidden',
            }}
            options={{
              autoplay: true,
              controls: false,
              preload: true,
              fluid: true,
              sources: [
                {
                  src: url,
                },
              ],
              poster: data.firstFrameImage,
            }}
          />
        </MyLink>
      ) : (
        <ProgressiveImg
          src={data.coverImage}
          alt="coverImage"
          shape="rect_h"
          className="h-full w-full shrink-0 object-cover object-center"
        />
      )}
      <div
        className="absolute bottom-0 right-0 left-0 flex flex-col items-center justify-center p-5"
        style={{
          background:
            'linear-gradient(0deg, #0D0D0D 4.69%, rgba(0, 0, 0, 0.0001) 100%)',
        }}
      >
        <MyLink
          href={{
            pathname: ROUTES.channel.videos,
            query: { id: data?.channel?.id, type: 'shorts' },
          }}
          checkId
          className="avatar h-12 w-12"
        >
          <ProgressiveImg src={data.channel?.avatarImage} alt="coverImage" />
        </MyLink>
        <p className="my-3 text-center font-semibold text-white line-clamp-2">
          {data.channel?.name}
        </p>
        <FollowBox channelData={data.channel} onlyButton size="small" />
      </div>
    </div>
  )
}
export default ChannelCard
