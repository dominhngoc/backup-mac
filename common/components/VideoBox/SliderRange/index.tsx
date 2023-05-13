import { VideoObject } from '@common/constants'
import { isEqual } from 'lodash'
import { memo, useMemo, useState } from 'react'
import { getTrackBackground, Range } from 'react-range'
interface Props {
  min?: number
  max?: number
  values: number[]
  onChange: (value: number[]) => void
  className?: string
  onMouseDown?: (e: any) => void
  onMouseUp?: (e: any) => void
  loadedTime?: number
  videoData?: VideoObject
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
    loadedTime,
    videoData,
  } = props

  const [left, setLeft] = useState(-1)
  const [indexThumb, setIndexThumb] = useState(0)

  const thumb = useMemo(() => {
    var countImg = 0
    var picName = 'P001.png'
    var newPicName = ''
    var picCount = 1
    var xTop, xRight, xBottom, xLeft
    let thumbs: any = []
    let image = videoData?.previewImage || ''
    for (var d = 0; d <= max + 5; d = d + 5) {
      xTop = Math.floor(countImg / 5) * 90 + Math.floor(countImg / 5)
      xRight = 160 * ((countImg % 5) + 1) + (countImg % 5)
      xBottom = (Math.floor(countImg / 5) + 1) * 90 + Math.floor(countImg / 5)
      xLeft = xRight - 160 + countImg

      thumbs[d] = {
        src: image,
        style: {
          position: 'absolute',
          left: -xLeft,
          bottom: xTop,
          width: 806,
          height: 456,
          clip:
            'rect(' +
            xTop +
            'px, ' +
            xRight +
            'px, ' +
            xBottom +
            'px, ' +
            xLeft +
            'px)',
        },
      }
      countImg = countImg + 1
      if (countImg == 25) {
        countImg = 0
        picCount++
        if (picCount < 10) {
          newPicName = 'P00' + picCount + '.png'
        } else if (picCount < 100) {
          newPicName = 'P0' + picCount + '.png'
        } else {
          newPicName = 'P' + picCount + '.png'
        }
        image = image.replace(picName, newPicName)
        picName = newPicName
      }
    }
    return thumbs
  }, [max, videoData?.previewImage])

  return (
    <div className={className}>
      <Range
        min={0}
        max={max}
        step={1}
        values={values}
        onChange={onChange}
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
            onMouseLeave={() => {
              setLeft(-1)
            }}
            style={{
              ...props.style,
              height: '24px',
              display: 'flex',
              width: '100%',
            }}
            onMouseMove={(e) => {
              const tmp =
                e.clientX - e.currentTarget.getBoundingClientRect().left
              const index = Math.round(
                (tmp / e.currentTarget.getBoundingClientRect().width) * max
              )
              setIndexThumb(index - (index % 5))
              setLeft(
                tmp < e.currentTarget.getBoundingClientRect().width - 160
                  ? tmp
                  : e.currentTarget.getBoundingClientRect().width - 160
              )
            }}
            className={
              '[&>div]:hover:h-1.5 [&>div>div>div]:hover:h-4 [&>div>div>div]:hover:w-4'
            }
          >
            <div
              ref={props.ref}
              className={'h-1 w-full rounded transition-all'}
              style={{
                background: getTrackBackground({
                  values: [...values, loadedTime].filter(Boolean) as any,
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
            className={'flex h-3 w-3 items-center justify-center outline-none'}
          >
            <div
              id="thumb-range"
              className={
                'thumb-range h-3 w-3 shrink-0 origin-center rounded-full bg-primary transition-all'
              }
            ></div>
          </div>
        )}
      />
      <img
        className={left === -1 || !thumb[indexThumb] ? 'hidden' : ''}
        src={thumb[indexThumb]?.src}
        style={{
          ...thumb[indexThumb]?.style,
          left: left + (thumb[indexThumb]?.style?.left || 0),
          bottom: -456 + 120 + (thumb[indexThumb]?.style?.bottom || 0),
        }}
        alt="thumb-img"
      />
    </div>
  )
}

export default memo(SliderRange, (a, b) => {
  return isEqual(
    {
      max: a.max,
      loadedTime: a.loadedTime,
      videoData: a.videoData,
    },
    {
      max: b.max,
      loadedTime: b.loadedTime,
      videoData: b.videoData,
    }
  )
})
