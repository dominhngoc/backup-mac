import MyLink from '@common/components/MyLink'
import ScrollMenu from '@common/components/ScrollMenu'
import { some } from '@common/constants'
import { ExploreIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
interface Props {
  listCategory: some[]
  hasDivider?: boolean
}

const MenuCategories: React.FC<Props> = (props: Props) => {
  const { listCategory, hasDivider } = props
  const { query, pathname = '/' } = useRouter()
  const categoryId = query.id ? Number(query.id) : ''

  const TABS = [
    // {
    //   icon: <ExploreIcon />,
    //   label: <FormattedMessage id="explorer" />,
    //   href: { pathname: ROUTES.explorer },
    //   default: true,
    // },
    {
      label: <FormattedMessage id="offer" />,
      href: { pathname: ROUTES.home },
      default: true,
    },
    {
      label: <FormattedMessage id="movies" />,
      href: { pathname: ROUTES.phim.index },
      routers: [...Object.values(ROUTES.phim)],
      default: true,
    },
    ...(listCategory || []).map((val) => ({
      label: val.name,
      href: {
        pathname: ROUTES.category,
        query: {
          id: val.id,
        },
      },
    })),
  ]

  return (
    <div className="sticky top-[95px] z-40 bg-bg1">
      <div className=" container flex h-10 items-center bg-bg1 px-0">
        <ScrollMenu classArrowBox="max-w-[40px]">
          {TABS.map((item: any, index) => {
            const active = item.routers
              ? item.routers?.includes(pathname)
              : categoryId
              ? item?.href?.query?.id
                ? categoryId === item?.href?.query?.id
                : false
              : pathname === item.href?.pathname && item.default

            return (
              <MyLink
                key={index}
                href={item.href}
                className={
                  'mr-4 mt-1 flex flex-col ' +
                  (active ? 'text-inherit' : 'text-neutral-500')
                }
              >
                <div className="flex whitespace-nowrap font-semibold">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
                <div
                  className={
                    'mt-0.5 h-1 w-full rounded bg-primary ' +
                    (active ? 'opacity-1' : 'opacity-0')
                  }
                />
              </MyLink>
            )
          })}
        </ScrollMenu>
      </div>
      {!!hasDivider && (
        <div className="h-[1px] w-full bg-white opacity-[0.1]"></div>
      )}
    </div>
  )
}

export default MenuCategories
