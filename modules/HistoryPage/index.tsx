import {
  SearchObject,
  some,
  SUCCESS_CODE,
  VideoObject,
} from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { SEARCH_KEY } from '@modules/VideoDetailPage/constants'
import {
  CloseIcon,
  DeleteIcon,
  LoadingIcon,
  RadioChecked,
  RadioEmpty,
  SearchIcon,
} from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'
import moment from 'moment'
import Head from 'next/head'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import { useDebounce } from 'usehooks-ts'
import VideoCardHistory, { VideoCardHistorySkeleton } from './VideoCardHistory'
interface Props {
  dataCategorySSR: some[]
}
const HistoryPage = (props: Props) => {
  const { dataCategorySSR } = props
  const { router, dispatch, setMessage, intl, confirmDialog } = useGeneralHook()
  const { close, promptConfirmation } = confirmDialog
  const { query, replace } = router
  const { term, type = 'HISTORY' } = query
  const listKeySearch = () => {
    const keySearch = localStorage.getItem(SEARCH_KEY)
    return keySearch ? JSON.parse(keySearch) : []
  }
  const [history, setHistory] = useState<SearchObject[]>(listKeySearch() || [])
  const { handleSubmit, control, reset } = useForm<any>({
    defaultValues: { term: query.term },
  })

  useEffect(() => {
    reset({ term })
  }, [reset, term])

  const {
    data: dataCSR = [],
    size,
    setSize,
    mutate,
    isValidating,
  } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null
      return index.toString() + 'history'
    },
    async (key) => {
      const json = await dispatch(
        fetchThunk(
          {
            url: API_PATHS.users.cache.get({
              page_token: key.replaceAll('history', ''),
              page_size: 12,
              filter: 'HISTORY',
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
                page_token: key.replaceAll('history', ''),
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
        debouncedSize === size &&
        dataCSR?.every((item) => item?.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [dataCSR, debouncedSize, isValidating, setSize, size]
  )

  const onDeleteKeySearch = useCallback(
    async (index) => {
      const confirm = await promptConfirmation({
        warning: true,
        title: intl.formatMessage({ id: 'deleteSearchConfirm' }),
        okText: 'delete',
      })
      if (confirm) {
        const tmp = history.filter((_, idx) => idx !== index).filter(Boolean)
        setHistory(tmp)
        localStorage.setItem(SEARCH_KEY, JSON.stringify(tmp))
        setMessage({ message: intl.formatMessage({ id: 'deleteFolder' }) })
      }
      close()
    },
    [close, history, intl, promptConfirmation, setMessage]
  )

  const onDeleteAllKeySearch = useCallback(async () => {
    const confirm = await promptConfirmation({
      warning: true,
      title: intl.formatMessage({ id: 'deleteHistorySearchingTitle' }),
      message: intl.formatMessage({ id: 'deleteHistorySearchingContent' }),
      okText: intl.formatMessage({ id: 'deleteHistorySearch' }),
    })
    if (confirm) {
      localStorage.removeItem(SEARCH_KEY)
      setHistory([])
      setMessage({ message: intl.formatMessage({ id: 'deleteAllKeySearch' }) })
    }
    close()
  }, [close, intl, promptConfirmation, setMessage])

  const onDeleteHistory = useCallback(
    async (value: VideoObject) => {
      const confirm = await promptConfirmation({
        warning: true,
        title: intl.formatMessage({ id: 'deleteHistoryVideoConfirm' }),
        okText: 'delete',
      })
      if (confirm) {
        try {
          const json = await dispatch(
            fetchThunk({
              url: API_PATHS.users.cache.delete,
              method: 'post',
              data: {
                type: 'HISTORY',
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

  const onDeleteAllHistory = useCallback(async () => {
    const confirm = await promptConfirmation({
      warning: true,
      title: intl.formatMessage({
        id: 'deleteHistoryWatchingTitle',
      }),
      message: intl.formatMessage({
        id: 'deleteHistoryWatchingContent',
      }),
      okText: intl.formatMessage({
        id: 'deleteHistoryWatched',
      }),
    })
    if (confirm) {
      try {
        const json = await dispatch(
          fetchThunk({
            url: API_PATHS.users.cache.delete,
            method: 'post',
            data: {
              type: type,
              ids: '0',
            },
          })
        )
        if (json.status === SUCCESS_CODE) {
          mutate()
        }
        setMessage({ message: json.data?.message })
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    }
    close()
  }, [close, dispatch, intl, mutate, promptConfirmation, setMessage, type])

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
            id: type === 'HISTORY' ? 'historyWatching' : 'historySearching',
          })}
        </title>
      </Head>
      <MenuCategories listCategory={dataCategorySSR} hasDivider />
      <div className="container py-9 min-h-screen">
        <p className="mb-5 font-semibold title2">
          <FormattedMessage
            id={type === 'HISTORY' ? 'historyWatching' : 'historySearching'}
          />
        </p>
        <div className="flex">
          {type === 'HISTORY' ? (
            <>
              <div className="flex h-fit flex-[3]">
                {(mappedData.length > 0 || isValidating) && (
                  <div className="w-full rounded-lg bg-bg2 p-6 pt-3">
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
                {!isValidating && mappedData.length === 0 && (
                  <div className="w-full pt-6 text-center headline">
                    <FormattedMessage id="noVideoInList" />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex h-fit flex-[3]">
                {history.length > 0 ? (
                  <div className="flex w-full flex-col rounded-lg bg-bg2 p-6 pt-0">
                    {history.map((value, index) => {
                      return (
                        <div
                          key={index}
                          className="mt-6 flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <p className="break-all font-bold headline line-clamp-1">
                              {value.term}
                            </p>
                            <p className="text-neutral-400">
                              {formatDistance(
                                moment(value.time).toDate(),
                                new Date(),
                                {
                                  addSuffix: true,
                                  locale: vi,
                                }
                              )}
                            </p>
                          </div>
                          <button
                            className="p-3"
                            onClick={() => {
                              onDeleteKeySearch(index)
                            }}
                          >
                            <CloseIcon />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="w-full pt-6 text-center headline">
                    <FormattedMessage id="noSearchHistoryKey" />
                  </div>
                )}
              </div>
            </>
          )}
          <div className="ml-5 flex-1">
            {false && (
              <form
                onSubmit={handleSubmit((value) => {
                  replace(
                    { query: { ...query, term: value.term } },
                    undefined,
                    { shallow: true }
                  )
                })}
                className="relative mb-6 flex-1"
              >
                <button className="pointer-events-none absolute inset-y-0 left-1 p-2 text-neutral-400">
                  <SearchIcon />
                </button>
                <Controller
                  name="term"
                  control={control}
                  render={({ field: { value, ref, onChange, onBlur } }) => {
                    return (
                      <>
                        <input
                          className={'text-field px-10'}
                          ref={ref}
                          value={value}
                          onBlur={onBlur}
                          onChange={(e) => {
                            onChange(e.target.value)
                          }}
                          placeholder={intl.formatMessage({
                            id: 'searchHistoryWatching',
                          })}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          {value && (
                            <button
                              type="button"
                              className="p-2 text-neutral-400"
                              onClick={() => {
                                replace(
                                  { query: { ...query, term: '' } },
                                  undefined,
                                  { shallow: true }
                                )
                              }}
                            >
                              <CloseIcon />
                            </button>
                          )}
                        </div>
                      </>
                    )
                  }}
                />
              </form>
            )}
            <div className="mb-6">
              <p className="px-6 py-3 font-bold headline">
                <FormattedMessage id="chooseTypeHistory" />
              </p>
              <button
                className="flex px-6 py-3"
                onClick={() => {
                  replace({ query: { ...query, type: 'HISTORY' } })
                }}
              >
                {type === 'HISTORY' ? (
                  <RadioChecked className="text-primary" />
                ) : (
                  <RadioEmpty className="text-neutral-500" />
                )}
                <p className="ml-3">
                  <FormattedMessage id="historyWatching" />
                </p>
              </button>
              <button
                className="flex px-6 py-3"
                onClick={() => {
                  replace({ query: { ...query, type: 'SEARCH' } }, undefined, {
                    shallow: true,
                  })
                }}
              >
                {type === 'SEARCH' ? (
                  <RadioChecked className="text-primary" />
                ) : (
                  <RadioEmpty className="text-neutral-500" />
                )}
                <p className="ml-3">
                  <FormattedMessage id="historySearching" />
                </p>
              </button>
            </div>
            <button
              className="btn-outlined w-full"
              onClick={() => {
                if (type !== 'SEARCH') {
                  onDeleteAllHistory()
                } else {
                  onDeleteAllKeySearch()
                }
              }}
            >
              <DeleteIcon className="mr-2" />
              <FormattedMessage
                id={
                  type === 'HISTORY'
                    ? 'deleteHistoryWatching'
                    : 'deleteHistorySearching'
                }
              />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
export default HistoryPage
