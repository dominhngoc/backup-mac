import api from '@common/api'
import ScrollMenu from '@common/components/ScrollMenu'
import { some } from '@common/constants'
import { API_PATHS } from '@utility/API_PATH'
import { FilterSearch } from 'pages/search'
import { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import { FILTER_TYPE } from './constant'
import FilmCard from './FilmCard'
interface Props {
  dataFilmSSR: some[]
  filterObj: FilterSearch
}

const FilmListBox = (props: Props) => {
  const { dataFilmSSR, filterObj } = props

  const {
    data = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) => {
      return API_PATHS.search.index({
        query: filterObj.term,
        type: FILTER_TYPE.FILM,
        page_token: index + 1,
        page_size: 12,
        filter: [
          filterObj.duration?.split(',')[0],
          filterObj.duration?.split(',')[1],
          filterObj.sort,
          filterObj.time,
        ].filter((v) => !!v),
      })
    },
    async (url) => {
      const json = await api({ url, method: 'get' })
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateAll: false,
      revalidateFirstPage: false,
      initialSize: 1,
      revalidateOnMount: false,
      revalidateOnFocus: false,
    }
  )

  const mappedData = useMemo(() => {
    return data?.reduce((v, c) => {
      return [...(v || []), ...(c || [])]
    }, dataFilmSSR)
  }, [data, dataFilmSSR])

  const onScrollLoad = (e) => {
    if (
      e.currentTarget.scrollLeft + e.currentTarget.offsetWidth >=
        e.currentTarget.scrollWidth - 10 &&
      !isValidating &&
      dataFilmSSR.length > 0 &&
      data?.every((v) => v?.length > 0)
    ) {
      setSize(size + 1)
    }
  }

  if (dataFilmSSR.length === 0) {
    return null
  }
  return (
    <div className="container py-6">
      <div className="mb-5 flex items-center py-3">
        <p className="text-2xl font-bold leading-6">
          <FormattedMessage id="movies" />
        </p>
      </div>
      <ScrollMenu
        onScroll={(e) => {
          onScrollLoad(e)
        }}
        classArrowBox="max-w-[40px]"
      >
        {mappedData?.map((item) => {
          return (
            <div className="mr-[19px]" key={item.id}>
              <FilmCard data={item} key={item.id} />
            </div>
          )
        })}
      </ScrollMenu>
    </div>
  )
}

export default FilmListBox
