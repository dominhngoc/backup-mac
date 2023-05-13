import { useConfirmDialog } from '@common/components/ConfirmDialogProvider'
import { setMessage } from '@redux/snackbarReducer'
import { AppState } from '@redux/store'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

const useGeneralHook = () => {
  const router = useRouter()
  const dispatch: ThunkDispatch<AppState, null, AnyAction> = useDispatch()
  const userData = useSelector(
    (state: AppState) => state.auth.userData,
    shallowEqual
  )
  const isLogin = useSelector(
    (appState: AppState) => appState.auth.isLogin,
    shallowEqual
  )
  const intl = useIntl()
  const confirmDialog = useConfirmDialog()
  return {
    intl,
    dispatch,
    router,
    setMessage: (value: { message: any; className?: string }) =>
      dispatch(setMessage(value)),
    isLogin,
    confirmDialog,
    userData: userData,
  }
}

export default useGeneralHook
