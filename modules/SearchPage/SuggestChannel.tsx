import api from '@common/api'
import FollowBox from '@common/components/FollowBox'
import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import ScrollMenu from '@common/components/ScrollMenu'
import { some } from '@common/constants'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import { numberFormatter } from '@utility/utils'
import { useRouter } from 'next/router'
import { FilterSearch } from 'pages/search'
import { useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import { FILTER_TYPE } from './constant'

interface Props {
  listChannel: some[]
  filterObj: FilterSearch
}

const ChannelCard = ({ data }) => {
  return (
    <div className="mr-4 flex w-fit flex-col items-center">
      <MyLink
        href={{ pathname: ROUTES.channel.detail, query: { id: data.id } }}
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
          values={{ num: numberFormatter(data.followCount, 1) || 0 }}
        />
      </p>
      <FollowBox channelData={data} onlyButton size="small" noIcon />
    </div>
  )
}

const SuggestChannel = (props: Props) => {
  const { listChannel, filterObj } = props
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const { query } = useRouter()
  const { topic_id = '' } = query

  const {
    data = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) => {
      return !topic_id
        ? API_PATHS.search.index({
            query: filterObj.term,
            type: FILTER_TYPE.CHANNEL,
            page_token: index + 1,
            page_size: 12,
            filter: [
              filterObj.duration?.split(',')[0],
              filterObj.duration?.split(',')[1],
              filterObj.sort,
              filterObj.time,
            ].filter((v) => !!v),
          })
        : null
    },
    async (url) => {
      const json = await api({ url, method: 'get' })
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateAll: false,
      revalidateFirstPage: false,
      initialSize: 1,
      revalidateOnMount: false,
      revalidateOnFocus: false,
    }
  )

  const mappedData = useMemo(() => {
    return data?.reduce((v, c) => {
      return [...(v || []), ...(c || [])]
    }, listChannel)
  }, [data, listChannel])

  const onScrollLoad = (e) => {
    if (
      e.currentTarget.scrollLeft + e.currentTarget.offsetWidth >=
        e.currentTarget.scrollWidth - 10 &&
      !isValidating &&
      listChannel.length > 0 &&
      data?.every((v) => v?.length > 0)
    ) {
      setSize(size + 1)
      setIsFirstLoad(false)
    }
  }

  if (listChannel.length === 0) {
    return null
  }
  return (
    <div className="container py-6">
      <div className="mb-5 flex w-full items-center py-3">
        <p className="text-2xl font-bold leading-6">
          <FormattedMessage id={'channel'} />
        </p>
      </div>
      <ScrollMenu
        onScroll={(e) => {
          onScrollLoad(e)
        }}
        classArrow="h-12 w-12"
      >
        {mappedData.map((item, index) => (
          <ChannelCard data={item} key={item.id} />
        ))}
        {isFirstLoad && (
          <div className="flex w-[200px] shrink-0 items-center justify-center"></div>
        )}

        {isValidating && (
          <div className="flex w-[112px] shrink-0 items-center justify-center">
            {isValidating && <LoadingIcon className="h-10 animate-spin" />}
          </div>
        )}
      </ScrollMenu>
    </div>
  )
}

export default SuggestChannel
