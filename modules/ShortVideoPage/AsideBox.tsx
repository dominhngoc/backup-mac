import FollowBox from '@common/components/FollowBox'
import MyLink from '@common/components/MyLink'
import { some } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import { FireIcon, FireWhiteIcon, UsersIcon } from '@public/icons'
import { changeKey } from '@redux/commonReducer'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { ROUTES } from '@utility/constant'
import { memo } from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  listChannelSSR: some[]
  listHashtagSSR: some[]
  defaultParams?: string
}

const AsideBox = (props: Props) => {
  const { listChannelSSR, listHashtagSSR, defaultParams } = props
  const { router, dispatch } = useGeneralHook()
  const { param = defaultParams, hashtag } = router.query

  return (
    <div className="sticky top-24 z-10 box-border flex w-[356px] flex-col overflow-hidden h-screen-head">
      <div>
        {param === 'HOT' ? (
          <button
            className={
              'flex w-full items-center p-4 ' +
              (param === 'HOT'
                ? 'rounded-lg bg-bg2 text-white'
                : 'text-neutral-500 ')
            }
            onClick={() => dispatch(changeKey())}
          >
            <FireIcon />
            <p className="ml-2 font-bold title">
              <FormattedMessage id="forYou" />
            </p>
          </button>
        ) : (
          <MyLink
            href={{ pathname: ROUTES.shorts.index, query: { param: 'HOT' } }}
            className={
              'flex items-center p-4 ' +
              (param === 'HOT'
                ? 'rounded-lg bg-bg2 text-white'
                : 'text-neutral-500 ')
            }
          >
            <FireWhiteIcon />
            <p className="ml-2 font-bold title">
              <FormattedMessage id="forYou" />
            </p>
          </MyLink>
        )}
        <>
          {param === 'RECOMMEND_FOLLOW' ? (
            <button
              className={
                'flex w-full items-center p-4 ' +
                (param === 'RECOMMEND_FOLLOW'
                  ? 'rounded-lg bg-bg2 text-white'
                  : 'text-neutral-500 ')
              }
              onClick={() => dispatch(changeKey())}
            >
              <UsersIcon className={'tetext-neutral-500'} />
              <p className="ml-2 font-bold title">
                <FormattedMessage id="follow" />
              </p>
            </button>
          ) : (
            <MyLink
              href={{
                pathname: ROUTES.shorts.index,
                query: { param: 'RECOMMEND_FOLLOW' },
              }}
              className={
                'flex items-center p-4 ' +
                (param === 'RECOMMEND_FOLLOW'
                  ? 'rounded-lg bg-bg2 text-white'
                  : 'text-neutral-500 ')
              }
            >
              <UsersIcon className={'text-white'} />
              <p className="ml-2 font-bold title">
                <FormattedMessage id="follow" />
              </p>
            </MyLink>
          )}
        </>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden px-3">
        {listHashtagSSR.length > 0 && (
          <>
            <p className={'mt-4 mb-4 font-bold title 2xl:mt-10'}>
              <FormattedMessage id="explorer" />
            </p>
            <div className="max-h-[200px] shrink-0 overflow-hidden">
              <div className="flex flex-wrap">
                {listHashtagSSR?.map((val) => (
                  <MyLink
                    href={{
                      pathname: ROUTES.shorts.hashtags,
                      query: {
                        hashtag: val?.hashtag,
                      },
                    }}
                    key={val?.hashtag}
                    className={
                      'mr-3 mb-2 w-fit max-w-[230px] overflow-hidden break-all rounded-full bg-bg2 px-3 py-1.5 opacity-80 ' +
                      (hashtag === val?.hashtag ? 'bg-neutral-200' : '')
                    }
                  >
                    <p className="headline line-clamp-1">#{val?.hashtag}</p>
                  </MyLink>
                ))}
              </div>
            </div>
          </>
        )}
        {listChannelSSR?.length > 0 && (
          <>
            <p className="mt-4 mb-2 font-bold title 2xl:mt-10">
              <FormattedMessage id="channel" />
            </p>
            <div className="pb-4">
              {listChannelSSR?.slice(0, 5)?.map((channelData) => (
                <FollowBox
                  className="mt-4"
                  size="small"
                  key={channelData?.id}
                  channelData={channelData}
                  showNumberVideos
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
export default memo(AsideBox, () => false)
