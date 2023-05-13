import { some } from '@common/constants'
import Head from 'next/head'
import { FormattedMessage, useIntl } from 'react-intl'

interface Props {
  data: some
}

const OperationalRegulationsPage = (props: Props) => {
  const { data } = props
  const intl = useIntl()
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'operationalRegulations' })}</title>
      </Head>
      <div className="container flex justify-center py-12">
        <div className="flex h-[70vh] w-[980px] flex-col overflow-hidden rounded-2xl bg-black bg-opacity-5 backdrop-blur-2xl">
          <div className="bg-neutral-200 p-4 text-center font-bold uppercase title2">
            <FormattedMessage id="operationalRegulations" />
          </div>
          <div
            className="flex-1 overflow-auto bg-white bg-opacity-5 py-12 px-16 text-editor"
            dangerouslySetInnerHTML={{ __html: data?.content }}
          />
        </div>
      </div>
    </>
  )
}

export default OperationalRegulationsPage
