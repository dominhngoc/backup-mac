import MyLink from '@common/components/MyLink'
import { AppStore, BoCongThuong, FacebookIcon, GooglePlay } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { FormattedMessage } from 'react-intl'

interface Props {}

const Footer = (props: Props) => {
  return (
    <div className=" w-full bg-bg2">
      <div className="container">
        <div className="grid grid-cols-4 pt-[57px] pb-[51px]">
          <div className="mb-5 flex flex-col ">
            <p className="mb-4 text-xl font-bold">
              <FormattedMessage id="MyClip" />
            </p>
            <div className="flex flex-col">
              <MyLink href={{ pathname: ROUTES.introduce }}>
                <p className="mt-2 text-sm">
                  <FormattedMessage id="introduce" />
                </p>
              </MyLink>
              <MyLink href={{ pathname: ROUTES.termsOfUse }}>
                <p className="mt-2 text-sm">
                  <FormattedMessage id="termsOfUse" />
                </p>
              </MyLink>
              <MyLink href={{ pathname: ROUTES.operationalRegulations }}>
                <p className="mt-2 text-sm">
                  <FormattedMessage id="operationalRegulations" />
                </p>
              </MyLink>
            </div>
          </div>
          <div className="mb-5 flex flex-col">
            <p className="text-xl font-bold">
              <FormattedMessage id="help" />
            </p>
            <div className="flex flex-col">
              <MyLink href={{ pathname: ROUTES.privacyPolicy }}>
                <p className="mt-2 text-sm">
                  <FormattedMessage id="privacyPolicy" />
                </p>
              </MyLink>
              <MyLink href={{ pathname: ROUTES.contact }}>
                <p className="mt-2 text-sm">
                  <FormattedMessage id="contact" />
                </p>
              </MyLink>
            </div>
          </div>
          <div className="mb-5 flex flex-col">
            <p className="mb-4 text-xl font-bold">
              <FormattedMessage id="follow" />
            </p>
            <div className="flex flex-col">
              <MyLink
                target={'_blank'}
                href={{
                  pathname: 'https://www.facebook.com/myclipvn.viettel.fanpage',
                }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200"
              >
                <FacebookIcon />
              </MyLink>
            </div>
          </div>
          <div className="mb-5 flex flex-col">
            <p className="mb-4 text-xl font-bold">
              <FormattedMessage id="downloadTheApp" />
            </p>
            <div className="flex flex-row ">
              <MyLink
                target={'_blank'}
                className="mr-4"
                href={{
                  pathname:
                    'https://apps.apple.com/vn/app/myclip-clip-hot/id1186215150?l=vi',
                }}
              >
                <img src={AppStore.src} alt="AppStore" className="h-12" />
              </MyLink>
              <MyLink
                target={'_blank'}
                href={{
                  pathname:
                    'https://play.google.com/store/apps/details?id=com.viettel.myclip&hl=vi',
                }}
              >
                <img src={GooglePlay.src} alt="GooglePlay" className="h-12" />
              </MyLink>
            </div>
          </div>
          <div className="mt-12 flex flex-col text-xs text-[#9E9E9E]">
            Mạng xã hội Video MyClip.
            <br /> Đơn vị chủ quản: Tổng Công ty Viễn thông Viettel.
            <br /> ĐKKD số: 0100109106-011 cấp ngày 18/07/2005.
            <br /> Địa chỉ: Số 1 Giang Văn Minh – Ba Đình – Hà Nội.
            <br /> Giấy phép số 366/GP-BTTTT cấp ngày 28/07/2017
          </div>
          <div className="mt-12 flex flex-col">
            <MyLink
              target={'_blank'}
              href={{ pathname: 'http://online.gov.vn/Home/WebDetails/68768' }}
            >
              <img
                src={BoCongThuong.src}
                alt=""
                className="h-[70px] w-auto object-contain"
              />
            </MyLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
