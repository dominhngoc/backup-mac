import MyLink from '@common/components/MyLink'
import PlaylistOptions from '@common/components/PlaylistOptions'
import Popper from '@common/components/Popper'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { PlayListObject } from '@common/constants'
import { MoreIcon, PlayListIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  data: PlayListObject
  mutate: () => void
  isOwner: boolean
}
export const PlaylistCardSkeleton = () => {
  return (
    <div>
      <div className="gap relative flex animate-pulse flex-row">
        <div className="h-[196px] w-full bg-bg2" />
        <div className="absolute top-0 right-0 flex h-full w-36 flex-col items-center justify-center gap-3 bg-black bg-opacity-70">
          <div className="mb-10 h-2.5 w-1/4 rounded bg-neutral-100" />
          <PlayListIcon />
        </div>
      </div>
      <div className="flex w-full">
        <div className="flex-1 p-3">
          <div className="flex-1">
            <div className="h-4 w-1/2 rounded bg-neutral-100" />
            <div className="mt-1 h-4 w-1/4 rounded bg-neutral-100" />
          </div>
        </div>
      </div>
    </div>
  )
}
export default function PlayListsCard(props: Props) {
  const { data, isOwner, mutate } = props
  const [openPopper, setOpenPopper] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <MyLink
        href={{
          pathname: ROUTES.playlist.detail,
          query: {
            id: data.id,
          },
        }}
        className="relative w-full flex-1"
      >
        <ProgressiveImg
          shape="rect_w"
          src={data?.coverImage}
          className="h-[196px] w-full object-cover"
        />
        <div className="absolute top-0 right-0 flex h-full w-36 flex-col items-center justify-center gap-3 bg-black bg-opacity-70">
          <span className="mb-10">{data?.numVideo}</span>
          <PlayListIcon />
        </div>
      </MyLink>
      <div className="flex">
        <MyLink
          href={{
            pathname: ROUTES.playlist.detail,
            query: {
              id: data.id,
            },
          }}
          className="w-full p-3"
          style={{
            maxWidth: 'calc(100% - 48px)',
          }}
        >
          <p className="headline break-words font-bold line-clamp-1">
            {data.name}
          </p>
          <div className="caption1 mt-1 flex flex-1 gap-1 text-neutral-500">
            {data?.numVideo}&nbsp;
            <FormattedMessage id={data?.numVideo > 1 ? 'videos' : 'video'} />
          </div>
        </MyLink>
        {isOwner && (
          <Popper
            open={openPopper}
            className="h-fit p-3"
            wrapper={<MoreIcon className="scale-125" />}
            setOpen={setOpenPopper}
            classNamePaper="w-72"
          >
            <PlaylistOptions data={data} mutate={mutate} />
          </Popper>
        )}
      </div>
    </div>
  )
}
