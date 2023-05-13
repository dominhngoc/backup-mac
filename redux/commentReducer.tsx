import { createSlice } from '@reduxjs/toolkit'
import { uniq } from 'lodash'

export interface CommentState {
  likeList: (string | number)[]
}

export const initialStateComment: CommentState = {
  likeList: [],
}

export const commentSlice = createSlice({
  name: 'auth',
  initialState: initialStateComment,
  reducers: {
    addLike: (state, action) => {
      state.likeList = uniq([...state.likeList, action.payload])
    },
    removeLike: (state, action) => {
      state.likeList = state.likeList.filter((v) => v !== action.payload)
    },
    removeAll: (state) => {
      state.likeList = []
    },
  },
})
export const { addLike, removeLike, removeAll } = commentSlice.actions

export default commentSlice.reducer
