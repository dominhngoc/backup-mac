import { LogoIcon } from '@public/icons'
import { FormattedMessage } from 'react-intl'
import HeaderActionLoginBox from './HeaderActionLoginBox'

const HeaderHome = () => {
  return (
    <header
      className={
        'sticky top-0 z-30 flex h-14 items-center justify-between bg-black p-4'
      }
    >
      <LogoIcon className="mr-2" />
      <HeaderActionLoginBox />
    </header>
  )
}
export default HeaderHome
