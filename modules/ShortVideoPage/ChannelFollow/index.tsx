import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import ChannelCard, { ChanelCardSkeleton } from './ChannelCard'

interface Props {}

const ChannelFollow = (props: Props) => {
  const { dispatch } = useGeneralHook()
  const [touched, setTouched] = useState<VideoObject | undefined>(undefined)

  const {
    data = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      API_PATHS.shorts.list({
        page_token: index,
        page_size: 12,
        filter: ['CHANNEL_FOLLOW'],
      }),
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnMount: true,
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
          document.body.offsetHeight - 420 &&
        !isValidating &&
        data.length > 0 &&
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
    <div className="flex flex-1 flex-col items-center px-6 pb-24">
      <div className="-mt-5 -ml-5 grid w-fit grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {mappedData.map((item) => {
          return (
            <ChannelCard
              key={item.id}
              data={item}
              touchedData={touched}
              onHover={setTouched}
            />
          )
        })}
        {isValidating && size === 1 && (
          <>
            <ChanelCardSkeleton />
            <ChanelCardSkeleton className="hidden md:block" />
            <ChanelCardSkeleton className="hidden lg:block" />
          </>
        )}
      </div>
      {isValidating && size !== 1 && (
        <div className="flex h-48 items-center justify-center">
          <LoadingIcon className="h-10 animate-spin" />
        </div>
      )}
    </div>
  )
}
export default ChannelFollow
