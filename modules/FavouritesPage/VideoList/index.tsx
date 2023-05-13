import NoDataFound from '@common/components/NoDataFound'
import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { VideoCardHorizontalSkeleton } from '@modules/VideoDetailPage/VideoCardHorizontal'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { useCallback, useEffect, useMemo } from 'react'
import useSWRInfinite from 'swr/infinite'
import VideoCard from './VideoCard'
import { FormattedMessage } from 'react-intl'

interface Props {}

const VideoList = (props: Props) => {
  const { isLogin, dispatch } = useGeneralHook()
  const {
    data: dataVideoCSR = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      isLogin
        ? API_PATHS.favourites.videos({
            page_token: index,
            page_size: 10,
            filter: 'LIKE_VIDEO',
          })
        : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }, true))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateFirstPage: true,
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  )

  const mappedData = useMemo(() => {
    return dataVideoCSR?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [dataVideoCSR])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 290 * 2 &&
        !isValidating &&
        dataVideoCSR?.length > 0 &&
        dataVideoCSR?.every((item) => item.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [dataVideoCSR, isValidating, setSize, size]
  )

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  if (isValidating && size === 1) {
    return (
      <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array(8)
          .fill(0)
          .map((_, index) => {
            return (
              <div className="pl-5 pb-5" key={index}>
                <VideoCardHorizontalSkeleton key={index} />
              </div>
            )
          })}
      </div>
    )
  }
  return (
    <>
      <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mappedData?.map((item: VideoObject, index) => {
          return (
            <div className="pl-5 pb-5" key={index}>
              <VideoCard data={item} />
            </div>
          )
        })}
      </div>
      {!isValidating && mappedData.length === 0 && (
        <div className='mt-17 text-center headline font-bold'>
          <FormattedMessage id="emptyVideoFavourite" />
        </div>
      )}
      {isValidating && (
        <div className="flex h-36 w-full shrink-0 items-center justify-center">
          <LoadingIcon className="h-10 animate-spin" />
        </div>
      )}
    </>
  )
}
export default VideoList
