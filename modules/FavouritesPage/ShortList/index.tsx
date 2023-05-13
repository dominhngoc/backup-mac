import ShortVideoCard, {
  ShortVideoCardSkeleton,
} from '@common/components/ShortVideoCard'
import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'

interface Props {}

const ShortList = (props: Props) => {
  const { isLogin, dispatch } = useGeneralHook()
  const {
    data: dataShortCSR = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      isLogin
        ? API_PATHS.favourites.videos({
            page_token: index,
            page_size: 10,
            filter: 'LIKE_SHORT',
          })
        : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }, true))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  )

  const mappedData = useMemo(() => {
    return dataShortCSR?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [dataShortCSR])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 290 * 2 &&
        !isValidating &&
        dataShortCSR?.length > 0 &&
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

  if (isValidating && size === 1) {
    return (
      <div className="-ml-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {Array(6)
          .fill(0)
          .map((_, index) => {
            return (
              <div className="pl-5 pb-5" key={index}>
                <ShortVideoCardSkeleton key={index} />
              </div>
            )
          })}
      </div>
    )
  }
  return (
    <>
      <div className="-ml-5 -mb-5 flex flex-wrap">
        {mappedData?.map((item: VideoObject, index) => {
          return (
            <div className="pl-5 pb-5" key={index}>
              <ShortVideoCard
                key={index}
                data={item}
                query={{
                  id: item.id,
                }}
                className="relative flex h-[410px] w-[231px] shrink-0 flex-col"
              />
            </div>
          )
        })}
      </div>
      {!isValidating && mappedData.length === 0 && (
        <div className="mt-17 text-center font-bold headline">
          <FormattedMessage id="emptyShortVideo" />
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
export default ShortList
