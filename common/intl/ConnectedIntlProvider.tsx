import { AppState } from '@redux/store'
import { IntlProvider } from 'react-intl'
import { useSelector } from 'react-redux'
import en from './en.json'
import vi from './vi.json'

function getMessages(locale: string) {
  if (locale === 'en') {
    return en
  }
  return vi
}

const ConnectedIntlProvider = ({ children }) => {
  const { locale } = useSelector((state: AppState) => state.intl)
  return (
    <IntlProvider locale={locale} messages={getMessages(locale)}>
      {children}
    </IntlProvider>
  )
}

export default ConnectedIntlProvider
