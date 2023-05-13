import { createSlice } from '@reduxjs/toolkit'

export interface DialogState {
  openLoginDialog: boolean
  openLoginRequiedDialog: boolean
  openChangePassword: boolean
  openPackageData: boolean
}

export const initialStateDialog: DialogState = {
  openLoginDialog: false,
  openLoginRequiedDialog: false,
  openChangePassword: false,
  openPackageData: false,
}

export const DialogSlice = createSlice({
  name: 'auth',
  initialState: initialStateDialog,
  reducers: {
    setOpenPackageDataDialog: (state, action) => {
      state.openPackageData = action.payload
    },
    setOpenChangePasswordDialog: (state, action) => {
      state.openChangePassword = action.payload
    },
    setOpenLoginDialog: (state, action) => {
      state.openLoginDialog = action.payload
    },
    setOpenLoginRequiedDialog: (state, action) => {
      state.openLoginRequiedDialog = action.payload
    },
  },
})

export const {
  setOpenLoginDialog,
  setOpenLoginRequiedDialog,
  setOpenChangePasswordDialog,
  setOpenPackageDataDialog,
} = DialogSlice.actions

export default DialogSlice.reducer
