import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import {
  DeleteIcon,
  EditPen,
  HeartFilled,
  HeartIcon,
  MessageIcon,
  MoreIcon,
  UpArrow,
} from '@public/icons'
import { addLike, removeLike } from '@redux/commentReducer'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { AppState } from '@redux/store'
import { API_PATHS } from '@utility/API_PATH'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import Popper from '../Popper'
import ProgressiveImg from '../ProgressiveImg'
import EditForm from './EditForm'
import ReplyForm from './ReplyForm'
type Props = {
  dataMessage: some
  mutate: () => void
  type: string
  content_id: any
}

const CommentItem = (props: Props) => {
  const { dataMessage, mutate, type, content_id } = props
  const { setMessage, dispatch, isLogin, userData, intl, confirmDialog } =
    useGeneralHook()
  const { promptConfirmation, close } = confirmDialog
  const [openReply, setOpenReply] = useState(false)
  const [openReplyList, setOpenReplyList] = useState(false)
  const likeList = useSelector(
    (state: AppState) => state.comment.likeList,
    shallowEqual
  )
  const cacheLiked = likeList.includes(dataMessage.id) ? 1 : 0
  const [liked, setIsLike] = useState(cacheLiked)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<some | undefined>(undefined)

  const likeComment = useCallback(
    debounce(async (value) => {
      if (isLogin) {
        try {
          await dispatch(
            fetchThunk({
              url: API_PATHS.comment.like,
              method: 'post',
              data: {
                comment_id: dataMessage.id,
                content_id: content_id,
                type,
                status: value,
              },
            })
          )
        } catch (e: any) {
          setMessage({ message: e.response?.data?.message })
        } finally {
        }
      }
    }, 350),
    []
  )

  const onReplyComment = async (values: some, setLoading) => {
    try {
      setLoading(true)
      await dispatch(
        fetchThunk(
          {
            url: API_PATHS.comment.sendComment,
            method: 'post',
            data: {
              ...values,
              content_id: content_id,
              type,
              parent_id: dataMessage.id,
            },
          },
          true
        )
      )
      setOpenReply(false)
      mutate()
    } catch (e: any) {
      setMessage({ message: e.response?.data?.message || 'Error' })
    } finally {
      setLoading(false)
    }
  }

  const onUpdateComment = async (values: some, setLoading) => {
    try {
      setLoading(true)
      await dispatch(
        fetchThunk(
          {
            url: API_PATHS.comment.edit,
            method: 'post',
            data: values,
          },
          true
        )
      )
      setFormData(undefined)
      mutate()
    } catch (e: any) {
      setMessage({ message: e.response?.data?.message || 'Error' })
    } finally {
      setLoading(false)
    }
  }

  const onDeleteComment = async () => {
    const confirm = await promptConfirmation({
      warning: true,
      okText: 'delete',
      title: intl.formatMessage({ id: 'deleteComment' }),
      message: intl.formatMessage({ id: 'deleteCommentMessage' }),
    })
    if (confirm) {
      try {
        const json = await dispatch(
          fetchThunk({
            url: API_PATHS.comment.delete,
            method: 'post',
            data: {
              id: dataMessage?.id,
            },
          })
        )
        setMessage({ message: json?.data?.message })
        mutate()
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    }
    close()
  }

  useEffect(() => {
    if (dataMessage.status) {
      dispatch(addLike(dataMessage.id))
    }
  }, [dataMessage.id, dataMessage.status, dispatch])

  useEffect(() => {
    setIsLike(cacheLiked)
  }, [cacheLiked])

  return (
    <React.Fragment key={dataMessage.id}>
      <div className="flex w-full sm:py-1 2xl:py-3 [&>#btn-poper]:hover:block">
        <ProgressiveImg
          src={dataMessage.channel?.avatarImage}
          alt="avatarImage"
          isAvatar
          className="avatar h-10 w-10 bg-bg1"
        />
        <div className="ml-3 flex w-full flex-col">
          <div className="mb-1 flex items-center justify-between">
            <div className="mr-2 flex flex-1 items-center">
              {dataMessage.channel?.name && (
                <p className="mr-1 font-bold headline">
                  {dataMessage.channel?.name}
                </p>
              )}
              <p className="text-neutral-400">
                &nbsp;•&nbsp;{dataMessage.createdAt}
              </p>
            </div>
          </div>
          {formData ? (
            <EditForm
              formData={formData}
              onClose={() => setFormData(undefined)}
              onSubmit={onUpdateComment}
            />
          ) : (
            <>
              <div className="mb-1 break-words">{dataMessage.comment}</div>
              <div className="mb-1 flex text-neutral-500">
                <button
                  type="button"
                  className="mr-6 flex items-center"
                  onClick={() => {
                    if (!isLogin) {
                      dispatch(setOpenLoginDialog(true))
                    } else {
                      setIsLike(liked ? 0 : 1)
                      likeComment(liked ? 0 : 1)
                      if (!liked) {
                        dispatch(addLike(dataMessage.id))
                      } else {
                        dispatch(removeLike(dataMessage.id))
                      }
                    }
                  }}
                >
                  {liked ? (
                    <HeartFilled className="scale-75 text-primary" />
                  ) : (
                    <HeartIcon className="scale-75" />
                  )}
                  <p className="min-w-[12px] caption1">
                    {dataMessage.likeCount === '0' && liked
                      ? 1
                      : dataMessage.likeCount}
                  </p>
                </button>
                <div
                  className=" mr-6 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    // setReplyData(item)
                  }}
                >
                  <MessageIcon className="scale-75" />
                  <p className="caption1">{dataMessage.commentCount}</p>
                </div>
                <button
                  className="mr-6 text-xs text-white"
                  onClick={() => {
                    if (!isLogin) {
                      dispatch(setOpenLoginDialog(true))
                    } else {
                      setOpenReply(true)
                    }
                  }}
                >
                  <FormattedMessage id="reply" />
                </button>
              </div>
              {openReply === true && (
                <ReplyForm onSubmit={onReplyComment} onClose={setOpenReply} />
              )}
            </>
          )}
        </div>
        {isLogin && (
          <Popper
            open={open}
            setOpen={setOpen}
            className="ml-3 hidden p-3"
            wrapper={<MoreIcon />}
            classNamePaper="mt-3 overflow-hidden w-48 border border-neutral-100"
          >
            {dataMessage.channel?.id === userData?.id ? (
              <>
                <button
                  className="flex w-full items-center px-4 py-3 hover:bg-neutral-100"
                  onClick={() => {
                    setOpen(false)
                    setFormData(dataMessage)
                  }}
                >
                  <EditPen className="mr-3 text-neutral-500" />
                  <p>
                    <FormattedMessage id="edit" />
                  </p>
                </button>
                <button
                  className="flex w-full items-center px-4 py-3 hover:bg-neutral-100"
                  onClick={() => {
                    setOpen(false)
                    onDeleteComment()
                  }}
                >
                  <DeleteIcon className="mr-2 text-neutral-500" />
                  <p>
                    <FormattedMessage id="removeComment" />
                  </p>
                </button>
              </>
            ) : (
              <></>
            )}
          </Popper>
        )}
      </div>
      <div className="ml-14">
        {dataMessage.children?.length > 0 && (
          <button
            className="flex items-center font-bold uppercase text-primary"
            onClick={() => setOpenReplyList((old) => !old)}
          >
            {dataMessage.children?.length}&nbsp;
            <FormattedMessage id="reply" />
            <UpArrow
              className={
                'ml-1 scale-75 transition-all ' +
                (openReplyList ? 'rotate-0' : 'rotate-180')
              }
            />
          </button>
        )}
        {openReplyList && (
          <div className="mb-1 w-full">
            {dataMessage.children.map((item) => (
              <CommentItem
                key={item.id}
                content_id={content_id}
                dataMessage={item}
                mutate={mutate}
                type={type}
              />
            ))}
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default CommentItem
