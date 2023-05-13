import MyLink from '@common/components/MyLink'
import { AppStore, GooglePlay, MicroIcon } from '@public/icons'
import Head from 'next/head'
import { FormattedMessage, useIntl } from 'react-intl'

interface Props {}

const NextPage = (props: Props) => {
  const intl = useIntl()
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'karaoke' })}</title>
      </Head>
      <div style={{ backgroundImage: `url(/icons/karaoke_bg.svg)` }}>
        <div className="container flex py-28 text-white min-h-screen">
          <div className="flex-1">
            <MicroIcon />
            <h1
              style={{ fontSize: 48, lineHeight: '72px' }}
              className="mt-6 mb-4 font-bold"
            >
              <FormattedMessage id="karaokeTitle" />
            </h1>
            {[
              {
                icon: '/icons/karaoke_2.svg',
                label: 'karaoke_1',
              },
              {
                icon: '/icons/karaoke_3.svg',
                label: 'karaoke_2',
              },
              {
                icon: '/icons/karaoke_1.svg',
                label: 'karaoke_3',
              },
            ].map((item) => {
              return (
                <div key={item.label} className="mt-6 flex items-center">
                  <img src={item.icon} alt="icon" />
                  <p className="ml-2 font-semibold text-neutral-300 headline">
                    <FormattedMessage id={item.label} />
                  </p>
                </div>
              )
            })}
            <div className="mt-11 flex">
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
              </MyLink>{' '}
            </div>
          </div>
          <div className="flex flex-[1.5] justify-center">
            <img src="/icons/karaoke_banner.png" alt="karaoke_banner" />
          </div>
        </div>
      </div>
    </>
  )
}

export default NextPage
