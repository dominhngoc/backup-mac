import { AppState } from '@redux/store'
import { formatTimeVideo } from '@utility/helper'
import { useEffect, useState } from 'react'
import { getTrackBackground, Range } from 'react-range'
import { shallowEqual, useSelector } from 'react-redux'

interface Props {
  min?: number
  max?: number
  values: number[]
  onChange: (value: number[]) => void
  className?: string
  onMouseDown?: (e: any) => void
  onMouseUp?: (e: any) => void
  hiddenThumb: boolean
}

const SliderRange = (props: Props) => {
  const {
    className,
    min = 0,
    max = 100,
    values,
    onMouseDown,
    onMouseUp,
    onChange,
    hiddenThumb,
  } = props

  const { videoData, draggingProgressLine, metadata } = useSelector(
    (state: AppState) => state.shortVideo,
    shallowEqual
  )
  const [valuesTmp, setValuesTmp] = useState(values)

  return (
    <>
      <div className={className}>
        <Range
          min={0}
          max={max}
          step={1}
          values={draggingProgressLine ? valuesTmp : values}
          onChange={(values) => {
            setValuesTmp(values)
          }}
          onFinalChange={(values) => {
            onChange(values)
          }}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={(e) => {
                props.onMouseDown(e)
                onMouseDown && onMouseDown(e)
              }}
              onTouchStart={(e) => {
                props.onTouchStart(e)
                onMouseDown && onMouseDown(e)
              }}
              onMouseUp={(e) => {
                onMouseUp && onMouseUp(e)
              }}
              onTouchEnd={(e) => {
                onMouseUp && onMouseUp(e)
              }}
              style={{
                ...props.style,
                height: '16px',
                display: 'flex',
                width: '100%',
              }}
            >
              <div
                ref={props.ref}
                className={'w-full rounded ' + (hiddenThumb ? 'h-0.5' : 'h-1')}
                style={{
                  background: getTrackBackground({
                    values: draggingProgressLine
                      ? valuesTmp
                      : ([...values, videoData.loadedTime].filter(
                          Boolean
                        ) as any),
                    colors: [
                      '#D21F3C',
                      'rgba(255, 255, 255, 0.25)',
                      'rgba(255, 255, 255, 0.1)',
                    ],
                    min: min,
                    max: max,
                    // rtl,
                  }),
                  alignSelf: 'center',
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className={
                'flex h-3 w-3 items-center justify-center outline-none'
              }
            >
              <div
                id="thumb-range"
                className={
                  'shrink-0 origin-center rounded-full bg-primary transition-all ' +
                  (hiddenThumb ? 'h-0.5 w-0.5' : 'h-3 w-3')
                }
              ></div>
            </div>
          )}
        />
      </div>
      <div className="z-10 mt-2 h-[18px] text-xs" style={{ fontWeight: 700 }}>
        {draggingProgressLine
          ? formatTimeVideo(valuesTmp[0])
          : formatTimeVideo(videoData.currentTime)}
        <span className="opacity-60">
          &nbsp;/&nbsp;{formatTimeVideo(videoData.duration)}
        </span>
      </div>
    </>
  )
}

export default SliderRange
