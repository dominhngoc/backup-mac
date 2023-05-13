import MyLink from '@common/components/MyLink'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { FilterIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FilterSearch } from 'pages/search'
import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { FILTER_TYPE } from './constant'
import FilmListBox from './FilmListBox'
import Filter from './Filter'
import ListVideo from './ListVideo'
import ShortVideoList from './ShortVideoList'
import SuggestChannel from './SuggestChannel'

interface Props {
  dataCategorySSR
  dataFilmSSR
  dataShortSSR
  listChannelSSR
  listVideoSSR
  loading: Boolean
}
const SearchPage = (props: Props) => {
  const {
    dataCategorySSR,
    dataFilmSSR,
    dataShortSSR,
    listChannelSSR,
    listVideoSSR,
    loading,
  } = props
  const intl = useIntl()
  const { query } = useRouter()

  const [showFilter, setShowFilter] = useState(false)

  const filter: FilterSearch = {
    term: query.term ? (query.term as string) : '',
    sort: query.sort ? (query.sort as string) : '',
    type: query.type ? (query.type as string) : '',
    time: query.time ? (query.time as string) : '',
    duration: query.duration ? (query.duration as string) : '',
  }

  const TYPE_SEARCH = [
    {
      label: <FormattedMessage id="all" />,
      type: '',
    },
    {
      label: <FormattedMessage id="video" />,
      type: FILTER_TYPE.VIDEO,
    },
    {
      label: <FormattedMessage id="short" />,
      type: FILTER_TYPE.SHORT,
    },
    {
      label: <FormattedMessage id="channel" />,
      type: FILTER_TYPE.CHANNEL,
    },
  ]

  const SORT_FILTER = {
    key: 'sort',
    header: <FormattedMessage id="filter.sortBy" />,
    selections: [
      {
        label: <FormattedMessage id="filter.relevance" />,
        value: '',
      },
      {
        label: <FormattedMessage id="filter.uploadDate" />,
        value: 'CREATED_AT-',
      },
      // {
      //   label: <FormattedMessage id="filter.view" />,
      //   value: 'VIEW-',
      // },
      // {
      //   label: <FormattedMessage id="filter.rate" />,
      //   value: 'RATE-',
      //   disible: true,
      // },
    ],
  }

  const TYPE_FILTER = {
    key: 'type',
    header: <FormattedMessage id="filter.type" />,
    selections: [
      {
        label: <FormattedMessage id="all" />,
        value: '',
      },
      {
        label: <FormattedMessage id="video" />,
        value: FILTER_TYPE.VIDEO,
      },
      {
        label: <FormattedMessage id="short" />,
        value: FILTER_TYPE.SHORT,
      },
      {
        label: <FormattedMessage id="channel" />,
        value: FILTER_TYPE.CHANNEL,
      },
      {
        label: <FormattedMessage id="movies" />,
        value: FILTER_TYPE.FILM,
      },
    ],
  }

  const DATE_FILTER = {
    key: 'time',
    header: <FormattedMessage id="filter.uploadDate" />,
    selections: [
      {
        label: <FormattedMessage id="filter.allTime" />,
        value: '',
      },
      {
        label: <FormattedMessage id="filter.today" />,
        value: 'PUBLISHED_1-',
      },
      {
        label: <FormattedMessage id="filter.thisWeek" />,
        value: 'PUBLISHED_7-',
      },
      {
        label: <FormattedMessage id="filter.thisMonth" />,
        value: 'PUBLISHED_-30',
      },
      {
        label: <FormattedMessage id="filter.thisYear" />,
        value: 'PUBLISHED_1-365',
      },
    ],
  }

  const DURATION_FILTER = {
    key: 'duration',
    header: <FormattedMessage id="filter.duration" />,
    selections: [
      {
        label: <FormattedMessage id="filter.any" />,
        value: '',
      },
      {
        label: <FormattedMessage id="filter.under4Minutes" />,
        value: 'DURATION_240-',
      },
      {
        label: <FormattedMessage id="filter.from4to20Minutes" />,
        value: 'DURATION_240+,DURATION_1200-',
      },
      {
        label: <FormattedMessage id="filter.over20Minutes" />,
        value: 'DURATION_1200+',
      },
    ],
  }

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({ id: 'search' })}:&nbsp;{query.term}
        </title>
      </Head>
      <MenuCategories listCategory={dataCategorySSR} />
      <div className="min-h-screen">
        <div className="container py-6">
          <button
            className="flex items-center rounded-xl border border-white py-2 px-5 font-bold"
            onClick={() => {
              setShowFilter(!showFilter)
            }}
          >
            <FilterIcon className="mr-2" />
            <FormattedMessage id="filter.label" />
          </button>
        </div>
        <div
          style={{ animation: 'fadeInDown 0.1s' }}
          className={
            'container grid grid-cols-4 pb-6' + (showFilter ? '' : ' hidden')
          }
        >
          <Filter data={SORT_FILTER} value={filter.sort} query={query}></Filter>
          <Filter data={TYPE_FILTER} value={filter.type} query={query}></Filter>
          <Filter data={DATE_FILTER} value={filter.time} query={query}></Filter>
          <Filter
            data={DURATION_FILTER}
            value={filter.duration}
            query={query}
          ></Filter>
        </div>
        <div className="container flex h-10 items-center overflow-x-auto bg-bg1 ">
          {TYPE_SEARCH.map((item: any, index) => {
            return (
              <MyLink
                key={index}
                href={
                  item.href || {
                    pathname: ROUTES.search.index,
                    query: { ...query, type: item?.type },
                  }
                }
                className={
                  'mr-3 rounded-full px-4 py-2 ' +
                  ((query.type || '') === item?.type
                    ? 'bg-white text-[#141414]'
                    : 'bg-bg2 text-white ')
                }
              >
                <span className="ml-1">{item.label}</span>
              </MyLink>
            )
          })}
        </div>

        {!loading &&
        listChannelSSR?.length === 0 &&
        dataShortSSR.length === 0 &&
        listVideoSSR.length === 0 &&
        dataFilmSSR.length === 0 ? (
          <div className="container my-11">
            <p className="mt-7 text-center font-bold headline">
              <FormattedMessage id={'notFoundData'} />
            </p>
            <p className="mt-3 text-center text-neutral-500 subtitle">
              <FormattedMessage id="tryOther" />
            </p>
          </div>
        ) : (
          <>
            <SuggestChannel listChannel={listChannelSSR} filterObj={filter} />
            <ShortVideoList
              dataShortSSR={dataShortSSR}
              filterObj={filter}
              hiddenSeeAll={true}
            />
            <FilmListBox dataFilmSSR={dataFilmSSR} filterObj={filter} />
            <div className="container my-6">
              <ListVideo
                listDataSSR={listVideoSSR}
                filterObj={filter}
                type={'VIDEO'}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default SearchPage
