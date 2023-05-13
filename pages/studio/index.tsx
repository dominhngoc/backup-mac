import Redirect from '@common/components/Redirect'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import StudioPage from '@modules/StudioPage'
import { API_PATHS } from '@utility/API_PATH'
import { NextRequest, NextResponse } from 'next/server'
import { useCallback, useEffect, useState } from 'react'

interface Props {}

const NextPage = (props: Props) => {
  const { dispatch, setMessage, isLogin } = useGeneralHook()
  const [hasPermission, setPermis] = useState(true)
  const checkPermission = useCallback(async () => {
    if (!isLogin) {
      return
    }
    try {
      await dispatch(
        fetchThunk({ url: API_PATHS.lives.checkPermission, method: 'post' })
      )
    } catch (e: any) {
      setPermis(false)
      setMessage({ message: e.response?.data?.message })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  if (!isLogin) {
    return <Redirect to="/" />
  }

  if (hasPermission) {
    return (
      <>
        <StudioPage />
      </>
    )
  }
  return <Redirect to="/" />
}

export default NextPage
