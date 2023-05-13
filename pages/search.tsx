import api from '@common/api'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import SearchPage from '@modules/SearchPage'
import { FILTER_TYPE } from '@modules/SearchPage/constant'
import { API_PATHS, API_PATHS_SERVER } from '@utility/API_PATH'
import { useRouter } from 'next/dist/client/router'
import useSWR from 'swr'
export interface FilterSearch {
  term: string
  sort: string
  type: string
  time: string
  duration: string
}

interface Props {
  dataHomeSSR
  dataShortSSR
  dataCategorySSR
  listChannelSSR
  listVideoSSR
}

const NextPage = (props: Props) => {
  const { dispatch } = useGeneralHook()

  const { query } = useRouter()

  const { data: dataFilmSSR = [], isLoading: isLoading1 } = useSWR(
    !query.type || query.type === FILTER_TYPE.FILM
      ? API_PATHS.search.index({
          query: query.term,
          type: FILTER_TYPE.FILM,
          page_token: 0,
          page_size: 12,
          filter: [
            (query.duration as string)?.split(',')[0],
            (query.duration as string)?.split(',')[1],
            query.sort,
            query.time,
          ].filter((v) => !!v),
        })
      : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }, true))
      return json?.data?.data?.[0]?.contents
    },
    {
      dedupingInterval: 30000,
    }
  )
  const { data: dataShortSSR = [], isLoading: isLoading2 } = useSWR(
    !query.type || query.type === FILTER_TYPE.SHORT
      ? API_PATHS.search.index({
          query: query.term,
          type: FILTER_TYPE.SHORT,
          page_token: 0,
          page_size: 12,
          filter: [
            (query.duration as string)?.split(',')[0],
            (query.duration as string)?.split(',')[1],
            query.sort,
            query.time,
          ].filter((v) => !!v),
        })
      : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }, true))
      return json?.data?.data?.[0]?.contents
    },
    {
      dedupingInterval: 30000,
    }
  )
  const { data: listChannelSSR = [], isLoading: isLoading3 } = useSWR(
    !query.type || query.type === FILTER_TYPE.CHANNEL
      ? API_PATHS.search.index({
          query: query.term,
          type: FILTER_TYPE.CHANNEL,
          page_token: 0,
          page_size: 12,
          filter: [
            (query.duration as string)?.split(',')[0],
            (query.duration as string)?.split(',')[1],
            query.sort,
            query.time,
          ].filter((v) => !!v),
        })
      : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }, true))
      return json?.data?.data?.[0]?.contents
    },
    {
      dedupingInterval: 30000,
    }
  )
  const { data: listVideoSSR = [], isLoading: isLoading4 } = useSWR(
    !query.type || query.type === FILTER_TYPE.VIDEO
      ? API_PATHS.search.index({
          query: query.term,
          type: FILTER_TYPE.VIDEO,
          page_token: 0,
          page_size: 12,
          filter: [
            (query.duration as string)?.split(',')[0],
            (query.duration as string)?.split(',')[1],
            query.sort,
            query.time,
          ].filter((v) => !!v),
        })
      : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }, true))
      return json?.data?.data?.[0]?.contents
    },
    {
      dedupingInterval: 30000,
    }
  )

  return (
    <SearchPage
      {...props}
      loading={isLoading1 || isLoading2 || isLoading3 || isLoading4}
      dataFilmSSR={dataFilmSSR}
      dataShortSSR={dataShortSSR}
      listChannelSSR={listChannelSSR}
      listVideoSSR={listVideoSSR}
    />
  )
}

export async function getServerSideProps() {
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
      dataCategorySSR: dataCategory?.data?.data?.[0]?.contents || [],
    },
  }
}

export default NextPage
