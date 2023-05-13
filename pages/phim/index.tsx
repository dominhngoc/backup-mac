import { api } from '@common/fetchThunk'
import { some } from '@common/constants'
import MoviesPage from '@modules/MoviesPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  dataTopicSSR: some[]
  dataFilmSSR: some[]
  topicSSR: some[]
  dataCategorySSR: some[]
  categoriesDetailSSR: some
}

const NextPage = (props: Props) => {
  return (
    <>
      <MoviesPage {...props} />
    </>
  )
}

export async function getServerSideProps({ query }) {
  try {
    const [dataTopic, dataFilm, categoriesDetail, topic, dataCategory] =
      await Promise.all([
        api({
          url: API_PATHS_SERVER.films.topics({
            page_token: 0,
            page_size: 100,
            filter: 'TYPE_FILM',
          }),
        }),
        api({
          url: API_PATHS_SERVER.films.index({
            page_token: 0,
            page_size: 12,
          }),
        }),
        api({
          url: API_PATHS_SERVER.home.categoriesDetail(
            Number(process.env.NEXT_PUBLIC_PHIM_CATEGORY_ID) || 0
          ),
        }),
        query.topic_id &&
          api({
            url: API_PATHS_SERVER.films.topicsFilm({
              page_token: 0,
              page_size: 12,
              topic_id: query.topic_id,
            }),
          }),
        api({
          url: API_PATHS_SERVER.home.categories({
            page_token: 0,
            page_size: 100,
            filter: 'PARENT',
          }),
        }),
      ])

    return {
      props: {
        dataTopicSSR: dataTopic?.data?.data?.[0]?.contents || [],
        dataFilmSSR: dataFilm?.data?.data?.[0]?.contents || [],
        topicSSR: topic?.data?.data?.[0]?.contents || [],
        categoriesDetailSSR: categoriesDetail?.data?.data?.contents[0] || {},
        dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
      },
    }
  } catch (err) {
    return {
      props: {
        dataTopicSSR: [],
        dataFilmSSR: [],
        topicSSR: [],
        dataCategorySSR: [],
        categoriesDetailSSR: {},
      },
    }
  }
}

export default NextPage
