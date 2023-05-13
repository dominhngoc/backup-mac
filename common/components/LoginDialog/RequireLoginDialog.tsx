import useGeneralHook from '@common/hook/useGeneralHook'
import {
  setOpenLoginDialog,
  setOpenLoginRequiedDialog,
} from '@redux/dialogReducer'
import { AppState } from '@redux/store'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import Modal from '../Modal'

const RequireLoginDialog = () => {
  const { dispatch } = useGeneralHook()
  const openLoginRequiedDialog = useSelector(
    (state: AppState) => state.dialog.openLoginRequiedDialog,
    shallowEqual
  )
  return (
    <>
      <Modal
        open={openLoginRequiedDialog}
        onClose={() => {
          dispatch(setOpenLoginRequiedDialog(false))
        }}
      >
        <div className="p-8 text-center">
          <p className="font-bold title">
            <FormattedMessage id="notify" />
          </p>
          <p className="mx-auto mt-4 mb-6 w-52 text-neutral-500">
            <FormattedMessage id="requireLogin" />
          </p>
          <div className="flex">
            <button
              className="btn mr-2 w-full flex-1 font-bold headline"
              onClick={() => {
                dispatch(setOpenLoginRequiedDialog(false))
              }}
            >
              <FormattedMessage id="pass" />
            </button>
            <button
              className="btn-container ml-2 w-full flex-1 whitespace-nowrap font-bold headline"
              onClick={() => {
                dispatch(setOpenLoginRequiedDialog(false))
                dispatch(setOpenLoginDialog(true))
              }}
            >
              <FormattedMessage id="login" />
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
export default RequireLoginDialog
