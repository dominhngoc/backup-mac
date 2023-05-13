import { some, SUCCESS_CODE, VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import VideoCardHistory, {
  VideoCardHistorySkeleton,
} from '@modules/HistoryPage/VideoCardHistory'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import Head from 'next/head'
import { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import { useDebounce } from 'usehooks-ts'
interface Props {
  dataCategorySSR: some[]
}
const WatchLaterPage = (props: Props) => {
  const { dataCategorySSR } = props
  const { dispatch, setMessage, confirmDialog, intl } = useGeneralHook()
  const { promptConfirmation, close } = confirmDialog
  const {
    data: dataCSR = [],
    size,
    setSize,
    mutate,
    isValidating,
  } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null
      return index.toString() + 'watch-later'
    },
    async (key) => {
      const json = await dispatch(
        fetchThunk(
          {
            url: API_PATHS.users.cache.get({
              page_token: key.replaceAll('watch-later', ''),
              page_size: 12,
              filter: 'WATCH_LATER',
            }),
            method: 'get',
          },
          true
        )
      )
      if (json?.data?.data?.[0]?.ids) {
        const json2 = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.videos.index({
                page_token: key.replaceAll('watch-later', ''),
                page_size: 12,
                filter: `IDS_${json?.data?.data?.[0]?.ids}`,
              }),
              method: 'get',
            },
            true
          )
        )
        return json2?.data?.data?.[0]?.contents
      }
      return []
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateFirstPage: false,
      revalidateAll: false,
    }
  )

  const debouncedSize = useDebounce<number>(size, 0)

  const mappedData = useMemo(() => {
    return dataCSR.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [dataCSR])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 80 * 3 &&
        !isValidating &&
        dataCSR?.length > 0 &&
        size === debouncedSize &&
        dataCSR?.every((item) => item?.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [dataCSR, debouncedSize, isValidating, setSize, size]
  )

  const onDeleteHistory = useCallback(
    async (value: VideoObject) => {
      const confirm = await promptConfirmation({
        warning: true,
        title: intl.formatMessage({ id: 'deleteVideoWatchLaterConfirm' }),
        okText: 'delete',
      })
      if (confirm) {
        try {
          const json = await dispatch(
            fetchThunk({
              url: API_PATHS.users.cache.delete,
              method: 'post',
              data: {
                type: 'WATCH_LATER',
                ids: value.id,
              },
            })
          )
          close()
          if (json.status === SUCCESS_CODE) {
            await mutate()
          }
          setMessage({ message: json.data?.message })
        } catch (e: any) {
          setMessage({ message: e.response?.data?.message })
        }
      } else {
        close()
      }
    },
    [close, dispatch, intl, mutate, promptConfirmation, setMessage]
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
        <title>
          {intl.formatMessage({
            id: 'watchLater',
          })}
        </title>
      </Head>
      <MenuCategories listCategory={dataCategorySSR} hasDivider />
      <div className="container py-9 min-h-screen">
        <p className="mb-5 font-semibold title2">
          <FormattedMessage id={'watchLater'} />
        </p>
        <div className="flex">
          <div className="flex flex-[3]">
            {mappedData.length > 0 && (
              <div className="flex w-full flex-col rounded-lg bg-bg2 p-6 pt-3">
                {mappedData?.map((item: VideoObject, index) => {
                  return (
                    <VideoCardHistory
                      key={index}
                      data={item}
                      onDelete={onDeleteHistory}
                    />
                  )
                })}
                {isValidating &&
                  (size === 1 && !dataCSR.length ? (
                    Array(4)
                      .fill(0)
                      .map((_, index) => {
                        return <VideoCardHistorySkeleton key={index} />
                      })
                  ) : (
                    <div className="flex h-36 w-full shrink-0 items-center justify-center">
                      <LoadingIcon className="h-10 animate-spin" />
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="ml-5 flex-1" />
        </div>
        {!isValidating && mappedData.length === 0 && (
          <div className="w-full pt-6 text-center headline">
            <FormattedMessage id="noVideoInList" />
          </div>
        )}
      </div>
    </>
  )
}
export default WatchLaterPage
