import { some } from '@common/constants'
import { api } from '@common/fetchThunk'
import AccountChannel from '@modules/AccountChannel'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  dataCategorySSR: some[]
}

const NextPage = (props: Props) => {
  return (
    <>
      <AccountChannel {...props} />
    </>
  )
}

export async function getServerSideProps() {
  try {
    const [dataCategory] = await Promise.all([
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
        dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
      },
    }
  } catch (err) {
    return {
      props: {
        dataCategorySSR: [],
      },
    }
  }
}

export default NextPage
