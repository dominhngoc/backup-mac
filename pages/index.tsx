import api from '@common/api'
import { some, VideoObject } from '@common/constants'
import HomePage from '@modules/HomePage'
import { API_PATHS_SERVER } from '@utility/API_PATH'
import Head from 'next/head'
import { FormattedMessage, useIntl } from 'react-intl'
interface Props {
  dataHomeSSR: VideoObject[]
  dataLiveSSR: VideoObject[]
  dataShortSSR: VideoObject[]
  dataCategorySSR: some[]
  bannersSSR: some[]
  listChannelSSR: some[]
  categoryDetailSSR: some
}

const NextPage = (props: Props) => {
  const intl = useIntl()
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'home' })}</title>
      </Head>
      <HomePage {...props} />
    </>
  )
}

export async function getServerSideProps({ req }) {
  const headers = req?.cookies?.TOKEN && {
    Authorization: `Bearer ${req?.cookies?.TOKEN}`,
  }
  try {
    const [dataHome, dataLive, dataShort, dataCategory, banners, listChannel] =
      await Promise.all([
        api({
          url: API_PATHS_SERVER.home.home({ page_token: 0, page_size: 12 }),
          headers,
        }),
        api({
          url: API_PATHS_SERVER.home.lives({ page_token: 0, page_size: 4 }),
          headers,
        }),
        api({
          url: API_PATHS_SERVER.home.shorts({ page_token: 0, page_size: 7 }),
          headers,
        }),
        api({
          url: API_PATHS_SERVER.home.categories({
            page_token: 0,
            filter: 'PARENT',
            page_size: 100,
          }),
          headers,
        }),
        api({
          url: API_PATHS_SERVER.home.banner({
            filter: 'LOCATION_HOME',
            page_token: 0,
            page_size: 10,
          }),
          headers,
        }),
        api({
          url: API_PATHS_SERVER.home.channelsHome({
            filter: 'CHANNEL_RECOMMEND',
            page_token: 0,
            page_size: 9,
          }),
          headers,
        }),
      ])
    return {
      props: {
        dataHomeSSR: dataHome?.data?.data?.[0]?.contents,
        dataLiveSSR: dataLive?.data?.data?.[0]?.contents,
        dataShortSSR: dataShort?.data?.data?.[0]?.contents,
        dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
        bannersSSR: banners?.data?.data?.[0]?.contents,
        listChannelSSR: listChannel?.data?.data?.[0]?.contents || [],
      },
    }
  } catch (error) {
    console.log(error)
    return {
      props: {
        dataHomeSSR: [],
        dataLiveSSR: [],
        dataShortSSR: [],
        dataCategorySSR: [],
        bannersSSR: [],
        listChannelSSR: [],
      },
    }
  }
}

export default NextPage
