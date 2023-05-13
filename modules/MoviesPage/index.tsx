import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import ScrollMenu from '@common/components/ScrollMenu'
import { some } from '@common/constants'
import MenuCategories from '@modules/HomePage/MenuCategories'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import AllFilmBox from './AllFilmBox'
import TopicFilmBox from './TopicFilmBox'

interface Props {
  dataTopicSSR: some[]
  dataFilmSSR: some[]
  topicSSR: some[]
  dataCategorySSR: some[]
  categoriesDetailSSR: some[] | any
}

const MoviesPage = (props: Props) => {
  const intl = useIntl()
  const { query } = useRouter()
  const {
    dataFilmSSR,
    topicSSR,
    dataTopicSSR,
    dataCategorySSR,
    categoriesDetailSSR,
  } = props
  const { topic_id = '' } = query

  const TABS = [
    {
      id: '',
      name: <FormattedMessage id={'all'} />,
    },
    ...(dataTopicSSR || []),
  ]

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'moviesList' })}</title>
      </Head>
      <MenuCategories listCategory={dataCategorySSR} />
      <div className="container min-h-screen">
        {/* <div className=" animate-pulse ">
        <div className="h-72 w-full rounded-2xl bg-neutral-500" />
      </div> */}
        <div className="flex h-[120px] items-center ">
          <div className="flex items-center">
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-neutral-400">
              <ProgressiveImg
                src={categoriesDetailSSR.avatarImage}
                className="h-full w-full rounded-full"
              />
            </div>
            <div className="ml-6 flex flex-col">
              <p className="mb-2 text-xl font-bold">
                <FormattedMessage
                  id={
                    categoriesDetailSSR?.name
                      ? categoriesDetailSSR?.name
                      : 'movie'
                  }
                />
              </p>
              <p>
                <span className="mr-2 text-base font-bold">
                  {categoriesDetailSSR?.playTimes}
                </span>
                <span className="font-semibold text-neutral-400">
                  <FormattedMessage id={'filter.view'} />
                </span>
              </p>
            </div>
          </div>
        </div>
        <ScrollMenu classNameWrapper="min-h-10 sticky top-[135px] pb-2 bg-bg1 z-10 mb-4">
          {TABS.map((item, index) => {
            return (
              <MyLink
                key={index}
                href={{
                  query: { ...query, topic_id: `${item.id}` },
                }}
                className={
                  'mx-2 mt-1 mr-3  flex flex-col font-bold ' +
                  (topic_id === `${item.id}`
                    ? 'text-inherit '
                    : 'text-neutral-500')
                }
              >
                <div className="flex whitespace-nowrap font-semibold">
                  {item.name}
                </div>
                {topic_id === `${item.id}` && (
                  <div className="mt-0.5 h-1 w-full rounded bg-primary" />
                )}
              </MyLink>
            )
          })}
        </ScrollMenu>
        <AllFilmBox dataFilmSSR={dataFilmSSR} />
        <TopicFilmBox topicSSR={topicSSR} />
      </div>
    </>
  )
}

export default MoviesPage
