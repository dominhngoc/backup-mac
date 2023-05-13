import ShareModal from '@common/components/ShareModal'
import { VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import ReportVideoModal from '@common/ReportVideoModal'
import {
  AddListIcon,
  ClockIcon,
  DownloadIcon,
  EditPen,
  MoreIcon,
  ReportIcon,
  ShareIcon,
  StopIcon,
} from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { API_PATHS } from '@utility/API_PATH'
import { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import Popper, { Options } from './Popper'
import WatchLaterModal from './WatchLaterModal/WatchLaterModal'

interface Props {
  videoData?: VideoObject
  className?: string
  classNamePaper?: string
  wrapper?: any
  isShortCard?: boolean
  isLive?: boolean
  isFilm?: boolean
  options?: Options
}

const VideoOptionPoper = (props: Props) => {
  const {
    wrapper,
    className,
    classNamePaper,
    videoData,
    isShortCard = false,
    isLive = false,
    isFilm = false,
    options,
  } = props
  const [openPopper, setOpenPopper] = useState(false)

  const { setMessage, dispatch, isLogin, userData } = useGeneralHook()
  const [shareVideo, setShareVideo] = useState(false)
  const [openPlaylist, setOpenPlayList] = useState(false)
  const [openReport, setOpenReport] = useState(false)
  const isOwner = isLogin && userData?.id == videoData?.channel?.id

  const onClose = () => {
    setOpenPopper(false)
  }

  const onDislikeChannel = useCallback(async () => {
    const json = await dispatch(
      fetchThunk(
        {
          url: API_PATHS.users.dislikeChannel,
          method: 'POST',
          data: { channel_id: videoData?.channel?.id },
        },
        true
      )
    )
    setMessage({ message: json.data?.message })
  }, [dispatch, setMessage, videoData?.channel?.id])

  const onSubmitWatchLatter = useCallback(async () => {
    if (isLogin) {
      try {
        const json = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.users.insertWatchLater,
              method: 'post',
              data: { videoId: videoData?.id },
            },
            true
          )
        )
        onClose()
        setMessage({ message: json.data?.message })
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    } else {
      dispatch(setOpenLoginDialog(true))
    }
  }, [dispatch, isLogin, setMessage, videoData?.id])

  return (
    <>
      <Popper
        open={openPopper}
        className={className}
        classNamePaper={classNamePaper}
        wrapper={wrapper || <MoreIcon />}
        setOpen={setOpenPopper}
        options={options}
      >
        {[
          {
            icon: <ClockIcon />,
            label: <FormattedMessage id="addWatchLater" />,
            onClick: () => {
              if (isLogin) {
                onSubmitWatchLatter()
              } else {
                onClose()
                dispatch(setOpenLoginDialog(true))
              }
            },
            hidden: !isOwner || isLive === true,
          },
          {
            icon: <AddListIcon />,
            label: <FormattedMessage id="addList" />,
            onClick: () => {
              if (isLogin) {
                setOpenPlayList(true)
              } else {
                onClose()
                dispatch(setOpenLoginDialog(true))
              }
            },
            hidden: isShortCard === true || isLive === true || isFilm === true,
          },
          {
            icon: <EditPen />,
            label: <FormattedMessage id="edit" />,
            onClick: () => {},
            hidden: !isOwner || isLive === true,
          },
          {
            icon: <DownloadIcon />,
            label: <FormattedMessage id="download" />,
            hidden: isLive === true,
          },
          {
            icon: <ShareIcon />,
            label: <FormattedMessage id="share" />,
            onClick: () => {
              setShareVideo(true)
            },
            hidden: !videoData?.linkShare || isShortCard === true,
          },
          {
            icon: <StopIcon />,
            onClick: () => {
              if (isLogin) {
                onDislikeChannel()
              } else {
                onClose()
                dispatch(setOpenLoginDialog(true))
              }
            },
            label: <FormattedMessage id="blockThisChanel" />,
            hidden: isOwner,
          },
          {
            icon: <ReportIcon />,
            onClick: () => {
              if (isLogin) {
                setOpenReport(true)
              } else {
                onClose()
                dispatch(setOpenLoginDialog(true))
              }
            },
            hidden: !videoData?.id || isOwner,
            label: <FormattedMessage id="report" />,
          },
        ]
          .filter((v) => !v.hidden)
          .map((item, index) => {
            return (
              <button
                key={(item?.label || '') + index.toString()}
                className={`flex w-full whitespace-nowrap px-5 py-3 font-normal subtitle hover:bg-neutral-100`}
                onClick={() => {
                  setOpenPopper(false)
                  item.onClick && item.onClick()
                }}
              >
                {item.icon}
                <span className="ml-4">{item.label}</span>
              </button>
            )
          })}
      </Popper>
      <ShareModal
        open={shareVideo}
        onClose={() => {
          setShareVideo(false)
          onClose()
        }}
        shareUrl={videoData?.linkShare}
      />
      <WatchLaterModal
        videoData={videoData}
        open={openPlaylist}
        onClose={() => {
          setOpenPlayList(false)
          onClose()
        }}
      />
      <ReportVideoModal
        open={openReport}
        onClose={(val) => {
          setOpenReport(val)
          onClose()
        }}
        data={videoData}
        setMessage={setMessage}
      />
    </>
  )
}
export default VideoOptionPoper
