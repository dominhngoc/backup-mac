import { VideoObject } from '@common/constants'
import { ROUTES } from '@utility/constant'
import { FormattedMessage } from 'react-intl'

import MyLink from '@common/components/MyLink'
import VideoCard from '../../common/components/VideoCard'
interface Props {
  data: VideoObject[]
}
const InterestingVideosBox = (props: Props) => {
  const { data: dataHomeSSR } = props
  if (!dataHomeSSR.length) {
    return null
  }
  return (
    <>
      <div className="mt-10">
        <div className="mb-5 flex ">
          <p className="font-bold title2">
            <FormattedMessage id="doYouLikeIt" />
          </p>
          <MyLink
            href={{ pathname: ROUTES.interesting }}
            className="ml-4 font-semibold text-neutral-400"
          >
            <FormattedMessage id="seeAll" />
          </MyLink>
        </div>
        <div className="container flex flex-col p-0">
          <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {dataHomeSSR.slice(0, 8)?.map((item: VideoObject, index) => {
              return (
                <div className="pl-5 pb-5" key={item.id}>
                  <VideoCard data={item} key={index} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default InterestingVideosBox
