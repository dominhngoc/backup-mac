import MyLink from '@common/components/MyLink'
import VideoCard from '@common/components/VideoCard'
import { some, VideoObject } from '@common/constants'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { ROUTES } from '@utility/constant'
import Head from 'next/head'
import { FormattedMessage } from 'react-intl'
import ChannelInfoBox from '../ChannelInfoBox'
import HotLiveStreamList from '../HotLiveStreamList'
import ShortVideoList from '../ShortVideoList'

interface Props {
  channelId: string
  channelInfo: some
  dataLivesSSR: some[]
  dataCategorySSR: some[]
  dataShortsSSR: VideoObject[]
  dataVideosLatestSSR: VideoObject[]
  dataVideosPopularSSR: VideoObject[]
}

export default function HomeChannel(props: Props) {
  const {
    channelId,
    channelInfo,
    dataCategorySSR,
    dataLivesSSR,
    dataShortsSSR,
    dataVideosLatestSSR,
    dataVideosPopularSSR,
  } = props

  return (
    <>
      <Head>
        <title>{channelInfo?.name}</title>
      </Head>
      <MenuCategories hasDivider={true} listCategory={dataCategorySSR} />
      <div className="container pt-6 pb-36 min-h-screen">
        <ChannelInfoBox channelInfo={channelInfo} />
        <div className="flex flex-col">
          <HotLiveStreamList dataLiveSSR={dataLivesSSR} />
          <ShortVideoList dataShortSSR={dataShortsSSR} channelId={channelId} />
          {dataVideosLatestSSR.length > 0 && (
            <div>
              <div className="mb-5 mt-9 flex items-center">
                <p className="mr-3 font-bold title2">
                  <FormattedMessage id="latest" />
                </p>
                <MyLink
                  href={{
                    pathname: ROUTES.channel.videos,
                    query: { id: channelId },
                  }}
                  className="font-semibold text-neutral-600"
                >
                  <FormattedMessage id="seeAll" />
                </MyLink>
              </div>
              <div className="container flex flex-col p-0">
                <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {dataVideosLatestSSR
                    .slice(0, 8)
                    ?.map((item: VideoObject, index) => {
                      return (
                        <div className="pl-5 pb-5" key={item.id}>
                          <VideoCard data={item} />
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          )}
          {dataVideosPopularSSR.length > 0 && (
            <div>
              <div className="mb-5 mt-9 flex items-center">
                <p className="mr-3 font-bold title2">
                  <FormattedMessage id="mostView" />
                </p>
                <MyLink
                  href={{
                    pathname: ROUTES.channel.videos,
                    query: { id: channelId, filter: 'MOST_VIEW' },
                  }}
                  className="font-semibold text-neutral-600"
                >
                  <FormattedMessage id="seeAll" />
                </MyLink>
              </div>
              <div className="container flex flex-col p-0">
                <div className="-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {dataVideosPopularSSR
                    .slice(0, 8)
                    ?.map((item: VideoObject, index) => {
                      return (
                        <div className="pl-5 pb-5" key={item.id}>
                          <VideoCard data={item} key={index} />
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          )}
          {!dataLivesSSR.length &&
            !dataShortsSSR.length &&
            !dataVideosLatestSSR.length &&
            !dataVideosPopularSSR.length && (
              <div className="mt-17 text-center font-bold headline">
                <FormattedMessage id="emptyVideoChannelContent" />
              </div>
            )}
        </div>
      </div>
    </>
  )
}
