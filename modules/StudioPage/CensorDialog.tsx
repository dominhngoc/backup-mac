import Modal from '@common/components/Modal'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { CloseIcon, CloseSmallIcon, LoadingIcon, NoteIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { Tooltip } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import useSWR from 'swr'

interface Props {
  fomrData?: some
  open: boolean
  onClose: () => void
}
const ContentForm = (props: Props) => {
  const { open, onClose, fomrData } = props
  const { setMessage, dispatch, intl } = useGeneralHook()
  const [loading, setLoading] = useState(false)
  const { handleSubmit, control, reset, setValue } = useForm<{
    channelId: string
    listChannel: some[]
  }>({ defaultValues: { channelId: '', listChannel: [] } })
  const { fields, append, remove } = useFieldArray({
    name: 'listChannel',
    control: control,
    keyName: 'keyName',
  })

  const { data, isValidating } = useSWR(
    fomrData?.id ? API_PATHS.lives.moderator({ live_id: fomrData?.id }) : null,
    async (url) => {
      const json = await dispatch(
        fetchThunk({
          url,
          method: 'get',
        })
      )
      return json?.data?.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  const onSubmit = async (value: some) => {
    const tmp = value?.channelId?.trim()?.split('/')
    const channelId = tmp?.[tmp?.length - 1]
    if (channelId) {
      if (fields?.findIndex((v) => v.id === Number(channelId)) !== -1) {
        setMessage({ message: intl.formatMessage({ id: 'channelIdExisted' }) })
        return
      }
      try {
        setLoading(true)
        const json = await dispatch(
          fetchThunk({ url: API_PATHS?.channel?.detail(channelId) })
        )
        append(json?.data?.data)
        setLoading(false)
      } catch (e: any) {
        if (e.response) {
          setMessage({ message: e.response?.data?.message })
        }
      }
      setValue('channelId', '')
    }
  }

  const onSave = async () => {
    const listAdd = fields?.filter((v) =>
      data?.length > 0 ? data?.findIndex((one) => one.id === v.id) === -1 : true
    )
    const listDelete = data?.filter((v) =>
      fields.length > 0
        ? fields?.findIndex((one) => one.id === v.id) === -1
        : true
    )
    try {
      const json = await Promise.all([
        ...listAdd?.map((v) =>
          dispatch(
            fetchThunk({
              url: API_PATHS.lives.updateModerator,
              method: 'post',
              data: {
                user_id: v.id,
                live_id: fomrData?.id,
                action: 'add',
              },
            })
          )
        ),
        ...listDelete?.map((v) =>
          dispatch(
            fetchThunk({
              url: API_PATHS.lives.updateModerator,
              method: 'post',
              data: {
                user_id: v.id,
                live_id: fomrData?.id,
                action: 'remove',
              },
            })
          )
        ),
      ])
      onClose()
    } catch (e: any) {
      if (e.response) {
        setMessage({ message: e.response?.data?.message })
      }
    }
  }

  useEffect(() => {
    reset({ channelId: '', listChannel: data || [] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (isValidating) {
    return (
      <div className="flex h-70 w-full shrink-0 items-center justify-center">
        <LoadingIcon className="h-10 animate-spin" />
      </div>
    )
  }
  return (
    <>
      <div className="flex items-center">
        <p className="mr-2 font-bold title">
          <FormattedMessage id="addSensor" />
        </p>
        <Tooltip
          content={<FormattedMessage id="sensorNote" />}
          style="light"
          placement="top"
        >
          <NoteIcon className="cursor-pointer" />
        </Tooltip>
        <button
          className="absolute top-0 right-0 p-4 text-neutral-400"
          onClick={() => onClose()}
        >
          <CloseIcon />
        </button>
      </div>
      <div className="mt-10 flex min-h-[64px] flex-wrap items-center rounded-xl bg-neutral-100 pt-4 text-gray-400">
        {fields?.map((item, index) => {
          return (
            <div
              key={item.keyName}
              className="relative ml-8 mb-4 flex h-7 w-fit items-center rounded-r-full bg-neutral-200 pl-6 "
            >
              <ProgressiveImg
                src={item.avatarImage}
                className="avatar absolute -left-4 -top-0.5 h-8 w-8"
              />
              <p className="text-white caption1">{item.name}</p>
              <button
                type="button"
                className="p-2"
                onClick={() => remove(index)}
              >
                <CloseSmallIcon />
              </button>
            </div>
          )
        })}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="channelId"
            control={control}
            rules={{
              validate: (value) => !!value?.trim(),
            }}
            render={({ field: { name, onChange, ref, value = '' } }) => {
              return (
                <>
                  <input
                    className="mb-4 min-w-[500px] bg-transparent py-2 px-4 outline-none"
                    placeholder={intl.formatMessage({
                      id: 'sensorPlaceholder',
                    })}
                    name={name}
                    onChange={onChange}
                    ref={ref}
                    value={value}
                    autoComplete="off"
                  />
                </>
              )
            }}
          />
        </form>
      </div>
      <div className="mt-16 flex justify-end">
        <button type="button" className="btn w-28" onClick={() => onClose()}>
          <FormattedMessage id="cancel" />
        </button>
        <button
          type="button"
          className="btn-container ml-4 w-28"
          onClick={onSave}
          disabled={loading}
        >
          <FormattedMessage id="save" />
        </button>
      </div>
    </>
  )
}
const CensorDialog = (props: Props) => {
  const { open } = props
  return (
    <>
      <Modal open={open} className="w-[730px] bg-bg2 p-5">
        <ContentForm {...props} />
      </Modal>
    </>
  )
}

export default CensorDialog
