import { some } from '@common/constants'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface MetaVideoData {
  volume: number
  playbackRate: number
  error?: some
  ended: boolean
}
export interface VideoData {
  duration: number
  currentTime: number
  loadedTime: number
}
export interface VideoState {
  dataVideo: VideoData
  metadata: MetaVideoData
  player?: any
  quality?: number
  openChat: boolean
}

export const initialStateVideo: VideoState = {
  dataVideo: {
    currentTime: 0,
    duration: 0,
    loadedTime: 0,
  },
  metadata: {
    volume: 0,
    ended: false,
    playbackRate: 1,
  },
  player: undefined,
  quality: undefined,
  openChat: false,
}

export const videoSlice = createSlice({
  name: 'video',
  initialState: initialStateVideo,
  reducers: {
    setPlayerVideo(state, action: PayloadAction<any>) {
      state.player = action.payload
    },
    setQuality(state, action: PayloadAction<any>) {
      state.quality = action.payload
    },
    setOpenChat(state, action: PayloadAction<boolean>) {
      state.openChat = action.payload
    },
    setVideoData(state, action: PayloadAction<VideoData | some>) {
      state.dataVideo = { ...state.dataVideo, ...action.payload }
    },
    setMetaVideoData(state, action: PayloadAction<MetaVideoData | some>) {
      state.metadata = {
        ...state.metadata,
        ...action.payload,
        error: action.payload?.error || '',
      }
    },
    resetVideoPlayer: () => initialStateVideo,
  },
})
export const {
  setOpenChat,
  setQuality,
  resetVideoPlayer,
  setPlayerVideo,
  setVideoData,
  setMetaVideoData,
} = videoSlice.actions
export default videoSlice.reducer
