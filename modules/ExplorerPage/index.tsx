import MyLink from '@common/components/MyLink'
import VideoCard from '@common/components/VideoCard'
import { some, VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { API_PATHS } from '@utility/API_PATH'
import Head from 'next/head'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import EventBannerList from './EventBannerList'
import ExperienceBox from './ExperienceBox'
interface Props {
  listEventSSR: some[]
  discoveryVideosSSR: some[]
  dataCategorySSR: some[]
}

const ExplorerPage = (props: Props) => {
  const { listEventSSR = [], discoveryVideosSSR, dataCategorySSR } = props
  const { intl, dispatch } = useGeneralHook()
  const {
    data: dataCSR = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      API_PATHS.videos.index({
        page_token: index + 1,
        page_size: 12,
        filter: 'DISCOVERY',
      }),
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
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
    return dataCSR.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, discoveryVideosSSR)
  }, [dataCSR, discoveryVideosSSR])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 290 * 2 &&
        !isValidating &&
        discoveryVideosSSR?.length > 0 &&
        dataCSR?.every((item) => item?.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [dataCSR, discoveryVideosSSR?.length, isValidating, setSize, size]
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
        <title>{intl.formatMessage({ id: 'explorer' })}</title>
      </Head>
      <MenuCategories listCategory={dataCategorySSR} />
      <div className="container py-8">
        <EventBannerList data={listEventSSR} />
        <ExperienceBox />
        {mappedData.length > 0 && (
          <div>
            <div className="mb-5 mt-9 flex items-center">
              <p className="mr-3 font-bold title2">
                <FormattedMessage id="mostView" />
              </p>
            </div>
            <div className="container flex flex-col p-0">
              <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {mappedData.map((item: VideoObject, index) => {
                  return (
                    <div className="pl-5 pb-5" key={item.id}>
                      <VideoCard data={item} key={index} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ExplorerPage
