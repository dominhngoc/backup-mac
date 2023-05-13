import { some } from '@common/constants'
import { api } from '@common/fetchThunk'
import {
  AnyAction,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit'
import { API_PATHS } from '@utility/API_PATH'
import { AppState } from './store'

const SPAN_VIEW_PLAYER = 'SPAN_VIEW_PLAYER'
export interface CommonState {
  chatAccess: {
    emoji: some[]
    money: some[]
    motion: some[]
    tag: some[]
  }
  spanViewPlayer: boolean
  openDownloadDialog: boolean
  keyStatus: string
}

export const initialStateCommon: CommonState = {
  chatAccess: { emoji: [], money: [], motion: [], tag: [] },
  spanViewPlayer: false,
  openDownloadDialog: false,
  keyStatus: 'on',
}

export function loadChatAccess(): ThunkAction<
  Promise<void>,
  AppState,
  null,
  AnyAction
> {
  return async (dispatch) => {
    const [chatAccessJson] = await Promise.all([
      api({ url: API_PATHS.lives.getChatAccess, method: 'get' }),
    ])
    dispatch(setChatAccess(chatAccessJson?.data?.data))
  }
}

export const commonSlice = createSlice({
  name: 'auth',
  initialState: initialStateCommon,
  reducers: {
    setChatAccess: (state, action) => {
      state.chatAccess = action.payload
    },
    setOpenDownloadDialog: (state, action) => {
      state.openDownloadDialog = action.payload
    },
    setSpanViewPlayer: (state) => {
      localStorage.setItem(SPAN_VIEW_PLAYER, `${!state.spanViewPlayer}`)
      state.spanViewPlayer = !state.spanViewPlayer
    },
    changeKey: (state) => {
      state.keyStatus = state.keyStatus === 'on' ? 'off' : 'on'
    },
  },
})

export const {
  setChatAccess,
  setOpenDownloadDialog,
  setSpanViewPlayer,
  changeKey,
} = commonSlice.actions

export default commonSlice.reducer
