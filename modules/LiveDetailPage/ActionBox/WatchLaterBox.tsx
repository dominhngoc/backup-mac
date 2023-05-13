import { some, VideoObject } from '@common/constants'
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
  const { setMessage, dispatch, isLogin } = useGeneralHook()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="flex flex-1 flex-col items-center justify-center"
        onClick={() =>
          isLogin ? setOpen(true) : dispatch(setOpenLoginDialog(true))
        }
      >
        <AddListIcon />
        <p className="caption1 ml-2">
          <FormattedMessage id="add" />
        </p>
      </button>
    </>
  )
}

export default WatchLaterBox
