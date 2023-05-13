import { PlayListObject, VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { DeleteIcon, UpArrowRounded } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { API_PATHS } from '@utility/API_PATH'
import { FormattedMessage } from 'react-intl'

interface Props {
  videoData?: VideoObject
  playlistInfo: PlayListObject
  onClose: (value: boolean) => void
  mutate?: () => Promise<any>
}

const PlaylistVideoOptions = (props: Props) => {
  const { playlistInfo, videoData, mutate } = props
  const { setMessage, dispatch, isLogin, confirmDialog, intl } =
    useGeneralHook()
  const { promptConfirmation, close } = confirmDialog

  const onDelete = async () => {
    if (!isLogin) {
      dispatch(setOpenLoginDialog(true))
      return
    }
    const confirm = await promptConfirmation({
      warning: true,
      title: intl.formatMessage({ id: 'deleteVideoOutOfPlaylist' }),
      message: (
        <>
          <FormattedMessage
            id="deleteConfirm"
            values={{
              name: <strong className="text-white">{videoData?.name}</strong>,
            }}
          />
          <br />
          <FormattedMessage id="noteDelete" />
        </>
      ),
      okText: 'deleteVideo',
    })
    if (confirm) {
      try {
        const json = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.playlists.toggleVideo,
              method: 'POST',
              data: {
                id: playlistInfo?.id,
                status: 0,
                video_id: videoData?.id,
              },
            },
            true
          )
        )
        close()
        if (json.status === 200) {
          mutate && mutate()
        }
        setMessage({ message: json.data?.message })
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    } else {
      close()
    }
  }

  return (
    <>
      <button
        className="subtitle flex w-full items-center px-5 py-3 hover:bg-neutral-100"
        onClick={() => {
          onDelete()
        }}
      >
        <DeleteIcon className="mr-2" />
        <FormattedMessage id="deleteOutList" />
      </button>
      {/* <button className="subtitle flex w-full items-center px-5 py-3 hover:bg-neutral-100">
        <UpArrowRounded className="mr-2" />
        <FormattedMessage id="moveToTop" />
      </button>
      <button className="subtitle flex w-full items-center px-5 py-3 hover:bg-neutral-100">
        <UpArrowRounded className="mr-2 rotate-180" />
        <FormattedMessage id="moveToBottom" />
      </button> */}
    </>
  )
}
export default PlaylistVideoOptions
