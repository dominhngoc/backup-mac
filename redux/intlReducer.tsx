import { createAction, createSlice, nanoid } from '@reduxjs/toolkit'

export interface IntlState {
  locale: string
}

export const initialStateIntl: IntlState = {
  locale: 'vi',
}

export const changeLocale = createAction(
  'intl/changeLocale',
  function prepare(locale: string) {
    return {
      payload: {
        locale,
        id: nanoid(),
      },
    }
  }
)

export const intlReducer = createSlice({
  name: 'intl',
  initialState: initialStateIntl,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(changeLocale, (state, action) => {
      state.locale = action.payload?.locale
    })
  },
})

export default intlReducer.reducer
