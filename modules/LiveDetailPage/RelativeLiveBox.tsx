import { VideoObject } from '@common/constants'
import VideoCard from '@common/components/VideoCard'
import { LoadingIcon } from '@public/icons'
import { FormattedMessage } from 'react-intl'

interface Props {
  data: VideoObject[]
  loading: boolean
  size: number
}

const RelativeLiveBox = (props: Props) => {
  const { size, data, loading } = props

  if (!data.length && !loading) {
    return null
  }

  return (
    <div className="mt-2 flex flex-col pb-2">
      <div className="mb-4 flex items-center justify-between px-3">
        <p className="title font-bold line-clamp-1">
          <FormattedMessage id="relatedVideo" />
        </p>
      </div>
      {data?.map((item: VideoObject) => {
        return (
          <div className="mb-4" key={item.id}>
            <VideoCard key={item.id} data={item} />
          </div>
        )
      })}
      <div className="flex h-[124px] items-center justify-center">
        {loading &&
          (size === 1 ? <></> : <LoadingIcon className="h-10 animate-spin" />)}
      </div>
    </div>
  )
}

export default RelativeLiveBox
