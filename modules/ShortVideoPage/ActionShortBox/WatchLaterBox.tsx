import WatchLaterModal from '@common/components/WatchLaterModal/WatchLaterModal'
import { VideoObject } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import { AddListIcon } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  data: VideoObject
}

const WatchLaterBox = (props: Props) => {
  const { data } = props
  const [open, setOpen] = useState(false)
  const { dispatch, isLogin } = useGeneralHook()

  return (
    <>
      <button
        className="flex  items-center"
        onClick={() =>
          isLogin ? setOpen(true) : dispatch(setOpenLoginDialog(true))
        }
      >
        <AddListIcon />
        <p className="caption1 ml-2">
          <FormattedMessage id="add" />
        </p>
      </button>
      <WatchLaterModal
        videoData={data}
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      />
    </>
  )
}

export default WatchLaterBox
