import { some } from '@common/constants'
import { FormattedMessage } from 'react-intl'
import StreamCard from './StreamCard'

interface Props {
  dataLiveSSR: some[]
}

const HotLiveStreamList = (props: Props) => {
  const { dataLiveSSR } = props

  if (dataLiveSSR && dataLiveSSR.length === 0) {
    return null
  }

  return (
    <div className="mt-9">
      <div className="mb-5 flex w-full items-center">
        <p className="text-2xl font-bold leading-6">
          <FormattedMessage id={'liveStream'} />
        </p>
      </div>
      <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dataLiveSSR?.map((items) => (
          <div className="pl-5 pb-5" key={items.id}>
            <StreamCard key={items.id} data={items} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default HotLiveStreamList
