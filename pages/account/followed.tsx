import api from '@common/api'
import Redirect from '@common/components/Redirect'
import { some } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import FollowedPage from '@modules/FollowedPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  dataCategorySSR: some[]
}
const NextPage = (props: Props) => {
  const { isLogin } = useGeneralHook()
  if (isLogin) return <FollowedPage {...props} />
  return <Redirect />
}

export async function getServerSideProps({ query }) {
  try {
    const [dataCategory] = await Promise.all([
      api({
        url: API_PATHS_SERVER.home.categories({
          page_token: 0,
          page_size: 100,
          filter: 'PARENT',
        }),
      }),
    ])

    return {
      props: {
        dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
      },
    }
  } catch (err) {
    return {
      props: {
        categoriesDetailSSR: {},
      },
    }
  }
}

export default NextPage
