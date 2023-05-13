import Head from 'next/head'
import { useIntl } from 'react-intl'

interface Props {}

const ContactPage = (props: Props) => {
  const intl = useIntl()
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'contact' })}</title>
      </Head>
      <div className="container flex items-center min-h-screen">
        <div className="w-[550px]">
          <div
            className="font-bold mb-16 flex text-3xl" 
          >
            Dự án MXH MyClip - Trung tâm VAS Tổng Công ty Viễn thông Viettel
          </div>
          <p className="mb-3 text-neutral-500">Địa chỉ:</p>
          <p className="mb-4 text-primary title">
            Tòa nhà CIT ngõ 15 đường Duy Tân, quận Cầu Giấy, Hà Nội.
          </p>
          <p className="mb-3 mt-11 text-neutral-500">Số điện thoại:</p>
          <p className="titlemb-4 text-primary title">(024) 6273 1458</p>
          <p className="mb-3 mt-11 text-neutral-500">Số điện thoại:</p>
          <p className="mb-4 text-primary title">
            1800 8098 (miễn phí liên hệ từ thuê bao Viettel)
          </p>
        </div>
        <div className="flex flex-[2] justify-center">
          <img src="/icons/contact_icon.svg" alt="contact_icon" />
        </div>
      </div>
    </>
  )
}

export default ContactPage
