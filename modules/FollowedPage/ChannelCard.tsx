import FollowBox from '@common/components/FollowBox'
import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { ROUTES } from '@utility/constant'
import { FormattedMessage } from 'react-intl'

const ChannelCard = ({ data, className = '' }) => {
  return (
    <div className={'flex w-fit flex-col items-center ' + className}>
      <MyLink
        href={{ pathname: ROUTES.channel.detail, query: { id: data.id } }}
        checkId
        className="avatar mb-3 h-28 w-28 shrink-0"
      >
        <ProgressiveImg
          src={data?.avatarImage}
          alt={data?.name}
          className="avatar h-full w-full"
        />
      </MyLink>
      <p className="mb-0.5 text-center font-bold line-clamp-1">{data?.name}</p>
      <p className="mb-4 text-center text-neutral-500 caption2">
        <FormattedMessage
          id="followerCount"
          values={{ num: data.followCount || 0 }}
        />
      </p>
      <FollowBox channelData={data} onlyButton size="small" noIcon />
    </div>
  )
}

export default ChannelCard
