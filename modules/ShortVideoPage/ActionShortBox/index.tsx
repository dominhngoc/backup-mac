import ShareModal from '@common/components/ShareModal'
import VideoOptionPoper from '@common/components/VideoOptionPoper'
import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import ReportVideoModal from '@common/ReportVideoModal'
import {
  HeartFilled,
  MessageFilledIcon,
  MoreIcon,
  ShareFillIcon,
} from '@public/icons'
import { setOpenLoginRequiedDialog } from '@redux/dialogReducer'
import { API_PATHS } from '@utility/API_PATH'
import { debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWR from 'swr'
interface Props {
  data: VideoObject
  isActive: boolean
  setOpenComment?: () => void
  setOpenShare: (value: boolean) => void
  onClickCommentBox?: () => void
}

const ActionShortBox = (props: Props) => {
  const { data, isActive } = props
  const type = 'SHORT'
  const { setMessage, dispatch, isLogin } = useGeneralHook()
  const [openReport, setOpenReport] = useState(false)
  const [openShare, setOpenShare] = useState(false)
  const [liked, setIsLike] = useState(0)

  const { data: status = 0, mutate } = useSWR(
    data?.id && isLogin && isActive
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
        mutate()
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
    <div className="flex flex-col items-center sm:mb-5 2xl:mb-2">
      <div className="flex flex-col items-center text-center sm:mb-3 md:mb-3 2xl:mb-6">
        <button
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 ${
            liked ? 'text-primary ' : ' '
          }`}
          onClick={() => {
            if (!isLogin) {
              dispatch(setOpenLoginRequiedDialog(true))
            } else {
              setIsLike(liked ? 0 : 1)
              onLikeDebounce(liked ? 0 : 1)
            }
          }}
        >
          <HeartFilled />
        </button>
        <p className="mt-1 font-semibold">
          {data.likeCount}
        </p>
      </div>
      <div
        className="flex flex-col items-center text-center sm:mb-3 2xl:mb-6"
        onClick={() => {
          props.setOpenComment && props.setOpenComment()
        }}
      >
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
          <MessageFilledIcon />
        </button>
        <p className="mt-1 font-semibold">
          {data.commentCount || 0}
        </p>
      </div>
      <div className="flex flex-col items-center text-center sm:mb-3 2xl:mb-6">
        <button
          onClick={() => setOpenShare(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100"
        >
          <ShareFillIcon />
        </button>
        <p className="mt-1 font-semibold whitespace-nowrap">
          <FormattedMessage id="share" />
        </p>
      </div>

      <VideoOptionPoper
        className="flex items-center justify-center md:h-9 md:w-9  2xl:h-12 2xl:w-12"
        wrapper={<MoreIcon className="sm:scale-125 2xl:scale-150" />}
        classNamePaper="w-72"
        videoData={{
          ...data,
          linkShare: data.linkShare,
        }}
        isShortCard={true}
        options={{ placement: 'right-end' }}
      />

      <ReportVideoModal
        open={openReport}
        onClose={(val) => {
          setOpenReport(val)
        }}
        data={data}
        setMessage={setMessage}
      />
      <ShareModal
        open={openShare}
        onClose={() => {
          setOpenShare(false)
        }}
        shareUrl={data?.linkShare}
      />
    </div>
  )
}

export default ActionShortBox
