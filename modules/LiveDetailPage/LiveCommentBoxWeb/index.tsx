import ProgressiveImg from '@common/components/ProgressiveImg'
import { VideoObject } from '@common/constants'
import emitter from '@common/emitter'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import {
  EmojiIcon,
  GiftIcon,
  LeftArrowIcon,
  LoadingIcon,
  SendIcon,
  StarIcon,
  TreasureIcon,
} from '@public/icons'
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
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import socketIOClient from 'socket.io-client'
import useSWR from 'swr'
import EmojiChooseBox from './EmojiChooseBox'
import MessageBox from './MessageBox'
import MotionChooseBox from './MotionChooseBox'
import PinMessageBox from './PinMessageBox'
import ReplyBox from './ReplyBox'
interface Props {
  liveData?: VideoObject
  total?: number
  showFormChat: boolean
  setShowFormChat: (v: boolean) => void
  setViewCount: (v: number) => void
}

const btnGiftClass =
  'flex mr-3 h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-[#47474d54]'
const LiveCommentBoxWeb = (props: Props) => {
  const { liveData, showFormChat, setShowFormChat } = props
  const { userData, intl, dispatch, isLogin } = useGeneralHook()
  const {
    listMessage,
    role,
    pinMessage,
    socket,
    replyId,
    blockDuration,
    time,
  } = useSelector((state: AppState) => state.live, shallowEqual)
  const [openEmoji, setOpenEmoji] = useState(false)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [openBlockMessage, setOpenBlockMessage] = useState(false)
  const [lockedUser, setOnLockedUser] = useState<string[]>([])
  const scrollBox = useRef<HTMLDivElement | null>(null)
  const userID = userData?.id

  const methods = useForm<{
    comment: string
  }>()
  const { handleSubmit, control } = methods
  const motionData = useSelector(
    (state: AppState) => state.common.chatAccess.motion,
    shallowEqual
  )
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
    emitter.emit('closeReply')
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
          setOpenBlockMessage(true)
        })
        socketTmp.on('lockUser', (obj) => {
          setOnLockedUser((old) => [...old, obj.id?.toString()])
        })

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
      dispatch(setRole('GUEST'))
      socketTmp?.emit('closeRoom')
      socketTmp?.disconnect()
      socketTmp?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, roomInfo])

  const onReply = (replyId) => {
    dispatch(setReplyId(replyId))
  }

  const onSendMessage = (value, methods) => {
    if (!isLogin) {
      dispatch(setOpenLoginDialog(true))
    }
    if ((blockDuration > 0 && time > 0) || blockDuration === 0) {
      setOpenBlockMessage(true)
      return
    }
    if (socket) {
      socket.emit('sendText', {
        room: roomInfo.roomId,
        msg: value.comment,
        replyId: replyId,
      })
      methods?.reset({ comment: '' })
    }
  }

  const onSendEmoji = (value, callback) => {
    if ((blockDuration > 0 && time > 0) || blockDuration === 0) {
      setOpenBlockMessage(true)
      return
    }
    if (socket) {
      socket.emit('sendEmoji', {
        room: roomInfo.roomId,
        emoji: value.id,
        replyId: replyId,
      })
      callback()
    }
  }

  const onSendEmotion = (value) => {
    if ((blockDuration > 0 && time > 0) || blockDuration === 0) {
      setOpenBlockMessage(true)
      return
    }
    if (socket) {
      socket.emit('sendMotion', {
        room: roomInfo.roomId,
        motion: value.id,
        replyId: replyId,
      })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (time > 0) {
        dispatch(setTimeBlockDuration(time - 1))
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setOpenBlockMessage(false)
        }, 3000)
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
          {/* {showFormChat && (
            <button
              className="mr-2 text-neutral-200"
              onClick={() => scrollToBottom()}
            >
              <SortListIcon />
            </button>
          )} */}
          <button
            onClick={() => setShowFormChat(!showFormChat)}
            className={`${
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
                  onClick={() => scrollToBottom(true)}
                  className="absolute bottom-4 right-12 flex h-8 w-8 -rotate-90 items-center justify-center rounded-full text-primary hover:bg-neutral-100"
                >
                  <LeftArrowIcon />
                </button>
              )}
            </div>
          )}
          {replyId && (
            <div className="flex-1 overflow-hidden">
              <ReplyBox roomInfo={roomInfo} />
            </div>
          )}
          {isLogin ? (
            openBlockMessage ? (
              <div className="flex h-16 items-center justify-between bg-bg2 px-3">
                <button className="btn w-full rounded text-xs font-normal">
                  <FormattedMessage id="youHaveBeenLockedOfChatFor" />
                  &nbsp;
                  <span className="font-bold text-white">
                    {time}
                    &nbsp;
                    <FormattedMessage id="second" />
                  </span>
                </button>
              </div>
            ) : lockedUser.includes(userID.toString()) ? (
              <div className="flex h-16 items-center justify-between bg-bg2 px-3">
                <div className="btn w-full cursor-default rounded">
                  <FormattedMessage id="youHaveLockedChat" />
                </div>
              </div>
            ) : (
              <>
                <div className="relative flex h-16 items-center justify-between bg-bg2 px-3">
                  <FormProvider {...methods}>
                    <form
                      onSubmit={handleSubmit((value) => {
                        onSendMessage(value, methods)
                      })}
                      className="flex items-center"
                    >
                      <ProgressiveImg
                        className="avatar mr-3 h-8 w-8"
                        alt="avatar"
                        src={userData?.avatar}
                        isAvatar
                      />
                      <Controller
                        name="comment"
                        control={control}
                        rules={{
                          required: true,
                          validate: (value) => !!value?.trim(),
                        }}
                        render={({
                          field: { name, onChange, ref, value = '', onBlur },
                          fieldState: { invalid },
                        }) => {
                          return (
                            <>
                              <div className="relative">
                                <input
                                  id="message-input"
                                  className={
                                    'text-field mr-10 ' +
                                    (invalid ? 'error-field' : '')
                                  }
                                  name={name}
                                  onChange={onChange}
                                  ref={ref}
                                  value={value}
                                  onBlur={onBlur}
                                  onFocus={() => {
                                    setOpenEmoji(false)
                                    if (!isLogin) {
                                      dispatch(setOpenLoginDialog(true))
                                    }
                                  }}
                                  autoComplete="off"
                                  placeholder={intl.formatMessage({
                                    id: 'yourComment',
                                  })}
                                />
                                <button
                                  id="emoji-btn"
                                  type="button"
                                  aria-label={'emoji-btn'}
                                  tabIndex={-1}
                                  onClick={(e) => {
                                    setOpenEmoji(!openEmoji)
                                    if (!isLogin) {
                                      dispatch(setOpenLoginDialog(true))
                                    }
                                  }}
                                  className={
                                    'absolute top-2.5 right-2 ' +
                                    (openEmoji
                                      ? 'text-primary'
                                      : 'text-neutral-300')
                                  }
                                >
                                  <EmojiIcon />
                                </button>
                              </div>
                              <button
                                id="submit-btn"
                                aria-label={'send-btn'}
                                type="submit"
                                className="flex flex-1 items-center justify-center pl-3"
                              >
                                <SendIcon />
                              </button>
                            </>
                          )
                        }}
                      />
                    </form>
                  </FormProvider>
                  {openEmoji && (
                    <div className="absolute bottom-full right-14 z-10 h-[330px] w-[375px] rounded-lg border border-neutral-100 bg-bg2">
                      <EmojiChooseBox
                        open={true}
                        onSendEmoji={(value) =>
                          onSendEmoji(value, () => setOpenEmoji(false))
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="divider opacity-40"></div>
                <div className="flex h-16 items-center bg-bg2 px-3">
                  <button
                    className={btnGiftClass + ' mr-3'}
                    onClick={() => {
                      if (!isLogin) {
                        dispatch(setOpenLoginDialog(true))
                      }
                    }}
                    style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)' }}
                  >
                    <StarIcon />
                  </button>
                  <button
                    className={btnGiftClass + ' mr-3'}
                    style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)' }}
                    onClick={() => {
                      if (!isLogin) {
                        dispatch(setOpenLoginDialog(true))
                      }
                    }}
                  >
                    <GiftIcon />
                  </button>
                  <button
                    className={btnGiftClass + ' mr-3'}
                    style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)' }}
                    onClick={() => {
                      if (!isLogin) {
                        dispatch(setOpenLoginDialog(true))
                      }
                    }}
                  >
                    <TreasureIcon />
                  </button>
                  <div className="mr-3 h-[37px] w-[1px] bg-neutral-200"></div>

                  {(motionData || [])
                    ?.reduce((v: any, c) => [...v, ...c.liveAssetChilds], [])
                    ?.slice(0, 3)
                    .map((item) => {
                      return (
                        <button
                          key={item.id}
                          className={btnGiftClass + ' mr-3'}
                          style={{
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
                          }}
                          onClick={() => {
                            if (!isLogin) {
                              dispatch(setOpenLoginDialog(true))
                            } else {
                              onSendEmotion(item)
                            }
                          }}
                        >
                          <ProgressiveImg
                            src={item.image}
                            className="h-6 w-6 shrink-0"
                          />
                        </button>
                      )
                    })}
                </div>
                <MotionChooseBox onSendEmotion={onSendEmotion} />
              </>
            )
          ) : (
            <div className="flex h-16 items-center justify-between bg-bg2 px-3">
              <button
                className="btn w-full rounded"
                onClick={() => dispatch(setOpenLoginDialog(true))}
              >
                <FormattedMessage id="signInToChat" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default LiveCommentBoxWeb
