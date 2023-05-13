import api from '@common/api'
import Redirect from '@common/components/Redirect'
import { some, VideoObject } from '@common/constants'
import VideosByCategory from '@modules/HomePage/VideosByCategory'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  dataCategorySSR: VideoObject[]
  dataVideoSSR: VideoObject[]
  categoryDetailSSR: some
}

const NextPage = (props: Props) => {
  if (props.categoryDetailSSR) {
    return <VideosByCategory {...props} />
  }
  return <Redirect />
}
export async function getServerSideProps({ query }) {
  const id = query.id
  if (id) {
    try {
      const [dataCategory, dataVideo, categoryDetail] = await Promise.all([
        api({
          url: API_PATHS_SERVER.home.categories({
            page_token: 0,
            filter: 'PARENT',
            page_size: 100,
          }),
        }),
        api({
          url: API_PATHS_SERVER.videos.home({
            filter: `CATEGORY_${id}`,
            page_token: 0,
            page_size: 12,
          }),
        }),
        api({
          url: API_PATHS_SERVER.home.categoriesDetail(id),
        }),
      ])
      return {
        props: {
          dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
          dataVideoSSR: dataVideo?.data?.data?.[0]?.contents,
          categoryDetailSSR: categoryDetail?.data?.data?.contents[0],
        },
      }
    } catch (error) {
      return {
        props: {
          dataCategorySSR: [],
          dataVideoSSR: [],
          categoryDetailSSR: null,
        },
      }
    }
  }
  return {
    props: {
      dataCategorySSR: [],
      dataVideoSSR: [],
      categoryDetailSSR: null,
    },
  }
}

export default NextPage
