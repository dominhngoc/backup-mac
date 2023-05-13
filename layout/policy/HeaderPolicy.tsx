import MyLink from '@common/components/MyLink'
import { LogoIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'

export const ROUTES_HEADER_POLICY = [
  {
    label: 'introduction',
    href: ROUTES.introduce,
    children: [ROUTES.introduce],
  },
  {
    label: 'termsOfUse',
    href: ROUTES.termsOfUse,
    children: [ROUTES.termsOfUse],
  },
  {
    label: 'operationalRegulations',
    href: ROUTES.operationalRegulations,
    children: [ROUTES.operationalRegulations],
  },
  {
    label: 'privacyPolicy',
    href: ROUTES.privacyPolicy,
    children: [ROUTES.privacyPolicy],
  },
  {
    label: 'guide',
    href: ROUTES.guide,
    children: [ROUTES.guide],
  },
  {
    label: 'contact',
    href: ROUTES.contact,
    children: [ROUTES.contact],
  },
]

interface Props {}
const HeaderPolicy = (props: Props) => {
  const { pathname } = useRouter()
  return (
    <header
      className={
        'sticky top-0 z-50 bg-black bg-opacity-10 backdrop-blur-xl sm:h-[72px] 2xl:h-24'
      }
    >
      <div className={'container flex h-full items-center py-4 '}>
        <MyLink href={{ pathname: ROUTES.home }}>
          <LogoIcon />
        </MyLink>
        <div className="ml-8 flex flex-1  2xl:text-base">
          {ROUTES_HEADER_POLICY.map((item, index) => {
            return (
              <MyLink
                key={index}
                href={{
                  pathname: item.href,
                }}
                className={
                  'headline whitespace-nowrap font-bold md:mr-4 lg:mr-5 2xl:mr-7 ' +
                  (item.children && item.children.includes(pathname)
                    ? ''
                    : 'text-neutral-500')
                }
              >
                <FormattedMessage id={item.label} />
              </MyLink>
            )
          })}
        </div>
      </div>
    </header>
  )
}
export default HeaderPolicy
