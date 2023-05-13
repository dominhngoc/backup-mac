import MyLink from '@common/components/MyLink'
import ShortVideoCard from '@common/components/ShortVideoCard'
import { VideoObject } from '@common/constants'
import { ROUTES } from '@utility/constant'
import { FormattedMessage } from 'react-intl'

interface Props {
  dataShortSSR: VideoObject[]
  channelId: string
}

const ShortVideoList = (props: Props) => {
  const { dataShortSSR, channelId } = props
  if (dataShortSSR.length === 0) {
    return null
  }
  return (
    <div className="mt-9">
      <div className="mb-5 flex items-center">
        <p className="font-bold title">
          <FormattedMessage id="shortVideo" />
        </p>
        {dataShortSSR.length > 7 && (
          <MyLink
            href={{
              pathname: ROUTES.channel.videos,
              query: { id: channelId, type: 'shorts' },
            }}
            className="ml-3 font-semibold text-neutral-600"
          >
            <FormattedMessage id="seeAll" />
          </MyLink>
        )}
      </div>

      <div className="-ml-5 -mb-5 grid md:grid-cols-5 lg:grid-cols-7">
        {dataShortSSR.slice(0, 7)?.map((items, index) => (
          <div className="pl-5 pb-5" key={items.id}>
            <ShortVideoCard
              data={items}
              query={{
                pageSize: 0,
                slideIndex: index,
                type: 'channel',
                channelId: channelId,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShortVideoList
