import api from '@common/api'
import { some } from '@common/constants'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'
import useSWRInfinite from 'swr/infinite'
import FilmCard from './FilmCard'

interface Props {
  topicSSR: some[]
}

const TopicFilmBox = (props: Props) => {
  const { topicSSR } = props
  const { query } = useRouter()
  const { topic_id = '' } = query

  const {
    data = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      topic_id
        ? API_PATHS.films.topicsFilm({
            page_token: index + 1,
            page_size: 12,
            topic_id,
            filter: 'TYPE_FILM',
          })
        : null,
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
      return [...v, ...c]
    }, topicSSR)
  }, [data, topicSSR])

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 320 * 2 &&
        !isValidating &&
        topicSSR.length > 0 &&
        data?.every((item) => item.length > 0)
      ) {
        setSize(size + 1)
      }
    },
    [data, isValidating, setSize, size, topicSSR.length]
  )

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  if (!topic_id) {
    return null
  }

  return (
    <>
      <div
        className={
          '-ml-5 -mb-5 grid grid-cols-3 py-3  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  xl:grid-cols-6'
        }
      >
        {mappedData?.map((item) => {
          return (
            <div className="pl-5 pb-5" key={item.id}>
              <FilmCard data={item} key={item.id} />
            </div>
          )
        })}
      </div>
      <div className="flex h-36 w-full shrink-0 items-center justify-center">
        {isValidating && <LoadingIcon className="h-10 animate-spin" />}
      </div>
    </>
  )
}

export default TopicFilmBox
