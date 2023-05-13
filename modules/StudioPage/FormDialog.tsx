import Modal from '@common/components/Modal'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import SelectElement from '@common/SelectElement'
import { CameraUpLoadImgIcon, CloseIcon } from '@public/icons'
import { AppState } from '@redux/store'
import { API_PATHS } from '@utility/API_PATH'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'

interface Props {
  formData?: some
  open: boolean
  onClose: () => void
  onSubmit: (value: some) => void
}

const FormDialog = (props: Props) => {
  const { open, onClose, formData, onSubmit } = props
  const { setMessage, dispatch, intl } = useGeneralHook()
  const [key, setKey] = useState(0)
  const listCategory = useSelector(
    (appState: AppState) => appState.studio.listCategory,
    shallowEqual
  )
  const [avatar, setAvatar] = useState<string>(formData?.coverImage)
  const { handleSubmit, reset, setValue, control } = useForm<{
    name: string
    description?: string
    categoryId?: string
    token_image?: string
  }>()

  const onUploadImage = async (e) => {
    setKey((old) => old + 1)
    const target = e.target as HTMLInputElement
    const listFiles = target.files
    if (listFiles && listFiles.length > 0) {
      try {
        const json = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.users.pushImg + 'img',
              method: 'post',
              headers: { 'Content-Type': 'multipart/form-data' },
              data: {
                file: listFiles[0],
              },
              onUploadProgress: (event) => {
                const { loaded, total } = event
                let percent = Math.floor((loaded * 100) / total)
                if (percent < 100) {
                }
              },
            },
            true
          )
        )
        if (json?.data?.data?.token) {
          setValue('token_image', json?.data?.data?.token)
          var reader = new FileReader()
          reader.readAsDataURL(listFiles[0])
          reader.onload = function () {
            const data: any = reader.result
            setAvatar(data)
          }
        }
      } catch (error: any) {
        setMessage({ message: error.response?.data?.message })
      }
    }
  }

  useEffect(() => {
    reset(formData)
    setAvatar(formData?.coverImage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

  return (
    <>
      <Modal open={open} className="w-[730px] bg-bg2 p-8">
        <div className="flex items-center">
          <p className="flex-1 font-bold title">
            <FormattedMessage
              id={formData?.id ? 'updateStudio' : 'createStudio'}
            />
          </p>
          <button
            className="absolute top-0 right-0 p-4 text-neutral-400"
            onClick={() => onClose()}
          >
            <CloseIcon />
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit, (e) => {
            setMessage({ message: Object.values(e)[0]?.message })
          })}
          className="mt-12"
        >
          <div className="flex">
            <div className="mr-10 flex-1">
              <Controller
                name="name"
                control={control}
                rules={{
                  required: intl.formatMessage({ id: 'required' }),
                  validate: (value) =>
                    value?.trim().length > 100
                      ? intl.formatMessage({ id: 'maxLength' }, { num: 100 })
                      : true,
                }}
                render={({
                  field: { name, onBlur, onChange, ref, value = '' },
                  fieldState: { invalid },
                }) => {
                  return (
                    <div className="relative">
                      <p className="ml-2 mb-2 font-bold uppercase text-neutral-300 caption2">
                        <FormattedMessage id="title" />*
                      </p>
                      <input
                        className={
                          'text-field ' + (invalid ? 'error-field' : '')
                        }
                        name={name}
                        onBlur={onBlur}
                        autoComplete="off"
                        onChange={onChange}
                        ref={ref}
                        autoFocus
                        value={value}
                        placeholder={intl.formatMessage({
                          id: 'titleEnter',
                        })}
                      />
                    </div>
                  )
                }}
              />
              <Controller
                name="categoryId"
                control={control}
                render={({ field: { onChange, value = '', ref } }) => {
                  return (
                    <div className="relative mt-6">
                      <p className="ml-2 mb-2 font-bold uppercase text-neutral-300 caption2">
                        <FormattedMessage id="type" />
                      </p>
                      <SelectElement
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        placeholder={intl.formatMessage({
                          id: 'typeSelect',
                        })}
                        options={listCategory?.map((v) => {
                          return { value: v.id, label: v.name }
                        })}
                        rawOption
                      />
                    </div>
                  )
                }}
              />
              <Controller
                name="description"
                control={control}
                rules={{
                  required: intl.formatMessage({ id: 'required' }),
                  validate: (value) =>
                    value && value?.trim().length > 500
                      ? intl.formatMessage({ id: 'maxLength' }, { num: 500 })
                      : true,
                }}
                render={({
                  field: { name, onBlur, onChange, ref, value = '' },
                  fieldState: { invalid },
                }) => {
                  return (
                    <div className="relative mt-6">
                      <p className="ml-2 mb-2 font-bold uppercase text-neutral-300 caption2">
                        <FormattedMessage id="description" />
                      </p>
                      <textarea
                        className={
                          'text-field ' + (invalid ? 'error-field' : '')
                        }
                        name={name}
                        onBlur={onBlur}
                        autoComplete="off"
                        onChange={onChange}
                        ref={ref}
                        autoFocus
                        value={value}
                        placeholder={intl.formatMessage(
                          {
                            id: 'maxLength',
                          },
                          { num: 500 }
                        )}
                        rows={5}
                      />
                    </div>
                  )
                }}
              />
            </div>
            <div className="flex-[0.7]">
              <Controller
                name="token_image"
                control={control}
                rules={{
                  required: !formData?.id
                    ? intl.formatMessage({ id: 'required' })
                    : false,
                }}
                render={({ field: { value }, fieldState: { invalid } }) => {
                  return (
                    <div className="relative">
                      <p className="ml-2 mb-2 font-bold uppercase text-neutral-300 caption2">
                        <FormattedMessage id="avatar" />
                      </p>
                      <ProgressiveImg
                        src={avatar}
                        shape="rect_w"
                        className={
                          'h-32 w-full rounded border border-neutral-100 object-cover ' +
                          (invalid ? 'border border-red' : '')
                        }
                      />
                      <div className="mt-3 flex items-center" key={value}>
                        <label
                          htmlFor={'avatar-video'}
                          className={
                            'btn btn-small ' +
                            (invalid ? 'border border-red' : '')
                          }
                        >
                          <input
                            key={key}
                            className={'hidden'}
                            id={'avatar-video'}
                            type="file"
                            autoComplete="off"
                            onChange={onUploadImage}
                            accept="image/png, image/jpeg"
                          />
                          <CameraUpLoadImgIcon />
                          <span className="ml-1.5 whitespace-nowrap">
                            <FormattedMessage id="chooseImage" />
                          </span>
                        </label>
                        {!value && (
                          <p className="ml-4 text-neutral-500">
                            <FormattedMessage id="chooseImageYet" />
                          </p>
                        )}
                      </div>
                    </div>
                  )
                }}
              />
            </div>
          </div>
          <div className="flex justify-end pt-8">
            <button className="btn mr-4 w-28" onClick={() => onClose()}>
              <FormattedMessage id="cancel" />
            </button>
            <button className="btn-container w-28" type="submit">
              <FormattedMessage id="save" />
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default FormDialog
