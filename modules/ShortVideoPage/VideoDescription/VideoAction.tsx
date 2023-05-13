import LikeBox from '@common/components/ActionBox/LikeBox'
import ShareModal from '@common/components/ShareModal'
import useGeneralHook from '@common/hook/useGeneralHook'
import { ShareFillIcon } from '@public/icons'
import { FormattedMessage } from 'react-intl'
import CommentCount from './CommentCount'

import { copyToClipboard } from '@utility/helper'
import { useState } from 'react'

interface Props {
  data?: any
}

const VideoAction = (props: Props) => {
  const [openShare, setOpenShare] = useState(false)
  const { setMessage, intl } = useGeneralHook()

  const { data } = props

  const onCopy = () => {
    copyToClipboard(data?.linkShare)
    setMessage({ message: intl.formatMessage({ id: 'copySuccess' }) })
  }

  const TABS = [
    {
      component: <LikeBox data={data} type="SHORT" />,
    },
    {
      component: <CommentCount data={data} />,
    },
    {
      icon: <ShareFillIcon />,
      label: <FormattedMessage id="share" />,
      onClick: () => setOpenShare(true),
    },
  ]

  return (
    <div>
      <div className="flex content-center items-center justify-start">
        {TABS.map((item, index) => {
          if (item.component) {
            return (
              <div className="mr-12" key={index}>
                {item.component}
              </div>
            )
          }
          return (
            <div className="mr-12 flex items-center justify-center" key={index}>
              <div>
                <button onClick={() => item.onClick && item.onClick()}>
                  <div
                    className={
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white bg-opacity-10 text-white '
                    }
                  >
                    {item.icon}
                  </div>
                </button>
              </div>

              <div className="ml-[4.5px]">
                <p className="font-bold headline">{item.label}</p>
              </div>
            </div>
          )
        })}
        <ShareModal
          open={openShare}
          onClose={() => {
            setOpenShare(false)
          }}
          shareUrl={data?.linkShare}
        />
      </div>

      <div className="flex justify-between rounded-xl bg-neutral-100 pl-3 pr-5 sm:mt-3 sm:h-8 2xl:mt-6 2xl:h-10">
        <p className="flex-1 text-neutral-400 line-clamp-1 sm:leading-8 2xl:leading-10">
          {data?.linkShare}
        </p>
        <button onClick={() => onCopy()}>
          <p className="whitespace-nowrap font-bold uppercase text-primary">
            <FormattedMessage id="copy" />
          </p>
        </button>
      </div>
    </div>
  )
}

export default VideoAction
