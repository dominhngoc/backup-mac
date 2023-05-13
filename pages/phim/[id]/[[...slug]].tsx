import { api } from '@common/fetchThunk'
import { some, VideoObject } from '@common/constants'
import MoviesDetailPage from '@modules/MoviesDetailPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'
import Redirect from '@common/components/Redirect'

interface Props {
  dataFilmSSR: some
  listFilmSSR: VideoObject[]
  dataRelatedVideoSSR: some[]
  dataCategorySSR: some[]
}

const NextPage = (props: Props) => {
  if (props.dataFilmSSR) {
    return <MoviesDetailPage {...props} />
  }
  return <Redirect />
}
export async function getServerSideProps({ query }) {
  const id = query?.id
  try {
    const [dataFilm, dataCategory] = await Promise.all([
      api({
        url: API_PATHS_SERVER.films.detail(id as string),
      }),
      api({
        url: API_PATHS_SERVER.home.categories({
          page_token: 0,
          page_size: 100,
          filter: 'PARENT',
        }),
      }),
    ])

    const dataFilmSSR = dataFilm?.data?.data
    let dataRelatedVideoSSR = []

    const listFilm = await api({
      url: API_PATHS_SERVER.films.child(id as string, {
        page_size: dataFilmSSR.numVideo || 99999,
        page_token: 0,
        type: 'FILM',
      }),
    })

    if (dataFilmSSR?.channel?.id && dataFilmSSR?.categoryId && id) {
      const listFilm = await api({
        url: API_PATHS_SERVER.videos.related({
          page_size: 12,
          page_token: 0,
          id,
          channel_id: dataFilmSSR?.channel?.id,
          category_id: dataFilmSSR?.categoryId,
        }),
      })
      dataRelatedVideoSSR = listFilm?.data?.data?.[0]?.contents
    }
    return {
      props: {
        dataFilmSSR: dataFilmSSR,
        listFilmSSR: listFilm?.data?.data?.[0]?.contents || [],
        dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
        dataRelatedVideoSSR,
      },
    }
  } catch (err) {
    return {
      props: {
        dataFilmSSR: null,
        listFilmSSR: [],
        dataRelatedVideoSSR: [],
        dataCategorySSR: [],
      },
    }
  }
}

export default NextPage
