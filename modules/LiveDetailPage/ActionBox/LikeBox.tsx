import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { HeartFilled, HeartIcon } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { API_PATHS } from '@utility/API_PATH'
import { debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
interface Props {
  data: VideoObject
  type?: 'VIDEO' | 'SHORT'
  className?: string
}

const LikeBox = (props: Props) => {
  const { data, type = 'VIDEO', className = '' } = props
  const { setMessage, dispatch, isLogin } = useGeneralHook()
  const [liked, setIsLike] = useState(0)
  const { data: status = 0, isValidating } = useSWR(
    data?.id && isLogin
      ? API_PATHS.users.cache.get({
          filter: `LIKE_${type}_${data?.id}`,
          page_size: 12,
          page_token: 0,
        })
      : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }, true))
      return json?.data?.data?.[0].status
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  )

  const onLike = async (status) => {
    try {
      const json = await dispatch(
        fetchThunk(
          {
            url: API_PATHS.users.like,
            method: 'post',
            data: {
              id: data.id,
              type: type,
              status: status,
            },
          },
          true
        )
      )
      if (json.status === 200) {
        // mutate()
      }
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
    setIsLike(status)
  }, [isLogin, status])

  return (
    <button
      className={'flex flex-1 flex-col items-center justify-center' + className}
      onClick={() => {
        if (!isLogin) {
          dispatch(setOpenLoginDialog(true))
        } else {
          setIsLike(liked ? 0 : 1)
          onLikeDebounce(liked ? 0 : 1)
        }
      }}
      disabled={isValidating}
    >
      <div className={liked ? 'text-primary' : 'text-neutral-500'}>
        {liked ? <HeartFilled /> : <HeartIcon />}
      </div>
      <p className="caption1 ml-2">{data.likeCount}</p>
    </button>
  )
}

export default LikeBox
