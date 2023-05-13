import ProgressiveImg from '@common/components/ProgressiveImg'
import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { LoadingIcon } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { API_PATHS } from '@utility/API_PATH'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import CommentItem from './CommentItem'
interface Props {
  type: 'PLAYLIST' | 'VOD' | 'SHORT'
  contentId?: number
  total?: number
}

const CommentsBoxShort = (props: Props) => {
  const { total, type = 'PLAYLIST', contentId: content_id = '' } = props
  const { setMessage, userData, intl, dispatch, isLogin } = useGeneralHook()
  const ref = useRef<HTMLDivElement>(null)

  const { handleSubmit, reset, control } = useForm<{
    comment: string
    parent_id?: string
  }>()

  const {
    data: listComment = [],
    mutate,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      content_id
        ? API_PATHS.comment.get({
            content_id,
            type,
            page_token: index,
            page_size: 12,
          })
        : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateAll: true,
    }
  )

  useEffect(() => {
    mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin])

  const mappedData = useMemo(() => {
    return listComment.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [listComment])

  const onScroll = useCallback(
    (e) => {
      if (
        e.target.scrollTop + e.target.scrollWidth + 250 >
          e.target.scrollHeight &&
        !isValidating &&
        listComment?.every((item) => item.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [listComment, isValidating, setSize, size]
  )

  const onSubmit = useCallback(
    async ({ values, id_content }, callback?: () => void) => {
      if (isLogin) {
        try {
          await dispatch(
            fetchThunk(
              {
                url: API_PATHS.comment.sendComment,
                method: 'post',
                data: {
                  ...values,
                  content_id: id_content,
                  type,
                },
              },
              true
            )
          )
        } catch (e: any) {
          setMessage({ message: e.response?.data?.message || 'Error' })
        } finally {
          reset()
          mutate()
          ref?.current?.scrollTo({ top: 0 })
          callback && callback()
        }
      } else {
        dispatch(setOpenLoginDialog(true))
      }
    },
    [dispatch, isLogin, mutate, reset, setMessage, type]
  )

  const renderComment = useCallback(
    (listComment: some[]) => {
      return listComment.map((item, i) => {
        return (
          <CommentItem
            type={type}
            item={item}
            content_id={content_id}
            key={item.id}
            onReplyMessage={mutate}
          />
        )
      })
    },
    [content_id, mutate, type]
  )

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-bg2">
      <div className="comment-box-short-child w-full sm:h-3 2xl:h-5"></div>
      <div className="comment-box-short-child flex items-center px-0 sm:h-10 2xl:h-14">
        <p className="mr-4 font-bold leading-5 tracking-[-0.41px]  text-white sm:text-sm 2xl:text-[16px]">
          {total}&nbsp; <FormattedMessage id="comment" />
        </p>
      </div>
      <div className="comment-box-short-child">
        <form
          onSubmit={handleSubmit((value) => {
            onSubmit({ values: value, id_content: content_id })
          })}
        >
          <div
            id="short-comment-main-input"
            className="my-3 flex w-full items-center"
          >
            <ProgressiveImg
              className="avatar mr-3 h-10 w-10"
              src={userData?.avatar}
            />
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
                      'text-field mr-6 ' + (invalid ? 'error-field' : '')
                    }
                    name={name}
                    onBlur={onBlur}
                    onChange={onChange}
                    ref={ref}
                    autoComplete="off"
                    value={value}
                    onFocus={() => {
                      if (!isLogin) {
                        dispatch(setOpenLoginDialog(true))
                      }
                    }}
                    placeholder={intl.formatMessage({ id: 'writeYourComment' })}
                  />
                )
              }}
            />
            <button type="submit" className="btn-container whitespace-nowrap">
              <FormattedMessage id="comment" />
            </button>
          </div>
        </form>
      </div>
      <div className="flex-1 overflow-auto" onScroll={onScroll} ref={ref}>
        {renderComment(mappedData)}
        {isValidating && (
          <div className="col-span-3 flex h-24 items-center justify-center">
            <LoadingIcon className="h-10 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentsBoxShort
