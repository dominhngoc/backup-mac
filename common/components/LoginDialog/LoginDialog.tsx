import useGeneralHook from '@common/hook/useGeneralHook'
import LoginContent from '@modules/LoginContent'
import TermOfUseDialog from '@modules/LoginContent/TermOfUseDialog'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { AppState } from '@redux/store'
import { useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import Modal from '../Modal'
import ForgotPasswordDialog from './ForgotPasswordDialog'

const LoginDialog = () => {
  const { dispatch } = useGeneralHook()
  const [openTerm, setOpenTerm] = useState(false)
  const [openRegisterForm, setOpenRegisterForm] = useState(false)
  const openLoginDialog = useSelector(
    (state: AppState) => state.dialog.openLoginDialog,
    shallowEqual
  )
  return (
    <>
      <Modal
        open={openLoginDialog}
        onClose={() => {
          dispatch(setOpenLoginDialog(false))
          setOpenTerm(false)
          setOpenRegisterForm(false)
        }}
      >
        {openTerm ? (
          <TermOfUseDialog
            open={openTerm}
            onClose={() => {
              setOpenTerm(false)
            }}
          />
        ) : openRegisterForm ? (
          <ForgotPasswordDialog setOpenRegisterForm={setOpenRegisterForm} />
        ) : (
          <div className="relative max-h-[90vh] px-14 pt-12 pb-8">
            <LoginContent
              setOpenTerm={setOpenTerm}
              setOpenRegisterForm={setOpenRegisterForm}
            />
          </div>
        )}
      </Modal>
    </>
  )
}
export default LoginDialog
