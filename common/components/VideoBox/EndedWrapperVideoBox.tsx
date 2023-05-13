import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { VideoObject } from '@common/constants'
import { ROUTES } from '@utility/constant'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCountdown } from 'usehooks-ts'
import { AUTO_PLAY } from '../../../modules/VideoDetailPage/constants'

interface Props {
  listVideo: VideoObject[]
}
const EndedWrapperVideoBox = (props: Props) => {
  const { listVideo } = props

  const { push } = useRouter()
  const nextVideo = listVideo[0]
  const [openAutoPlay, setOpenAuto] = useState(
    localStorage.getItem(AUTO_PLAY) === 'true' && nextVideo
  )
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 7,
    })

  useEffect(() => {
    if (!openAutoPlay) {
      resetCountdown()
    } else {
      startCountdown()
    }
  }, [openAutoPlay, resetCountdown, startCountdown])

  useEffect(() => {
    if (count === 0) {
      push({
        query: {
          id: nextVideo?.id,
          slug: nextVideo?.slug,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  if (openAutoPlay) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black pb-16">
        <div className="w-89">
          <p className="text-neutral-400">
            <FormattedMessage id="forwardIn" />
            &nbsp;<span className="text-white">{count}</span>
          </p>
          <MyLink
            href={{
              query: {
                id: nextVideo?.id,
                slug: nextVideo?.slug,
              },
            }}
          >
            <ProgressiveImg
              src={nextVideo?.coverImage}
              alt="coverImage"
              className="mt-2 h-50 w-full shrink-0 rounded-md"
              shape="rect_w"
            />
          </MyLink>
          <div className="flex p-3">
            <MyLink
              href={{
                pathname: ROUTES.channel.detail,
                query: { id: nextVideo?.channel?.id },
              }}
              className={'avatar mr-3 h-8 w-8 object-cover'}
            >
              <ProgressiveImg
                src={nextVideo?.channel?.avatarImage}
                isAvatar
                className="avatar h-8 w-8 object-cover"
              />
            </MyLink>
            <div className="flex-1">
              <MyLink
                className="break-words font-bold headline line-clamp-2"
                href={{
                  query: {
                    id: nextVideo?.id,
                    slug: nextVideo?.slug,
                  },
                }}
              >
                {nextVideo?.name}
              </MyLink>
              <div className="text-neutral-500">
                <MyLink
                  href={{
                    pathname: ROUTES.channel.detail,
                    query: { id: nextVideo?.channel?.id },
                  }}
                  className="my-1 caption1"
                >
                  {nextVideo?.channel?.name && <>{nextVideo?.channel.name}</>}
                </MyLink>
                <br />
              </div>
            </div>
          </div>
          <div className="flex px-6 py-2">
            <button
              className="btn w-full"
              onClick={() => {
                setOpenAuto(false)
                stopCountdown()
              }}
            >
              <FormattedMessage id="cancel" />
            </button>
            <MyLink
              href={{
                query: {
                  id: nextVideo?.id,
                  slug: nextVideo?.slug,
                },
              }}
              className="btn-container ml-4 w-full whitespace-nowrap"
            >
              <FormattedMessage id="playNow" />
            </MyLink>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-10 bg-black p-6 pb-24">
      <div className="-mt-1 -ml-1 grid grid-cols-3 items-center justify-center xl:grid-cols-4">
        {listVideo.slice(0, 12).map((item) => {
          return (
            <MyLink
              href={{
                query: {
                  id: item?.id,
                  slug: item?.slug,
                },
              }}
              key={item.id}
              className="relative rounded-md pt-1 pl-1 [&>div]:hover:opacity-100"
            >
              <ProgressiveImg
                src={item?.coverImage}
                alt="coverImage"
                className="h-36 w-full shrink-0 rounded-md object-cover"
                shape="rect_w"
              />
              <div
                className="absolute inset-0 p-2 opacity-0 transition-all"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.648) 62.38%, rgba(0, 0, 0, 0) 100%), url(image.png)',
                }}
              >
                <p className="font-semibold caption1">{item.name}</p>
                <p className="my-1 font-semibold text-neutral-500 caption2">
                  {item.channel?.name && <>{item.channel.name}</>}
                </p>
                <p className="font-semibold  text-neutral-500 caption2">
                  {item.playTimes}&nbsp;
                  <FormattedMessage id="viewNumber" />
                  &nbsp;•&nbsp;{item.publishedTime}
                </p>
              </div>
            </MyLink>
          )
        })}
      </div>
    </div>
  )
}
export default EndedWrapperVideoBox
