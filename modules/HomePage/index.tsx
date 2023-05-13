import { some, VideoObject } from '@common/constants'
import { useRouter } from 'next/router'
import HotLiveStreamList from '../LivesPage/HotLiveStreamList'
import BannersCarousel from './BannersCarousel'
import MenuCategories from './MenuCategories'
import ShortVideoList from './ShortVideoList'
import SuggestChannel from './SuggestChannel'
import SuggestVideosChannel from './SuggestVideosChannel'

import InterestingVideosBox from './InterestingVideosBox'
interface Props {
  dataHomeSSR: VideoObject[]
  dataLiveSSR: VideoObject[]
  dataShortSSR: VideoObject[]
  dataCategorySSR: some[]
  bannersSSR: some[]
  listChannelSSR: some[]
}
const HomePage = (props: Props) => {
  const {
    dataHomeSSR,
    dataLiveSSR,
    dataShortSSR,
    dataCategorySSR,
    bannersSSR,
    listChannelSSR,
  } = props

  const { query } = useRouter()

  const categoryId = query.categoryId ? Number(query.categoryId) : ''

  if (categoryId) {
    return (
      <>
        <MenuCategories listCategory={dataCategorySSR} />
      </>
    )
  }

  return (
    <>
      <BannersCarousel banners={bannersSSR} />
      <MenuCategories listCategory={dataCategorySSR} />
      <div className="container mt-10 min-h-screen">
        <HotLiveStreamList
          dataLiveSSR={dataLiveSSR}
          title={{ value: 'hotLiveStream', showSeeAll: true }}
          type="HOT"
        />
        <ShortVideoList dataShortSSR={dataShortSSR} />
        <InterestingVideosBox data={dataHomeSSR} />
        <SuggestChannel listChannel={listChannelSSR} />
        <SuggestVideosChannel />
      </div>
    </>
  )
}

export default HomePage
