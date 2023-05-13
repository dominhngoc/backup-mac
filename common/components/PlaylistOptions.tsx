import { PlayListObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { DeleteIcon } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { API_PATHS } from '@utility/API_PATH'
import { FormattedMessage } from 'react-intl'

interface Props {
  data?: PlayListObject
  mutate?: any
}

const PlaylistOptions = (props: Props) => {
  const { data, mutate } = props
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
      title: intl.formatMessage({ id: 'deletePlaylistTitle' }),
      message: (
        <>
          <FormattedMessage
            id="deleteConfirm"
            values={{
              name: <strong className="text-white">{data?.name}</strong>,
            }}
          />
          <br />
          <FormattedMessage id="noteDelete" />
        </>
      ),
      okText: 'deletePlaylist',
    })
    if (confirm) {
      try {
        const json = await dispatch(
          fetchThunk({
            url: API_PATHS.playlists.delete,
            method: 'POST',
            data: {
              id: data?.id,
            },
          })
        )
        close()
        if (json.status === 200) {
          mutate && (await mutate())
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
        className="subtitle flex w-full items-center px-5 py-3"
        onClick={() => {
          onDelete()
        }}
      >
        <DeleteIcon className="mr-2" />
        <FormattedMessage id="deletePlaylist" />
      </button>
    </>
  )
}
export default PlaylistOptions
