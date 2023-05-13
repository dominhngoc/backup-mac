import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { LeftArrowIcon, LoadingIcon } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import {
  addMessage,
  addMotion,
  MessageType,
  receiveHeart,
  removeMessage,
  removeMessageUser,
  resetLiveState,
  setBlockDuration,
  setPinMessage,
  setReplyId,
  setRole,
  setSocket,
  setTimeBlockDuration,
} from '@redux/liveReducer'
import { setMessage } from '@redux/snackbarReducer'
import { AppState } from '@redux/store'
import { API_PATHS } from '@utility/API_PATH'
import { useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import socketIOClient from 'socket.io-client'
import useSWR from 'swr'
import MessageBox from '../LiveCommentBoxWeb/MessageBox'
import PinMessageBox from '../LiveCommentBoxWeb/PinMessageBox'

interface Props {
  liveData?: VideoObject
  total?: number
  showFormChat: boolean
  setShowFormChat: (v: boolean) => void
  setViewCount: (v: number) => void
}

const LiveCommentBoxWebNoAuth = (props: Props) => {
  const { liveData, showFormChat, setShowFormChat } = props
  const { dispatch, isLogin } = useGeneralHook()
  const { listMessage, role, pinMessage, socket, replyId, time } = useSelector(
    (state: AppState) => state.live,
    shallowEqual
  )
  const scrollBox = useRef<HTMLDivElement | null>(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const { data: roomInfo, isValidating } = useSWR(
    liveData?.id ? API_PATHS.lives.getChatRoom(liveData?.id) : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data
    },
    { revalidateOnFocus: false }
  )

  const scrollToBottom = (force = false) => {
    const check = document.querySelectorAll('.form-like-reply-live-message')
    const btn = document.getElementById('scrollBtn')
    if (!scrollBox.current || (force ? false : btn || check?.length !== 0)) {
      return
    }
    scrollBox.current.scrollTop = scrollBox.current.scrollHeight + 500
  }

  useEffect(() => {
    let socketTmp
    if (roomInfo) {
      socketTmp = socketIOClient(process.env.NEXT_PUBLIC_SOCKET || '', {
        upgrade: true,
        transports: ['websocket'],
        reconnection: true,
      })

      socketTmp.on('connect_error', (err) => {
        console.log(`connect_error due to ${err?.message}`)
      })
      socketTmp.on('connect', () => {
        socketTmp.emit(
          'joinRoom',
          {
            room: roomInfo.roomId,
            token: roomInfo.linkId,
          },
          (e) => {
            dispatch(resetLiveState())
          }
        )
        socketTmp.on('joinRoom', (e) => {
          if (e.errorCode === '200') {
            e.role && dispatch(setRole(e.role))
          } else if (e.errorCode === '201') {
            dispatch(setMessage({ message: e.msg }))
          }
        })
        socketTmp.on('roomInfo', (e) => {
          console.log('roomInfo', e)
          const total = Number(e.total)
          if (total) {
            props.setViewCount(total)
          }
        })
        socketTmp.on('receiveText', (e: MessageType) => {
          dispatch(addMessage(e))
          setTimeout(() => scrollToBottom(), 100)
        })
        socketTmp.on('receiveEmoji', (e: MessageType) => {
          dispatch(addMessage({ ...e, type: 'emoji' }))
          setTimeout(() => scrollToBottom(), 100)
        })
        socketTmp.on('receiveMotion', (e: MessageType) => {
          dispatch(addMotion({ ...e, position: 0 + Math.random() * 45 }))
        })
        socketTmp.on('deleteMsg', (obj) => {
          dispatch(removeMessage(obj.id))
        })
        socketTmp.on('deleteMsgUser', (obj) => {
          dispatch(removeMessageUser(obj.id))
        })
        socketTmp.on('lockChat', (obj) => {
          dispatch(setBlockDuration(obj.duration))
          dispatch(setTimeBlockDuration(obj.duration))
        })
        socketTmp.on('lockUser', (obj) => {})

        socketTmp.on('receiveHeart', (obj) => {
          dispatch(receiveHeart(obj))
        })

        socketTmp.on('pinMessage', (obj) => {
          dispatch(setPinMessage(obj))
        })
        socketTmp.on('init', (e) => {
          console.log('init', e)
        })
        dispatch(setSocket(socketTmp))
      })
    }
    return () => {
      socketTmp?.emit('closeRoom')
      socketTmp?.disconnect()
      socketTmp?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, roomInfo])

  const onReply = (replyId?: string) => {
    if (isLogin) {
      dispatch(setReplyId(replyId))
    } else {
      dispatch(setOpenLoginDialog(true))
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (time > 0) {
        dispatch(setTimeBlockDuration(time - 1))
      } else {
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [dispatch, time])

  useEffect(() => {
    setTimeout(() => scrollToBottom(true), 100)
  }, [replyId, showFormChat])

  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="flex h-16 items-center justify-between bg-bg2 px-3">
        <p className="text-base font-bold">
          <FormattedMessage id={showFormChat ? 'liveChat' : 'showChat'} />
        </p>
        <div className="flex">
          <button
            onClick={() => setShowFormChat(!showFormChat)}
            className={`transition-all ${
              showFormChat ? 'rotate-90' : '-rotate-90'
            } text-neutral-200`}
          >
            <LeftArrowIcon />
          </button>
        </div>
      </div>
      {showFormChat && (
        <>
          {pinMessage && !replyId && (
            <>
              <div className="divider opacity-40"></div>
              <PinMessageBox
                message={pinMessage}
                socket={socket}
                roomInfo={roomInfo}
                role={role}
              />
            </>
          )}
          {!replyId && (
            <div className="relative flex-1 overflow-hidden">
              {!isValidating ? (
                <>
                  <div
                    className="flex h-full flex-1 flex-col overflow-auto overflow-x-hidden scroll-smooth p-3"
                    id="scroll-box"
                    ref={scrollBox}
                    onScroll={(e) => {
                      if (!scrollBox.current) {
                        return
                      }
                      if (
                        scrollBox.current?.scrollTop +
                          scrollBox.current?.offsetHeight +
                          250 >=
                        scrollBox.current?.scrollHeight
                      ) {
                        setShowScrollToBottom(false)
                      } else {
                        setShowScrollToBottom(true)
                      }
                    }}
                  >
                    {listMessage.map((message) => {
                      return (
                        <MessageBox
                          key={message.id}
                          message={message}
                          socket={socket}
                          roomInfo={roomInfo}
                          onReply={onReply}
                          role={role}
                        />
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="flex w-full flex-1 shrink-0 items-center justify-center">
                  <LoadingIcon className="mt-10 h-10 animate-spin" />
                </div>
              )}
              {showScrollToBottom && (
                <button
                  id="scrollBtn"
                  onClick={(e) => {
                    scrollToBottom(true)
                    let clickEvent = new Event('click')
                    e.currentTarget.dispatchEvent(clickEvent)
                  }}
                  className="absolute bottom-0.5 right-12 flex h-8 w-8 -rotate-90 items-center justify-center rounded-full text-primary hover:bg-neutral-100"
                >
                  <LeftArrowIcon />
                </button>
              )}
            </div>
          )}
          <div className="flex h-16 items-center justify-between bg-bg2 px-3">
            <button
              className="btn w-full rounded"
              onClick={() => dispatch(setOpenLoginDialog(true))}
            >
              <FormattedMessage id="signInToChat" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default LiveCommentBoxWebNoAuth
