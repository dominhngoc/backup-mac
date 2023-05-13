import ChangePasswordDialog from '@common/components/ChangePasswordDialog'
import ConfirmDialog from '@common/components/ConfirmDialog'
import LoginDialog from '@common/components/LoginDialog/LoginDialog'
import RequireLoginDialog from '@common/components/LoginDialog/RequireLoginDialog'
import PackageDataDialog from '@common/components/PackageDataDialog'
import RequireDownloadDialog from '@common/components/RequireDownloadDialog'
import SnackbarProvider from '@common/components/SnackbarProvider'
import { ROUTES } from '@utility/constant'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import Footer from './component/Footer'
import Header from './component/Header'
import HeaderPolicy, { ROUTES_HEADER_POLICY } from './policy/HeaderPolicy'
const listHiddenFooter = [ROUTES.shorts.index, ROUTES.shorts.hashtags]

const DefaultLayout = ({ children }) => {
  const router = useRouter()
  const hiddenFooter = listHiddenFooter.includes(router.pathname)

  const policyHeader = ROUTES_HEADER_POLICY.reduce((v: string[], c: any) => {
    return [...v, ...c.children]
  }, []).includes(router.pathname)

  const studioRoute = Object.values(ROUTES.studio).includes(router.pathname)

  return (
    <div
      style={{
        backgroundImage: policyHeader ? 'url("/icons/bg_layout2.png")' : '',
      }}
      className="bg-cover bg-center"
    >
      {policyHeader ? <HeaderPolicy /> : studioRoute ? null : <Header />}
      {children}
      {!hiddenFooter && <Footer />}
      <SnackbarProvider />
      <RequireLoginDialog />
      <LoginDialog />
      <ChangePasswordDialog />
      <PackageDataDialog />
      <ConfirmDialog />
      <RequireDownloadDialog />
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}
export default DefaultLayout
