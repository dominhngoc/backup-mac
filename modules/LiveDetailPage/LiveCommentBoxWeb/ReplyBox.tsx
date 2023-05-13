import { some } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import { LeftArrowIcon } from '@public/icons'
import { setReplyId } from '@redux/liveReducer'
import { AppState } from '@redux/store'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import MessageBox from './MessageBox'

interface Props {
  roomInfo: some
}

const ReplyBox = (props: Props) => {
  const { roomInfo } = props
  const { dispatch } = useGeneralHook()
  const { listMessage, role, socket, replyId } = useSelector(
    (state: AppState) => state.live,
    shallowEqual
  )

  const replyObject = replyId
    ? listMessage.find((message) => message.id === replyId)
    : undefined

  return (
    <div className="h-full w-full bg-bg2">
      <div className="flex h-12 w-full items-center border-t border-b border-neutral-100 px-3 py-2">
        <button onClick={() => dispatch(setReplyId(undefined))}>
          <LeftArrowIcon className=" text-neutral-500" />
        </button>
        <div className="ml-3 flex">
          <p className="text-xs text-neutral-500">
            <FormattedMessage id="reply" />
          </p>
          <p className="ml-1 text-xs font-bold text-white">
            {replyObject?.userName}
          </p>
        </div>
      </div>
      <div
        className="flex h-full flex-1 flex-col overflow-auto p-3"
        style={{ maxHeight: 'calc(100% - 48px)' }}
      >
        {listMessage
          ?.filter((v) => v.replyId === replyId || v.id === replyId)
          .map((message) => {
            return (
              <div className="mb-3" key={message.id}>
                <MessageBox
                  key={message.id}
                  message={message}
                  socket={socket}
                  roomInfo={roomInfo}
                  role={role}
                />
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default ReplyBox
