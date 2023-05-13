import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { API_PATHS } from '@utility/API_PATH'
import { useCallback, useEffect, useState } from 'react'
import FormDialog from './FormDialog'
import HeaderStudio from './HeaderStudio'
import InfoBox from './InfoBox'
import SettingBox from './SettingBox'
import useSWR from 'swr'
import { loadCategory } from '@redux/studioReducer'
import { LiveIcon, LoadingIcon, SettingIcon } from '@public/icons'
import { FormattedMessage } from 'react-intl'
import Head from 'next/head'

interface Props {}

const StudioPage = (props: Props) => {
  const {} = props
  const { router, setMessage, dispatch, intl, confirmDialog } = useGeneralHook()
  const { promptConfirmation, close } = confirmDialog
  const { tab } = router.query
  const [fomrData, setFormData] = useState<some | undefined>()
  const [isFirstTime, setFirstFime] = useState<number>(0)
  const { data, isValidating, mutate } = useSWR(
    API_PATHS.lives.currentLives,
    async (url) => {
      const json = await dispatch(
        fetchThunk({
          url,
          method: 'get',
        })
      )
      setFirstFime((old) => old + 1)
      return json?.data?.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  const onCreateUpdateLive = useCallback(
    async (value) => {
      try {
        const json = await dispatch(
          fetchThunk(
            {
              url: value?.id ? API_PATHS.lives.update : API_PATHS.lives.create,
              method: 'post',
              data: value?.id ? { type: 'INFO', ...value } : value,
            },
            true
          )
        )
        setFormData(undefined)
        mutate()

        setMessage({ message: json?.data?.message })
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message || 'Error' })
      } finally {
      }
    },
    [dispatch, mutate, setMessage]
  )

  const onResetLiveToken = useCallback(
    async (mode) => {
      const confirm = await promptConfirmation({
        warning: true,
        title: intl.formatMessage({ id: 'resetLiveToken' }),
        message: intl.formatMessage({ id: 'resetLiveTokenNote' }),
        okText: intl.formatMessage({ id: 'reset' }),
      })
      if (confirm) {
        try {
          const json = await dispatch(
            fetchThunk(
              {
                url: API_PATHS.lives.update,
                method: 'post',
                data: {
                  id: data?.id,
                  type: 'STATUS',
                  status: 'REMAKE_TOKEN',
                  mode: mode,
                },
              },
              true
            )
          )
          setFormData(undefined)
          mutate()
          setMessage({ message: json?.data?.message })
        } catch (e: any) {
          setMessage({ message: e.response?.data?.message || 'Error' })
        } finally {
        }
      }
      close()
    },
    [close, data?.id, dispatch, intl, mutate, promptConfirmation, setMessage]
  )

  const onChangeStatus = useCallback(async () => {
    try {
      const json = await dispatch(
        fetchThunk(
          {
            url: API_PATHS.lives.update,
            method: 'post',
            data: {
              type: 'STATUS',
              status:
                data?.status === 0
                  ? 'START_LIVE'
                  : data?.status === 2
                  ? 'STOP_LIVE'
                  : '',
              mode: data?.mode,
              id: data?.id,
            },
          },
          true
        )
      )
      setFormData(undefined)
      mutate()
      setMessage({ message: json?.data?.message })
    } catch (e: any) {
      setMessage({ message: e.response?.data?.message || 'Error' })
    } finally {
    }
  }, [data?.id, data?.mode, data?.status, dispatch, mutate, setMessage])

  useEffect(() => {
    dispatch(loadCategory())
  }, [dispatch])

  useEffect(() => {
    if (!data && !isValidating && isFirstTime === 1) {
      setFormData({})
    }
  }, [data, isFirstTime, isValidating])

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'myclipStudio' })}</title>
      </Head>
      <HeaderStudio>
        {data && (
          <div className="flex">
            <button className="btn-container mr-2" onClick={onChangeStatus}>
              <LiveIcon className="mr-2" />
              <FormattedMessage
                id={data?.status === 2 ? 'endLive' : 'startLive'}
              />
            </button>
            <button className="btn-text">
              <SettingIcon />
            </button>
          </div>
        )}
      </HeaderStudio>
      {isValidating ? (
        <div className="flex w-full shrink-0 items-center justify-center h-screen-head">
          <LoadingIcon className="h-10 animate-spin" />
        </div>
      ) : (
        <>
          {!tab && (
            <div className="container py-6">
              <InfoBox data={data} setFormData={setFormData} />
              <FormDialog
                formData={fomrData}
                open={!!fomrData}
                onClose={() => setFormData(undefined)}
                onSubmit={onCreateUpdateLive}
              />
              {data && (
                <SettingBox data={data} onResetLiveToken={onResetLiveToken} />
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default StudioPage
