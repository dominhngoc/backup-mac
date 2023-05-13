import api from '@common/api'
import { some } from '@common/constants'
import LivesPage from '@modules/LivesPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  dataCategorySSR: some[]
  bannersSSR: some[]
  dataLivesSSR: some[]
  recentLivesSSR: some[]
}

const NextPage = (props: Props) => {
  return <LivesPage {...props} />
}

export async function getServerSideProps() {
  const [dataCategory, banners, dataLives, recentLives] = await Promise.all([
    api({
      url: API_PATHS_SERVER.home.categories({
        page_token: 0,
        filter: 'PARENT',
        page_size: 100,
      }),
    }),
    api({
      url: API_PATHS_SERVER.home.banner({
        filter: 'LOCATION_LIVE',
        page_token: 0,
        page_size: 10,
      }),
    }),
    api({
      url: API_PATHS_SERVER.home.lives({ page_token: 0, page_size: 100 }),
    }),
    api({
      url: API_PATHS_SERVER.videos.index({
        filter: `CATEGORY_${process.env.NEXT_PUBLIC_LIVE_CATEGORY_ID}`,
        page_token: 0,
        page_size: 12,
      }),
    }),
  ])

  return {
    props: {
      dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
      bannersSSR: banners?.data?.data?.[0]?.contents,
      dataLivesSSR: dataLives?.data?.data?.[0]?.contents,
      recentLivesSSR: recentLives?.data?.data?.[0]?.contents,
    },
  }
}

export default NextPage
