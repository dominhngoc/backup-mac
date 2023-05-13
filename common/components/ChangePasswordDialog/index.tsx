import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import {
  ChangeePasswordIcon,
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  ReloadIcon,
} from '@public/icons'
import { setOpenChangePasswordDialog } from '@redux/dialogReducer'
import { AppState } from '@redux/store'
import { API_PATHS } from '@utility/API_PATH'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import useSWR from 'swr'
import Modal from '../Modal'

const ChangePasswordDialog = () => {
  const { dispatch, isLogin, setMessage, intl } = useGeneralHook()
  const openChangePassword = useSelector(
    (state: AppState) => state.dialog.openChangePassword,
    shallowEqual
  )
  const [type, setType] = useState({
    password: 'text',
    new_password: 'text',
    repeat_password: 'text',
  })
  const { handleSubmit, watch, control } = useForm<{
    password?: string
    new_password?: string
    repeat_password?: string
    captcha?: string
  }>({
    reValidateMode: 'onChange',
  })
  const valuesField = watch()

  const { data: captcha, mutate } = useSWR(
    openChangePassword && isLogin ? API_PATHS.users.captcha : null,
    async (url) => {
      const json = await dispatch(
        fetchThunk({
          url,
          method: 'get',
          headers: {
            'Content-Type': 'image/jpeg',
          },
          responseType: 'blob',
        })
      )
      return json?.data
    },
    {
      revalidateOnFocus: false,
    }
  )
  const src = useMemo(
    () => (captcha ? window.URL.createObjectURL(captcha) : null),
    [captcha]
  )

  const onInValid = async (error: any) => {
    setMessage({ message: (Object.values(error)?.[0] as any)?.message })
  }

  const onSubmit = async (value) => {
    try {
      const json = await dispatch(
        fetchThunk(
          {
            url: API_PATHS.users.changePassword,
            method: 'post',
            data: value,
          },
          true
        )
      )
      setMessage({ message: json?.data?.message })
      if (json.status === 200) {
        dispatch(setOpenChangePasswordDialog(false))
      }
    } catch (e: any) {
      mutate()
      setMessage({ message: e.response?.data?.message })
    }
  }

  return (
    <>
      <Modal open={openChangePassword && isLogin}>
        <div className="flex w-[480px] flex-col items-center px-14 pt-10 pb-14">
          <button
            className="absolute top-0 right-0 p-3"
            onClick={() => {
              dispatch(setOpenChangePasswordDialog(false))
            }}
          >
            <CloseIcon />
          </button>
          <p className="mb-2 text-center font-bold title">
            <FormattedMessage id="changePassword" />
          </p>
          <ChangeePasswordIcon />
          <form
            onSubmit={handleSubmit(onSubmit, onInValid)}
            className="flex flex-1 flex-col"
          >
            <Controller
              control={control}
              name="password"
              rules={{
                validate: {
                  required: (value) =>
                    !value?.trim()
                      ? intl.formatMessage({ id: 'required' })
                      : true,
                  lessThan: (value = '') =>
                    value.length > 128 || value.length < 6
                      ? intl.formatMessage({ id: 'minLength' })
                      : true,
                },
              }}
              render={({
                field: { value, ref, onChange },
                fieldState: { invalid },
              }) => {
                return (
                  <div className="relative mb-6">
                    <input
                      className={
                        'text-field pr-10 ' + (invalid ? 'error-field' : '')
                      }
                      value={value}
                      onChange={onChange}
                      ref={ref}
                      type={type.password}
                      placeholder={intl.formatMessage({ id: 'old_password' })}
                    />
                    {value && (
                      <div className="absolute inset-y-0 right-10 flex items-center">
                        <button
                          type="button"
                          className="p-2 text-neutral-400"
                          onClick={() => onChange('')}
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <button
                        type="button"
                        className="p-2 text-neutral-400"
                        onClick={() =>
                          setType((old) => ({
                            ...old,
                            password:
                              old?.password === 'password'
                                ? 'text'
                                : 'password',
                          }))
                        }
                      >
                        {type.password === 'password' ? (
                          <EyeIcon />
                        ) : (
                          <EyeOffIcon />
                        )}
                      </button>
                    </div>
                  </div>
                )
              }}
            />
            <Controller
              control={control}
              name="new_password"
              rules={{
                validate: {
                  required: (value) =>
                    !value?.trim()
                      ? intl.formatMessage({ id: 'required' })
                      : true,
                  lessThan: (value = '') =>
                    value.length > 128 || value.length < 6
                      ? intl.formatMessage({ id: 'minLength' })
                      : true,
                  difference: (value) =>
                    valuesField?.password === value && valuesField?.new_password
                      ? intl.formatMessage({ id: 'matchingOldPassword' })
                      : true,
                },
              }}
              render={({
                field: { value, ref, onChange },
                fieldState: { invalid },
              }) => {
                return (
                  <div className="relative mb-6">
                    <input
                      className={
                        'text-field  pr-10 ' + (invalid ? 'error-field' : '')
                      }
                      value={value}
                      onChange={onChange}
                      ref={ref}
                      type={type.new_password}
                      placeholder={intl.formatMessage({ id: 'new_password' })}
                    />
                    {value && (
                      <div className="absolute inset-y-0 right-10 flex items-center">
                        <button
                          type="button"
                          className="p-2 text-neutral-400"
                          onClick={() => onChange('')}
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <button
                        type="button"
                        className="p-2 text-neutral-400"
                        onClick={() =>
                          setType((old) => ({
                            ...old,
                            new_password:
                              old?.new_password === 'password'
                                ? 'text'
                                : 'password',
                          }))
                        }
                      >
                        {type.new_password === 'password' ? (
                          <EyeIcon />
                        ) : (
                          <EyeOffIcon />
                        )}
                      </button>
                    </div>
                  </div>
                )
              }}
            />
            <Controller
              control={control}
              name="repeat_password"
              rules={{
                validate: {
                  required: (value) =>
                    !value?.trim()
                      ? intl.formatMessage({ id: 'required' })
                      : true,
                  lessThan: (value = '') =>
                    value.length > 128 || value.length < 6
                      ? intl.formatMessage({ id: 'minLength' })
                      : true,
                  positive: (value) =>
                    valuesField?.new_password !== value &&
                    valuesField?.new_password
                      ? intl.formatMessage({ id: 'notMatchingPassword' })
                      : true,
                },
              }}
              render={({
                field: { value, ref, onChange },
                fieldState: { invalid },
              }) => {
                return (
                  <div className="relative mb-6">
                    <input
                      className={
                        'text-field pr-10 ' + (invalid ? 'error-field' : '')
                      }
                      value={value}
                      onChange={onChange}
                      ref={ref}
                      type={type.repeat_password}
                      placeholder={intl.formatMessage({
                        id: 'repeat_password',
                      })}
                    />
                    {value && (
                      <div className="absolute inset-y-0 right-10 flex items-center">
                        <button
                          type="button"
                          className="p-2 text-neutral-400"
                          onClick={() => onChange('')}
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <button
                        type="button"
                        className="p-2 text-neutral-400"
                        onClick={() =>
                          setType((old) => ({
                            ...old,
                            repeat_password:
                              old?.repeat_password === 'password'
                                ? 'text'
                                : 'password',
                          }))
                        }
                      >
                        {type.repeat_password === 'password' ? (
                          <EyeIcon />
                        ) : (
                          <EyeOffIcon />
                        )}
                      </button>
                    </div>
                  </div>
                )
              }}
            />
            <Controller
              control={control}
              name="captcha"
              rules={{ required: true }}
              shouldUnregister={true}
              render={({
                field: { value, ref, onChange },
                fieldState: { invalid },
              }) => {
                return (
                  <div className="mb-6 flex gap-2">
                    <div className="relative">
                      <input
                        type={'text'}
                        className={
                          'text-field pr-10 ' + (invalid ? 'error-field' : '')
                        }
                        value={value}
                        onChange={onChange}
                        ref={ref}
                        placeholder={intl.formatMessage({ id: 'captcha' })}
                      />
                    </div>
                    {src && (
                      <img
                        src={src}
                        alt="captcha"
                        className="h-10 rounded-lg"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        mutate()
                      }}
                    >
                      <ReloadIcon />
                    </button>
                  </div>
                )
              }}
            />
            <button
              className="btn-container"
              disabled={!Object.values(valuesField).every((v) => v?.trim())}
            >
              <FormattedMessage id="complete" />
            </button>
          </form>
        </div>
      </Modal>
    </>
  )
}
export default ChangePasswordDialog
