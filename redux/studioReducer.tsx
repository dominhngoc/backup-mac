import api from '@common/api'
import { some } from '@common/constants'
import { AnyAction, createSlice, ThunkAction } from '@reduxjs/toolkit'
import { API_PATHS } from '@utility/API_PATH'
import { AppState } from './store'

export interface StudioState {
  listCategory: some[]
}

export function loadCategory(): ThunkAction<
  Promise<void>,
  AppState,
  null,
  AnyAction
> {
  return async (dispatch) => {
    const [json] = await Promise.all([
      api({
        url: API_PATHS.getTopic({ filter: ['TYPE_LIVE'] }),
        method: 'get',

      }),
    ])
    dispatch(setListCategory(json?.data?.data?.[0]?.contents))
  }
}

export const initialStateStudio: StudioState = { listCategory: [] }

export const studioSlice = createSlice({
  name: 'auth',
  initialState: initialStateStudio,
  reducers: {
    setListCategory: (state, action) => {
      state.listCategory = action.payload
    },
    // setSpanViewPlayer: (state) => {
    //   localStorage.setItem(SPAN_VIEW_PLAYER, `${!state.spanViewPlayer}`)
    //   state.spanViewPlayer = !state.spanViewPlayer
    // },
  },
})

export const { setListCategory } = studioSlice.actions

export default studioSlice.reducer
