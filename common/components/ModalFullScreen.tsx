import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
interface Props {
  children?: any
  className?: string
  open: boolean
  onClose?: (open: boolean) => void
  refParent?: any
}

const Content = (props: Props) => {
  const { onClose, className = '', children, open } = props
  const refContent = useRef<HTMLDivElement | null>(null)

  return (
    <>
      <div
        ref={refContent}
        className={'fixed inset-0 z-70 h-screen bg-bg2 ' + className}
      >
        {children}
      </div>
    </>
  )
}

const ModalFullScreen = (props: Props) => {
  const { open, refParent } = props
  const ref = useRef<any>(null)

  useEffect(() => {
    ref.current = refParent || document.getElementById('append-root')
  }, [refParent, open])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else if (ref.current.childNodes?.length <= 1) {
      document.body.style.overflow = ''
    }
  }, [open])

  return <>{open && createPortal(<Content {...props} />, ref.current)}</>
}

export default ModalFullScreen
