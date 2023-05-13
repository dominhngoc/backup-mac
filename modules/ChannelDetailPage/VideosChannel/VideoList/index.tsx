import MyLink from '@common/components/MyLink'
import NoDataFound from '@common/components/NoDataFound'
import VideoCard, { VideoCardSkeleton } from '@common/components/VideoCard'
import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { AddIcon, LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import { DEFAULT_FILTER } from '..'

interface Props {
  channelId?: string
  isOwner: boolean
}

const VideoList = (props: Props) => {
  const { channelId, isOwner } = props
  const { dispatch, router } = useGeneralHook()
  const { query } = router
  const { filter = DEFAULT_FILTER } = query

  const {
    data: dataVideoCSR = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      API_PATHS.videos.index({
        page_token: index,
        page_size: 12,
        filter: ['OWNER_WAIT_APPROVE', 'OWNER_REJECT'].includes(
          filter as string
        )
          ? [filter]
          : [filter, `CHANNEL_${channelId}`],
      }),
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateFirstPage: false,
      revalidateOnMount: true,
    }
  )

  const mappedData = useMemo(() => {
    return dataVideoCSR.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [dataVideoCSR])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 200 * 2 &&
        !isValidating &&
        dataVideoCSR.length > 0 &&
        dataVideoCSR?.every((item) => item?.length > 0)
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

  return (
    <>
      {mappedData.length > 0 && mappedData ? (
        <>
          <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {mappedData?.map((item: VideoObject, index) => {
              return (
                <div className="pl-5 pb-5" key={item.id}>
                  <VideoCard data={item} />
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <>
          {!isValidating && (
            <NoDataFound message="emptyVideo">
              {isOwner ? (
                <>
                  <p className="headline mt-2 font-bold">
                    <FormattedMessage id="emptyVideo" />
                  </p>
                  <p className="my-3 mt-3 text-neutral-400">
                    <FormattedMessage id="createShareVideo" />
                  </p>
                  <MyLink
                    href={{ pathname: ROUTES.upload.index }}
                    className="btn-container"
                  >
                    <AddIcon className="mr-2" />
                    <FormattedMessage id="createVideo" />
                  </MyLink>
                </>
              ) : (
                <>
                  <p className="headline mt-2 ">
                    <FormattedMessage id="emptyVideoChannel" />
                  </p>
                </>
              )}
            </NoDataFound>
          )}
        </>
      )}

      {isValidating &&
        (size === 1 ? (
          <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <>
              {Array(12)
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
    </>
  )
}
export default VideoList
