import { DownArrow } from '@public/icons'
import { HTMLAttributes, useEffect, useRef, useState } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  classArrowBox?: string
  classNameWrapper?: string
  classArrow?: string
  step?: (width, childs) => number
}
const ScrollMenu = (props: Props) => {
  const {
    classArrow,
    classArrowBox,
    children,
    onScroll,
    className,
    classNameWrapper,
    step,
    ...rest
  } = props
  const ref = useRef<HTMLDivElement | null>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowRight(
        ref.current?.scrollWidth !== ref.current?.getBoundingClientRect().width
      )
    }, 500)
  }, [])

  return (
    <div className={'relative w-full overflow-auto ' + classNameWrapper}>
      {showLeft && (
        <div
          className={
            'absolute left-0 top-0 bottom-0 z-10 flex w-20 items-center justify-center ' +
            classArrowBox
          }
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0, 0, 0, 0) 6.79%, #000000 100%)',
              mixBlendMode: 'multiply',
            }}
          />

          <button
            onClick={() => {
              ref.current?.scroll({
                left: step
                  ? ref.current?.scrollLeft -
                    step(
                      ref.current?.scrollWidth,
                      ref.current?.childNodes?.length
                    )
                  : ref.current?.scrollLeft -
                    ref.current?.scrollWidth /
                      (ref.current?.childNodes?.length || 1),
                behavior: 'smooth',
              })
            }}
            className={
              'z-10 flex min-h-[24px] w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-300 ' +
              classArrow
            }
          >
            <DownArrow className="rotate-90" />
          </button>
        </div>
      )}
      {showRight && (
        <div
          className={
            'absolute right-0 top-0 bottom-0 z-10 flex w-20 rotate-180 items-center justify-center ' +
            classArrowBox
          }
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0, 0, 0, 0) 6.79%, #000000 100%)',
              mixBlendMode: 'multiply',
            }}
          />

          <button
            onClick={() => {
              console.log(ref.current?.scrollWidth, ref.current?.childNodes)

              ref.current?.scroll({
                left: step
                  ? ref.current?.scrollLeft +
                    step(
                      ref.current?.scrollWidth,
                      ref.current?.childNodes?.length
                    )
                  : ref.current?.scrollLeft +
                    ref.current?.scrollWidth /
                      (ref.current?.childNodes?.length || 1),
                behavior: 'smooth',
              })
            }}
            className={
              'z-10 flex min-h-[24px] w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-300 ' +
              classArrow
            }
          >
            <DownArrow className="rotate-90" />
          </button>
        </div>
      )}
      <div
        {...rest}
        className={
          'flex flex-nowrap overflow-auto scrollbar-none-height ' + className
        }
        onScroll={(e) => {
          onScroll && onScroll(e)
          setShowLeft(e.currentTarget.scrollLeft !== 0)
          setShowRight(
            Math.round(
              e.currentTarget.scrollLeft + e.currentTarget.offsetWidth
            ) !== e.currentTarget.scrollWidth
          )
        }}
        ref={ref}
      >
        {children}
      </div>
    </div>
  )
}
export default ScrollMenu
