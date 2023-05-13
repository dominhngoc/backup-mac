import VideoCard from '@common/components/VideoCard'
import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import Head from 'next/head'
import { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'

interface Props {}

const GuidePage = (props: Props) => {
  const { dispatch, intl } = useGeneralHook()

  const {
    data = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null
      return API_PATHS.home.listVideo({
        page_token: index,
        page_size: 12,
        filter: `CHANNEL_${process.env.NEXT_PUBLIC_CHANNEL_GUIDE_ID}`,
      })
    },
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    }
  )

  const mappedData = useMemo(() => {
    return data.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [data])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 200 * 2 &&
        !isValidating &&
        data.length > 0 &&
        data?.every((item) => item.length > 0)
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
        <title>{intl.formatMessage({ id: 'guide' })}</title>
      </Head>
      <div className="container py-16 min-h-screen">
        <p
          className="mb-5 font-bold
       title2"
        >
          <FormattedMessage id="guide" />
        </p>
        <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mappedData?.map((item: VideoObject) => {
            return (
              <div className="pl-5 pb-5" key={item.id}>
                <VideoCard data={item} />
              </div>
            )
          })}
        </div>
        {isValidating && (
          <div className="flex h-32 items-center justify-center">
            <LoadingIcon className="h-10 animate-spin" />
          </div>
        )}
      </div>
    </>
  )
}

export default GuidePage
