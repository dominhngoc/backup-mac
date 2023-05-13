import useGeneralHook from '@common/hook/useGeneralHook'
import { AppStore, CloseIcon, GooglePlay, MyclipIcon } from '@public/icons'
import { setOpenDownloadDialog } from '@redux/commonReducer'
import { AppState } from '@redux/store'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import Modal from './Modal'
import MyLink from './MyLink'

interface Props {}
const RequireDownloadDialog = (props: Props) => {
  const { dispatch } = useGeneralHook()
  const openDownloadDialog = useSelector(
    (state: AppState) => state.common.openDownloadDialog,
    shallowEqual
  )

  return (
    <Modal
      open={openDownloadDialog}
      onClose={() => {
        dispatch(setOpenDownloadDialog(false))
      }}
    >
      <div className="flex flex-col gap-3 px-12 pt-10 pb-12 text-center">
        <p className="font-bold headline">
          <FormattedMessage id="uploadTitle" />
        </p>
        <p className="py-7 text-neutral-500">
          <FormattedMessage id="uploadMessage" />
        </p>
        <img
          src="/images/qr_code.jpg"
          alt="qr_code"
          className="mx-auto h-50 w-50 rounded border-4 border-white"
        />
        <div className="my-4 flex justify-center">
          <MyLink
            target={'_blank'}
            className="mr-4"
            href={{
              pathname:
                'https://apps.apple.com/vn/app/myclip-clip-hot/id1186215150?l=vi',
            }}
          >
            <img src={AppStore.src} alt="AppStore" className="h-12" />
          </MyLink>
          <MyLink
            target={'_blank'}
            href={{
              pathname:
                'https://play.google.com/store/apps/details?id=com.viettel.myclip&hl=vi',
            }}
          >
            <img src={GooglePlay.src} alt="GooglePlay" className="h-12" />
          </MyLink>
        </div>
        <button
          className="absolute top-0 right-0 p-4 text-neutral-500"
          onClick={() => {
            dispatch(setOpenDownloadDialog(false))
          }}
        >
          <CloseIcon />
        </button>
      </div>
    </Modal>
  )
}
export default RequireDownloadDialog
