import { createSlice } from '@reduxjs/toolkit'

export interface LoginState {
  username: string
  password: string
}

const getDefaultValue = () => {
  // return { password: '12345678', username: '0979379455' }

  // return { password: '123123aA@', username: 'aladin' }

  return { password: '', username: '' }
}

export const initialStateLogin: LoginState = getDefaultValue()

export const LoginSlide = createSlice({
  name: 'login',
  initialState: initialStateLogin,
  reducers: {
    setLoginForm: (state, action) => {
      state.username = action.payload.username
      state.password = action.payload.password
    },
  },
})

export const { setLoginForm } = LoginSlide.actions

export default LoginSlide.reducer
