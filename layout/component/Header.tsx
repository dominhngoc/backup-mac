import MyLink from '@common/components/MyLink'
import SearchHeader from '@common/components/SearchHeader'
import useGeneralHook from '@common/hook/useGeneralHook'
import { LogoIcon } from '@public/icons'
import { AppState } from '@redux/store'
import { ROUTES } from '@utility/constant'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import HeaderActionBox from './HeaderActionBox'
import HeaderActionLoginBox from './HeaderActionLoginBox'

const ROUTES_HEADER = [
  {
    label: 'home',
    href: '/',
    children: [
      '/',
      ROUTES.interesting,
      ...Object.values(ROUTES.video),
      ...Object.values(ROUTES.phim),
    ],
  },
  {
    label: 'shortVideo',
    href: ROUTES.shorts.index,
    children: [...Object.values(ROUTES.shorts)],
  },
  {
    label: 'live',
    href: ROUTES.live.index,
    children: [...Object.values(ROUTES.live)],
  },
  {
    label: 'explorer',
    href: ROUTES.explorer,
    children: [ROUTES.explorer],
  },
  {
    label: 'karaoke',
    href: ROUTES.karaoke,
    children: [ROUTES.karaoke],
    badge: (
      <svg
        width="24"
        height="14"
        viewBox="0 0 24 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ml-1"
      >
        <path
          d="M6 0C2.68629 0 0 2.68629 0 6C0 7.19494 0.349314 8.30829 0.951398 9.24351L0.348813 12.2564C0.195869 13.0212 0.938226 13.6589 1.67114 13.3924L5.5001 12L5.46478 11.9765C5.64111 11.992 5.81962 12 6 12H18C21.3137 12 24 9.31371 24 6C24 2.68629 21.3137 0 18 0H6Z"
          fill="#FF3B30"
        />
        <path
          d="M5.54977 3.18182H6.61511L8.46738 7.70455H8.53556L10.3878 3.18182H11.4532V9H10.6179V4.78977H10.564L8.84806 8.99148H8.15488L6.43897 4.78693H6.38499V9H5.54977V3.18182ZM16.375 4.33239H17.0312C17.0312 4.77936 16.9299 5.13258 16.7273 5.39205C16.5265 5.64962 16.1837 5.77841 15.6989 5.77841V5.30114C15.892 5.30114 16.0369 5.26136 16.1335 5.18182C16.2301 5.10038 16.2945 4.98769 16.3267 4.84375C16.3589 4.69792 16.375 4.52746 16.375 4.33239ZM14.5653 9.08807C14.1563 9.08807 13.7992 8.99432 13.4943 8.80682C13.1894 8.61932 12.9527 8.35701 12.7841 8.01989C12.6155 7.68277 12.5312 7.28883 12.5312 6.83807C12.5312 6.38542 12.6155 5.98958 12.7841 5.65057C12.9527 5.31155 13.1894 5.0483 13.4943 4.8608C13.7992 4.6733 14.1563 4.57955 14.5653 4.57955C14.9744 4.57955 15.3314 4.6733 15.6364 4.8608C15.9413 5.0483 16.178 5.31155 16.3466 5.65057C16.5152 5.98958 16.5994 6.38542 16.5994 6.83807C16.5994 7.28883 16.5152 7.68277 16.3466 8.01989C16.178 8.35701 15.9413 8.61932 15.6364 8.80682C15.3314 8.99432 14.9744 9.08807 14.5653 9.08807ZM14.5682 8.375C14.8333 8.375 15.053 8.30492 15.2273 8.16477C15.4015 8.02462 15.5303 7.83807 15.6136 7.60511C15.6989 7.37216 15.7415 7.11553 15.7415 6.83523C15.7415 6.55682 15.6989 6.30114 15.6136 6.06818C15.5303 5.83333 15.4015 5.64489 15.2273 5.50284C15.053 5.3608 14.8333 5.28977 14.5682 5.28977C14.3011 5.28977 14.0795 5.3608 13.9034 5.50284C13.7292 5.64489 13.5994 5.83333 13.5142 6.06818C13.4309 6.30114 13.3892 6.55682 13.3892 6.83523C13.3892 7.11553 13.4309 7.37216 13.5142 7.60511C13.5994 7.83807 13.7292 8.02462 13.9034 8.16477C14.0795 8.30492 14.3011 8.375 14.5682 8.375ZM14.2159 4.05398L14.8807 2.74432H15.7756L14.8949 4.05398H14.2159ZM17.6683 9V4.63636H18.5177V9H17.6683ZM18.0972 3.96307C17.9495 3.96307 17.8226 3.91383 17.7166 3.81534C17.6124 3.71496 17.5603 3.59564 17.5603 3.45739C17.5603 3.31723 17.6124 3.19792 17.7166 3.09943C17.8226 2.99905 17.9495 2.94886 18.0972 2.94886C18.245 2.94886 18.3709 2.99905 18.4751 3.09943C18.5812 3.19792 18.6342 3.31723 18.6342 3.45739C18.6342 3.59564 18.5812 3.71496 18.4751 3.81534C18.3709 3.91383 18.245 3.96307 18.0972 3.96307Z"
          fill="white"
        />
      </svg>
    ),
  },
]

interface Props {}
const Header = (props: Props) => {
  const { pathname } = useRouter()
  const isLogin = useSelector(
    (appState: AppState) => appState.auth.isLogin,
    shallowEqual
  )

  return (
    <header className={'sticky top-0 z-50 min-h-[96px] bg-black'}>
      <div
        className={'container flex h-full flex-wrap items-center bg-black py-4'}
      >
        <MyLink href={{ pathname: ROUTES.home }}>
          <div className="flex items-center">
            <LogoIcon className="text-primary" />
            <p className="ml-2 text-xl font-semibold leading-6">
              <FormattedMessage id="myClip" />
            </p>
          </div>
        </MyLink>
        <div className="ml-8 flex flex-1 flex-wrap">
          {ROUTES_HEADER.map((item, index) => {
            return (
              <MyLink
                key={index}
                href={{
                  pathname: item.href,
                }}
                className={
                  'mr-1 flex items-center font-bold headline md:mr-2 lg:mr-3 xl:mr-4 2xl:mr-7 ' +
                  (item.children && item.children.includes(pathname)
                    ? ''
                    : 'text-neutral-500')
                }
              >
                <FormattedMessage id={item.label} />
                {item.badge}
              </MyLink>
            )
          })}
        </div>
        <div className="flex flex-wrap items-center sm:scale-90 2xl:scale-100">
          <SearchHeader />
          {isLogin ? (
            <HeaderActionLoginBox />
          ) : (
            <>
              <HeaderActionBox />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
export default Header
