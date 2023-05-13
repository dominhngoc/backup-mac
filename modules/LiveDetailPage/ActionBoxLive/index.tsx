import ShareModal from '@common/components/ShareModal'
import ModalReportVideo from '@common/components/VideoBox/SettingController/ModalReportVideo'
import { VideoObject } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import { ReportIcon, ShareIcon } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  data: VideoObject
}
const ActionBoxLive = (props: Props) => {
  const { data } = props

  const [openShare, setOpenShare] = useState(false)
  const [openReport, setOpenReport] = useState(false)
  const { dispatch, isLogin } = useGeneralHook()
  return (
    <div className="flex w-[190px]">
      <button
        className="flex flex-1 items-center justify-center text-neutral-500"
        onClick={() => setOpenShare(true)}
      >
        <ShareIcon />
        <p className="caption1 ml-2">
          <FormattedMessage id="share" />
        </p>
      </button>
      <button
        className="flex flex-1 items-center justify-center text-neutral-500"
        onClick={() =>
          isLogin ? setOpenReport(true) : dispatch(setOpenLoginDialog(true))
        }
      >
        <ReportIcon />
        <p className="caption1 ml-2">
          <FormattedMessage id="report" />
        </p>
      </button>
      <ShareModal
        open={openShare}
        onClose={() => setOpenShare(false)}
        shareUrl={data?.linkShare}
      />
      <ModalReportVideo
        open={openReport}
        onClose={(value) => {
          setOpenReport(value)
        }}
        data={data}
      />
    </div>
  )
}

export default ActionBoxLive
