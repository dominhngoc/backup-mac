import MyLink from '@common/components/MyLink'
import ScrollMenu from '@common/components/ScrollMenu'
import VideoCard, { VideoCardSkeleton } from '@common/components/VideoCard'
import { some, VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import Head from 'next/head'
import { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import ChannelCard from './ChannelCard'
import ChannelFollowedBox from './ChannelFollowedBox'

interface Props {
  dataCategorySSR: some[]
}
const FollowedPage = (props: Props) => {
  const { dataCategorySSR } = props
  const { intl, dispatch } = useGeneralHook()

  const {
    data: dataHomeCSR = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      API_PATHS.videos.index({
        page_token: index,
        page_size: 12,
        filter: 'RECOMMEND_FOLLOW',
      }),
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateAll: false,
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  )

  const mappedData = useMemo(() => {
    return dataHomeCSR.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [dataHomeCSR])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 290 * 2 &&
        !isValidating &&
        dataHomeCSR?.length > 0 &&
        dataHomeCSR?.every((item) => item?.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [dataHomeCSR, isValidating, setSize, size]
  )

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: 'followChannels',
          })}
        </title>
      </Head>
      <MenuCategories listCategory={dataCategorySSR} />
      <div className="container py-9 min-h-screen">
        <div className="mb-12 flex items-center">
          <p className="mr-3 font-bold title2">
            <FormattedMessage id="channelFollowList" />
          </p>
          <MyLink
            href={{
              pathname: ROUTES.account.followedList,
            }}
            className="font-semibold text-neutral-600"
          >
            <FormattedMessage id={'seeAll'} />
          </MyLink>
        </div>
        <ChannelFollowedBox />
        <div className="mt-10 -ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mappedData?.map((item: VideoObject) => {
            return (
              <div className="pl-5 pb-5" key={item.id}>
                <VideoCard data={item} />
              </div>
            )
          })}
        </div>
        {isValidating &&
          (size === 1 ? (
            <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <>
                {Array(4)
                  .fill(0)
                  .map((_, index) => {
                    return (
                      <div className="pl-5 pb-5" key={index}>
                        <VideoCardSkeleton key={index} />
                      </div>
                    )
                  })}
              </>
            </div>
          ) : (
            <div className="flex h-36 w-full shrink-0 items-center justify-center">
              <LoadingIcon className="h-10 animate-spin" />
            </div>
          ))}
      </div>
    </>
  )
}
export default FollowedPage
