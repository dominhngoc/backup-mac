import api from '@common/api'
import useGeneralHook from '@common/hook/useGeneralHook'
import { CloseIcon, EyeIcon, EyeOffIcon, ReloadIcon } from '@public/icons'
import { login } from '@redux/authReducer'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { setLoginForm } from '@redux/loginReducer'
import { API_PATHS } from '@utility/API_PATH'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import useSWR, { mutate as numteAll } from 'swr'
import FacebookLoginBox from './FacebookLoginBox'
import GoogleLoginBox from './GoogleLoginBox'
export const DEVICE_ID = 'deviceId'

function LoginContent({ setOpenTerm, setOpenRegisterForm }) {
  const { intl, router, dispatch } = useGeneralHook()
  const [type, setType] = useState('password')
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')
  const { handleSubmit, watch, reset, control } = useForm<{
    username: string
    password?: string
    captcha?: string
  }>({
    // defaultValues: { password: '12345678', username: '0979379455' },
    // defaultValues: { password: '422135', username: '0388897636' },
    // defaultValues: { password: '123123aA@', username: 'aladin' },
    defaultValues: { password: '', username: '' },
    reValidateMode: 'onChange',
  })
  const username = watch('username')
  const password = watch('password')
  const captchaWatch = watch('captcha')

  const { data: captcha, mutate } = useSWR(
    showCaptcha ? API_PATHS.users.captcha : null,
    async (url) => {
      try {
        const json = await api({
          url,
          method: 'get',
          headers: {
            'Content-Type': 'image/jpeg',
            Authorization: sessionStorage.getItem(DEVICE_ID) || '',
          },
          responseType: 'blob',
        })
        return json?.data
      } catch (error) {
        setShowCaptcha(false)
      }
    },
    {
      revalidateOnFocus: false,
    }
  )

  const onSubmit = useCallback(
    async (value) => {
      setLoading(true)
      const { username, password, captcha } = value
      dispatch(setLoginForm({ username, password }))
      setError('')
      try {
        const json = await dispatch(
          login({
            captcha: captcha,
            username: username?.trim(),
            password: password?.trim(),
          })
        )
        reset()
        if (json.status === 200) {
          setShowCaptcha(false)
          dispatch(setOpenLoginDialog(false))
          numteAll(() => true, undefined, { revalidate: true })
          // router.reload()
        }
      } catch (e: any) {
        if (e.response.status === 403) {
          sessionStorage.setItem(
            DEVICE_ID,
            `${value.username}_${new Date().getTime()}_${Math.random()}`
          )
          setShowCaptcha(true)
        }
        showCaptcha && mutate()
        setError(e.response?.data?.message)
      }
      setLoading(false)
    },
    [dispatch, mutate, reset, showCaptcha]
  )

  const src = useMemo(
    () => (captcha ? window.URL.createObjectURL(captcha) : null),
    [captcha]
  )

  useEffect(() => {
    return () => {
      if (src) {
        URL.revokeObjectURL(src)
      }
    }
  }, [src])

  return (
    <>
      <button
        className="absolute top-4 right-4"
        onClick={() => {
          setError('')
          dispatch(setOpenLoginDialog(false))
        }}
      >
        <CloseIcon />
      </button>
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-bg2">
        <h2 className="mb-8 text-center font-bold title">
          <FormattedMessage id="login" />
        </h2>
        <div className="mx-auto flex w-[369px] flex-col items-center sm:mt-4 2xl:mt-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            className="w-full"
          >
            <Controller
              control={control}
              name="username"
              rules={{ required: true, validate: (value) => !!value?.trim() }}
              render={({
                field: { value, ref, onChange },
                fieldState: { invalid },
              }) => {
                return (
                  <div className="relative mb-10 w-full">
                    <input
                      className={
                        'text-field mr-10 ' + (invalid ? 'error-field' : '')
                      }
                      autoComplete="off"
                      value={value}
                      onChange={onChange}
                      ref={ref}
                      type="tel"
                      placeholder={intl.formatMessage({ id: 'phoneNumber' })}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      {value.trim() && (
                        <button
                          type="button"
                          className="p-2 text-neutral-400"
                          onClick={() => onChange('')}
                        >
                          <CloseIcon />
                        </button>
                      )}
                    </div>
                  </div>
                )
              }}
            />
            <Controller
              control={control}
              name="password"
              rules={{ required: true, validate: (value) => !!value?.trim() }}
              render={({
                field: { value, ref, onChange },
                fieldState: { invalid },
              }) => {
                return (
                  <div className="relative w-full">
                    <input
                      className={
                        'text-field mr-10 ' + (invalid ? 'error-field' : '')
                      }
                      autoComplete="new-password"
                      value={value}
                      onChange={onChange}
                      ref={ref}
                      type={type}
                      placeholder={intl.formatMessage({ id: 'password' })}
                    />
                    {value?.trim() && (
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
                    {password && password?.trim() !== '' && (
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <button
                          type="button"
                          className="p-2 text-neutral-400"
                          onClick={() => {
                            setType((old) =>
                              old === 'text' ? 'password' : 'text'
                            )
                          }}
                        >
                          {type === 'text' ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    )}
                  </div>
                )
              }}
            />
            {showCaptcha && (
              <Controller
                control={control}
                name="captcha"
                rules={{ required: showCaptcha }}
                shouldUnregister={true}
                render={({
                  field: { value, ref, onChange },
                  fieldState: { invalid },
                }) => {
                  return (
                    <div className="mt-10 flex">
                      <div className="relative">
                        <input
                          autoComplete="off"
                          type={'text'}
                          className={
                            'text-field ' + (invalid ? 'error-field' : '')
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
                          className="ml-2 h-10 rounded-lg"
                        />
                      )}
                      <button
                        type="button"
                        className="ml-2"
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
            )}
            <p className="my-3 text-center text-xs text-red">{error}&nbsp;</p>
            <button
              className="btn-container w-full"
              type="submit"
              disabled={
                username?.trim() === '' ||
                password?.trim() === '' ||
                (showCaptcha && !captchaWatch?.trim()) ||
                loading
              }
            >
              <FormattedMessage id="login" />
            </button>
          </form>
          <span className="text-base font-normal not-italic tracking-[-0.408px] text-neutral-500 md:mt-6 lg:mt-6 xl:mt-8 2xl:mt-10">
            <FormattedMessage id="loginBy" />
          </span>
          <div className="flex md:mt-6 lg:mt-6 xl:mt-8 2xl:mt-10">
            <GoogleLoginBox />
            <FacebookLoginBox />
          </div>
          <div
            onClick={() => setOpenRegisterForm(true)}
            className="flex font-bold text-primary subtitle md:mt-6 lg:mt-6 xl:mt-8 2xl:mt-10"
          >
            <a href="#" className="mr-2">
              <FormattedMessage id="register" />
            </a>
            <span className="mr-2">/</span>
            <a href="#" className="">
              <FormattedMessage id="fogotPassword" />
            </a>
          </div>
          <p className="text-center md:mt-6 lg:mt-6 xl:mt-8 2xl:mt-10">
            <span className="text-neutral-400 caption2">
              <FormattedMessage id="agreeWithTerm" />
            </span>
            <br />
            <button
              className="text-yellow caption2"
              onClick={() => {
                setOpenTerm(true)
              }}
            >
              <FormattedMessage id="policy" />
            </button>
          </p>
        </div>
      </div>
    </>
  )
}

export default LoginContent
