import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  children?: any
  className?: string
  open: boolean
  onClose?: (open: boolean) => void
  refParent?: any
  isFullScreen?: boolean
  propsPaper?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
}

const Content = (props: Props) => {
  const { onClose, className = '', children, propsPaper } = props
  const refContent = useRef<HTMLDivElement | null>(null)

  return (
    <>
      <div ref={refContent} className={'fixed inset-0 z-max'}>
        <div
          className="fixed inset-0 -z-10 flex cursor-pointer items-center justify-center bg-black bg-opacity-50 opacity-100 "
          onClick={(e) => {
            onClose && onClose(false)
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''
          }}
        />
        <div
          {...propsPaper}
          className={
            'absolute top-1/2 left-1/2 max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-bg2 ' +
            className
          }
        >
          {children}
        </div>
      </div>
    </>
  )
}

const Modal = (props: Props) => {
  const { open, refParent } = props
  const ref = useRef<any>(null)

  useEffect(() => {
    ref.current = refParent || document.getElementById('append-root')
  }, [refParent, open])

  return (
    <>
      {open && ref.current && createPortal(<Content {...props} />, ref.current)}
    </>
  )
}

export default Modal
