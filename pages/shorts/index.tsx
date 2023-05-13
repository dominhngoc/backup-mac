import api from '@common/api'
import { some } from '@common/constants'
import ShortVideoPage from '@modules/ShortVideoPage'
import AsideBox from '@modules/ShortVideoPage/AsideBox'
import { AppState } from '@redux/store'
import { API_PATHS_SERVER } from '@utility/API_PATH'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'

interface Props {
  listChannelSSR: some[]
  listHashtagSSR: some[]
}

const NextPage = (props: Props) => {
  const { listChannelSSR, listHashtagSSR } = props
  const { param = 'HOT' } = useRouter()?.query
  const key = useSelector((state: AppState) => state.common.keyStatus)
  const intl = useIntl()
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'shorts' })}</title>
      </Head>
      <div className={'container flex'}>
        <AsideBox
          defaultParams="HOT"
          listChannelSSR={param === 'HOT' ? listChannelSSR : []}
          listHashtagSSR={listHashtagSSR}
        />
        <ShortVideoPage key={(param as any) + key} />
      </div>
    </>
  )
}

export async function getServerSideProps() {
  try {
    const [listChannel, listHashtag] = await Promise.all([
      api({
        url: API_PATHS_SERVER.home.channelsHome({
          filter: 'CHANNEL_SHORT',
          page_token: 0,
          page_size: 6,
        }),
      }),
      api({
        url: API_PATHS_SERVER.shorts.getPopularHashtag({
          filter: 'hot',
          page_token: 0,
          page_size: 15,
        }),
      }),
    ])
    return {
      props: {
        listChannelSSR: listChannel?.data?.data?.[0]?.contents || [],
        listHashtagSSR: listHashtag?.data?.data || [],
      },
    }
  } catch (e) {
    return { props: { listChannelSSR: [], listHashtagSSR: [] } }
  }
}

export default NextPage
