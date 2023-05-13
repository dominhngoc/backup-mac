import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import { AnyAction, createSlice, ThunkAction } from '@reduxjs/toolkit'
import { API_PATHS } from '@utility/API_PATH'
import { AppState } from './store'

export interface UserInfoUpload {
  id: number
  status: number
  email: string
  id_card_created_at: string
  id_card_created_by: string
  id_card_image_backside: string
  id_card_image_frontside: string
  id_card_number: string
  msisdn: string
  name: string
  reason: string
  acceptTerm: boolean
}
export interface UploadState {
  userInfomation?: UserInfoUpload
  loading: boolean
}

export const initialStateUpload: UploadState = {
  loading: false,
}

export const uploadSlice = createSlice({
  name: 'auth',
  initialState: initialStateUpload,
  reducers: {
    setInfoUserUpload: (state, action) => {
      state.userInfomation = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { setInfoUserUpload, setLoading } = uploadSlice.actions

export function checkInfoUpload(): ThunkAction<
  Promise<any>,
  AppState,
  null,
  AnyAction
> {
  return async (dispatch, getState) => {
    dispatch(setLoading(true))
    const json = await dispatch(
      fetchThunk({ url: API_PATHS.users.getInfomation })
    )
    if ([403].includes(json?.data?.data?.status))
      dispatch(setInfoUserUpload({}))
    else if ([1, 3].includes(json?.data?.data?.status))
      dispatch(setInfoUserUpload(json?.data.data))
    dispatch(setLoading(false))
  }
}

export default uploadSlice.reducer
