import MyLink from '@common/components/MyLink'
import ShortVideoCard from '@common/components/ShortVideoCard'
import { VideoObject } from '@common/constants'
import { ROUTES } from '@utility/constant'
import { FormattedMessage } from 'react-intl'

interface Props {
  dataShortSSR: VideoObject[]
  hiddenSeeAll?: boolean
}
const ShortVideoList = (props: Props) => {
  const { dataShortSSR, hiddenSeeAll } = props
  if (dataShortSSR.length === 0) {
    return null
  }
  return (
    <div className="mt-10">
      <div className="mb-5 flex items-center py-3">
        <p className="font-bold title2">
          <FormattedMessage id="shortVideo" />
        </p>
        {hiddenSeeAll === true ? null : (
          <MyLink
            href={{ pathname: ROUTES.shorts.index }}
            className="ml-4 font-semibold text-neutral-400"
          >
            <FormattedMessage id="seeAll" />
          </MyLink>
        )}
      </div>
      <div className="grid sm:-ml-3 md:grid-cols-5 lg:grid-cols-7 2xl:-ml-5">
        {dataShortSSR?.map((items, index) => (
          <div className="sm:ml-3 2xl:ml-5" key={items.id}>
            <ShortVideoCard
              data={items}
              query={{ slideIndex: index, pageSize: 0 }}
              className="relative flex h-[351px] w-[198px] shrink-0 flex-col"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShortVideoList
