import api from '@common/api'
import MyLink from '@common/components/MyLink'
import { VideoObject } from '@common/constants'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import VideoCard, { VideoCardSkeleton } from '../../common/components/VideoCard'
interface Props { }

const ChannelVideoItem = ({ data }) => {
  const [listVideo, setListVideo] = useState([])
  const [loading, setLoading] = useState(true)
  const getSuggestedChannelList = useCallback(async (id: number) => {
    const json = await api({
      url: API_PATHS.home.listVideo({
        filter: [`CHANNEL_${id}`, 'LATEST'],
        page_token: 0,
        page_size: 8,
      }),
    })
    setLoading(false)
    setListVideo(json?.data?.data?.[0]?.contents)
  }, [])

  useEffect(() => {
    data?.id && getSuggestedChannelList(data?.id)
  }, [data?.id, getSuggestedChannelList])
  if (loading) {
    return (
      <div className="mt-8">
        <div className="mb-5 flex items-center py-3">
          <p className="text-2xl font-bold leading-6">{data?.name}</p>
          <MyLink
            href={{
              pathname: ROUTES.channel.detail,
              query: { id: data?.id },
            }}
            className=" ml-3 font-semibold  text-neutral-400"
          >
            <FormattedMessage id="seeAll" />
          </MyLink>
        </div>
        <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            return (
              <div className="pl-5 pb-5" key={i}>
                <VideoCardSkeleton />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  if (listVideo.length === 0) {
    return null
  }
  return (
    <div className="mt-8">
      <div className="mb-5 flex items-center py-3">
        <p className="text-2xl font-bold leading-6">{data?.name}</p>
        <MyLink
          href={{
            pathname: ROUTES.channel.detail,
            query: { id: data?.id },
          }}
          className=" ml-3 font-semibold  text-neutral-400"
        >
          <FormattedMessage id="seeAll" />
        </MyLink>
      </div>
      <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {listVideo?.map((item: VideoObject, index) => {
          return (
            <div className="pl-5 pb-5" key={index}>
              <VideoCard data={item} key={index} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChannelVideoItemSlekton = () => {
  return (
    <div>
      <div className="mb-5 flex items-center py-3">
        <div className="w-100 animate-pulse " />
      </div>
      <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4]?.map((item: any, index) => {
          return (
            <div className="pl-5 pb-5" key={index}>
              <VideoCardSkeleton key={index} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const SuggestVideosChannel: React.FC<Props> = (props) => {
  const {
    data = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (pageIndex) => {
      return API_PATHS.home.channelsHome({
        page_token: pageIndex,
        page_size: 5,
        filter: 'CHANNEL_HOME',
      })
    },
    async (url) => {
      const json = await api({ url, method: 'get' })
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateOnFocus: false,
    }
  )

  const mappedChannel = useMemo(() => {
    const dataChannelSuggest = data?.reduce((c, v) => {
      return [...c, ...v]
    }, [])
    return dataChannelSuggest.filter(
      (value, index, self) => self.map((x) => x.id).indexOf(value.id) == index
    )
  }, [data])

  const onScroll = useCallback(() => {
    if (
      window.innerHeight + window.pageYOffset >=
      document.body.offsetHeight - 320 &&
      !isValidating &&
      data?.length > 0 &&
      data?.every((item) => item?.length > 0)
    ) {
      setSize(size + 1)
    }
  }, [data, isValidating, setSize, size])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  return (
    <div className="mt-10 mb-10 flex flex-col">
      {mappedChannel.map((v) => (
        <ChannelVideoItem data={v} key={v.id} />
      ))}
      {isValidating && (
        <>
          {size === 1 ? (
            <>
              <ChannelVideoItemSlekton />
              <ChannelVideoItemSlekton />
              <ChannelVideoItemSlekton />
            </>
          ) : (
            <div className="mt-10 flex h-24 items-center justify-center">
              <LoadingIcon className="h-10 animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SuggestVideosChannel
