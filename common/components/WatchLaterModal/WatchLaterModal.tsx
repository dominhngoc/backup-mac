import Checkbox from '@common/components/Checkbox'
import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { AddIcon, CloseIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import Modal from '../Modal'
import PlaylistItem from './PlaylistItem'
interface Props {
  videoData?: VideoObject
  open: boolean
  onClose: (val: boolean) => void
}

const WatchLaterModal = (props: Props) => {
  const { videoData, open, onClose } = props
  const intl = useIntl()
  const { setMessage, userData, dispatch, isLogin } = useGeneralHook()
  const [openForm, setOpenForm] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  const [hasWatchLater, setWatchLater] = useState(false)

  const { handleSubmit, control, reset } = useForm<{
    name: string
  }>()

  const {
    data: listData = [],
    size,
    setSize,
    isValidating,
    mutate,
  } = useSWRInfinite(
    (index) =>
      userData?.id && open && isLogin
        ? API_PATHS.playList.get({
            page_size: 12,
            page_token: index,
            filter: `PLAYLIST_CHANNEL_${userData?.id}`,
          })
        : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }, true))
      return json?.data?.data?.[0]?.contents
    },
    { revalidateAll: false }
  )

  const mappedData = useMemo(() => {
    return listData.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [listData])

  const onCreateList = useCallback(
    async (values) => {
      try {
        const json = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.playList.insert,
              method: 'post',
              data: { name: values.name?.trim() },
            },
            true
          )
        )
        setMessage({ message: json.data?.message })
        mutate()
        reset()
        setOpenForm(false)
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    },
    [dispatch, mutate, reset, setMessage]
  )

  const getCheckList = useCallback(async () => {
    if (!videoData?.id || !open || !isLogin) {
      return
    }
    const json = await dispatch(
      fetchThunk(
        {
          url: API_PATHS.playList.checkVideo,
          method: 'post',
          data: {
            video_id: videoData?.id,
          },
        },
        true
      )
    )
    if (json?.status === 200) {
      setSelected(json?.data.data)
      setWatchLater(json?.data.data?.includes(0))
    }
  }, [videoData?.id, dispatch, isLogin, open])

  useEffect(() => {
    setSelected([])
    setWatchLater(false)
    if (open) {
      mutate()
    }
  }, [mutate, open])

  useEffect(() => {
    getCheckList()
  }, [getCheckList])

  const onScroll = useCallback(
    (e) => {
      if (
        e.currentTarget.scrollTop + e.currentTarget.offsetHeight + 100 * 6 >=
          e.currentTarget.scrollHeight &&
        !isValidating &&
        listData?.length > 0 &&
        listData?.every((v) => v.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [listData, isValidating, setSize, size]
  )

  const saveWatchLater = async () => {
    if (hasWatchLater) {
      try {
        const json = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.users.cache.delete,
              method: 'post',
              data: { ids: videoData?.id + '', type: 'WATCH_LATER' },
            },
            true
          )
        )
        getCheckList()

        if (json.status === 200) {
          setWatchLater((old) => !old)
        }
        setMessage({
          message: json.data?.message,
        })
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    } else {
      try {
        const json = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.users.insertWatchLater,
              method: 'post',
              data: { videoId: videoData?.id },
            },
            true
          )
        )
        getCheckList()
        if (json.status === 200) {
          setWatchLater((old) => !old)
          setMessage({
            message: json.data?.message,
          })
        } else {
          setMessage({ message: json.data?.message })
        }
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    }
  }

  const saveToPlaylist = useCallback(
    async (item, status) => {
      if (!isLogin) {
        return
      }
      try {
        const json = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.playList.toggleVideo,
              method: 'post',
              data: {
                id: item.id,
                status: status ? 1 : 0,
                video_id: videoData?.id,
              },
            },
            true
          )
        )
        if (json.status === 200) {
          getCheckList()
        }
        setMessage({ message: json.data?.message })
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    },
    [dispatch, getCheckList, isLogin, setMessage, videoData?.id]
  )

  useEffect(() => {
    if (!open) setOpenForm(false)
  }, [open])

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        className={'w-full max-w-sm rounded-xl'}
      >
        <div className=" flex h-16 items-center justify-between px-6">
          <p className="flex-1 font-bold title">
            <FormattedMessage id="addList" />
          </p>
          <button
            onClick={() => {
              onClose(false)
            }}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="divider opacity-40" />
        <div className="max-h-60 overflow-auto  px-6 py-1" onScroll={onScroll}>
          <div
            className="flex cursor-pointer items-center py-3"
            onClick={() => {
              saveWatchLater()
            }}
          >
            <Checkbox checked={hasWatchLater} />
            <p className="ml-2">
              <FormattedMessage id="watchLater" />
            </p>
          </div>
          {mappedData.map((item) => {
            return (
              <PlaylistItem
                item={item}
                key={item.id}
                checked={selected.includes(item.id)}
                saveToPlaylist={saveToPlaylist}
              />
            )
          })}
        </div>
        <div className="divider opacity-40" />
        {openForm && (
          <form
            onSubmit={handleSubmit((value) => {
              onCreateList(value)
            })}
          >
            <div className="px-6 py-4">
              <Controller
                name="name"
                control={control}
                rules={{
                  required: true,
                  maxLength: 100,
                  validate: (value) => !!value?.trim(),
                }}
                render={({
                  field: { name, onBlur, onChange, ref, value = '' },
                  fieldState: { invalid },
                }) => {
                  return (
                    <div className="relative">
                      <input
                        className={
                          'text-field pr-14 ' + (invalid ? 'error-field' : '')
                        }
                        name={name}
                        onBlur={onBlur}
                        autoComplete="off"
                        onChange={onChange}
                        ref={ref}
                        autoFocus
                        value={value}
                        placeholder={intl.formatMessage({
                          id: 'enterPlayListName',
                        })}
                      />
                      <p className="absolute top-3.5 right-2 text-neutral-400 caption2">
                        {value.length}/100
                      </p>
                    </div>
                  )
                }}
              />
              <button className="btn-container mt-8 w-full" type="submit">
                <FormattedMessage id="create" />
              </button>
            </div>
          </form>
        )}
        {!openForm && (
          <button
            className="flex h-20 w-full items-center px-6 text-base text-primary"
            onClick={() => setOpenForm(true)}
          >
            <AddIcon className="mr-2" />
            <FormattedMessage id="createNewList" />
          </button>
        )}
      </Modal>
    </>
  )
}

export default WatchLaterModal
