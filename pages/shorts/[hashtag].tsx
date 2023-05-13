import Redirect from '@common/components/Redirect'
import { some } from '@common/constants'
import { api } from '@common/fetchThunk'
import ShortHashTagPage from '@modules/ShortHashTagPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  hashtagInfo: some
  dataSSR: some[]
  listHashtagSSR: some[]
}

const NextPage = (props: Props) => {
  if (props.hashtagInfo) {
    return <ShortHashTagPage {...props} />
  }
  return <Redirect />
}

export async function getServerSideProps({ req, query }) {
  const hashtag = query?.hashtag
  try {
    const [hashtagInfo, dataSSR, listHashtag] = await Promise.all([
      api({
        url: API_PATHS_SERVER.shorts.getInfoByTag({
          filter: `DETAIL_${hashtag}`,
        }),
      }),
      api({
        url: API_PATHS_SERVER.shorts.getListByTag({
          hashtag,
          page_token: 0,
          page_size: 12,
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
        hashtagInfo: hashtagInfo?.data?.data,
        dataSSR: dataSSR?.data?.data?.[0]?.contents || [],
        listHashtagSSR: listHashtag?.data?.data || [],
      },
    }
  } catch (err) {
    return {
      props: {
        hashtagInfo: {},
        dataSSR: [],
        listHashtagSSR: [],
      },
    }
  }
}
export default NextPage
