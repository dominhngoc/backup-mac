import ScrollMenu from '@common/components/ScrollMenu'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { useMemo } from 'react'
import useSWRInfinite from 'swr/infinite'
import ChannelCard from './ChannelCard'

interface Props {}
const ChannelFollowedBox = (props: Props) => {
  const { dispatch } = useGeneralHook()

  const {
    data = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) => {
      return API_PATHS.channel.list({
        filter: `CHANNEL_FOLLOW`,
        page_size: 12,
        page_token: index,
      })
    },
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateAll: false,
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    }
  )

  const mappedData = useMemo(() => {
    return data?.reduce((v, c) => {
      return [...(v || []), ...(c || [])]
    }, [])
  }, [data])

  return (
    <>
      <ScrollMenu
        step={(w, c) => (3 * w) / c.length}
        onScroll={(e) => {
          if (
            e.currentTarget.scrollLeft + e.currentTarget.offsetWidth + 400 >=
              e.currentTarget.scrollWidth &&
            !isValidating &&
            data?.length > 0 &&
            data?.every((v) => v?.length > 0)
          ) {
            setSize(size + 1)
          }
        }}
      >
        {mappedData?.map((item, index) => (
          <ChannelCard data={item} key={item.id} className="w-56 shrink-0" />
        ))}
        {isValidating &&
          (size === 1 ? (
            <div className="flex">
              <>
                {Array(6)
                  .fill(0)
                  .map((_, index) => {
                    return (
                      <div
                        className="flex h-52 w-56 shrink-0 animate-pulse flex-col items-center"
                        key={index}
                      >
                        <div className="avatar h-28 w-28 shrink-0 bg-bg2" />
                        <div className="mt-3 h-4 w-40 rounded bg-bg2" />
                        <div className="mt-2 h-3 w-20 rounded bg-bg2" />
                        <div className="mt-3 h-8 w-36 rounded bg-bg2" />
                      </div>
                    )
                  })}
              </>
            </div>
          ) : (
            <div className="flex h-52 w-56 shrink-0 items-center justify-center">
              <LoadingIcon className="h-10 animate-spin" />
            </div>
          ))}
      </ScrollMenu>
    </>
  )
}
export default ChannelFollowedBox
