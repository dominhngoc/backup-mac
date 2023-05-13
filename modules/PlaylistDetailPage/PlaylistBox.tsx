import NoDataFound from '@common/components/NoDataFound'
import VideoPlaylistCard, {
  VideoPlaylistSkeleton,
} from '@common/components/VideoPlaylistCard'
import { PlayListObject, VideoObject } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import { LoadingIcon } from '@public/icons'
import { useMemo } from 'react'
import { SWRInfiniteResponse } from 'swr/infinite'

interface Props {
  playlistInfo: PlayListObject
  swr: SWRInfiniteResponse
  revalidate?: () => void
}

export const PlaylistBox = (props: Props) => {
  const { playlistInfo, swr, revalidate } = props
  const { router } = useGeneralHook()
  const { query } = router
  const id = query?.id as string

  const { data: dataCSR = [], size, setSize, isValidating, mutate } = swr

  const mappedData = useMemo(() => {
    return dataCSR.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [dataCSR])

  return (
    <>
      <div
        className="flex h-[576px] flex-1 flex-col overflow-auto"
        onScroll={(e) => {
          if (
            e.currentTarget.scrollTop + e.currentTarget.offsetHeight + 80 * 4 >=
              e.currentTarget.scrollHeight &&
            !isValidating &&
            dataCSR?.length > 0 &&
            dataCSR?.every((v) => v.length > 0)
          ) {
            setSize(size + 1)
          }
        }}
      >
        {mappedData?.map((item: VideoObject, index) => {
          return (
            <VideoPlaylistCard
              key={index}
              index={index + 1}
              videoData={item}
              playlistInfo={playlistInfo}
              mutate={() => {
                mutate()
                revalidate && revalidate()
              }}
            />
          )
        })}
        {!isValidating && !mappedData.length && <NoDataFound />}
        {isValidating &&
          (size === 1 ? (
            <>
              <VideoPlaylistSkeleton />
              <VideoPlaylistSkeleton />
              <VideoPlaylistSkeleton />
              <VideoPlaylistSkeleton />
            </>
          ) : (
            <div className="flex h-[264px] items-center justify-center">
              <LoadingIcon className="h-10 animate-spin" />
            </div>
          ))}
      </div>
    </>
  )
}

export default PlaylistBox
