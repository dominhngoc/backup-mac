import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { some } from '@common/constants'
import { ROUTES } from '@utility/constant'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'

interface Props {
  data: some
  index: number
  className?: string
}
const FilmCardHorizontal = (props: Props) => {
  const { data, className, index } = props
  const { query } = useRouter()
  return (
    <MyLink
      key={`${data.id}`}
      href={{
        pathname: ROUTES.phim.detail,
        query: { id: data.id, slug: [data.slug] },
      }}
      title={data.description}
      className={'flex px-3 py-2'}
    >
      <div className="flex w-[18px] min-w-[18px] items-center">{index + 1}</div>
      <div className="relative ml-3 h-[68px] min-h-[68px] w-32 min-w-32 rounded  bg-black">
        <ProgressiveImg
          src={data.coverImage}
          shape="rect_h"
          alt="coverImage"
          className="h-full w-full rounded object-cover"
        />
      </div>
      <div className="ml-3 ">
        <div className=" text-xs font-bold line-clamp-2">{data.name}</div>
        <div>
          <p className=" text-neutral-500 line-clamp-2">
            {data?.playTimes || 0}&nbsp;
            <FormattedMessage id="viewText" />
          </p>
        </div>
      </div>
    </MyLink>
  )
}

export default FilmCardHorizontal
