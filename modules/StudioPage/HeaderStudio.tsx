import MyLink from '@common/components/MyLink'
import { LogoIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'

export const ROUTES_HEADER_STUDIO = [
  {
    label: 'livestream',
    value: '',
  },
  {
    label: 'webcam',
    value: 'webcam',
  },
  {
    label: 'manage',
    value: 'manage',
  },
]

interface Props {
  children?: React.ReactNode
}
const HeaderStudio = (props: Props) => {
  const { children } = props
  const { query } = useRouter()

  return (
    <header
      className={
        'sticky top-0 z-50 h-24 bg-black bg-opacity-10 backdrop-blur-xl'
      }
    >
      <div className={'container flex h-full flex-wrap items-center py-4'}>
        <MyLink href={{ pathname: ROUTES.home }} className='flex'>
          <LogoIcon />
          <span className="ml-2 text-xl font-semibold leading-6">
            <FormattedMessage id="myClip" />
          </span>
        </MyLink>
        <div className="mx-8 flex flex-1 justify-center">
          {ROUTES_HEADER_STUDIO.map((item, index) => {
            return (
              <MyLink
                key={index}
                href={{
                  query: { tab: item.value },
                }}
                className={
                  'mr-4 max-w-[192px] flex-1 whitespace-nowrap text-center font-bold uppercase headline ' +
                  (item.value === (query.tab || '') ? '' : 'text-neutral-500')
                }
              >
                <FormattedMessage id={item.label} />
                {item.value === (query.tab || '') && (
                  <div className="h-1 w-full self-center rounded bg-primary" />
                )}
              </MyLink>
            )
          })}
        </div>
        {children}
      </div>
    </header>
  )
}
export default HeaderStudio
