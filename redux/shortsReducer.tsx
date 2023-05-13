import { some } from '@common/constants'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ShortVideoData {
  duration: number
  currentTime: number
  loadedTime: number
}
interface ShortMetaData {
  volume: number
  playing: boolean
  error?: any
}
export interface ShortState {
  videoData: ShortVideoData
  metadata: ShortMetaData
  draggingProgressLine: boolean
  player?: any
}

export const initialStateShort: ShortState = {
  videoData: {
    currentTime: 0,
    duration: 0,
    loadedTime: 0,
  },
  metadata: {
    playing: false,
    volume: 0,
  },
  draggingProgressLine: false,
}

export const shortsSlice = createSlice({
  name: 'short',
  initialState: initialStateShort,
  reducers: {
    setPlayerShort(state, action: PayloadAction<any>) {
      state.player = action.payload
    },
    setShortVideoData(state, action: PayloadAction<ShortVideoData | some>) {
      state.videoData = { ...state.videoData, ...action.payload }
    },
    setShortMetaData(state, action: PayloadAction<ShortMetaData | some>) {
      state.metadata = {
        ...state.metadata,
        ...action.payload,
        error: action.payload?.error || '',
      }
    },
    setDraggingProgressLine(state, action: PayloadAction<boolean>) {
      state.draggingProgressLine = action.payload
    },
  },
})
export const {
  setPlayerShort,
  setShortVideoData,
  setShortMetaData,
  setDraggingProgressLine,
} = shortsSlice.actions
export default shortsSlice.reducer
