import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import VideoOptionPoper from '@common/components/VideoOptionPoper'
import { some } from '@common/constants'
import { ROUTES } from '@utility/constant'
import { FormattedMessage } from 'react-intl'

interface Props {
  data: some | any
  className?: string
}
const FilmCard = (props: Props) => {
  const { data, className } = props
  return (
    <div className="w-[230px] min-w-[230px]">
      <MyLink
        key={`${data.id}`}
        href={{
          pathname: ROUTES.phim.detail,
          query: { id: data.id, slug: [data.slug] },
        }}
        title={data.description}
        className={'relative ' + className}
      >
        <ProgressiveImg
          src={data.coverImage}
          shape="rect_w"
          alt="coverImage"
          className="h-80 w-full rounded-lg object-cover"
        />{' '}
        {data.numVideo > 1 && (
          <div className="caption2 absolute left-0 bottom-3 flex items-center rounded-r-full bg-red px-2 py-1 font-bold">
            {data.numVideo}&nbsp;
            <FormattedMessage id="episode" />
          </div>
        )}
      </MyLink>
      <div className="flex py-3">
        <MyLink
          className="w-full"
          href={{
            pathname: ROUTES.video.detail,
            query: { id: data.id, slug: [data.slug] },
          }}
        >
          <div className="flex">
            <div className="flex-1">
              <p className="headline size-[16]  font-bold line-clamp-2">
                {data.name}
              </p>
              <p className="size-[14] mt-0.5 font-[400] text-neutral-500 line-clamp-2">
                {data?.playTimes || 0}&nbsp;
                <FormattedMessage id="viewText" />
              </p>
            </div>
          </div>
        </MyLink>
        <VideoOptionPoper
          className="ml-3 h-fit"
          classNamePaper="w-72"
          videoData={{
            ...data,
            linkShare: data.linkShare,
          }}
          isFilm={true}
        />
      </div>
      <div className="pt-2"></div>
    </div>
  )
}

export default FilmCard
