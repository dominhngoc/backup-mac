import api from '@common/api'
import { some } from '@common/constants'
import WatchLaterAccountPage from '@modules/WatchLaterAccountPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  dataCategorySSR: some[]
}

const NextPage = (props: Props) => {
  return (
    <>
      <WatchLaterAccountPage {...props} />
    </>
  )
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
