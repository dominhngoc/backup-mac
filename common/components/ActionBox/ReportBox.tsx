import { some } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import { ReportIcon } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  data: some
}

const ReportBox = (props: Props) => {
  const { data } = props
  const [open, setOpen] = useState(false)
  const { setMessage, dispatch, isLogin } = useGeneralHook()
  return (
    <>
      <button
        className="flex  items-center"
        onClick={() =>
          isLogin ? setOpen(true) : dispatch(setOpenLoginDialog(true))
        }
      >
        <ReportIcon />
        <p className="caption1 ml-2">
          <FormattedMessage id="report" />
        </p>
      </button>
    </>
  )
}

export default ReportBox
