import Popper from '@common/components/Popper'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { some } from '@common/constants'
import emitter from '@common/emitter'
import useGeneralHook from '@common/hook/useGeneralHook'
import {
  CheckRoundIcon,
  HeartFilled,
  MoreIcon,
  ReplyIcon,
  WrenchIcon,
} from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { MessageType } from '@redux/liveReducer'
import { AppState } from '@redux/store'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'

interface Props {
  message: MessageType
  socket: Socket
  roomInfo: some
  onReply?: (replyId: string) => void
  role: MessageType['role']
}

const MessageBox = (props: Props) => {
  const { message, socket, roomInfo, role, onReply } = props
  const { isLogin, dispatch, confirmDialog, intl } = useGeneralHook()
  const chatAccess = useSelector(
    (state: AppState) => state.common.chatAccess,
    shallowEqual
  )
  const { promptConfirmation, close } = confirmDialog
  const [liked, setLike] = useState(message.isLike === '1' ? true : 0)
  const [openOption, setOpenOption] = useState(false)
  const [open, setOpen] = useState(false)

  const onLikeMessage = () => {
    if (isLogin) {
      if (liked) {
        socket.emit('removeHeart', {
          room: roomInfo?.roomId,
          id: message?.id,
        })
      } else {
        socket.emit('sendHeart', {
          room: roomInfo?.roomId,
          id: message?.id,
        })
      }
      setLike(!liked)
    } else {
      dispatch(setOpenLoginDialog(true))
    }
  }
  const onPinMessage = () => {
    socket.emit('pinMessageUser', {
      room: roomInfo?.roomId,
      id: message?.id,
    })
    setOpenOption(false)
  }
  const onDelete = async () => {
    const confirm = await promptConfirmation({
      warning: true,
      title: intl.formatMessage({ id: 'confirm' }),
      message: intl.formatMessage({ id: 'deletesCommentConfirm' }),

      okText: 'deleteComment',
    })
    if (confirm) {
      socket.emit('deleteMsgByChannel', {
        room: roomInfo?.roomId,
        id: message?.id,
      })
    }
    close()
    setOpenOption(false)
  }
  const onBlock = () => {
    socket.emit('lockUserByChannel', {
      room: roomInfo?.roomId,
      userId: message?.userId,
    })
    setOpenOption(false)
  }

  useEffect(() => {
    emitter.addListener('closeReply', () => {
      setOpen(false)
    })
    return () => {
      emitter.removeAllListeners()
    }
  }, [])

  const emojiSrc =
    message.type === 'emoji'
      ? chatAccess?.emoji
          ?.reduce((v: any, c) => {
            return [...v, ...c.liveAssetChilds]
          }, [])
          ?.find((v) => v.id === message.msg)?.image
      : undefined

  return (
    <div className="relative mb-3">
      {message.replyUser && (
        <div className="flex items-center pl-10 text-neutral-400 caption2">
          {onReply && (
            <button
              className="flex flex-nowrap items-center px-2 text-neutral-300 caption2"
              onClick={() => message.replyId && onReply(message.replyId)}
            >
              <ReplyIcon className="mr-1" /> <FormattedMessage id="reply" />{' '}
              <div className="ml-1 max-w-[186px] text-left line-clamp-1">
                <strong>{message.replyUser}</strong>
              </div>
            </button>
          )}
        </div>
      )}
      <div className="flex">
        <ProgressiveImg
          src={message.avatar}
          className="avatar mr-3 h-8 w-8"
          isAvatar
        />
        <div className="flex-1 flex-col">
          <div className="flex min-w-[120px] max-w-[200px] flex-col">
            <div className="relative">
              <div
                className=" flex-1 rounded-xl bg-neutral-100 px-3 py-2"
                onClick={() => {
                  setOpen(!open)
                }}
              >
                <div
                  className={
                    'flex items-center ' +
                    (message.role === 'admin'
                      ? 'text-primary'
                      : message.role === 'moderator_channel'
                      ? 'text-green'
                      : '')
                  }
                >
                  <div className="max-w-[160px]">
                    <p className={'mr-1 font-bold caption1 line-clamp-1'}>
                      {message.userName}
                    </p>
                  </div>
                  {message.role === 'moderator_channel' ? (
                    <WrenchIcon />
                  ) : message.role === 'admin' ? (
                    <CheckRoundIcon />
                  ) : null}
                </div>
                <p className="mt-0.5 overflow-hidden caption2">
                  {emojiSrc ? (
                    <ProgressiveImg
                      src={emojiSrc}
                      className="max-w-20 object-contain"
                    />
                  ) : (
                    message.msg
                  )}
                </p>
              </div>
              {message?.heartNum > 0 && (
                <div
                  className="absolute right-0 top-1 flex h-7 items-center rounded-full bg-neutral-200 py-1 px-2"
                  style={{
                    transform: 'translateX(14px)',
                  }}
                  onClick={onLikeMessage}
                >
                  <HeartFilled className=" h-3 w-3 text-red" />
                  {message?.heartNum > 1 ? (
                    <p className="ml-1 caption2">{message.heartNum}</p>
                  ) : (
                    ''
                  )}
                </div>
              )}
            </div>
          </div>
          {message.id && open && (
            <div className="form-like-reply-live-message mt-2 flex text-neutral-400 caption2">
              <button
                className={'px-2 ' + (liked ? 'font-bold text-red' : '')}
                onClick={onLikeMessage}
              >
                <FormattedMessage id="dropHeart" />
              </button>
              {onReply && (
                <button className="px-2" onClick={() => onReply(message.id)}>
                  <FormattedMessage id="reply" />
                </button>
              )}
            </div>
          )}
        </div>
        {(role === 'moderator_channel' || role === 'admin') && (
          <Popper
            open={openOption}
            wrapper={<MoreIcon />}
            setOpen={setOpenOption}
            className="h-6 w-6"
            classNamePaper="w-72"
          >
            <div className="shadow-[0px 6px 15px rgba(0, 0, 0, 0.6)] min-h-20 absolute top-[100%] right-0 z-10 flex w-[224px] flex-col rounded-lg border border-neutral-100 bg-bg2">
              <button
                className="flex h-12 flex-row items-center rounded-tl-lg rounded-tr-lg px-6 hover:bg-neutral-200"
                onClick={onDelete}
              >
                <p className="text-sm ">
                  <FormattedMessage id="removeComment" />
                </p>
              </button>
              <button
                className="flex h-12 flex-row items-center  px-6 hover:bg-neutral-200"
                onClick={onBlock}
              >
                <p className="text-left text-sm text-white line-clamp-2">
                  <FormattedMessage
                    id="blockChat"
                    values={{ name: message.userName }}
                  />
                </p>
              </button>
              <button
                className="flex h-12 flex-row items-center rounded-bl-lg rounded-br-lg px-6 hover:bg-neutral-200"
                onClick={onPinMessage}
              >
                <p className="text-sm text-white">
                  <FormattedMessage id="pin" />
                </p>
              </button>
            </div>
          </Popper>
        )}
      </div>
    </div>
  )
}

export default MessageBox
