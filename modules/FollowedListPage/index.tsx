import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import ChannelCard from '@modules/FollowedPage/ChannelCard'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import Head from 'next/head'
import { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'

interface Props {
  dataCategorySSR: some[]
}
const FollowedListPage = (props: Props) => {
  const { dataCategorySSR } = props
  const { intl, dispatch } = useGeneralHook()

  const {
    data = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) => {
      return API_PATHS.channel.list({
        filter: `CHANNEL_FOLLOW`,
        page_size: 12,
        page_token: index,
      })
    },
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateAll: false,
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    }
  )

  const mappedData = useMemo(() => {
    return data?.reduce((v, c) => {
      return [...(v || []), ...(c || [])]
    }, [])
  }, [data])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 290 * 2 &&
        !isValidating &&
        data?.every((item) => item?.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [data, isValidating, setSize, size]
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
        <p className="mb-12 font-semibold title2">
          <FormattedMessage id={'allChannelFollow'} />
        </p>
        <div className="-ml-6 -mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {mappedData?.map((item, index) => (
            <ChannelCard
              data={item}
              key={item.id}
              className="w-56 shrink-0 pl-6 pb-6"
            />
          ))}
        </div>
        {isValidating && (
          <div className="flex h-40 items-center justify-center">
            <LoadingIcon className="h-10 animate-spin" />
          </div>
        )}
      </div>
    </>
  )
}
export default FollowedListPage
