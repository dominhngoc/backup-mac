import MyLink from '@common/components/MyLink'
import { some } from '@common/constants'
import { LoadingIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { FormattedMessage } from 'react-intl'
import StreamCard from './StreamCard'

interface Props {
  dataLiveSSR: some[]
  hiddenViewAll?: boolean | undefined
  title: {
    value: string
    showSeeAll: boolean
  }
  type?: 'HOT' | 'RECENT'
}

const ShortVideoList = (props: Props) => {
  const { dataLiveSSR, title, type = 'HOT' } = props

  if (dataLiveSSR && dataLiveSSR.length === 0) {
    return null
  }

  return (
    <div>
      <div className="mt-6 mb-5 flex w-full items-center">
        <p className="font-bold title2">
          <FormattedMessage id={title.value} />
        </p>
        {title.showSeeAll && (
          <MyLink
            href={{ pathname: ROUTES.live.index }}
            className="ml-4 font-semibold text-neutral-400"
          >
            <FormattedMessage id="seeAll" />
          </MyLink>
        )}
      </div>
      <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dataLiveSSR?.map((items) => (
          <div className="pl-5 pb-5" key={items.id}>
            <StreamCard key={items.id} data={items} type={type} isLive={true} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShortVideoList
