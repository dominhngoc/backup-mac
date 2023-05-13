import React, { useEffect, useRef } from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onTouch: () => void
  duration?: number
}

export const TouchContainer: React.FC<Props> = (props) => {
  const { onTouch, duration, children, className = '', ...rest } = props

  const timer = useRef<any>(null)

  const onTouchStart = (e: any) => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(onTouch, duration || 1000)
  }

  const onTouchEnd = (e: any) => {
    if (timer) {
      clearTimeout(timer.current)
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  }, [timer])

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} {...rest}>
      {children}
    </div>
  )
}
export default TouchContainer
