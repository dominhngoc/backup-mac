import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { API_PATHS } from '@utility/API_PATH'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import ProgressiveImg from '../ProgressiveImg'
import CommentItem from './CommentItem'
interface Props {
  type: 'PLAYLIST' | 'VOD' | 'SHORT'
  contentId?: number
  total?: number
  listCommentClassName?: string
}

const CommentsBox = (props: Props) => {
  const {
    total,
    type = 'PLAYLIST',
    contentId: content_id = '',
    listCommentClassName = '',
  } = props
  const { setMessage, userData, intl, dispatch, isLogin } = useGeneralHook()
  const [loading, setLoading] = useState(false)
  const { handleSubmit, reset, control, setFocus } = useForm<{
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

  const mappedData = useMemo(() => {
    return listComment.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [listComment])

  const onSubmit = useCallback(
    async ({ values, id_content }, callback?: () => void) => {
      if (isLogin) {
        setLoading(true)
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
          mutate()
        } catch (e: any) {
          setMessage({ message: e.response?.data?.message || 'Error' })
        } finally {
          reset()
          setLoading(false)
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
            key={item.id}
            type={type}
            dataMessage={item}
            content_id={content_id}
            mutate={() => {
              mutate()
            }}
          />
        )
      })
    },
    [content_id, mutate, type]
  )

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 290 * 2 &&
        !isValidating &&
        listComment?.length > 0 &&
        listComment?.every((item) => item.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [listComment, isValidating, setSize, size]
  )

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  useEffect(() => {
    mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin])

  return (
    <div className="z-10 flex flex-col rounded-xl bg-bg2 pt-5 pb-4">
      <div className="flex h-14 items-center px-0">
        <p className="mr-4 font-bold text-white title">
          {total}&nbsp; <FormattedMessage id="comment" />
        </p>
      </div>
      <div>
        <form
          onSubmit={handleSubmit((value) => {
            onSubmit({ values: value, id_content: content_id })
          })}
        >
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
                <div className="relative my-3 flex w-full">
                  <ProgressiveImg
                    className="avatar mr-2 h-10 w-10"
                    src={userData?.avatar}
                  />
                  <input
                    className={
                      'text-field mr-2 ' + (invalid ? 'error-field' : '')
                    }
                    name={name}
                    onBlur={onBlur}
                    autoComplete="off"
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    onFocus={() => {
                      if (!isLogin) {
                        dispatch(setOpenLoginDialog(true))
                      }
                    }}
                    placeholder={intl.formatMessage({ id: 'writeYourComment' })}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-container whitespace-nowrap"
                    onClick={(e) => {
                      if (value.trim().length === 0) {
                        e.preventDefault()
                        setMessage({
                          message: intl.formatMessage({
                            id: 'inputRequired',
                          }),
                        })
                        setFocus(name)
                        return
                      }
                    }}
                  >
                    <FormattedMessage id="comment" />
                  </button>
                </div>
              )
            }}
          />
        </form>
      </div>
      <div className={`${listCommentClassName}`}>
        {renderComment(mappedData)}
      </div>
    </div>
  )
}

export default CommentsBox
