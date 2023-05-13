import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { GoogleIcon } from '@public/icons'
import {
  authIn,
  setPlarform,
  setProfileData,
  setUserData,
} from '@redux/authReducer'
import { API_PATHS } from '@utility/API_PATH'
import { parseJwt } from '@utility/utils'
import { useGoogleLogin } from 'react-google-login'

interface Props {}

const GoogleLoginBox = (props: Props) => {
  const { router, dispatch, setMessage } = useGeneralHook()

  const onSubmitOath = async (values) => {
    try {
      const json = await dispatch(
        fetchThunk({
          url: API_PATHS.users.socialLogin,
          method: 'POST',
          data: {
            accessToken: values.tokenId,
            login_via: 'GOOGLE',
          },
        })
      )
      if (json?.data?.token) {
        dispatch(setPlarform('goolge'))
        const tokenInfo = parseJwt(json.data.token)
        dispatch(
          setUserData({
            ...json.data,
            id: tokenInfo?.sub,
            avatar: tokenInfo?.context?.avatar,
          })
        )
        const profileJson = await dispatch(
          fetchThunk({
            url: API_PATHS.users.profile,
          })
        )
        dispatch(setProfileData(profileJson.data?.data))
        dispatch(authIn())
        router.back()
      }
    } catch (e: any) {
      setMessage({ message: e.response?.data?.message })
    } finally {
    }
  }

  const { signIn, loaded } = useGoogleLogin({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    onSuccess: onSubmitOath,
    onFailure: (response) => {
      console.log('onFailure', response)
      // const json = api({ url: API_PATHS.users.socialLogin })
    },
  })

  return (
    <>
      <button onClick={signIn} className="mr-6">
        <GoogleIcon />
      </button>
    </>
  )
}

export default GoogleLoginBox
