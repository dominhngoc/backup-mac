import Checkbox from '@common/components/Checkbox'
import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { CameraUpLoadImgIcon } from '@public/icons'
import {
  checkInfoUpload,
  setInfoUserUpload,
  UserInfoUpload,
} from '@redux/uploadReducer'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import { DATE_FORMAT, DATE_FORMAT_2 } from '@utility/moment'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useCountdown } from 'usehooks-ts'
import SignUpToReceiveMoney from './SignUpToReceiveMoney'

interface Props {
  formData?: UserInfoUpload
}

const FormRegister = (props: Props) => {
  const { formData } = props
  const { dispatch, setMessage, intl } = useGeneralHook()
  const [showForm, setShowForm] = useState(
    formData?.status && [1, 3].includes(formData?.status)
  )

  const [image, setImage] = useState({
    token_image_frontside: formData?.id_card_image_frontside,
    token_image_backside: formData?.id_card_image_backside,
  })
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    countStop: 0,
  })

  const { handleSubmit, watch, control, setValue } = useForm<{
    name: string
    email: string
    id_card_number: string
    id_card_created_at: string
    id_card_created_by: string
    token_image_frontside: string
    token_image_backside: string
    msisdn: string
    otp: string
    acceptTerm: boolean
  }>({
    defaultValues: {
      name: formData?.name,
      email: formData?.email,
      id_card_number: formData?.id_card_number,
      id_card_created_at:
        formData?.id_card_created_at &&
        moment(formData?.id_card_created_at, DATE_FORMAT).format(DATE_FORMAT_2),
      id_card_created_by: formData?.id_card_created_by,
      token_image_frontside: '',
      token_image_backside: '',
      msisdn: formData?.msisdn,
      otp: '',
      acceptTerm: false,
    },
    reValidateMode: 'onChange',
  })

  const acceptTerm = watch('acceptTerm')
  const msisdn = watch('msisdn')

  const onUploadImage = async (e, key) => {
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
            },
            true
          )
        )
        if (json?.data?.data?.token) {
          setValue(key, json?.data?.data?.token)
          var reader = new FileReader()
          reader.readAsDataURL(listFiles[0])
          reader.onload = function () {
            const data: any = reader.result
            setImage((old) => ({ ...old, [key]: data }))
          }
        }
      } catch (error: any) {
        setMessage({ message: error.response?.data?.message })
      }
    }
  }

  const getOtp = async () => {
    resetCountdown()
    startCountdown()
    try {
      const json = await dispatch(
        fetchThunk(
          {
            url: API_PATHS.users.getOTP,
            method: 'post',
            data: {
              msisdn: msisdn,
            },
          },
          true
        )
      )
      setMessage({ message: json.data?.message })
    } catch (error: any) {
      setMessage({ message: error.response?.data?.message })
    }
  }

  const onSubmit = async (value) => {
    try {
      const json = await dispatch(
        fetchThunk(
          {
            url: API_PATHS.users.getInfomation,
            method: 'POST',
            data: {
              ...value,
              id_card_created_at:
                value.id_card_created_at &&
                moment(value.id_card_created_at).format(DATE_FORMAT),
            },
          },
          true
        )
      )
      setMessage({ message: json.data?.message })
      dispatch(checkInfoUpload())
    } catch (error: any) {
      setMessage({ message: error.response?.data?.message })
    }
  }

  useEffect(() => {
    setShowForm(formData?.status && [1, 3].includes(formData?.status))
  }, [formData?.status])

  if (showForm) {
    return (
      <div className="mt-6 flex h-[532px] w-full flex-col items-center justify-center rounded-xl bg-bg2 p-6">
        {formData?.status === 1 ? (
          <>
            <p className="font-bold title">
              <FormattedMessage id="receivedInfo" />
            </p>
            <p className="mt-6 text-neutral-300">
              <FormattedMessage id="upload.title.1" />
            </p>
            <p className="mb-12 text-neutral-300">
              <FormattedMessage id="upload.title.2" />
            </p>
          </>
        ) : (
          <>
            <p className="font-bold title">
              <FormattedMessage id="rejectInfoAccount" />
            </p>
            <p className="mb-12 mt-6 text-neutral-300">
              <FormattedMessage id="reason" />
              :&nbsp;{formData?.reason}
            </p>
          </>
        )}
        <button
          className="btn btn-container"
          onClick={() => setShowForm(false)}
        >
          <FormattedMessage id="reEnter" />
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="mt-6 flex">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col rounded-xl bg-bg2 p-8 "
          style={{ userSelect: 'none' }}
          autoComplete="off"
        >
          <p className="text-xl font-bold">
            <FormattedMessage id="confirmPersonalInfo" />
          </p>
          <p className="mt-6 mb-8 italic text-secondary caption2">
            <FormattedMessage id="confirmPersonalInfoNote" />
          </p>
          <div className="flex w-full flex-col ">
            <Controller
              control={control}
              name="name"
              rules={{ required: true, validate: (value) => !!value?.trim() }}
              render={({
                field: { value, ref, onChange },
                fieldState: { invalid },
              }) => {
                return (
                  <div className="relative mb-4">
                    <input
                      className={
                        'text-field rounded-xl px-4 ' +
                        (invalid ? 'error-field' : '')
                      }
                      autoComplete="off"
                      value={value}
                      onChange={onChange}
                      ref={ref}
                      placeholder={intl.formatMessage({ id: 'fullName' })}
                    />
                  </div>
                )
              }}
            />
            <Controller
              control={control}
              name="email"
              rules={{ required: true, validate: (value) => !!value?.trim() }}
              render={({
                field: { value, ref, onChange },
                fieldState: { invalid },
              }) => {
                return (
                  <div className="relative mb-4">
                    <input
                      className={
                        'text-field rounded-xl px-4 ' +
                        (invalid ? 'error-field' : '')
                      }
                      autoComplete="off"
                      value={value}
                      onChange={onChange}
                      ref={ref}
                      placeholder={intl.formatMessage({ id: 'emailAddress' })}
                    />
                  </div>
                )
              }}
            />
            <div className="flex">
              <Controller
                control={control}
                name="id_card_number"
                rules={{ required: true, validate: (value) => !!value?.trim() }}
                render={({
                  field: { value, ref, onChange },
                  fieldState: { invalid },
                }) => {
                  return (
                    <div className="relative mb-4 w-1/2">
                      <input
                        className={
                          'text-field rounded-xl px-4 ' +
                          (invalid ? 'error-field' : '')
                        }
                        autoComplete="off"
                        type={'number'}
                        value={value}
                        onChange={onChange}
                        ref={ref}
                        placeholder={intl.formatMessage({ id: 'identify' })}
                      />
                    </div>
                  )
                }}
              />
              <Controller
                control={control}
                name="id_card_created_at"
                rules={{ required: true, validate: (value) => !!value?.trim() }}
                render={({
                  field: { value, ref, onChange },
                  fieldState: { invalid },
                }) => {
                  return (
                    <div className="relative mb-4 w-1/4 pl-4">
                      <input
                        className={
                          'text-field rounded-xl px-4 ' +
                          (invalid ? 'error-field' : '')
                        }
                        autoComplete="off"
                        value={value}
                        onChange={onChange}
                        ref={ref}
                        type="date"
                        max={moment().format(DATE_FORMAT_2)}
                        placeholder={intl.formatMessage({ id: 'dateRage' })}
                      />
                    </div>
                  )
                }}
              />
              <Controller
                control={control}
                name="id_card_created_by"
                rules={{ required: true, validate: (value) => !!value?.trim() }}
                render={({
                  field: { value, ref, onChange },
                  fieldState: { invalid },
                }) => {
                  return (
                    <div className="relative mb-4 w-1/4 pl-4">
                      <input
                        className={
                          'text-field rounded-xl px-4 ' +
                          (invalid ? 'error-field' : '')
                        }
                        autoComplete="off"
                        value={value}
                        onChange={onChange}
                        ref={ref}
                        placeholder={intl.formatMessage({ id: 'placeIssued' })}
                      />
                    </div>
                  )
                }}
              />
            </div>
            <Controller
              control={control}
              name="token_image_frontside"
              rules={{
                required: formData?.id ? false : true,
              }}
              render={({
                field: { value, ref, name },
                fieldState: { invalid },
              }) => {
                return (
                  <div className="relative mb-4 flex">
                    <p className="mr-4 mt-1 w-32 px-4 text-neutral-400">
                      <FormattedMessage id="frontImage" />
                    </p>
                    <input
                      key={value}
                      className={'hidden'}
                      id="image-font-input"
                      type="file"
                      autoComplete="off"
                      onChange={(e) => onUploadImage(e, name)}
                      ref={ref}
                      accept="image/png, image/gif, image/jpeg, image/webp"
                    />
                    <label
                      htmlFor="image-font-input"
                      className="cursor-pointer"
                    >
                      {image[name] ? (
                        <ProgressiveImg
                          src={image[name]}
                          className="h-40 w-40 rounded-md border border-neutral-100 object-cover"
                          shape="rect_w"
                        />
                      ) : (
                        <div
                          className={
                            'btn btn-small ' +
                            (invalid ? 'border border-red' : '')
                          }
                        >
                          <CameraUpLoadImgIcon />
                          <span className="ml-2">
                            <FormattedMessage id="uploadImage" />
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                )
              }}
            />
            <Controller
              control={control}
              name="token_image_backside"
              rules={{
                required: formData?.id ? false : true,
              }}
              render={({
                field: { value, ref, name },
                fieldState: { invalid },
              }) => {
                return (
                  <div className="relative mb-4 flex">
                    <p className="mr-4 mt-1 w-32 px-4 text-neutral-400">
                      <FormattedMessage id="backImage" />
                    </p>
                    <input
                      className={'hidden'}
                      id="image-back-input"
                      type="file"
                      key={value}
                      autoComplete="off"
                      onChange={(e) => onUploadImage(e, name)}
                      ref={ref}
                      accept="image/png, image/gif, image/jpeg, image/webp"
                    />
                    <label
                      htmlFor="image-back-input"
                      className="cursor-pointer"
                    >
                      {image[name] ? (
                        <ProgressiveImg
                          src={image[name]}
                          className="h-40 w-40 rounded-md border border-neutral-100 object-cover"
                          shape="rect_w"
                        />
                      ) : (
                        <div
                          className={
                            'btn btn-small ' +
                            (invalid ? 'border border-red' : '')
                          }
                        >
                          <CameraUpLoadImgIcon />
                          <span className="ml-2">
                            <FormattedMessage id="uploadImage" />
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                )
              }}
            />
            <Controller
              control={control}
              name="msisdn"
              rules={{ required: true, validate: (value) => !!value?.trim() }}
              render={({
                field: { value, ref, onChange },
                fieldState: { invalid },
              }) => {
                return (
                  <div className="relative mb-4">
                    <input
                      className={
                        'text-field rounded-xl px-4 ' +
                        (invalid ? 'error-field' : '')
                      }
                      autoComplete="off"
                      value={value}
                      onChange={onChange}
                      ref={ref}
                      placeholder={intl.formatMessage({ id: 'telephone' })}
                    />
                  </div>
                )
              }}
            />
            <div className="flex">
              <Controller
                control={control}
                name="otp"
                rules={{ required: true, validate: (value) => !!value?.trim() }}
                render={({
                  field: { value, ref, onChange },
                  fieldState: { invalid },
                }) => {
                  return (
                    <div className="relative mb-4">
                      <input
                        className={
                          'text-field rounded-xl px-4 ' +
                          (invalid ? 'error-field' : '')
                        }
                        autoComplete="off"
                        value={value}
                        onChange={onChange}
                        ref={ref}
                        placeholder={intl.formatMessage({ id: 'enterOTP' })}
                      />
                    </div>
                  )
                }}
              />
              <button
                type="button"
                className="btn-container ml-4"
                disabled={(count < 30 && count > 0) || !msisdn}
                onClick={getOtp}
              >
                <FormattedMessage id="getOTP" />
              </button>
            </div>
          </div>
          <div className="flex items-center text-neutral-500">
            <Controller
              control={control}
              name="acceptTerm"
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                return (
                  <Checkbox
                    checked={value}
                    onChange={onChange}
                    className="mr-2"
                  />
                )
              }}
            />
            <FormattedMessage id="accept_1" />
            &nbsp;
            <MyLink href={{ pathname: ROUTES.termsOfUse }} target="_blank">
              <span className="text-primary">
                <FormattedMessage id="accept_2" />
              </span>
            </MyLink>
            &nbsp;
            <FormattedMessage id="accept_3" />
            &nbsp;
            <MyLink
              href={{ pathname: ROUTES.operationalRegulations }}
              target="_blank"
            >
              <span className="text-primary">
                <FormattedMessage id="accept_4" />
              </span>
            </MyLink>
            &nbsp;
            <FormattedMessage id="accept_5" />
          </div>
          <div className="mt-12 flex justify-end">
            <button
              className="btn h-10 w-32"
              onClick={() => {
                dispatch(setInfoUserUpload(undefined))
              }}
            >
              <FormattedMessage id="deny" />
            </button>
            <button
              type="submit"
              disabled={!acceptTerm}
              className="btn-container ml-4 w-32"
            >
              <FormattedMessage id="accept" />
            </button>
          </div>
        </form>
        <SignUpToReceiveMoney />
      </div>
    </>
  )
}

export default FormRegister
