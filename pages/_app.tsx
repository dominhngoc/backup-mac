import ConfirmDialogProvider from '@common/components/ConfirmDialogProvider'
import ConnectedIntlProvider from '@common/intl/ConnectedIntlProvider'
import DefaultLayout from '@layout/DefaultLayout'
import { persistor, store } from '@redux/store'
import NextNProgress from 'nextjs-progressbar'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'react-toastify/dist/ReactToastify.css'
import { PersistGate } from 'redux-persist/integration/react'
import { SWRConfig } from 'swr'
import '../styles/animation.css'
import '../styles/banner.css'
import '../styles/fly.css'
import '../styles/globals.css'
import '../styles/tailwind.css'
import '../styles/video.css'

const MyApp = (props) => {
  const { Component, pageProps } = props
  const Layout = Component.Layout || EmptyLayout

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <Layout>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConnectedIntlProvider>
            <ConfirmDialogProvider>
              <SWRConfig value={{ provider: () => new Map() }}>
                <DefaultLayout>
                  <NextNProgress
                    color="#D21F3C"
                    height={2}
                    options={{ showSpinner: false }}
                  />
                  <Component {...pageProps} />
                </DefaultLayout>
              </SWRConfig>
            </ConfirmDialogProvider>
          </ConnectedIntlProvider>
        </PersistGate>
      </Provider>
    </Layout>
  )
}

export default MyApp

const EmptyLayout = ({ children }) => <>{children}</>

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  return {
    ...pageProps,
  }
}
