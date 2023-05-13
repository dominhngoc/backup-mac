import ShareModal from '@common/components/ShareModal'
import ModalReportVideo from '@common/components/VideoBox/SettingController/ModalReportVideo'
import { VideoObject } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import { LiveChatIcon, ReportIcon, ShareIcon } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { setOpenChatDrawer } from '@redux/liveReducer'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import LikeBox from './LikeBox'

interface Props {
  data: VideoObject
}

const ActionBox = (props: Props) => {
  const { data } = props
  const [openShare, setOpenShare] = useState(false)
  const [openReport, setOpenReport] = useState(false)

  const { dispatch, isLogin } = useGeneralHook()

  const TABS = [
    {
      component: <LikeBox data={data} />,
    },
    {
      icon: <LiveChatIcon />,
      label: <FormattedMessage id="liveChatBox" />,
      onClick: () => dispatch(setOpenChatDrawer(true)),
    },
    {
      icon: <ReportIcon />,
      label: <FormattedMessage id="report" />,
      onClick: () =>
        isLogin ? setOpenReport(true) : dispatch(setOpenLoginDialog(true)),
    },
    {
      icon: <ShareIcon />,
      label: <FormattedMessage id="share" />,
      onClick: () => setOpenShare(true),
    },
  ]
  return (
    <>
      <div className="mt-4 flex text-neutral-500">
        {TABS.map((item, index) => {
          if (item.component) {
            return (
              <div key={index} className="ml-3">
                {item.component}
              </div>
            )
          }
          return (
            <button
              key={index}
              className="ml-3 flex flex-1 flex-col items-center justify-center"
              onClick={item.onClick}
            >
              {item.icon}
              <p className="caption1 ml-2">{item.label}</p>
            </button>
          )
        })}
      </div>
      <ShareModal
        open={openShare}
        onClose={() => setOpenShare(false)}
        shareUrl={data?.linkShare}
      />
      <ModalReportVideo open={openReport} onClose={setOpenReport} data={data} />
    </>
  )
}

export default ActionBox
