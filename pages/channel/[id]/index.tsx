import Redirect from '@common/components/Redirect'
import { some, VideoObject } from '@common/constants'
import { api } from '@common/fetchThunk'
import HomeChannel from '@modules/ChannelDetailPage/HomeChannel'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  channelId: string
  channelInfo: some
  dataCategorySSR: some[]
  dataLivesSSR: some[]
  dataShortsSSR: VideoObject[]
  dataVideosLatestSSR: VideoObject[]
  dataVideosPopularSSR: VideoObject[]
}

const NextPage = (props: Props) => {
  if (props.channelInfo) {
    return <HomeChannel {...props} />
  }
  return <Redirect />
}

export async function getServerSideProps({ query }) {
  const id = query?.id

  try {
    if (id) {
      const [
        dataCategory,
        channelInfo,
        dataLivesSSR,
        dataShortsSSR,
        dataVideosLatestSSR,
        dataVideosPopularSSR,
      ] = await Promise.all([
        api({
          url: API_PATHS_SERVER.home.categories({
            page_token: 0,
            filter: 'PARENT',
            page_size: 100,
          }),
        }),
        api({
          url: API_PATHS_SERVER.channel.detail(id),
        }),
        api({
          url: API_PATHS_SERVER.channel.lives({
            filter: `CHANNEL_${id}`,
            page_token: 0,
            page_size: 24,
          }),
        }),
        api({
          url: API_PATHS_SERVER.channel.short({
            page_token: 0,
            page_size: 12,
            filter: [`CHANNEL_${id}`],
          }),
        }),
        api({
          url: API_PATHS_SERVER.channel.videosLatest({
            page_token: 0,
            page_size: 8,
            filter: [`CHANNEL_${id}`, 'LATEST'],
          }),
        }),
        api({
          url: API_PATHS_SERVER.channel.videosPopular({
            page_token: 0,
            page_size: 8,
            filter: [`CHANNEL_${id}`, 'MOST_VIEW'],
          }),
        }),
      ])
      return {
        props: {
          channelId: id,
          channelInfo: channelInfo?.data?.data,
          dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
          dataLivesSSR: dataLivesSSR.data.data[0].contents,
          dataShortsSSR: dataShortsSSR.data.data[0].contents,
          dataVideosLatestSSR: dataVideosLatestSSR.data.data[0].contents,
          dataVideosPopularSSR: dataVideosPopularSSR.data.data[0].contents,
        },
      }
    }
  } catch (err) {
    console.log(err);

    return {
      props: {
        channelId: id,
        channelInfo: null,
        dataCategorySSR: [],
        dataLivesSSR: [],
        dataShortsSSR: [],
        dataVideosLatestSSR: [],
        dataVideosPopularSSR: [],
      },
    }
  }
}

export default NextPage
