import { Placement, PositioningStrategy, State } from '@popperjs/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Modifier, usePopper } from 'react-popper'

export interface Options {
  placement?: Placement
  modifiers?: Array<Partial<Modifier<any, any>>>
  strategy?: PositioningStrategy
  onFirstUpdate?: (arg0: Partial<State>) => void
}
interface Props {
  children?: any
  wrapper?: any
  className?: string
  classNamePaper?: string
  open: boolean
  setOpen: (value: boolean) => void
  options?: Options
  rootId?: string
  noPortal?: boolean
}
const Popper = (props: Props) => {
  const {
    rootId,
    children,
    wrapper,
    className = '',
    classNamePaper = '',
    open,
    setOpen,
    options,
    noPortal,
  } = props
  const [referenceElement, setReferenceElement] = useState<any>(null)
  const [popperElement, setPopperElement] = useState<any>(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
    ...options,
  })
  const ref = useRef<any>(null)
  const content = useMemo(() => {
    return (
      <div>
        <div
          className="fixed inset-0 bg-transparent z-90"
          onClick={() => setOpen(false)}
        />
        <div
          ref={setPopperElement}
          style={styles.popper}
          className="z-max"
          {...attributes.popper}
        >
          <div
            className={`overflow-hidden rounded-md bg-bg2 ` + classNamePaper}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }, [attributes.popper, children, classNamePaper, setOpen, styles.popper])

  useEffect(() => {
    ref.current = rootId
      ? document.getElementById(rootId)
      : document.getElementById('append-root')
  }, [rootId])

  return (
    <>
      <button
        id="btn-poper"
        type="button"
        className={'h-fit w-fit ' + className}
        ref={setReferenceElement}
        onClick={() => {
          setOpen(!open)
        }}
      >
        {wrapper}
      </button>

      {open && (noPortal ? content : createPortal(content, ref.current))}
    </>
  )
}

export default Popper
