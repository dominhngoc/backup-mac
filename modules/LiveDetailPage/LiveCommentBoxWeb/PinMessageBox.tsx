import ProgressiveImg from '@common/components/ProgressiveImg'
import { some } from '@common/constants'
import { CheckRoundIcon, HeartFilled, PinIcon, WrenchIcon } from '@public/icons'
import { MessageType } from '@redux/liveReducer'
import { AppState } from '@redux/store'
import { useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'

interface Props {
  message: MessageType
  socket: Socket
  roomInfo: some
  role: MessageType['role']
}

const PinMessageBox = (props: Props) => {
  const { message, socket, roomInfo } = props
  const [liked, setLike] = useState(message.isLike === '1' ? true : 0)
  const [show, setShow] = useState(true)

  const chatAccess = useSelector(
    (state: AppState) => state.common.chatAccess,
    shallowEqual
  )

  const onLikeMessage = () => {
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
  }

  useEffect(() => {
    let interval
    if (message?.duration && message?.duration > 0) {
      interval = setTimeout(() => {
        setShow(false)
      }, message?.duration && 60000)
    }
    return () => clearInterval(interval)
  }, [message?.duration])

  useEffect(() => {
    if (message?.duration === 0) {
      setShow(true)
    }
  }, [message?.duration])

  const emojiSrc =
    message.type === 'emoji'
      ? chatAccess?.emoji
          ?.reduce((v: any, c) => {
            return [...v, ...c.liveAssetChilds]
          }, [])
          ?.find((v) => v.id === message.msg)?.image
      : undefined

  if (!show) {
    return null
  }

  return (
    <div className="flex h-16 items-center justify-between bg-bg2 px-3">
      <div className="flex h-8 w-[252px]">
        <ProgressiveImg
          className="avatar mr-3 h-8 w-8"
          alt="avatar"
          src={message.avatar}
          isAvatar
        />
        <div>
          <div
            className={
              'flex items-center' +
              (message.role === 'admin'
                ? 'text-primary'
                : message.role === 'moderator_channel'
                ? 'text-green'
                : '')
            }
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
              <div className="max-w-[176px]">
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
            <PinIcon className="ml-1 text-primary" />
          </div>
          <p
            className={
              'mt-0.5 caption2 line-clamp-1 ' +
              (message.role === 'admin'
                ? 'text-primary'
                : message.role === 'moderator_channel'
                ? 'text-green'
                : '')
            }
          >
            {emojiSrc ? (
              <ProgressiveImg
                src={emojiSrc}
                className="h-5 w-5 object-contain"
              />
            ) : (
              message.msg
            )}
          </p>
        </div>
      </div>
      {message?.heartNum > 0 && (
        <div className="flex h-[21px] w-[46px] items-center justify-center rounded-xl bg-neutral-100 text-[11px]">
          <HeartFilled className="mr-1 h-3 w-3 text-red" />
          {message?.heartNum ? <>{message.heartNum}</> : ''}
        </div>
      )}
    </div>
  )
}

export default PinMessageBox
