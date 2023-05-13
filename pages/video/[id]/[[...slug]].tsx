import api from '@common/api'
import Redirect from '@common/components/Redirect'
import { some, VideoObject } from '@common/constants'
import VideoDetailPage from '@modules/VideoDetailPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  dataVideoSSR: VideoObject
  dataRelatedVideoSSR: some[]
  dataCategorySSR: some[]
  videoUrl: string
}

const NextPage = (props: Props) => {
  if (props.dataVideoSSR) {
    return <VideoDetailPage {...props} />
  }
  return <Redirect />
}

export async function getServerSideProps({ query }) {
  const id = query?.id
  try {
    if (id) {
      const [dataCategory, dataVideo] = await Promise.all([
        api({
          url: API_PATHS_SERVER.home.categories({
            page_token: 0,
            filter: 'PARENT',
            page_size: 100,
          }),
        }),
        api({
          url: API_PATHS_SERVER.videos.detail(id as string),
        }),
      ])

      const dataVideoSSR = dataVideo?.data?.data

      let dataRelatedVideoSSR = []
      if (dataVideoSSR?.channel?.id && dataVideoSSR?.categoryId) {
        const listFilm = await api({
          url: API_PATHS_SERVER.videos.related({
            page_size: 12,
            page_token: 0,
            id,
            channel_id: dataVideoSSR?.channel?.id,
            category_id: dataVideoSSR?.categoryId,
          }),
        })
        dataRelatedVideoSSR = listFilm?.data?.data?.[0]?.contents
      }

      return {
        props: {
          dataVideoSSR: dataVideo?.data?.data,
          dataRelatedVideoSSR,
          dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
        },
      }
    }
  } catch (err) {
    return {
      props: {
        dataVideoSSR: null,
        dataRelatedVideoSSR: [],
        dataCategorySSR: [],
      },
    }
  }
}

export default NextPage
