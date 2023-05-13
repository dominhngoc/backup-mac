import useGeneralHook from '@common/hook/useGeneralHook'
import {
  CloseIcon,
  GoogleIcon,
  MessageFacebookIcon,
  ShareLinkIcon,
  TelegramIcon,
  TwitterIcon,
  ZaloIcon,
} from '@public/icons'
import { copyToClipboard } from '@utility/helper'
import { stringify } from 'querystring'
import { FormattedMessage } from 'react-intl'
;<a href="fb-messenger://share/?link= https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Freference%2Fsend-dialog&app_id=123456789">
  Send In Messenger
</a>

const LIST_SHARE = [
  {
    icon: <ShareLinkIcon />,
    name: 'shareLink',
  },
  {
    icon: <MessageFacebookIcon />,
    name: 'facebookMessenger',
    href: (url: string) =>
      `fb-messenger://share/?link=${encodeURIComponent(
        url
      )}&display=popup&app_id=123456789`,
  },
  {
    icon: <TwitterIcon />,
    name: 'twitter',
    href: (url) => `https://twitter.com/share?url=${url}`,
  },
  {
    icon: <GoogleIcon />,
    name: 'gmail',
    href: (url: string) => `mailto:?${stringify({ subject: url })}`,
  },

  {
    icon: <TelegramIcon />,
    name: 'telegram',
    href: (url: string) => `https://t.me/share/url?url=${url}`,
  },
  {
    icon: <ZaloIcon />,
    name: 'zalo',
    href: (url: string) => `https://chat.zalo.me/`,
  },
]

interface Props {
  onClose: (value: boolean) => void
  shareUrl?: string
}
const ShareContent = (props: Props) => {
  const { onClose, shareUrl } = props
  const { setMessage, intl } = useGeneralHook()
  if (!shareUrl) {
    return null
  }
  const onCopy = () => {
    copyToClipboard(shareUrl)
    setMessage({ message: intl.formatMessage({ id: 'copySuccess' }) })
    onClose(false)
  }
  return (
    <div className="px-6 pt-5 pb-6">
      <div className="mb-6 flex justify-between">
        <p className="font-bold title">
          <FormattedMessage id="share" />
        </p>
        <button onClick={() => onClose(false)}>
          <CloseIcon />
        </button>
      </div>
      <div className="mb-6 -mr-5 flex flex-row items-start overflow-auto scrollbar-none-height">
        {LIST_SHARE.map((item, index) => {
          if (item.href) {
            return (
              <a
                key={index}
                href={item.href(shareUrl)}
                target="_blank"
                rel="noreferrer"
                className="mr-5"
              >
                <div className="flex w-14 flex-col items-center justify-center text-center">
                  <div className="mb-2">{item.icon}</div>
                  <p className="caption2">
                    <FormattedMessage id={item.name} />
                  </p>
                </div>
              </a>
            )
          }
          return (
            <button
              className="mr-5 flex w-14 flex-col items-center justify-center text-center"
              key={index}
              onClick={() => item.name === 'shareLink' && onCopy()}
            >
              <div className="mb-2">{item.icon}</div>
              <p className="whitespace-nowrap caption2">
                <FormattedMessage id={item.name} />
              </p>
            </button>
          )
        })}
      </div>
      <div className="flex  h-10 w-full justify-between rounded-xl bg-neutral-100 p-2.5">
        <p className="max-w-xs text-neutral-400 line-clamp-1">{shareUrl}</p>
        <button onClick={() => onCopy()}>
          <p className="font-bold uppercase text-primary headline">
            <FormattedMessage id="copy" />
          </p>
        </button>
      </div>
    </div>
  )
}

export default ShareContent
