import api from '@common/api'
import { some, VideoObject } from '@common/constants'
import InterestingPage from '@modules/InterestingPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  dataSSR: VideoObject[]
  dataCategorySSR: some[]
}

const NextPage = (props: Props) => {
  return (
    <>
      <InterestingPage {...props} />
    </>
  )
}
export async function getServerSideProps() {
  try {
    const [dataHome, dataCategory] = await Promise.all([
      api({
        url: API_PATHS_SERVER.home.home({ page_token: 0, page_size: 12 }),
      }),

      api({
        url: API_PATHS_SERVER.home.categories({
          page_token: 0,
          filter: 'PARENT',
          page_size: 100,
        }),
      }),
    ])
    return {
      props: {
        dataSSR: dataHome?.data?.data?.[0]?.contents,
        dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
      },
    }
  } catch (error) {
    return {
      props: {
        dataSSR: [],
        dataCategorySSR: [],
      },
    }
  }
}

export default NextPage
