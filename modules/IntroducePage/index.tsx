import { some } from '@common/constants'
import { LogoIcon } from '@public/icons'
import Head from 'next/head'
import { FormattedMessage, useIntl } from 'react-intl'

interface Props {
  data: some
}

const IntroducePage = (props: Props) => {
  const { data } = props
  const intl = useIntl()
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'introduction' })}</title>
      </Head>
      <div className="container justify-center pb-12">
        <div className="flex w-full items-center">
          <div className="flex-1">
            <div className="flex text-4xl font-semibold">
              <LogoIcon />
              <span className="ml-3">
                <FormattedMessage id="myClip" />
              </span>
            </div>
            <p className="mt-9 mb-4 text-3xl font-bold">
              Chào mừng đến MyClip, một mạng xã hội video do Viettel cung cấp
            </p>
            <p className="mt-9 mb-4 text-sm opacity-60">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry standard dummy when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book. It has survived not only five centuries, but
              also the leap into electronic typesetting.
            </p>
          </div>
          <div className="ml-6 flex flex-[2] justify-end">
            <img
              src="/icons/introduce_1.svg"
              alt="introduce_1"
              className="h-[824px]"
            />
          </div>
        </div>
        <div className="-mt-[5%] flex w-full items-center">
          <div className="flex-[2]">
            <img
              src="/icons/introduce_2.svg"
              alt="introduce_2"
              className="mx-auto h-[476px]"
            />
          </div>
          <div className="ml-6 flex flex-1 flex-col justify-end">
            <div className="flex text-4xl font-semibold">
              Chào mừng đến MyClip, một mạng xã hội video do Viettel cung cấp
            </div>
            <p className="mt-9 mb-4 text-sm opacity-60">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry standard dummy when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book. It has survived not only five centuries, but
              also the leap into electronic typesetting.
            </p>
          </div>
        </div>
        <div className="flex w-full py-36">
          <div className="flex-1">
            <div className="flex text-4xl font-semibold">
              Không giới hạn lưu lượng data, tốc độ cao Viettel
            </div>
            <p className="mt-9 mb-4 text-sm opacity-60">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry standard dummy when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book. It has survived not only five centuries, but
              also the leap into electronic typesetting.
            </p>
          </div>
          <div className="ml-6 flex flex-[2] justify-end">
            <img
              src="/icons/introduce_3.svg"
              alt="introduce_3"
              className="w-[824px]"
            />
          </div>
        </div>
        <div className="flex w-full items-center">
          <div className="flex-[2]">
            <img
              src="/icons/introduce_4.svg"
              alt="introduce_4"
              className="w-[824px]"
            />
          </div>
          <div className="ml-6 flex flex-1 flex-col justify-end">
            <div className="flex text-4xl font-semibold">
              Cung cấp nhiều kênh video đặc sắc
            </div>
            <p className="mt-9 mb-4 text-sm opacity-60">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry standard dummy when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book. It has survived not only five centuries, but
              also the leap into electronic typesetting.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default IntroducePage
