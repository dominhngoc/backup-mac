import { some } from '@common/constants'
import { api } from '@common/fetchThunk'
import ExplorerPage from '@modules/ExplorerPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  listEventSSR: some[]
  discoveryVideosSSR: some[]
  dataCategorySSR: some[]
}

const NextPage = (props: Props) => {
  return <ExplorerPage {...props} />
}

export async function getServerSideProps({ req }) {
  const headers = req?.cookies?.TOKEN && {
    Authorization: `Bearer ${req?.cookies?.TOKEN}`,
  }
  try {
    const [eventJson, videoJson, dataCategory] = await Promise.all([
      api({
        url: API_PATHS_SERVER.home.event({
          page_token: 0,
          page_size: 12,
        }),
        headers,
      }),
      api({
        url: API_PATHS_SERVER.videos.index({
          page_token: 0,
          page_size: 12,
          filter: 'DISCOVERY',
        }),
        headers,
      }),
      api({
        url: API_PATHS_SERVER.home.categories({
          page_token: 0,
          filter: 'PARENT',
          page_size: 100,
        }),
        headers,
      }),
    ])
    return {
      props: {
        listEventSSR: eventJson?.data?.data,
        discoveryVideosSSR: videoJson?.data?.data?.[0]?.contents,
        dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
      },
    }
  } catch (err) {
    return {
      props: {
        listEventSSR: [],
        discoveryVideosSSR: [],
        dataCategorySSR: [],
      },
    }
  }
}

export default NextPage
