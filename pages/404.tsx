import MyLink from '@common/components/MyLink'
import { NotFoundIcon } from '@public/icons'
import Head from 'next/head'
import { FormattedMessage, useIntl } from 'react-intl'

interface Props {}

const NextPage = (props: Props) => {
  const intl = useIntl()
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: '404' })}</title>
      </Head>
      <div className="flex flex-col items-center justify-center pb-20 min-h-screen">
        <NotFoundIcon />
        <p className="font-bold headline">
          <FormattedMessage id="404" />
        </p>
        <p className="my-4 w-1/2 text-center text-neutral-500">
          <FormattedMessage id="notFoundURL" />
        </p>
        <MyLink href={'/'} className="btn-container">
          <FormattedMessage id="backToHome" />
        </MyLink>
      </div>
    </>
  )
}

export default NextPage
