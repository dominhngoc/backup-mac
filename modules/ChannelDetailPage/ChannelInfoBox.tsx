import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import ScrollMenu from '@common/components/ScrollMenu'
import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { CheckIcon, NotiOffIcon, Pen2Icon } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWR from 'swr'

interface Props {
  channelInfo: some
}

export default function ChannelInfoBox(props: Props) {
  const { channelInfo } = props
  const {
    setMessage,
    dispatch,
    intl,
    isLogin,
    router,
    userData,
    confirmDialog,
  } = useGeneralHook()
  const { close, promptConfirmation } = confirmDialog
  const [followCount, setFollowCount] = useState(channelInfo?.followCount || 0)
  const [open, setOpen] = useState(false)
  const { query, pathname } = router

  const isOwner = isLogin && userData?.id && userData?.id == channelInfo?.id

  const { data: listChannelFollowed, mutate } = useSWR(
    channelInfo?.id && isLogin
      ? API_PATHS.users.cache.get({
          filter: `FOLLOW_CHANNEL_${channelInfo?.id}`,
        })
      : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateOnFocus: false,
    }
  )

  const TABS = [
    {
      label: 'home',
      href: { pathname: ROUTES.channel.detail, query: { id: query.id } },
    },
    {
      label: 'video',
      href: { pathname: ROUTES.channel.videos, query: { id: query.id } },
    },
    {
      label: 'playlists',
      href: { pathname: ROUTES.channel.playlists, query: { id: query.id } },
    },
    {
      label: 'channel',
      href: { pathname: ROUTES.channel.channel, query: { id: query.id } },
    },
    {
      label: 'introduction',
      href: { pathname: ROUTES.channel.introduction, query: { id: query.id } },
    },
  ]

  const follow = useCallback(
    async (status, type = 2) => {
      try {
        if (!isLogin) {
          dispatch(setOpenLoginDialog(true))
          return
        }
        const json = await dispatch(
          fetchThunk({
            url: API_PATHS.users.followChannel,
            method: 'post',
            data: {
              id: channelInfo?.id,
              status: status,
              notification_type: type,
            },
          })
        )
        if (json.data?.data?.followCount) {
          setFollowCount(json.data?.data?.followCount)
          mutate()
        }
        setOpen(false)
        setMessage({ message: json.data?.message })
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    },
    [isLogin, dispatch, channelInfo?.id, setMessage, mutate]
  )

  const isFollow =
    isLogin && listChannelFollowed?.length > 0
      ? listChannelFollowed?.findIndex(
          (v) => `${v.id}` === `${channelInfo?.id}` && v.status === 1
        ) !== -1
      : false

  return (
    <>
      <ProgressiveImg
        src={channelInfo.coverImage}
        alt="coverImage"
        shape="channel"
        className="h-70 w-full rounded-xl object-cover"
      />
      <div className="my-12 flex items-center">
        <ProgressiveImg
          src={channelInfo.avatarImage}
          alt="avatarImage"
          className="avatar h-27 w-27"
        />
        <div className="mx-6 flex-1">
          <p className="text-2xl font-bold">{channelInfo.name}</p>
          <div className="mt-3 flex">
            <div className="flex">
              <p className="font-bold headline">
                {channelInfo.videoCount || 0}
              </p>
              &nbsp;
              <p className="body font-semibold text-neutral-400">
                <FormattedMessage id="video" />
              </p>
            </div>
            <div className="mx-4 flex">
              <p className="font-bold headline">{followCount || 0}</p>
              &nbsp;
              <p className="body font-semibold text-neutral-400">
                <FormattedMessage id="follow" />
              </p>
            </div>
            <div className="flex">
              <p className="font-bold headline">{channelInfo.likeCount || 0}</p>
              &nbsp;
              <p className="body font-semibold text-neutral-400">
                <FormattedMessage id="favourites" />
              </p>
            </div>
          </div>
        </div>
        {isOwner ? (
          <MyLink
            href={{ pathname: ROUTES.account.channel }}
            className={'btn w-40'}
          >
            <Pen2Icon className="mr-2" />
            <FormattedMessage id={'editProfile'} />
          </MyLink>
        ) : (
          <>
            <button
              className={isFollow ? 'btn' : 'btn-container'}
              onClick={async () => {
                if (isLogin) {
                  if (isFollow) {
                    const confirm = await promptConfirmation({
                      warning: true,
                      centered: true,
                      title: (
                        <p className="font-bold title">
                          <FormattedMessage id="unFollowConfirm" />
                          <br />
                          {channelInfo?.name}?
                        </p>
                      ),

                      okText: intl.formatMessage({ id: 'unFollow' }),
                    })
                    if (confirm) {
                      follow(0)
                    }
                    close()
                  } else {
                    follow(1)
                  }
                } else {
                  dispatch(setOpenLoginDialog(true))
                }
              }}
              disabled={!channelInfo?.id}
            >
              {isFollow ? <CheckIcon className="mr-2" /> : null}
              <FormattedMessage id={isFollow ? 'following' : 'follow'} />
            </button>
            {isLogin && isFollow && (
              <button
                className="btn btn-small ml-1 h-10 w-10 shrink-0 px-2"
                disabled={!channelInfo?.id}
                onClick={() => {
                  follow(2, 1)
                }}
              >
                {/* <BellIcon /> */}
                <NotiOffIcon />
              </button>
            )}
          </>
        )}
      </div>
      <ScrollMenu className={`flex h-full w-full items-center`}>
        {TABS.map((item: any, index) => {
          return (
            <MyLink
              key={index}
              href={item.href}
              className={
                'mx-2 mt-1 flex flex-col ' +
                (pathname === item.href?.pathname
                  ? 'text-inherit'
                  : 'text-neutral-500')
              }
            >
              <div className="flex whitespace-nowrap font-semibold">
                {item.label && <FormattedMessage id={item.label} />}
              </div>
              <div
                className={
                  'mt-0.5 h-1 w-full rounded bg-primary ' +
                  (pathname === item.href?.pathname ? 'opacity-1' : 'opacity-0')
                }
              />
            </MyLink>
          )
        })}
      </ScrollMenu>
    </>
  )
}
