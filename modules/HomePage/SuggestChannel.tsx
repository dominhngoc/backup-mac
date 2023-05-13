import FollowBox from '@common/components/FollowBox'
import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import ScrollMenu from '@common/components/ScrollMenu'
import { some } from '@common/constants'
import { ROUTES } from '@utility/constant'
import { numberFormatter } from '@utility/utils'
import React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  listChannel: some[]
  hiddenSeeAll?: boolean
  title?: string
}

const ChannelCard = ({ data }) => {
  return (
    <div className="sm:w-13 lg:w-21 flex flex-col items-center 2xl:w-28">
      <MyLink
        href={{ pathname: ROUTES.channel.detail, query: { id: data.id } }}
      >
        <ProgressiveImg
          src={data?.avatarImage}
          alt={data?.name}
          className="mb-3 h-28 w-28 rounded-full object-cover"
        />
      </MyLink>
      <p className="mb-0.5 text-center font-bold line-clamp-1">{data?.name}</p>
      <p className="mb-4 text-center text-neutral-500 caption2">
        <FormattedMessage
          id="followerCount"
          values={{ num: numberFormatter(data.followCount, 1) || 0 }}
        />
      </p>
      <FollowBox onlyButton size="small" noIcon channelData={data} />
    </div>
  )
}

const SuggestChannel: React.FC<Props> = (props) => {
  const { listChannel } = props
  if (listChannel.length === 0) {
    return null
  }
  return (
    <div>
      <div className="mb-5 mt-10 flex w-full items-center">
        <p className="font-bold title2">
          <FormattedMessage id={props.title ? props.title : 'suggestChannel'} />
        </p>
        {/* {props.hiddenSeeAll === true ? null : (
          <p className=" ml-3 font-semibold text-neutral-400">
            <FormattedMessage id="seeAll" />
          </p>
        )} */}
      </div>
      <ScrollMenu className="">
        {listChannel.map((v, index) => (
          <div
            className="flex h-[207] w-[12%] min-w-[148px] items-center justify-center"
            key={index}
          >
            <ChannelCard data={v} key={index} />
          </div>
        ))}
      </ScrollMenu>
    </div>
  )
}

export default SuggestChannel
