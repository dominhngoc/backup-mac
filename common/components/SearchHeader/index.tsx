import { SearchObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { SEARCH_KEY } from '@modules/VideoDetailPage/constants'
import { CloseIcon, LoadingIcon, SearchIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import { uniq } from 'lodash'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useSWR from 'swr'
import { useDebounce } from 'usehooks-ts'
import NoDataFound from '../NoDataFound'

const MAX_ITEM_SAVE_LOCAL = 20

interface Props {}
const SearchHeader = (props: Props) => {
  const { router, intl, dispatch } = useGeneralHook()
  const { push, query } = router
  const [focus, setFocus] = useState(false)
  const [popperElement, setPopperElement] = useState<any>(null)
  const listKeySearch = () => {
    const keySearch = localStorage.getItem(SEARCH_KEY)
    return keySearch ? JSON.parse(keySearch) : []
  }

  const { handleSubmit, control, reset, watch } = useForm<any>({
    defaultValues: { query: query.term },
  })

  const term = watch('term')

  const queryDebounce = useDebounce(term, 350) || ''

  const [history, setHistory] = useState<SearchObject[]>(listKeySearch() || [])

  const { data: searchData, isValidating: loadingSearch } = useSWR(
    queryDebounce?.length > 1
      ? API_PATHS.search.suggestion({ query: queryDebounce })
      : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  const onSearch = (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      return
    }
    const keySearch = listKeySearch()
    const tmp = uniq([
      { term: searchTerm, time: moment().valueOf() },
      ...keySearch,
    ])
      .filter(Boolean)
      ?.slice(0, MAX_ITEM_SAVE_LOCAL)
    setHistory(tmp)
    localStorage.setItem(SEARCH_KEY, JSON.stringify(tmp))
    push({
      pathname: ROUTES.search.index,
      query: { term: searchTerm },
    })
    setFocus(false)
  }

  const onDeleteKeySearch = useCallback(
    (index) => {
      const tmp = history.filter((_, idx) => idx !== index).filter(Boolean)
      setHistory(tmp)
      localStorage.setItem(SEARCH_KEY, JSON.stringify(tmp))
    },
    [history]
  )

  useEffect(() => {
    reset({ term: query.term })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.term])

  const checkEmptyHistory = () => {
    if (queryDebounce?.length >= 2) {
      if (searchData?.length > 0) {
        return false
      }
    } else {
      if (
        history?.filter((v) => v.term && v.term.includes(queryDebounce))
          ?.length > 0
      ) {
        return false
      }
    }
    return true
  }
  const getHistory = () => {
    try {
      const arr: Array<any> = []
      history.forEach((i) => {
        arr.push(i.term)
      })
      var newArr: Array<any> = []
      for (var i = 0; i < arr.length; i++) {
        if (!newArr.includes(arr[i])) {
          newArr.push(arr[i])
        }
      }
      const result: Array<any> = []
      for (let i = 0; i < newArr.length; i++) {
        const element = history.find((item) => item.term === newArr[i])
        result.push(element)
      }
      return result
    } catch (error) {
      return history
    }
  }

  const handleClickOutside = useCallback(
    (event: any) => {
      if (popperElement && !popperElement.contains(event.target)) {
        setFocus(false)
      }
    },
    [popperElement]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  return (
    <div
      className="relative flex w-[220px] flex-col p-0 text-neutral-400 lg:w-[280px] xl:w-[320px] 2xl:w-[360px]"
      tabIndex={-1}
      ref={setPopperElement}
    >
      <form
        onSubmit={handleSubmit((value) => {
          onSearch(value.term)
        })}
      >
        <Controller
          name="term"
          control={control}
          rules={{
            required: true,
            validate: (value) => !!value?.trim(),
          }}
          render={({
            field: { value, ref, onChange, onBlur },
            fieldState: { invalid },
          }) => {
            return (
              <div className="relative">
                <button className="pointer-events-none absolute inset-y-0 left-1 p-2 text-neutral-400">
                  <SearchIcon />
                </button>
                <input
                  className={
                    'text-field px-10 ' + (invalid ? 'error-field' : '')
                  }
                  ref={ref}
                  value={value}
                  onBlur={onBlur}
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                  onFocus={() => setFocus(true)}
                  placeholder={intl.formatMessage({ id: 'search' })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  {value && (
                    <button
                      type="button"
                      className="p-2 text-neutral-400"
                      onClick={() => {
                        onChange('')
                      }}
                    >
                      <CloseIcon />
                    </button>
                  )}
                </div>
              </div>
            )
          }}
        />
      </form>
      <div
        className={
          'absolute top-12 z-50 w-full rounded-xl bg-bg2 bg-opacity-60 backdrop-blur-xl'
        }
        style={{
          display: focus ? 'block' : 'none',
          padding: checkEmptyHistory() ? '0px' : '12px 0px',
        }}
      >
        <div className={'max-h-[410px] overflow-y-auto px-3'}>
          {queryDebounce?.length >= 2 ? (
            <>
              {loadingSearch ? (
                <div className="flex h-24 w-full shrink-0 items-center justify-center">
                  <LoadingIcon className="h-10 animate-spin" />
                </div>
              ) : searchData?.length > 0 ? (
                searchData?.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      {index != 0 && <div className="divider-light" />}
                      <button
                        className={'flex items-center gap-4 py-2 text-left'}
                        onClick={() => {
                          onSearch(item.name)
                        }}
                      >
                        <p className="flex-1 cursor-pointer break-all text-base text-white line-clamp-1 hover:font-bold ">
                          {item.name}
                        </p>
                      </button>
                    </React.Fragment>
                  )
                })
              ) : (
                <NoDataFound className="md:mt-0" />
              )}
            </>
          ) : (
            getHistory()
              ?.filter((v) => v.term && v.term?.includes(queryDebounce))
              .map((value, index) => (
                <div
                  key={index}
                  onClick={() => {
                    onSearch(value.term)
                  }}
                  className="z-0 flex w-full items-center justify-between border-b-[1px] border-neutral-100 py-2"
                >
                  <span className="flex-1 cursor-pointer break-all text-base text-white line-clamp-1 hover:font-bold">
                    {value.term}
                  </span>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteKeySearch(index)
                    }}
                  >
                    <CloseIcon className={'z-10 cursor-pointer'} />
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchHeader
