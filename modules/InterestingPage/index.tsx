import { some, VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import EmptyNotiBox from '@layout/component/EmptyNotiBox'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import Head from 'next/head'
import { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'

import VideoCard from '../../common/components/VideoCard'
interface Props {
  dataSSR: VideoObject[]
  dataCategorySSR: some[]
}
const InterestingPage = (props: Props) => {
  const { dataSSR, dataCategorySSR } = props

  const { intl, dispatch } = useGeneralHook()

  const {
    data = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      API_PATHS.home.videos({
        page_token: index + 1,
        page_size: 12,
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
      persistSize: true,
    }
  )

  const mappedData = useMemo(() => {
    return data.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, dataSSR)
  }, [data, dataSSR])

  const onScroll = useCallback(() => {
    if (
      window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 320 &&
      !isValidating &&
      dataSSR?.length > 0 &&
      data?.every((item) => item?.length > 0)
    ) {
      setSize(size + 1)
    }
  }, [data, dataSSR?.length, isValidating, setSize, size])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'doYouLikeIt' })}</title>
      </Head>
      <MenuCategories listCategory={dataCategorySSR} />
      <div className="container mb-20 min-h-screen">
        <div className="mb-5 mt-10 flex ">
          <p className="font-bold title2">
            <FormattedMessage id="doYouLikeIt" />
          </p>
        </div>
        <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mappedData?.map((item: VideoObject, index) => {
            return (
              <div className="pl-5 pb-5" key={item.id}>
                <VideoCard data={item} key={index} />
              </div>
            )
          })}
        </div>
        {!isValidating && mappedData?.length === 0 && <EmptyNotiBox />}
        {isValidating && (
          <div className="flex h-40 items-center justify-center">
            <LoadingIcon className="h-10 animate-spin" />
          </div>
        )}
      </div>
    </>
  )
}

export default InterestingPage
