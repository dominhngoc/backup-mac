import ProgressiveImg from '@common/components/ProgressiveImg'
import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { AddIcon, CheckIcon } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import { useCallback, useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWR from 'swr'
import { useIntersectionObserver } from 'usehooks-ts'
import MyLink from './MyLink'
interface Props {
  channelData?: some
  onlyButton?: boolean
  size?: 'small' | 'normal'
  noIcon?: boolean
  showNumberVideos?: boolean
  className?: string
  startIcon?: (isFollowed: boolean) => React.ReactNode
}

const FollowBox = (props: Props) => {
  const {
    channelData,
    onlyButton,
    size,
    noIcon,
    showNumberVideos,
    className = '',
    startIcon,
  } = props
  const ref = useRef<HTMLButtonElement | null>(null)
  const entry = useIntersectionObserver(ref, {})
  const isVisible = !!entry?.isIntersecting

  const { setMessage, dispatch, isLogin, confirmDialog, intl } =
    useGeneralHook()
  const { close, promptConfirmation } = confirmDialog

  const { data: listChannelFollowed, mutate } = useSWR(
    channelData && isLogin && isVisible
      ? API_PATHS.users.cache.get({
          filter: `FOLLOW_CHANNEL_${channelData?.id}`,
        })
      : null,
    async (url) => {
      if (isLogin) {
        const json = await dispatch(fetchThunk({ url, method: 'get' }))
        return json?.data?.data?.[0]?.contents
      }
    }
  )

  const follow = useCallback(
    async (status) => {
      try {
        const json = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.users.followChannel,
              method: 'post',
              data: {
                id: channelData?.id,
                status: status,
                notification_type: 2,
              },
            },
            true
          )
        )
        if (json.data?.data?.followCount) {
          mutate()
        }
        setMessage({ message: json.data?.message })
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channelData?.id, dispatch, mutate, setMessage]
  )

  const isFollow =
    listChannelFollowed?.length > 0
      ? listChannelFollowed?.findIndex(
          (v) => v.id === channelData?.id && v.status === 1
        ) !== -1
      : false

  if (!!onlyButton) {
    return (
      <>
        <button
          ref={ref}
          className={
            'btn w-fit shrink-0 gap-0 font-semibold ' +
            (isFollow ? 'btn ' : 'btn-container') +
            ' ' +
            (size === 'small' ? 'btn-small' : '') +
            ' ' +
            className
          }
          disabled={!channelData ? true : false}
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
                      {channelData?.name}?
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
        >
          {!noIcon && (
            <>
              {isFollow ? (
                <CheckIcon className="mr-2 scale-75" />
              ) : (
                <AddIcon className="mr-2 scale-75" />
              )}
            </>
          )}
          {startIcon && startIcon(isFollow)}
          <FormattedMessage id={isFollow ? 'following' : 'follow'} />
        </button>
      </>
    )
  }
  return (
    <div className={'mt-6 flex max-h-full items-center ' + className}>
      <MyLink
        href={{
          pathname: ROUTES.channel.detail,
          query: { id: channelData?.id },
        }}
        checkId
        className="h-12 w-12 shrink-0"
      >
        <ProgressiveImg
          src={channelData?.avatarImage}
          alt="avatarImage"
          className="avatar h-full w-full"
        />
      </MyLink>

      <div className="mx-2 flex-1">
        <MyLink
          href={{
            pathname: ROUTES.channel.detail,
            query: { id: channelData?.id },
          }}
          className={
            ' w-fit font-bold line-clamp-1 ' +
            (size === 'small' ? '' : 'headline')
          }
        >
          {channelData?.name}
        </MyLink>
        <p
          className={
            'mt-0.5 text-neutral-500 ' + (size === 'small' ? 'caption1' : '')
          }
        >
          {channelData?.followCount}&nbsp;
          <FormattedMessage id={'follower'} />
          {!!showNumberVideos && (
            <>
              &nbsp;•&nbsp;{channelData?.videoCount || 0}
              &nbsp;
              <span className="lowercase">
                <FormattedMessage id={'video'} />
              </span>
            </>
          )}
        </p>
        {/* -------------------------------------- chanel hashtag -------------------------------------- */}
      </div>
      <button
        ref={ref}
        className={
          'btn shrink-0 ' +
          (isFollow ? 'btn' : 'btn-container') +
          ' ' +
          (size === 'small' ? 'btn-small' : '')
        }
        disabled={!channelData ? true : false}
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
                    {channelData?.name}?
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
      >
        <FormattedMessage id={isFollow ? 'following' : 'follow'} />
      </button>
    </div>
  )
}

export default FollowBox
