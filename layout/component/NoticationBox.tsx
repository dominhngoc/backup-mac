import Popper from '@common/components/Popper'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { LoadingIcon, MarkReadIcon, NotificationIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import EmptyNotiBox from './EmptyNotiBox'
import NotiCard from './NotiCard'

const NoticationContent = () => {
  const { dispatch, setMessage, router } = useGeneralHook()

  const {
    data: listNoti = [],
    size,
    setSize,
    isValidating,
    mutate,
  } = useSWRInfinite(
    (index) =>
      API_PATHS.notifications.get({
        page_token: index,
        page_size: 12,
      }),
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data
    },
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  )

  const mappedData = useMemo(() => {
    return listNoti.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [listNoti])

  const todayNoti = useMemo(() => {
    return mappedData.filter((v) => moment(v.sent_time).isSame(moment(), 'day'))
  }, [mappedData])

  const lastWeekNoti = useMemo(() => {
    return mappedData.filter(
      (v) =>
        !moment(v.sent_time).isSame(moment(), 'day') &&
        moment(v.sent_time).isSame(moment(), 'week')
    )
  }, [mappedData])

  const olderNoti = useMemo(() => {
    return mappedData.filter(
      (v) => !moment(v.sent_time).isSame(moment(), 'week')
    )
  }, [mappedData])

  const markReadAll = async (values) => {
    try {
      const json = await dispatch(
        fetchThunk(
          {
            url: API_PATHS.notifications.read,
            method: 'post',
            data: values,
          },
          true
        )
      )
      mutate()
      setMessage({ message: json.data?.message })
    } catch (e: any) {
      setMessage({ message: e.response?.data?.message })
    }
  }

  return (
    <>
      <div className="absolute right-1 h-4 w-4 -translate-y-1 rotate-45 bg-bg2" />
      <div className="overflow-hiddenx flex max-h-[65vh] w-109 flex-col">
        <div className="flex items-center">
          <div className="flex-1 p-4 font-bold headline">
            <FormattedMessage id="notify" />
          </div>
          {mappedData?.length > 0 && (
            <button className="p-4" onClick={() => markReadAll({ ids: 'ALL' })}>
              <MarkReadIcon />
            </button>
          )}
        </div>

        <div
          className={`min-h-[384px] flex-1 overflow-auto`}
          onScroll={(e) => {
            e.stopPropagation()
            if (
              e.currentTarget.scrollLeft + e.currentTarget.offsetWidth + 260 >=
                e.currentTarget.scrollWidth &&
              !isValidating &&
              listNoti?.length > 0 &&
              listNoti?.every((v) => v?.length > 0)
            ) {
              setSize(size + 1)
            }
          }}
        >
          {todayNoti?.length > 0 ? (
            <>
              <p className="p-3 font-semibold">
                <FormattedMessage id="today" />
              </p>
              {todayNoti?.map((item) => {
                return (
                  <NotiCard key={item.record_id} data={item} mutate={mutate} />
                )
              })}
            </>
          ) : null}
          {lastWeekNoti?.length > 0 ? (
            <>
              <p className="p-3 font-semibold">
                <FormattedMessage id="thisWeek" />
              </p>
              {lastWeekNoti?.map((item) => {
                return (
                  <NotiCard key={item.record_id} data={item} mutate={mutate} />
                )
              })}
            </>
          ) : null}
          {olderNoti?.length > 0 ? (
            <>
              <p className="p-3 font-semibold">
                <FormattedMessage id="older" />
              </p>
              {olderNoti?.map((item) => {
                return (
                  <NotiCard key={item.record_id} data={item} mutate={mutate} />
                )
              })}
            </>
          ) : null}
          {!isValidating && mappedData?.length === 0 && <EmptyNotiBox />}
          {isValidating && (
            <div className="flex h-40 items-center justify-center">
              <LoadingIcon className="h-10 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
const NoticationBox = () => {
  const { dispatch, setMessage, router } = useGeneralHook()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [router.asPath])

  return (
    <>
      <Popper
        open={open}
        setOpen={setOpen}
        className="mx-6"
        wrapper={<NotificationIcon />}
        classNamePaper="z-50 mt-6 overflow-hidden -mr-6 "
        options={{
          modifiers: [
            {
              name: 'arrow',
              options: {
                element: 'dsa',
              },
            },
          ],
        }}
      >
        <NoticationContent />
      </Popper>
    </>
  )
}
export default NoticationBox
