import { some } from '@common/constants'
import { api } from '@common/fetchThunk'
import PlaylistDetailPage from '@modules/PlaylistDetailPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  host: string
  dataCategorySSR: some[]
}

const NextPage = (props: Props) => {
  return <PlaylistDetailPage {...props} />
}

export async function getServerSideProps({ req, query }) {
  const id = query?.id
  try {
    const [dataCategory] = await Promise.all([
      api({
        url: API_PATHS_SERVER.home.categories({
          page_token: 0,
          filter: 'PARENT',
          page_size: 100,
        }),
      }),
    ])
    return {
      props: {
        dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
        host: req.headers?.host,
      },
    }
  } catch (err) {
    return {
      props: {
        dataFilm: { dataCategorySSR: [], host: req.headers?.host },
      },
    }
  }
}
export default NextPage
