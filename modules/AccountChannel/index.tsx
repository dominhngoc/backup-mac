import ProgressiveImg from '@common/components/ProgressiveImg'
import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { CameraIcon, CheckboxIcon, SaveIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import useSWR from 'swr'
import AcceptBox from './AcceptBox'

interface Form {
  banner_token: string
  avatar_token: string
  name: string
  description: string
}

interface Props {
  dataCategorySSR: some[]
}

const AccountChannel = (props: Props) => {
  const { dataCategorySSR } = props
  const { dispatch, setMessage, intl } = useGeneralHook()
  const methods = useForm<Form>({
    defaultValues: {
      avatar_token: '',
      name: '',
      banner_token: '',
      description: '',
    },
  })
  const { handleSubmit, reset, control } = methods
  const [image, setImage] = useState<some>({
    coverImage: '',
    avatarImage: '',
  })

  const { data, mutate } = useSWR(
    API_PATHS.users.profile,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  const onSubmit = useCallback(
    async (value: Form) => {
      try {
        const json = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.users.updateProfile,
              method: 'post',
              data: value,
            },
            true
          )
        )
        if (json.status === 200) {
          mutate()
        }
        setMessage({ message: json.data?.message })
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    },
    [dispatch, mutate, setMessage]
  )

  const handleChangeImage = async (a: any, onChange, key) => {
    const target = a.target as HTMLInputElement
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
        onChange(json.data?.data?.token)
        var reader = new FileReader()
        reader.readAsDataURL(listFiles[0])
        reader.onload = function () {
          const data: any = reader.result
          setImage((old) => ({ ...old, [key]: data }))
        }
      } catch (error: any) {
        setMessage({ message: error.response?.data?.message })
      }
    }
  }

  useEffect(() => {
    reset({ ...data, name: data?.fullName })
    setImage(data)
  }, [data, reset])

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'contact' })}</title>
      </Head>
      <MenuCategories listCategory={dataCategorySSR} />
      <div className="container py-6 min-h-screen">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="banner_token"
              control={control}
              render={({ field: { value, name, onChange } }) => {
                return (
                  <div className="relative mb-6 flex w-full" key={value}>
                    <ProgressiveImg
                      src={image?.coverImage}
                      alt="banner"
                      shape="channel"
                      className="h-70 w-full rounded-xl object-cover"
                    />
                    <div className="absolute top-0 left-0 h-full w-full bg-transparent ">
                      <label
                        className="flex h-full w-full cursor-pointer items-center justify-center bg-transparent"
                        htmlFor={name}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-20">
                          <CameraIcon />
                        </div>
                      </label>
                      <input
                        key={value}
                        id={name}
                        type={'file'}
                        className="hidden"
                        onChange={(v) =>
                          handleChangeImage(v, onChange, 'coverImage')
                        }
                        accept="image/png, image/gif, image/jpeg, image/webp"
                      />
                    </div>
                  </div>
                )
              }}
            />
            <div className="flex">
              <div className="flex flex-1 rounded-xl bg-bg2 p-8">
                <Controller
                  name="avatar_token"
                  control={control}
                  render={({ field: { name, value, onChange } }) => {
                    return (
                      <div className="relative h-28 w-28" key={value}>
                        <ProgressiveImg
                          src={image?.avatarImage}
                          alt="banner"
                          className="avatar h-28 w-28"
                        />
                        <div className="absolute top-0 left-0 h-full w-full bg-transparent ">
                          <label
                            className="flex h-full w-full cursor-pointer items-center justify-center bg-transparent"
                            htmlFor={name}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-20">
                              <CameraIcon />
                            </div>
                          </label>
                          <input
                            key={value}
                            id={name}
                            type={'file'}
                            className="hidden"
                            onChange={(v) =>
                              handleChangeImage(v, onChange, 'avatarImage')
                            }
                            accept="image/png, image/gif, image/jpeg, image/webp"
                          />
                        </div>
                      </div>
                    )
                  }}
                />
                <div className="ml-8 flex-1">
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: intl.formatMessage({ id: 'required' }),
                    }}
                    render={({
                      field: { name, onChange, ref, value = '' },
                      fieldState: { invalid },
                    }) => {
                      return (
                        <>
                          <div className="relative mb-6">
                            <input
                              className={
                                'text-field pr-14 ' +
                                (invalid ? 'error-field' : '')
                              }
                              name={name}
                              onChange={onChange}
                              ref={ref}
                              value={value}
                              placeholder={intl.formatMessage({
                                id: 'channelPlaceholder',
                              })}
                              type="text"
                              maxLength={100}
                            />
                            <p className="absolute top-2.5 right-2 text-neutral-400 caption2">
                              {value.length}/100
                            </p>
                          </div>
                        </>
                      )
                    }}
                  />
                  <Controller
                    name="description"
                    control={control}
                    render={({
                      field: { name, onChange, ref, value = '' },
                      fieldState: { error },
                    }) => {
                      return (
                        <>
                          <div className="text-field flex w-full">
                            <textarea
                              className="mb-4 h-full w-full border-none bg-transparent px-0 text-sm outline-none focus:ring-0"
                              name={name}
                              onChange={onChange}
                              ref={ref}
                              value={value}
                              placeholder={intl.formatMessage({
                                id: 'channelPlaceholder',
                              })}
                              rows={10}
                              maxLength={1000}
                            />
                            <p className="mt-2 text-neutral-400 caption2">
                              {value?.length || 0}/1000
                            </p>
                          </div>
                          <p className="mt-1 ml-2 text-xs text-red">
                            {error?.message}&nbsp;
                          </p>
                        </>
                      )
                    }}
                  />
                  <AcceptBox dataUser={data} />
                  <div className="mt-16 flex justify-end">
                    <button
                      className="btn w-36"
                      type="button"
                      onClick={() => reset()}
                    >
                      <FormattedMessage id="cancel" />
                    </button>
                    <button className="btn-container ml-4 w-40" type="submit">
                      <SaveIcon className="mr-2" />
                      <FormattedMessage id="save" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="ml-6 w-[356px] rounded-xl bg-bg2 p-8">
                <p className="font-bold title">
                  <FormattedMessage id="notice" />:
                </p>
                <div className="mt-11">
                  {[
                    'image.notice1',
                    'image.notice2',
                    'image.notice3',
                    'image.notice4',
                  ].map((val) => {
                    return (
                      <div key={val} className="mt-6 flex items-center">
                        <CheckboxIcon className="mr-4 shrink-0" />
                        <span>
                          <FormattedMessage id={val} />
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  )
}

export default AccountChannel
