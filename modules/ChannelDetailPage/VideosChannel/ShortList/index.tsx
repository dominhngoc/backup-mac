import MyLink from '@common/components/MyLink'
import NoDataFound from '@common/components/NoDataFound'
import ShortVideoCard, {
  ShortVideoCardSkeleton,
} from '@common/components/ShortVideoCard'
import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { AddIcon, LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import { DEFAULT_FILTER } from '..'

interface Props {
  channelId?: string
  isOwner: boolean
}

const ShortList = (props: Props) => {
  const { channelId, isOwner } = props
  const { dispatch, router } = useGeneralHook()
  const { query } = router
  const { filter = DEFAULT_FILTER } = query

  const {
    data: dataShortCSR = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      API_PATHS.channel.short({
        page_token: index,
        page_size: 12,
        filter: [`CHANNEL_${channelId}`, filter],
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

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 200 * 2 &&
        !isValidating &&
        dataShortCSR.length > 0 &&
        dataShortCSR?.every((item) => item.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [dataShortCSR, isValidating, setSize, size]
  )

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])
  console.log(dataShortCSR)

  return (
    <>
      {dataShortCSR[0]?.length > 0 ? (
        <>
          <div className="-ml-5 -mb-5 grid md:grid-cols-5 lg:grid-cols-7">
            {dataShortCSR.map((value, pageSize) => {
              return value?.map((item: VideoObject, slideIndex) => {
                return (
                  <div className="pl-5 pb-5" key={item.id}>
                    <ShortVideoCard
                      theme="playlist"
                      data={item}
                      query={{
                        type: 'channel',
                        channelId: channelId,
                        filter: filter,
                        slideIndex,
                        pageSize,
                      }}
                    />
                  </div>
                )
              })
            })}
          </div>
        </>
      ) : (
        <>
          {!isValidating && (
            <NoDataFound message="emptyVideo">
              {isOwner ? (
                <>
                  <p className="mt-2 font-bold headline">
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
                  <p className="mt-2 headline ">
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
          <div className="-ml-5 -mb-5 grid md:grid-cols-5 lg:grid-cols-7">
            {Array(14)
              .fill(0)
              .map((_, index) => {
                return (
                  <div className="pl-5 pb-5" key={index}>
                    <ShortVideoCardSkeleton />
                  </div>
                )
              })}
          </div>
        ) : (
          <div className="flex h-36 w-full shrink-0 items-center justify-center">
            <LoadingIcon className="h-10 animate-spin" />
          </div>
        ))}
    </>
  )
}
export default ShortList
