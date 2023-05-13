import api from '@common/api'
import VideoCard from '@common/components/VideoCard'
import { some } from '@common/constants'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { useRouter } from 'next/router'
import { FilterSearch } from 'pages/search'
import { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'

interface Props {
  listDataSSR: some[]
  filterObj: FilterSearch
  type: 'FILM' | 'VIDEO'
}

const ListVideo = (props: Props) => {
  const { listDataSSR, filterObj, type } = props
  const { query } = useRouter()
  const { topic_id = '' } = query

  const {
    data = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) => {
      return !topic_id
        ? API_PATHS.search.index({
            query: filterObj.term,
            type: type,
            page_token: index + 1,
            page_size: 12,
            filter: [
              filterObj.duration?.split(',')[0],
              filterObj.duration?.split(',')[1],
              filterObj.sort,
              filterObj.time,
            ].filter((v) => !!v),
          })
        : null
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
      persistSize: true,
    }
  )

  const mappedData = useMemo(() => {
    return data?.reduce((v, c) => {
      return [...(v || []), ...(c || [])]
    }, listDataSSR)
  }, [data, listDataSSR])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 320 * 2 &&
        !isValidating &&
        listDataSSR.length > 0 &&
        data?.every((item) => item?.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [data, listDataSSR.length, isValidating, setSize, size]
  )
  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  if (topic_id || !listDataSSR || listDataSSR.length === 0) {
    return null
  }

  return (
    <>
      <div className="mb-5 flex py-3">
        <p className="text-2xl font-bold">
          <FormattedMessage id="doYouLikeIt" />
        </p>
        {/* <MyLink
          href={{ pathname: ROUTES.shorts.index }}
          className="ml-3 font-semibold text-neutral-600"
        >
          <FormattedMessage id="seeAll" />
        </MyLink> */}
      </div>
      <div
        className={
          '-ml-5 -mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }
      >
        {mappedData?.map((item) => {
          return (
            <div className="pl-5 pb-5" key={item.id}>
              <VideoCard data={item} key={item.id} />
            </div>
          )
        })}
      </div>
      <div className="flex h-24 w-full shrink-0 items-center justify-center">
        {isValidating && <LoadingIcon className="h-10 animate-spin" />}
      </div>
    </>
  )
}

export default ListVideo
