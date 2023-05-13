import { some } from '@common/constants'
import fetchThunk, { api } from '@common/fetchThunk'
import { DEVICE_ID } from '@modules/LoginContent'
import { AnyAction, createSlice, ThunkAction } from '@reduxjs/toolkit'
import { API_PATHS } from '@utility/API_PATH'
import { parseJwt } from '@utility/utils'
import { AppState } from './store'

interface SettingState {
  quality: { id: string; name: string }[]
  feedBack: { id: string; name: string }[]
}
export interface AuthState {
  isLogin: boolean
  loading: boolean
  userData?:
    | {
        id: number
        avatar: string
        user: string
      }
    | some
  profile?: some
  setting?: SettingState
  platform: string
}

export const initialStateAuth: AuthState = {
  isLogin: false,
  loading: false,
  platform: 'manual',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialStateAuth,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    authIn: (state) => {
      state.isLogin = true
    },
    authOut: (state) => {
      state.isLogin = false
    },
    setConfigPage: (state, action) => {
      state.setting = action.payload
    },
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setProfileData: (state, action) => {
      state.profile = action.payload
    },
    setPlarform: (state, action) => {
      state.platform = action.payload
    },
  },
})

export const {
  authIn,
  authOut,
  setLoading,
  setConfigPage,
  setProfileData,
  setUserData,
  setPlarform,
} = authSlice.actions

export function login(
  data: some
): ThunkAction<Promise<some>, AppState, null, AnyAction> {
  return async (dispatch, getState) => {
    dispatch(setLoading(true))
    const json = await api({
      url: API_PATHS.login,
      method: 'post',
      data,
      headers: data.captcha && {
        Authorization: sessionStorage.getItem(DEVICE_ID) || '',
      },
    })
    dispatch(setLoading(false))
    if (json?.data?.token) {
      dispatch(setPlarform('manual'))
      const tokenInfo = parseJwt(json.data.token)
      dispatch(
        setUserData({
          ...json.data,
          id: tokenInfo?.sub,
          avatar: tokenInfo?.context?.avatar,
          user: json.config.data,
        })
      )
      const json2 = await api({
        url: API_PATHS.users.getSettings,
      })
      dispatch(setConfigPage(json2.data?.data))
      const profileJson = await dispatch(
        fetchThunk({
          url: API_PATHS.users.profile,
        })
      )
      dispatch(setProfileData(profileJson.data?.data))
      dispatch(authIn())
    }
    return json
  }
}

export default authSlice.reducer
