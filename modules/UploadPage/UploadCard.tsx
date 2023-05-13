import ProgressiveImg from '@common/components/ProgressiveImg'
import { VIDEO_STATUS } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import SelectElement from '@common/SelectElement'
import { CameraUpLoadImgIcon, CloseIcon, HourglasscCon } from '@public/icons'
import { checkInfoUpload, setInfoUserUpload } from '@redux/uploadReducer'
import { API_PATHS } from '@utility/API_PATH'
import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'

interface FormData {
  name: string
  description?: string
  mode: number
  keyword: string
  token_image: string
  token_video?: string
}
interface Props {
  file: File
  index: number
}

const UploadCard = (props: Props) => {
  const { file, index } = props
  const { dispatch, setMessage, intl } = useGeneralHook()
  const [error, setError] = useState(false)
  const [remainTime, setRemainTime] = useState('')
  const [percent, setPercent] = useState(0)
  const [thumbVideo, setThumbVideo] = useState<string>()
  const abortController = useRef<any>(null)
  const [formData, setFormData] = useState<FormData | undefined>()
  const { handleSubmit, watch, control, reset, setValue } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      mode: 1,
      keyword: '',
      token_image: '',
      token_video: '',
    },
    reValidateMode: 'onChange',
  })
  const token_video = watch('token_video')

  const token_image = watch('token_image')

  const onSubmit = async (value) => {
    {
      const json = await dispatch(
        fetchThunk({ url: API_PATHS.users.getInfomation })
      )
      if ([403].includes(json?.data?.data?.status)) {
        dispatch(setInfoUserUpload({}))
        return
      }
    }
    try {
      {
        const json = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.users.uploadVideo,
              method: 'post',
              data: value,
            },
            true
          )
        )
        setFormData({ ...value, id: json.data?.data })
        setMessage({ message: json?.data?.message })
      }
    } catch (e: any) {
      setMessage({ message: e.response?.data?.message })
    }
  }

  const onUploadVideo = useCallback(
    async (file) => {
      if (!file) {
        return
      }
      let startTime = new Date().getTime()
      setError(false)
      setPercent(0)
      abortController.current = new AbortController()
      try {
        const json = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.users.pushImg + 'vod',
              method: 'post',
              headers: { 'Content-Type': 'multipart/form-data' },
              data: {
                file: file,
              },
              onUploadProgress: (event) => {
                const { loaded, total } = event
                let percent = Math.floor((loaded / total) * 100)
                const time = (new Date().getTime() - startTime) / 1000
                const bps = loaded / time
                const remTime = (total - loaded) / bps
                const second = Math.floor(remTime % 60)
                const minutes = Math.floor(remTime / 60)
                setRemainTime(minutes ? `${minutes}:${second}` : `${second}s`)
                setPercent(percent)
              },
              signal: abortController.current.signal,
            },
            true
          )
        )
        setValue('token_video', json.data.data?.token)
      } catch (error: any) {
        setPercent(0)
        setError(true)
        setRemainTime('')
        if (axios.isCancel(error)) {
        } else {
          if (error.response?.data?.message) {
            setMessage({ message: error.response?.data?.message })
          }
        }
      }
    },
    [dispatch, setMessage, setValue]
  )

  const onUploadImage = async (e) => {
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
            setThumbVideo(data)
          }
        }
      } catch (error: any) {
        setMessage({ message: error.response?.data?.message })
      }
    }
  }

  useEffect(() => {
    onUploadVideo(file)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (formData) {
    const modeLabel = VIDEO_STATUS.find((v) => v.value === formData.mode)?.label
    return (
      <div className="mt-6 flex w-full items-start rounded-xl bg-bg2 p-6">
        <ProgressiveImg
          src={thumbVideo}
          alt=""
          shape="rect_w"
          className="h-40 w-70 object-cover"
        />
        <div className="mx-4 flex-1">
          <p className="font-semibold">{formData.name}</p>
          <p className="mt-2 text-neutral-500">
            {modeLabel && <FormattedMessage id={modeLabel} />}
          </p>
        </div>
        <button
          className="font-semibold text-primary"
          type="button"
          disabled={true}
          // onClick={() => {
          //   reset(formData)
          //   setFormData(undefined)
          // }}
        >
          <FormattedMessage id="edit" />
        </button>
      </div>
    )
  }
  return (
    <>
      <div className="mt-6 flex w-full justify-between rounded-xl bg-bg2 p-8">
        <form
          onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
          className="flex w-full justify-between"
          autoComplete="off"
        >
          <div className="w-64">
            <div className="flex h-36 w-full items-center justify-center rounded border border-dashed  border-neutral-200">
              {!token_image && <HourglasscCon className="text-primary" />}
              {token_image && thumbVideo && (
                <ProgressiveImg
                  src={thumbVideo}
                  alt=""
                  shape="rect_w"
                  className="h-full w-full rounded  object-cover"
                />
              )}
            </div>
            <div className="mt-2 italic text-neutral-400">
              <FormattedMessage id="uploadNote" />
            </div>
          </div>
          <div className="ml-6 flex flex-1 flex-col">
            <div className="flex">
              <Controller
                control={control}
                name="token_video"
                rules={{
                  required: true,
                }}
                render={({ field: { value } }) => {
                  return (
                    <>
                      <div className="progress relative flex-1 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="absolute flex h-full items-center justify-center bg-primary font-semibold"
                          style={{
                            left: 0,
                            right: `calc(${100 - percent}%)`,
                            paddingRight: percent > 10 ? 8 : 0,
                          }}
                        >
                          <span
                            className="font-bold"
                            style={{
                              minWidth: 42,
                              textAlign: 'center',
                              opacity: percent > 10 ? 100 : 0,
                            }}
                          >
                            {percent}%
                          </span>
                          <div className="absolute top-3 -right-3 flex translate-x-full items-center leading-8 caption2">
                            {/* {percent < 70 && ( */}
                            <span className="whitespace-nowrap italic text-neutral-500 caption2">
                              {remainTime && (
                                <FormattedMessage
                                  id="remainTime"
                                  values={{ num: remainTime }}
                                />
                              )}
                            </span>
                          </div>
                        </div>
                        {!error && percent !== 0 && (
                          <button
                            type="button"
                            className="absolute right-0 top-0 z-10 p-2"
                            onClick={() => {
                              if (percent < 100 && percent > 0) {
                                abortController.current &&
                                  abortController.current?.abort()
                              } else {
                                setPercent(0)
                                setValue('token_video', undefined)
                              }
                            }}
                          >
                            <CloseIcon />
                          </button>
                        )}
                      </div>
                      {!token_video || percent < 100 ? (
                        <label
                          htmlFor="upload-video"
                          className="btn-container ml-4 w-32"
                        >
                          <input
                            key={value}
                            className={'hidden'}
                            id="upload-video"
                            type="file"
                            autoComplete="off"
                            accept="video/*"
                            disabled={percent !== 0}
                            onChange={(e) =>
                              onUploadVideo(e.target?.files?.[0])
                            }
                          />
                          <FormattedMessage id="upload" />
                        </label>
                      ) : (
                        <button
                          className={'btn-container ml-4 w-32'}
                          type="submit"
                          disabled={!value}
                        >
                          <FormattedMessage id="completeUpload" />
                        </button>
                      )}
                    </>
                  )
                }}
              />
            </div>
            <div className="mt-10 mb-3 flex items-baseline justify-between">
              <p className="ml-2 font-bold uppercase text-neutral-300 caption2">
                <FormattedMessage id="yourTitle" />
              </p>
              <p className="mr-2 text-neutral-400 caption2">
                <FormattedMessage id="maxLength" values={{ num: 255 }} />
              </p>
            </div>
            <Controller
              control={control}
              name="name"
              rules={{
                maxLength: 255,
                validate: (value) => !!value?.trim(),
              }}
              render={({
                field: { value, ref, onChange },
                fieldState: { invalid },
              }) => {
                return (
                  <input
                    className={'text-field ' + (invalid ? 'error-field' : '')}
                    autoComplete="off"
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    placeholder={'Myclip_video_'}
                  />
                )
              }}
            />
            <div className="mt-6 mb-3 flex items-baseline justify-between">
              <p className="ml-2 font-bold uppercase text-neutral-300 caption2">
                <FormattedMessage id="descriptionVideo" />
              </p>
              <p className="mr-2 text-neutral-400 caption2">
                <FormattedMessage id="maxLength" values={{ num: 1000 }} />
              </p>
            </div>
            <Controller
              control={control}
              name="description"
              rules={{
                maxLength: 1000,
              }}
              render={({
                field: { value, ref, onChange },
                fieldState: { invalid },
              }) => {
                return (
                  <textarea
                    className={'text-field ' + (invalid ? 'error-field' : '')}
                    rows={5}
                    autoComplete="off"
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    placeholder={intl.formatMessage({
                      id: 'descriptionUpload',
                    })}
                  />
                )
              }}
            />
            <div className="flex">
              <Controller
                control={control}
                name="mode"
                render={({ field: { value, onChange } }) => {
                  return (
                    <div className="relative mr-2 mt-6 flex-1 select-none">
                      <p className="mb-2 ml-2 font-bold uppercase text-neutral-300 caption2">
                        <FormattedMessage id="status" />
                      </p>
                      <SelectElement
                        value={value}
                        onChange={onChange}
                        options={VIDEO_STATUS}
                      />
                    </div>
                  )
                }}
              />
              <Controller
                control={control}
                name="keyword"
                render={({ field: { value, ref, onChange } }) => {
                  return (
                    <div className="relative ml-2 mt-6 flex-1">
                      <p className="mb-2 ml-2 font-bold uppercase text-neutral-300 caption2">
                        <FormattedMessage id="mainKeyword" />
                      </p>
                      <input
                        className={'text-field'}
                        autoComplete="off"
                        value={value}
                        onChange={onChange}
                        ref={ref}
                        placeholder={intl.formatMessage({
                          id: 'keywordExample',
                        })}
                      />
                    </div>
                  )
                }}
              />
            </div>
            <p className="mt-6 mb-2 ml-2 font-bold uppercase text-neutral-300 caption2">
              <FormattedMessage id="thumbVideo" />
            </p>
            <div className="flex flex-wrap">
              {thumbVideo && (
                <ProgressiveImg
                  key={index}
                  src={thumbVideo}
                  shape="rect_w"
                  className="mr-4 mb-4 h-24 w-40 object-cover"
                />
              )}
            </div>
            <div className="mb-8 flex items-center gap-4">
              <Controller
                control={control}
                name="token_image"
                rules={{
                  required: true,
                }}
                render={({ field: { value }, fieldState: { invalid } }) => {
                  return (
                    <>
                      <label
                        htmlFor={'image-front-input-' + index}
                        className={
                          'btn btn-small ' +
                          (invalid ? 'border border-red' : '')
                        }
                      >
                        <input
                          key={value}
                          className={'hidden'}
                          id={'image-front-input-' + index}
                          type="file"
                          autoComplete="off"
                          onChange={onUploadImage}
                          accept="image/png, image/jpeg"
                        />
                        <CameraUpLoadImgIcon />
                        <span className="ml-1.5 whitespace-nowrap">
                          <FormattedMessage
                            id={value ? 'updateImage' : 'addNewImage'}
                          />
                        </span>
                      </label>
                      {invalid && (
                        <p className="text-red">
                          <FormattedMessage id="required" />
                        </p>
                      )}
                    </>
                  )
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
export default UploadCard
