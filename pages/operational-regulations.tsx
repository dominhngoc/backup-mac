import api from '@common/api'
import Redirect from '@common/components/Redirect'
import { some } from '@common/constants'
import OperationalRegulationsPage from '@modules/OperationalRegulationsPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  data: some
}

const NextPage = (props: Props) => {
  if (props.data) {
    return <OperationalRegulationsPage {...props} />
  }
  return <Redirect />
}

export async function getServerSideProps({ query }) {
  try {
    const [json] = await Promise.all([
      api({
        url: API_PATHS_SERVER.home.getArticle('ARTICLE_TERM_CONDITION'),
      }),
    ])
    return {
      props: {
        data: json.data?.data,
      },
    }
  } catch (err) {
    return {
      props: {
        data: null,
      },
    }
  }
}

export default NextPage
