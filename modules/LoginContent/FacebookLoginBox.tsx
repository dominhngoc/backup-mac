import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { FacebookIcon } from '@public/icons'
import {
  authIn,
  setPlarform,
  setProfileData,
  setUserData,
} from '@redux/authReducer'
import { API_PATHS } from '@utility/API_PATH'
import { parseJwt } from '@utility/utils'
import FacebookLogin from 'react-facebook-login'

interface Props {}

const FacebookLoginBox = (props: Props) => {
  const { router, dispatch, setMessage } = useGeneralHook()

  const onSubmitOath = async (values) => {
    try {
      const json = await dispatch(
        fetchThunk({
          url: API_PATHS.users.socialLogin,
          method: 'POST',
          data: {
            accessToken: values.accessToken,
            login_via: 'FACEBOOK',
          },
        })
      )
      if (json?.data?.token) {
        dispatch(setPlarform('facebook'))
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

  return (
    <>
      <FacebookLogin
        appId={process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}
        fields="name,email,picture"
        icon={<FacebookIcon />}
        cssClass="h-full"
        textButton=""
        callback={onSubmitOath}
      ></FacebookLogin>
    </>
  )
}

export default FacebookLoginBox
