import ProgressiveImg from '@common/components/ProgressiveImg'
import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { HeartIcon, MessageIcon, UpArrow } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { API_PATHS } from '@utility/API_PATH'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'

type Props = {
  item: some
  onReplyMessage: () => void
  type: string
  content_id: any
}

const CommentItem = (props: Props) => {
  const { item, onReplyMessage, type, content_id } = props
  const [openReplyList, setOpenReplyList] = useState(false)
  const [openReplyForm, setOpenReplyForm] = useState(false)
  const { handleSubmit, reset, control } = useForm<{
    comment: string
    parent_id?: string
  }>()
  const { setMessage, intl, dispatch, isLogin } = useGeneralHook()

  const onSubmit = async (values: any) => {
    try {
      await dispatch(
        fetchThunk(
          {
            url: API_PATHS.comment.sendComment,
            method: 'post',
            data: {
              ...values,
              content_id: content_id,
              type,
              parent_id: item.id,
            },
          },
          true
        )
      )
      setOpenReplyForm(false)
      onReplyMessage()
    } catch (e: any) {
      setMessage({ message: e.response?.data?.message || 'Error' })
    } finally {
      reset()
    }
  }

  return (
    <React.Fragment key={item.id}>
      <div key={item.id} className="flex w-full text-sm sm:py-1 2xl:py-3">
        <ProgressiveImg
          src={item.channel?.avatarImage}
          alt="avatarImage"
          isAvatar
          className="avatar mr-3 bg-bg1 sm:h-8 sm:w-8 2xl:h-10 2xl:w-10"
        />
        <div className="flex w-full flex-col">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex flex-1 items-center">
              {item.channel?.name && (
                <p className="mr-1 font-bold caption1 sm:text-sm 2xl:text-base">
                  {item.channel?.name}
                </p>
              )}
              <p className="text-neutral-400 caption1 sm:text-xs 2xl:text-sm">
                &nbsp;•&nbsp;{item.createdAt}
              </p>
            </div>
          </div>
          <div className="mb-1 break-words caption1 sm:text-xs 2xl:text-sm">
            {item.comment}
          </div>
          <div className="mb-1 flex text-neutral-500">
            <div
              className="mr-6 flex items-center"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <HeartIcon className="scale-75" />
              <p className="caption1"> {item.likeCount}</p>
            </div>
            <div
              className=" mr-6 flex items-center"
              onClick={(e) => {
                e.stopPropagation()
                // setReplyData(item)
              }}
            >
              <MessageIcon className="scale-75" />
              <p className="caption1"> {item.commentCount || 0}</p>
            </div>
            <div
              className=" mr-6 flex items-center"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <button
                className=" text-xs text-white"
                onClick={() => setOpenReplyForm(true)}
              >
                <FormattedMessage id="reply" />
              </button>
            </div>
          </div>
          {openReplyForm === true && (
            <form
              className="mb-1 w-full max-w-[600px]  pr-5"
              onSubmit={handleSubmit((value) => {
                onSubmit(value)
              })}
            >
              <div className="flex w-full flex-col px-0 sm:my-1 2xl:my-3">
                <Controller
                  name="comment"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) => !!value?.trim(),
                  }}
                  render={({
                    field: { name, onBlur, onChange, ref, value = '' },
                    fieldState: { invalid },
                  }) => {
                    return (
                      <input
                        className={
                          'text-field small-field ' +
                          (invalid ? 'error-field' : '')
                        }
                        name={name}
                        ref={ref}
                        autoComplete="off"
                        onBlur={onBlur}
                        onFocus={() => {
                          if (!isLogin) {
                            dispatch(setOpenLoginDialog(true))
                          }
                        }}
                        onChange={onChange}
                        value={value}
                        autoFocus
                        placeholder={
                          intl.formatMessage({
                            id: 'enterFeedback',
                          }) + '...'
                        }
                      />
                    )
                  }}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setOpenReplyForm(false)}
                    className="btn mr-3 h-8 whitespace-nowrap text-sm font-semibold"
                  >
                    <FormattedMessage id="cancel" />
                  </button>
                  <button
                    aria-label={'search-btn text-sm font-semibold'}
                    type="submit"
                    className="btn h-8 whitespace-nowrap bg-primary text-sm"
                  >
                    <FormattedMessage id="feedback" />
                  </button>
                </div>
              </div>
            </form>
          )}
          {item.children?.length > 0 && (
            <button
              className="flex items-center font-bold uppercase text-primary"
              onClick={() => setOpenReplyList((old) => !old)}
            >
              {item.children?.length}&nbsp;
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
              {item.children.map((child, i) => (
                <>
                  <div className="flex w-full  py-3 text-sm" key={child.id}>
                    <ProgressiveImg
                      src={child.channel?.avatarImage}
                      alt="avatarImage"
                      isAvatar
                      className="avatar mr-3 h-8 w-8 bg-bg1"
                    />
                    <div className="flex w-full flex-col">
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex flex-1 items-center">
                          {child.channel?.name && (
                            <p className="mr-1 font-bold caption1 sm:text-sm 2xl:text-base">
                              {child.channel?.name}
                            </p>
                          )}
                          <p className="text-neutral-400  caption1 sm:text-xs 2xl:text-sm">
                            &nbsp;•&nbsp;{child.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="mb-1 break-words caption1 sm:text-xs 2xl:text-sm">
                        {child.comment}
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default CommentItem
