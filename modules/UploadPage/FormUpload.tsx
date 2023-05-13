import Checkbox from '@common/components/Checkbox'
import useGeneralHook from '@common/hook/useGeneralHook'
import { CameraUpLoadImgIcon } from '@public/icons'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'

interface Props {}

const FormUpload = (props: Props) => {
  const { intl } = useGeneralHook()
  const { handleSubmit, watch, reset, control } = useForm<{
    name: string
    email?: string
    cmnd?: string
    dateIssued?: string
    whereIssued?: string
    imageFront?: string
    imageBack?: string
    phoneNumber?: string
    otp?: string
    acceptTerm?: boolean
  }>({
    defaultValues: {
      name: '',
      email: '',
      cmnd: '',
      dateIssued: '',
      whereIssued: '',
      imageFront: '',
      imageBack: '',
      phoneNumber: '',
      otp: '',
      acceptTerm: false,
    },
    reValidateMode: 'onChange',
  })
  const acceptTerm = watch('acceptTerm')

  const onSubmit = (value) => {
    console.log(value)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col "
        style={{ userSelect: 'none' }}
        autoComplete="off"
      >
        <p className="text-xl font-bold">
          <FormattedMessage id="confirmPersonalInfo" />
        </p>
        <p className="caption2 mt-6 mb-8 text-xs italic text-secondary">
          <FormattedMessage id="confirmPersonalInfoNote" />
        </p>
        <div className="flex w-full flex-col ">
          <Controller
            control={control}
            name="name"
            rules={{ required: true, validate: (value) => !!value?.trim() }}
            render={({ field: { value, ref, onChange } }) => {
              return (
                <div className="relative mb-4">
                  <input
                    className={'text-field rounded-xl px-4'}
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
            render={({ field: { value, ref, onChange } }) => {
              return (
                <div className="relative mb-4">
                  <input
                    className={'text-field rounded-xl px-4'}
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
              name="email"
              rules={{ required: true, validate: (value) => !!value?.trim() }}
              render={({ field: { value, ref, onChange } }) => {
                return (
                  <div className="relative mb-4 w-1/2">
                    <input
                      className={'text-field rounded-xl px-4'}
                      autoComplete="off"
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
              name="email"
              rules={{ required: true, validate: (value) => !!value?.trim() }}
              render={({ field: { value, ref, onChange } }) => {
                return (
                  <div className="relative mb-4 w-1/4 pl-4">
                    <input
                      className={'text-field rounded-xl px-4'}
                      autoComplete="off"
                      value={value}
                      onChange={onChange}
                      ref={ref}
                      placeholder={intl.formatMessage({ id: 'dateRage' })}
                    />
                  </div>
                )
              }}
            />
            <Controller
              control={control}
              name="email"
              rules={{ required: true, validate: (value) => !!value?.trim() }}
              render={({ field: { value, ref, onChange } }) => {
                return (
                  <div className="relative mb-4 w-1/4 pl-4">
                    <input
                      className={'text-field rounded-xl px-4'}
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
            name="imageFront"
            rules={{ required: true, validate: (value) => !!value?.trim() }}
            render={({ field: { value, ref, onChange } }) => {
              return (
                <div className="relative mb-4 flex items-center">
                  <p className="w-28 whitespace-nowrap px-4 text-sm leading-10 text-neutral-400">
                    <FormattedMessage id="frontImage" />
                  </p>
                  <input
                    className={'hidden'}
                    id="image-front-input"
                    type="file"
                    autoComplete="off"
                    value={value}
                    onChange={onChange}
                    ref={ref}
                  />
                  <label
                    htmlFor="image-front-input"
                    className="ml-4 flex h-8 items-center justify-center rounded-xl bg-neutral-100 px-3 text-sm"
                  >
                    <CameraUpLoadImgIcon />
                    <span className="ml-1.5 whitespace-nowrap">
                      <FormattedMessage id="uploadImage" />
                    </span>
                  </label>
                </div>
              )
            }}
          />
          <Controller
            control={control}
            name="imageBack"
            rules={{ required: true, validate: (value) => !!value?.trim() }}
            render={({ field: { value, ref, onChange } }) => {
              return (
                <div className="relative mb-4 flex items-center">
                  <p className="w-28 whitespace-nowrap px-4 text-sm leading-10 text-neutral-400">
                    Ảnh mặt sau
                  </p>
                  <input
                    className={'hidden'}
                    id="image-back-input"
                    type="file"
                    autoComplete="off"
                    value={value}
                    onChange={onChange}
                    ref={ref}
                  />
                  <label
                    htmlFor="image-back-input"
                    className="ml-4 flex h-8 items-center justify-center rounded-xl bg-neutral-100 px-3 text-sm"
                  >
                    <CameraUpLoadImgIcon />
                    <span className="ml-1.5 whitespace-nowrap">Tải ảnh</span>
                  </label>
                </div>
              )
            }}
          />
          <Controller
            control={control}
            name="phoneNumber"
            rules={{ required: true, validate: (value) => !!value?.trim() }}
            render={({ field: { value, ref, onChange } }) => {
              return (
                <div className="relative mb-4">
                  <input
                    className={'text-field rounded-xl px-4'}
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
              render={({ field: { value, ref, onChange } }) => {
                return (
                  <div className="relative mb-4">
                    <input
                      className={'text-field rounded-xl px-4'}
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
            <button className="ml-4 h-10 w-36 rounded-xl bg-[#55eddb29]">
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
          <span className="text-primary">
            <FormattedMessage id="accept_2" />
          </span>
          &nbsp;
          <FormattedMessage id="accept_3" />
          &nbsp;
          <span className="text-primary">
            <FormattedMessage id="accept_4" />
          </span>
          &nbsp;
          <FormattedMessage id="accept_5" />
        </div>
        <div className="mt-12 flex justify-end">
          <button className="btn h-10 w-32">
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
    </>
  )
}

export default FormUpload
