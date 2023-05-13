import NoDataFound from '@common/components/NoDataFound'
import { PlayListObject, some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import Head from 'next/head'
import { useCallback, useEffect, useMemo } from 'react'
import useSWRInfinite from 'swr/infinite'
import ChannelInfoBox from '../ChannelInfoBox'
import PlayListsCard, { PlaylistCardSkeleton } from './PlaylistsCard'

export const DEFAULT_FILTER = 'LATEST'
export const DEFAULT_TAB = 'videos'
export const filterGuess: FilterType[] = [
  { label: 'popular', value: 'MOST_VIEW' },
  { label: 'latest', value: 'LATEST' },
  { label: 'oldest', value: 'OLDEST' },
]

export const filterOwner: FilterType[] = [
  ...filterGuess,
  { label: 'waiting', value: 'OWNER_WAIT_APPROVE' },
  { label: 'reject', value: 'OWNER_REJECT' },
]

export interface FilterType {
  label: string
  value: string
}

interface Props {
  channelId: string
  channelInfo: some
  dataCategorySSR: some[]
}
export default function PlaylistChannel(props: Props) {
  const { channelId, channelInfo, dataCategorySSR } = props
  const { router, dispatch, isLogin, userData } = useGeneralHook()
  const { query } = router
  const { id } = query
  const isOwner = isLogin && userData?.id == channelId

  const {
    data: dataVideoCSR = [],
    size,
    setSize,
    isValidating,
    mutate,
  } = useSWRInfinite(
    (index) =>
      id
        ? API_PATHS.playlists.index({
            page_token: index,
            page_size: 12,
            filter: `PLAYLIST_CHANNEL_${id}`,
          })
        : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
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

  return (
    <>
      <Head>
        <title>{channelInfo?.name}</title>
      </Head>
      <MenuCategories hasDivider={true} listCategory={dataCategorySSR} />
      <div className="container pt-6 pb-36 min-h-screen">
        <ChannelInfoBox channelInfo={channelInfo} />
        <div className="mt-6">
          {mappedData.length > 0 && mappedData ? (
            <>
              <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {mappedData?.map((item: PlayListObject, index) => {
                  return (
                    <div className="pl-5 pb-5" key={item.id}>
                      <PlayListsCard
                        data={item}
                        mutate={mutate}
                        isOwner={isOwner}
                      />
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <>
              {!isValidating && (
                <NoDataFound
                  message={isOwner ? 'emptyPlaylist' : 'emptPlaylistChannel'}
                />
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
                          <PlaylistCardSkeleton />
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
        </div>
      </div>
    </>
  )
}
