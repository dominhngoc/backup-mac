import { VideoCardSkeleton } from '@common/components/VideoCard'
import { some } from '@common/constants'
import VideoCardHorizontal from '@modules/VideoDetailPage/VideoCardHorizontal'
import { LoadingIcon } from '@public/icons'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { AUTO_PLAY } from './constants'

interface Props {
  data: some[]
  loading: boolean
  size: number
  title?: string | any
  className?: string
}

const RelativeVideoBox = (props: Props) => {
  const { size, data, loading, title, className } = props
  const [autoPlay, setAutoPlay] = useState(false)

  useEffect(() => {
    setAutoPlay(localStorage.getItem(AUTO_PLAY) === 'true')
  }, [])

  return (
    <div className={'flex w-89 flex-col pb-2 ' + (className || '')}>
      <div className="flex justify-between">
        {title ? (
          <p className="title font-bold line-clamp-1">{title}</p>
        ) : (
          <>
            <p className="title font-bold line-clamp-1">
              <FormattedMessage id="next" />
            </p>
            <div className="flex text-sm text-neutral-400">
              <FormattedMessage id="autoPlay" />
              <label
                className="relative ml-2 inline-flex cursor-pointer items-center"
                onChange={(e) => {
                  localStorage.setItem('AUTO_PLAY', !autoPlay + '')
                  setAutoPlay(!autoPlay)
                }}
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={autoPlay}
                  autoComplete="off"
                  readOnly
                />
                <div className="peer-focus:ring-blue-300 peer h-4 w-7 rounded-full bg-neutral-200 after:absolute after:top-[5.5px] after:left-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </>
        )}
      </div>
      <div className="max mt-6 flex h-full flex-col">
        {data?.map((item, index) => {
          return (
            <div className="mb-3" key={item.id + index}>
              <VideoCardHorizontal data={item} />
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-center">
        {loading &&
          (size === 1 ? (
            <VideoCardSkeleton />
          ) : (
            <div className="h-32">
              <LoadingIcon className="h-10 animate-spin" />
            </div>
          ))}
      </div>
    </div>
  )
}

export default RelativeVideoBox
