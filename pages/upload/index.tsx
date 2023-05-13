import api from '@common/api'
import Redirect from '@common/components/Redirect'
import { some } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import UploadPage from '@modules/UploadPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  dataCategorySSR: some[]
}

const NextPage = (props: Props) => {
  const { isLogin } = useGeneralHook()
  if (!isLogin) {
    return <Redirect to="/" />
  }
  return <UploadPage {...props} />
}

export async function getServerSideProps() {
  const [dataCategorySSR] = await Promise.all([
    api({
      url: API_PATHS_SERVER.home.categories({
        page_token: 0,
        page_size: 100,
        filter: 'PARENT',
      }),
    }),
  ])
  return {
    props: { dataCategorySSR: dataCategorySSR?.data?.data?.[0]?.contents },
  }
}

export default NextPage
