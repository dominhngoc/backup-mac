import VideoCard from '@common/components/VideoCard'
import { some, VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import Head from 'next/head'
import { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import BannerSlider from './BannerSlider'
import HotLiveStreamList from './HotLiveStreamList'

interface Props {
  dataCategorySSR: some[]
  bannersSSR: some[]
  dataLivesSSR: some[]
  recentLivesSSR: some[]
}

const LivesPage = (props: Props) => {
  const { dataCategorySSR, bannersSSR, dataLivesSSR, recentLivesSSR } = props
  const { intl, dispatch } = useGeneralHook()
  const {
    data: recentLivesCSR = [],
    size: size,
    setSize: setSize,
    isValidating: isValidating,
  } = useSWRInfinite(
    (pageIndex, prevPageData) => {
      if (pageIndex > 0 && prevPageData && prevPageData.length > 0) {
        return null
      }
      return process.env.NEXT_PUBLIC_LIVE_CATEGORY_ID
        ? API_PATHS.videos.home({
            filter: `CATEGORY_${process.env.NEXT_PUBLIC_LIVE_CATEGORY_ID}`,
            page_token: pageIndex + 1,
            page_size: 12,
          })
        : null
    },
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateAll: false,
      revalidateFirstPage: false,
      revalidateOnMount: false,
      revalidateOnFocus: false,
    }
  )

  const mappedData = useMemo(() => {
    return recentLivesCSR?.reduce((v, c) => [...v, ...c], recentLivesSSR)
  }, [recentLivesCSR, recentLivesSSR])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 200 * 2 &&
        !isValidating &&
        recentLivesSSR.length > 0 &&
        recentLivesCSR?.every((item) => item.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [isValidating, recentLivesCSR, recentLivesSSR.length, setSize, size]
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
        <title>{intl.formatMessage({ id: 'live' })}</title>
      </Head>
      <div className="container pb-10 min-h-screen">
        <MenuCategories listCategory={dataCategorySSR} />
        <BannerSlider bannersSSR={bannersSSR} />
        {dataLivesSSR.length > 0 && (
          <HotLiveStreamList
            dataLiveSSR={dataLivesSSR}
            title={{ value: 'hotLiveStream', showSeeAll: false }}
            type="HOT"
          />
        )}
        <div className="h-16 w-full"></div>
        {recentLivesSSR.length > 0 && (
          <div className="container">
            <div className="mb-5 flex w-full items-center py-3">
              <p className="text-2xl font-bold leading-6">
                <FormattedMessage id={'recentLive'} />
              </p>
            </div>
            <div className="container -ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {mappedData?.map((item: VideoObject) => {
                return (
                  <div key={item.id} className="pl-5 pb-5">
                    <VideoCard data={item} />
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {isValidating && (
          <div className="flex h-32 items-center justify-center">
            <LoadingIcon className="h-10 animate-spin" />
          </div>
        )}
      </div>
    </>
  )
}

export default LivesPage
