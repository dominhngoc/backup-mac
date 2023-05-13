import Redirect from '@common/components/Redirect'
import { some, VideoObject } from '@common/constants'
import { api } from '@common/fetchThunk'
import LiveDetailPage from '@modules/LiveDetailPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  dataVideoSSR: VideoObject
  dataRelatedVideoSSR: some[]
  dataCategoriesSSR: some[]
}

const NextPage = (props: Props) => {
  if (props.dataVideoSSR) {
    return <LiveDetailPage {...props} />
  }
  return <Redirect />
}

export async function getServerSideProps({ query, req }) {
  const id = query?.id
  const headers = req?.cookies?.TOKEN && {
    Authorization: `Bearer ${req?.cookies?.TOKEN}`,
  }
  try {
    if (id) {
      const [dataCategories, dataVideo] = await Promise.all([
        api({
          url: API_PATHS_SERVER.home.categories({
            page_token: 0,
            filter: 'PARENT',
            page_size: 100,
          }),
          headers,
        }),
        api({
          url: API_PATHS_SERVER.lives.detail(id as string),
          headers,
        }),
      ])
      const dataVideoSSR = dataVideo?.data?.data
      let dataRelatedVideoSSR = []
      if (dataVideoSSR?.channel?.id) {
        const listFilm = await api({
          url: API_PATHS_SERVER.videos.index({
            page_size: 12,
            page_token: 0,
            filter: `CHANNEL_${dataVideoSSR?.channel?.id},LATEST`,
          }),
          headers,
        })
        dataRelatedVideoSSR = listFilm?.data?.data?.[0]?.contents
      }
      return {
        props: {
          dataVideoSSR: dataVideo?.data?.data,
          dataRelatedVideoSSR,
          dataCategoriesSSR: dataCategories?.data?.data?.[0]?.contents,
        },
      }
    }
  } catch (err) {
    return {
      props: {
        dataVideoSSR: null,
        dataRelatedVideoSSR: [],
        dataCategoriesSSR: [],
      },
    }
  }
}

export default NextPage
