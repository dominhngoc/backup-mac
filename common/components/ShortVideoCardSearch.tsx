import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { VideoObject } from '@common/constants'
import { PlayIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { FormattedMessage } from 'react-intl'
import { UrlObject } from 'url'

export const ShortVideoCardSkeleton = () => {
  return (
    <div className="relative flex shrink-0 flex-col rounded-lg bg-bg2 sm:h-[284px] sm:w-full lg:h-[322px] lg:w-full 2xl:h-[352px] 2xl:w-[198px]">
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="h-3 w-3/4 rounded bg-neutral-100"></div>
      </div>
    </div>
  )
}

interface Props {
  data: VideoObject
  query?: UrlObject['query']
  theme?: 'playlist' | 'home'
}

const ShortVideoCardSearch = (props: Props) => {
  const { data, query, theme = 'home' } = props
  return (
    <MyLink
      href={{
        pathname: ROUTES.shorts.index,
        query: query,
      }}
      className="relative flex h-[352px] w-[198px] shrink-0 flex-col"
      title={data?.name}
    >
      <ProgressiveImg
        src={data?.coverImage}
        className="h-full rounded-lg object-cover"
        alt="coverImage"
        shape="rect_h"
      />
      <div
        className="absolute bottom-0 left-0 right-0 p-4 pt-11 line-clamp-2"
        style={{
          background:
            'linear-gradient(180deg, rgba(16, 16, 16, 0) 0%, #000000 90%)',
        }}
      >
        <div className="subtitle mb-2 flex flex-1 flex-wrap font-semibold">
          <span className="mr-1 line-clamp-2">{data?.name}</span>
          <span className="ml-1 line-clamp-2">
            {data?.hashtag &&
              data?.hashtag
                .split(',')
                .map(
                  (i, index) =>
                    i && <span className="mr-1" key={i + index}>{`#${i}`}</span>
                )}
          </span>
        </div>
        {theme === 'home' ? (
          <span className="caption1 text-neutral-400">
            {data?.playTimes} <FormattedMessage id={'view'} />
          </span>
        ) : (
          <p className="flex items-center">
            <PlayIcon className="scale-50" />
            {data?.playTimes} &nbsp;
            <FormattedMessage id={'view'} />
          </p>
        )}
      </div>
    </MyLink>
  )
}

export default ShortVideoCardSearch
