import api from '@common/api'
import MyLink from '@common/components/MyLink'
import ScrollMenu from '@common/components/ScrollMenu'
import ShortVideoCardSearch from '@common/components/ShortVideoCardSearch'
import { some, VideoObject } from '@common/constants'
import { LoadingIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import { useRouter } from 'next/router'
import { FilterSearch } from 'pages/search'
import { useMemo, useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'
import { FILTER_TYPE } from './constant'

interface Props {
  dataShortSSR: some[]
  filterObj: FilterSearch
  hiddenSeeAll?: boolean
}

const ShortVideoList = (props: Props) => {
  const { dataShortSSR, filterObj, hiddenSeeAll } = props

  const { query } = useRouter()
  const { topic_id = '' } = query
  const slider: HTMLDivElement | any = useRef(null)

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
            type: FILTER_TYPE.SHORT,
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
    }
  )

  const mappedData = useMemo(() => {
    return [dataShortSSR, ...data]
  }, [data, dataShortSSR])

  const onScrollLoad = (e) => {
    if (
      e.currentTarget.scrollLeft + e.currentTarget.offsetWidth >=
        e.currentTarget.scrollWidth - 10 &&
      !isValidating &&
      dataShortSSR.length > 0 &&
      data?.every((v) => v?.length > 0)
    ) {
      setSize(size + 1)
    }
  }

  if (dataShortSSR.length === 0) {
    return null
  }
  return (
    <div className="container my-6">
      <div className="mb-5 flex py-3 ">
        <p className="font-bold title">
          <FormattedMessage id="shortVideo" />
        </p>
        {hiddenSeeAll === true ? null : (
          <MyLink
            href={{ pathname: ROUTES.shorts.index }}
            className="ml-3 font-semibold text-neutral-600"
          >
            <FormattedMessage id="seeAll" />
          </MyLink>
        )}
      </div>

      <ScrollMenu
        id="video-box"
        classArrow="h-12 w-12"
        onScroll={(e) => {
          onScrollLoad(e)
        }}
      >
        {mappedData.map((value, pageSize) => {
          return value?.map((item: VideoObject, slideIndex) => {
            return (
              <div key={item.id} className="mr-[16px] w-fit">
                <ShortVideoCardSearch
                  key={item.id}
                  data={item}
                  query={{
                    ...query,
                    pageSize,
                    slideIndex,
                    type: 'search',
                  }}
                />
              </div>
            )
          })
        })}
        {isValidating && (
          <div className="flex  shrink-0 items-center justify-center sm:h-[285px] sm:w-[160px] lg:h-[322px] lg:w-[182px] 2xl:h-[351px] 2xl:w-[198px]">
            {<LoadingIcon className="h-10 animate-spin" />}
          </div>
        )}
      </ScrollMenu>
    </div>
  )
}

export default ShortVideoList
