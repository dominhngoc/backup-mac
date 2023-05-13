import Redirect from '@common/components/Redirect'
import { some } from '@common/constants'
import { api } from '@common/fetchThunk'
import ChannelTab from '@modules/ChannelDetailPage/ChannelTab'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  channelId: string
  channelInfo: some
  dataCategorySSR: some[]
}

const NextPage = (props: Props) => {
  if (props.channelInfo) {
    return (
      <>
        <ChannelTab {...props} />
      </>
    )
  }
  return <Redirect />
}

export async function getServerSideProps({ query }) {
  const id = query?.id

  try {
    if (id) {
      const [dataCategory, channelInfo] = await Promise.all([
        api({
          url: API_PATHS_SERVER.home.categories({
            page_token: 0,
            filter: 'PARENT',
            page_size: 100,
          }),
        }),
        api({
          url: API_PATHS_SERVER.channel.detail(id),
        }),
      ])
      return {
        props: {
          channelId: id,
          channelInfo: channelInfo?.data?.data,
          dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
        },
      }
    }
  } catch (err) {
    return {
      props: {
        channelId: id,
        channelInfo: null,
        dataCategorySSR: [],
      },
    }
  }
}

export default NextPage
