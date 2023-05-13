import { some } from '@common/constants'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
export interface MessageType {
  id: string
  isLike?: string
  isRewind?: boolean
  userId?: string
  avatar: string
  userName: string
  role?: 'GUEST' | 'user' | 'admin' | 'moderator_channel'
  msg?: string
  nameTagId?: string
  replyId?: string
  replyUser?: string
  heartNum: number
  type?: string
  room?: string
  replyList?: MessageType[]
  position?: number
  duration?: number
}

export interface LiveState {
  listMessage: MessageType[]
  role: MessageType['role']
  pinMessage?: MessageType
  socket?: any
  replyId?: MessageType['id']
  queueMotion: MessageType[]
  blockDuration: number
  time: number
  openChatDrawer: boolean
}

export const initialStateLive: LiveState = {
  listMessage: [],
  role: 'GUEST',
  queueMotion: [],
  blockDuration: -1,
  time: 0,
  openChatDrawer: false,
}

export const liveSlice = createSlice({
  name: 'live',
  initialState: initialStateLive,
  reducers: {
    addMessage(state, action: PayloadAction<MessageType>) {
      if (
        !(
          action.payload.isRewind &&
          state.listMessage.findIndex((v) => v.id === action.payload.id) !== -1
        )
      ) {
        state.listMessage = uniqBy([...state.listMessage, action.payload], 'id')
      }
    },
    removeMessage(state, action: PayloadAction<MessageType['id']>) {
      state.listMessage = state.listMessage.filter(
        (v) => v.id !== action.payload
      )
    },
    removeMessageUser(state, action: PayloadAction<MessageType['userId']>) {
      state.listMessage = state.listMessage.filter(
        (v) => v.userId !== action.payload
      )
    },
    addMotion(state, action: PayloadAction<MessageType>) {
      if (
        !(
          action.payload.isRewind &&
          state.queueMotion.findIndex((v) => v.id === action.payload.id) !== -1
        )
      ) {
        state.queueMotion = uniqBy([...state.queueMotion, action.payload], 'id')
      }
    },
    removeMotion(state, action: PayloadAction<string>) {
      state.queueMotion = state.queueMotion.filter(
        (old) => old.id !== action.payload
      )
    },

    setPinMessage(state, action: PayloadAction<MessageType | undefined>) {
      state.pinMessage = action.payload
    },
    setReplyId(state, action: PayloadAction<string | undefined>) {
      state.replyId = action.payload
    },
    setRole(state, action: PayloadAction<MessageType['role']>) {
      state.role = action.payload
    },
    setBlockDuration(state, action: PayloadAction<number>) {
      state.blockDuration = action.payload
    },
    setTimeBlockDuration(state, action: PayloadAction<number>) {
      state.time = action.payload
    },
    setSocket(state, action: PayloadAction<any>) {
      state.socket = action.payload
    },
    setOpenChatDrawer(state, action: PayloadAction<boolean>) {
      state.openChatDrawer = action.payload
    },
    receiveHeart(state, action: PayloadAction<any>) {
      state.listMessage = state.listMessage.map((val: MessageType) => {
        if (val.id === action.payload.id) {
          return { ...val, heartNum: action.payload.heartNum }
        }
        return val
      })
      if (state.pinMessage && state.pinMessage.id === action.payload.id) {
        state.pinMessage.heartNum = action.payload.heartNum
      }
    },
    resetLiveState: () => initialStateLive,
  },
})
export const {
  setOpenChatDrawer,
  setBlockDuration,
  setTimeBlockDuration,
  removeMessageUser,
  removeMessage,
  addMotion,
  removeMotion,
  receiveHeart,
  setRole,
  setReplyId,
  addMessage,
  setPinMessage,
  setSocket,
  resetLiveState,
} = liveSlice.actions
export default liveSlice.reducer
