import { VideoObject } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import ReportVideoModal from '@common/ReportVideoModal'
import { ReportIcon, ShareIcon } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ShareModal from '../ShareModal'
import LikeBox from './LikeBox'
import WatchLaterBox from './WatchLaterBox'

interface Props {
  data: VideoObject
  setOpenShare: (value: boolean) => void
}

const ActionBox = (props: Props) => {
  const { setMessage, dispatch, isLogin } = useGeneralHook()
  const { data } = props
  const [openReport, setOpenReport] = useState(false)
  const [openShare, setOpenShare] = useState(false)

  const TABS = [
    {
      component: <LikeBox data={data} />,
    },
    {
      component: <WatchLaterBox data={data} />,
    },
    {
      icon: <ShareIcon />,
      label: <FormattedMessage id="share" />,
      onClick: () => setOpenShare(true),
    },
    {
      icon: <ReportIcon />,
      label: <FormattedMessage id="report" />,
      onClick: () =>
        isLogin ? setOpenReport(true) : dispatch(setOpenLoginDialog(true)),
    },
  ]

  return (
    <div className="flex text-neutral-500">
      {TABS.map((item, index) => {
        if (item.component) {
          return (
            <div key={index} className="ml-5">
              {item.component}
            </div>
          )
        }
        return (
          <button
            key={index}
            className="ml-5 flex items-center"
            onClick={() => {
              item.onClick()
            }}
          >
            {item.icon}
            <p className="ml-2 caption1">{item.label}</p>
          </button>
        )
      })}
      <ReportVideoModal
        open={openReport}
        onClose={(val) => {
          setOpenReport(val)
        }}
        data={data}
        setMessage={setMessage}
      />
      <ShareModal
        open={openShare}
        onClose={() => {
          setOpenShare(false)
        }}
        shareUrl={data?.linkShare}
      />
    </div>
  )
}

export default ActionBox
