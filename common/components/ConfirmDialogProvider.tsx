import React, { useContext, useEffect, useState } from 'react'
import ConfirmDialog, { ConfirmDialogParams } from './ConfirmDialog'
const DUMMY_VALUE = {
  close: () => {},
  open: false,
  promptConfirmation: async () => {},
}
const ConfirmDialogContext =
  React.createContext<ConfirmDialogParams>(DUMMY_VALUE)

export const useConfirmDialog = () => {
  const ref = useContext(ConfirmDialogContext)
  return ref
}

const ConfirmDialogProvider: React.FunctionComponent = ({ children }) => {
  const refTmp = React.useRef<ConfirmDialogParams>(DUMMY_VALUE)

  const [ref_state, setRefState] = useState<ConfirmDialogParams>(DUMMY_VALUE)

  useEffect(() => {
    if (!refTmp.current) {
      return
    } else {
      setRefState(refTmp.current)
    }
  }, [])

  return (
    <ConfirmDialogContext.Provider value={ref_state}>
      {children}
      <ConfirmDialog ref={refTmp} />
    </ConfirmDialogContext.Provider>
  )
}
export default ConfirmDialogProvider
