import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
const MAX_SIZE = 3
export interface SnackbarState {
  stack: { message: any; leave: boolean; id: number; className?: string }[]
}

export const initialStateSnackBar: SnackbarState = {
  stack: [],
}

export const snackbarSlice = createSlice({
  name: 'auth',
  initialState: initialStateSnackBar,
  reducers: {
    setMessage: (
      state,
      action: PayloadAction<{ message: any; className?: string }>
    ) => {
      state.stack = [
        ...(state.stack.length > MAX_SIZE
          ? state.stack.map((v, i) => {
              if (i === 0) {
                return { ...v, leave: true }
              } else {
                return v
              }
            })
          : state.stack),
        { ...action.payload, leave: false, id: moment().valueOf() },
      ]
    },
    remove: (state, action: PayloadAction<number>) => {
      state.stack = state.stack.filter((v) => v.id !== action.payload)
    },
  },
})

export const { setMessage, remove } = snackbarSlice.actions

export default snackbarSlice.reducer
