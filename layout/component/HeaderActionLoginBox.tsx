import MyLink from '@common/components/MyLink'
import Popper from '@common/components/Popper'
import ProgressiveImg from '@common/components/ProgressiveImg'
import useGeneralHook from '@common/hook/useGeneralHook'
import {
  AddIcon,
  BookIcon,
  CameraOnIcon,
  ContactIcon,
  DocumentIcon,
  DollarIcon,
  HeartMenuIcon,
  LinkIcon,
  ListMenuIcon,
  LockedMenuIcon,
  LogoutIcon,
  MyclipSvgIcon,
  RecentIcon,
  ShieldIcon,
  UserCheckedIcon,
  WatchLaterIcon,
} from '@public/icons'
import { authOut } from '@redux/authReducer'
import {
  setOpenChangePasswordDialog,
  setOpenPackageDataDialog,
} from '@redux/dialogReducer'
import { setLoginForm } from '@redux/loginReducer'
import { AppState } from '@redux/store'
import { ROUTES } from '@utility/constant'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { batch, shallowEqual, useSelector } from 'react-redux'
import { mutate as numteAll } from 'swr'
import NoticationBox from './NoticationBox'

const HeaderActionLoginBox = () => {
  const [open, setOpen] = useState(false)
  const { dispatch, userData } = useGeneralHook()
  const userId = userData?.id
  const { profile, platform } = useSelector(
    (state: AppState) => state.auth,
    shallowEqual
  )
  const MENU_USER_TAB = [
    {
      id: 'cash',
      list: [
        {
          name: 'dataPack',
          icon: <DollarIcon />,
          action: () => {
            dispatch(setOpenPackageDataDialog(true))
          },
        },
        // {
        //   name: 'moneySign',
        //   icon: <CashIcon />,
        // },
      ],
    },
    {
      id: 'action',
      list: [
        // {
        //   name: 'scoreBoard',
        //   icon: <CrownIcon />,
        // },
        {
          name: 'myclipStudio',
          icon: <MyclipSvgIcon />,
          href: { pathname: ROUTES.studio.index },
        },
        {
          name: 'myVideo',
          icon: <CameraOnIcon />,
          href: { pathname: ROUTES.channel.videos, query: { id: userId } },
        },
        {
          name: 'favourites',
          icon: <HeartMenuIcon />,
          href: { pathname: ROUTES.favourites },
        },
        {
          name: 'followChannels',
          icon: <UserCheckedIcon />,
          href: { pathname: ROUTES.account.followed },
        },
        {
          name: 'watchLater',
          icon: <WatchLaterIcon />,
          href: { pathname: ROUTES.account.watchLater },
        },
        {
          name: 'watchRecently',
          icon: <RecentIcon />,
          href: { pathname: ROUTES.account.history },
        },
        {
          name: 'playlist',
          icon: <ListMenuIcon />,
          href: { pathname: ROUTES.channel.playlists, query: { id: userId } },
        },
        {
          name: 'accountLink',
          icon: <LinkIcon />,
        },
      ],
    },
    {
      id: 'option',
      list: [
        {
          name: 'changePassword',
          icon: <LockedMenuIcon />,
          action: () => {
            dispatch(setOpenChangePasswordDialog(true))
          },
          hidden: ['google', 'facebook'].includes(platform),
        },
        {
          name: 'intro',
          icon: <DocumentIcon />,
          href: { pathname: ROUTES.introduce },
        },
        {
          name: 'policy',
          icon: <ShieldIcon />,
          href: { pathname: ROUTES.termsOfUse },
        },
        {
          name: 'guide',
          icon: <BookIcon />,
          href: { pathname: ROUTES.guide },
        },
        {
          name: 'supportContact',
          icon: <ContactIcon />,
          href: { pathname: ROUTES.contact },
        },
      ],
    },
    {
      id: 'logout',
      list: [
        {
          name: 'logout',
          icon: <LogoutIcon />,
          action: () => {
            onLogout()
          },
        },
      ],
    },
  ]

  const onLogout = () => {
    batch(() => {
      dispatch(authOut())
      // dispatch(clearStoreAfterLogout())
      dispatch(setLoginForm({ username: '', password: '' }))
      numteAll(() => true, undefined, { revalidate: true })
    })
  }

  return (
    <>
      <MyLink
        href={{
          pathname: ROUTES.upload.index,
        }}
        className="btn ml-6 gap-0 uppercase"
      >
        <AddIcon className="mr-2" />
        <FormattedMessage id="create" />
      </MyLink>
      <NoticationBox />
      <Popper
        open={open}
        setOpen={setOpen}
        wrapper={
          <ProgressiveImg className="avatar h-10 w-10" src={userData?.avatar} />
        }
        classNamePaper="z-50 mt-3 overflow-hidden"
      >
        <div
          className="overflow-hiddenx flex max-h-[85vh] w-64 flex-col"
          onClick={() => {
            setOpen(false)
          }}
        >
          <MyLink
            href={{
              pathname: ROUTES.channel.detail,
              query: { id: userId },
            }}
            className="flex items-center p-4"
          >
            <ProgressiveImg
              className="avatar mr-3 h-10 w-10"
              src={userData?.avatar}
            />
            <div>
              <p className="line-clamp-2">{profile?.fullName}</p>
            </div>
          </MyLink>
          <div className={`flex-1 overflow-auto`}>
            {MENU_USER_TAB.map((v, index) => {
              return (
                <div key={v.id}>
                  <div className="divider border-neutral-100" />
                  <div className="flex w-60 flex-col py-3">
                    {v.list.map((item, index2) => {
                      if (item.href) {
                        return (
                          <MyLink
                            key={index2}
                            href={item.href}
                            className="flex items-center py-2 px-4 hover:bg-neutral-100"
                          >
                            {item.icon}
                            <p
                              className={
                                v.id === 'logout' ? 'ml-3 text-red' : 'ml-3'
                              }
                            >
                              <FormattedMessage id={item.name} />
                            </p>
                          </MyLink>
                        )
                      } else {
                        return (
                          <button
                            key={index2}
                            className="flex items-center py-2 px-4 hover:bg-neutral-100"
                            onClick={item.action}
                          >
                            {item.icon}
                            <p
                              className={
                                v.id === 'logout' ? 'ml-3 text-red' : 'ml-3'
                              }
                            >
                              <FormattedMessage id={item.name} />
                            </p>
                          </button>
                        )
                      }
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Popper>
    </>
  )
}
export default HeaderActionLoginBox
