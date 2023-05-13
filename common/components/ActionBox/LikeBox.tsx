import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { HeartFilled, HeartIcon } from '@public/icons'
import { addLike, removeLike } from '@redux/commentReducer'
import { setOpenLoginRequiedDialog } from '@redux/dialogReducer'
import { AppState } from '@redux/store'
import { API_PATHS } from '@utility/API_PATH'
import { debounce } from 'lodash'
import { useCallback, useEffect } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import useSWR from 'swr'

interface Props {
  data: VideoObject
  type?: 'VIDEO' | 'SHORT'
  className?: string
}

const LikeBox = (props: Props) => {
  const { data, type = 'VIDEO', className = '' } = props
  const { setMessage, dispatch, isLogin } = useGeneralHook()
  const likeList = useSelector(
    (state: AppState) => state.comment.likeList,
    shallowEqual
  )
  const liked = likeList.includes(data?.id)

  const { data: status } = useSWR(
    data?.id && isLogin && !liked
      ? API_PATHS.users.cache.get({
          filter: `LIKE_${type}_${data?.id}`,
          page_size: 12,
          page_token: 0,
        })
      : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0].status
    },
    {
      revalidateOnMount: true,
      dedupingInterval: 60000,
    }
  )

  const onLike = async (value) => {
    try {
      await dispatch(
        fetchThunk(
          {
            url: API_PATHS.users.like,
            method: 'post',
            data: {
              id: data?.id,
              type: type,
              status: value,
            },
          },
          true
        )
      )
    } catch (e: any) {
      setMessage({ message: e.response?.data?.message })
    }
  }

  const onLikeDebounce = useCallback(
    debounce(
      (value: number) => {
        onLike(value)
      },
      500,
      {
        trailing: true,
        leading: false,
      }
    ),
    []
  )

  useEffect(() => {
    if (status === undefined) {
      return
    }
    if (status) {
      dispatch(addLike(data?.id))
    } else {
      dispatch(removeLike(data?.id))
    }
  }, [data?.id, dispatch, status])

  if (!data) {
    return null
  }

  if (type === 'SHORT') {
    return (
      <div className="flex items-center justify-center">
        <button
          className={
            'mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white bg-opacity-10 ' +
            className +
            (liked ? ' text-primary ' : ' text-white')
          }
          onClick={() => {
            if (!isLogin) {
              dispatch(setOpenLoginRequiedDialog(true))
            } else {
              onLikeDebounce(liked ? 0 : 1)
              if (!liked) {
                dispatch(addLike(data?.id))
              } else {
                dispatch(removeLike(data?.id))
              }
            }
          }}
        >
          <HeartFilled />
        </button>
        <p className="font-bold headline">{data?.likeCount}</p>
      </div>
    )
  }

  return (
    <button
      className={'flex flex-1  items-center justify-center ' + className}
      onClick={() => {
        if (!isLogin) {
          dispatch(setOpenLoginRequiedDialog(true))
        } else {
          if (!liked) {
            dispatch(addLike(data?.id))
          } else {
            dispatch(removeLike(data?.id))
          }
          onLikeDebounce(liked ? 0 : 1)
        }
      }}
    >
      <div className={liked ? 'text-primary' : 'text-neutral-500 '}>
        {liked ? <HeartFilled /> : <HeartIcon />}
      </div>
      <p className="ml-1">{data?.likeCount}</p>
    </button>
  )
}

export default LikeBox
