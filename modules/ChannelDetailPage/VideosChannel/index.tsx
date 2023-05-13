import MyLink from '@common/components/MyLink'
import { some } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import MenuCategories from '@modules/HomePage/MenuCategories'
import Head from 'next/head'
import { FormattedMessage } from 'react-intl'
import ChannelInfoBox from '../ChannelInfoBox'
import FilterVideos from './FilterVideo'
import ShortList from './ShortList'
import VideoList from './VideoList'

export const DEFAULT_FILTER = 'LATEST'
export const DEFAULT_TAB = 'videos'
export const filterGuess: FilterType[] = [
  { label: 'popular', value: 'MOST_VIEW' },
  { label: 'latest', value: 'LATEST' },
  { label: 'oldest', value: 'OLDEST' },
]

export const filterOwner: FilterType[] = [
  ...filterGuess,
  { label: 'waiting', value: 'OWNER_WAIT_APPROVE' },
  { label: 'reject', value: 'OWNER_REJECT' },
]

export interface FilterType {
  label: string
  value: string
}

interface Props {
  channelId: string
  channelInfo: some
  dataCategorySSR: some[]
}
export default function VideosChannel(props: Props) {
  const { channelId, channelInfo, dataCategorySSR } = props
  const { userData, router, isLogin } = useGeneralHook()
  const { query } = router
  const { type = 'videos', id } = query
  const isOwner = isLogin && userData?.id && userData?.id == channelId
  const filterList =
    userData?.id == id && type === 'videos' ? filterOwner : filterGuess

  const TABS = [
    {
      label: 'video',
      type: 'videos',
    },
    {
      label: 'shorts',
      type: 'shorts',
    },
  ]

  return (
    <>
      <Head>
        <title>{channelInfo?.name}</title>
      </Head>
      <MenuCategories hasDivider={true} listCategory={dataCategorySSR} />
      <div className="container pt-6 pb-36 min-h-screen">
        <ChannelInfoBox channelInfo={channelInfo} />
        <div className="my-6 flex w-full gap-4">
          <div className="flex flex-1">
            {TABS.map((item, index) => {
              return (
                <MyLink
                  href={{
                    query: { id: query.id, type: item.type },
                  }}
                  key={JSON.stringify(item) + index}
                  className={
                    'mr-2 flex h-8 w-fit items-center justify-center gap-2 rounded-3xl px-3 text-sm ' +
                    (type === item.type
                      ? 'bg-white text-black font-bold'
                      : 'bg-bg2 text-white')
                  }
                >
                  <FormattedMessage id={item.label} />
                </MyLink>
              )
            })}
          </div>
          <FilterVideos filterList={filterList} />
        </div>
        {type === 'videos' && (
          <VideoList isOwner={isOwner} channelId={id as string} />
        )}
        {type === 'shorts' && (
          <ShortList isOwner={isOwner} channelId={id as string} />
        )}
      </div>
    </>
  )
}
