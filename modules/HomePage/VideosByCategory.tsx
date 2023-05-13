import { some, VideoObject } from '@common/constants'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { numberFormatter } from '@utility/utils'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import VideoCard from '../../common/components/VideoCard'
import MenuCategories from './MenuCategories'

import ProgressiveImg from '@common/components/ProgressiveImg'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import Head from 'next/head'
import { useCallback, useEffect, useMemo } from 'react'

interface Props {
  dataCategorySSR: VideoObject[]
  dataVideoSSR: VideoObject[]
  categoryDetailSSR: some
}

const VideosByCategory = (props: Props) => {
  const { dataCategorySSR, dataVideoSSR, categoryDetailSSR } = props
  const { intl, router, dispatch } = useGeneralHook()
  const { query } = router

  const {
    data: dataVideoCSR = [],
    size: size,
    setSize,
    isValidating: isValidating,
  } = useSWRInfinite(
    (pageIndex) => {
      return API_PATHS.videos.home({
        filter: `CATEGORY_${query.id}`,
        page_token: pageIndex + 1,
        page_size: 12,
      })
    },
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateAll: false,
      revalidateFirstPage: false,
      initialSize: 0,
      revalidateOnMount: false,
      revalidateOnFocus: false,
    }
  )

  const mappedData = useMemo(() => {
    return dataVideoCSR?.reduce((c, v) => {
      return [...c, ...v]
    }, dataVideoSSR)
  }, [dataVideoCSR, dataVideoSSR])

  const onScroll = useCallback(() => {
    if (
      window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 320 &&
      !isValidating &&
      dataVideoSSR?.length > 0 &&
      dataVideoCSR?.every((item) => item?.length > 0)
    ) {
      setSize(size + 1)
    }
  }, [dataVideoCSR, dataVideoSSR?.length, isValidating, setSize, size])

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
          {dataCategorySSR?.find((v) => v.id === (query.id as any))?.name}
        </title>
      </Head>
      <MenuCategories listCategory={dataCategorySSR} />
      <div className="container mb-10 min-h-screen">
        <div className="my-6 flex h-40 w-full items-center ">
          <ProgressiveImg
            src={categoryDetailSSR.avatarImage}
            className="h-20 w-20 rounded-full"
          />
          <div className="ml-6 flex flex-col">
            <p className="text-2xl font-bold">{categoryDetailSSR.name}</p>
            <div className="mt-3 flex text-sm text-neutral-400">
              <p>
                <span className="text-base font-bold text-white">
                  {numberFormatter(categoryDetailSSR.playTimes, 1)}
                </span>
                &nbsp;
                <FormattedMessage id="filter.view" />
              </p>
            </div>
          </div>
        </div>
        <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mappedData?.map((item: VideoObject) => {
            return (
              <div key={item.id} className="pl-5 pb-5">
                <VideoCard data={item} />
              </div>
            )
          })}
        </div>
        {isValidating && (
          <div className="flex h-24 items-center justify-center">
            <LoadingIcon className="h-10 animate-spin" />
          </div>
        )}
      </div>
    </>
  )
}

export default VideosByCategory
