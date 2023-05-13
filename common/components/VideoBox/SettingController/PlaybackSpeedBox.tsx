import { CheckIcon, LeftArrowIcon } from '@public/icons'
import { AppState } from '@redux/store'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
export const PLAYBACK_RATE = 'PLAYBACK_RATE'
export const OPTIONS_PLAYBACK = [
  {
    label: '0.25x',
    value: 0.25,
  },
  {
    label: '0.5x',
    value: 0.5,
  },
  {
    label: '0.75x',
    value: 0.75,
  },
  {
    label: <FormattedMessage id="normal" />,
    value: 1,
  },
  {
    label: '1.25x',
    value: 1.25,
  },
  {
    label: '1.5x',
    value: 1.5,
  },
  {
    label: '1.75x',
    value: 1.75,
  },
  {
    label: '2x',
    value: 2,
  },
]
interface Props {
  onClose: () => void
  playbackRate: number
}

export default function PlaybackSpeedBox(props: Props) {
  const { playbackRate, onClose } = props
  const player = useSelector(
    (state: AppState) => state.videoPlayer.player,
    shallowEqual
  )
  return (
    <>
      <button
        className="flex w-full items-center border-b border-neutral-200 py-4 px-4 "
        onClick={onClose}
      >
        <LeftArrowIcon className={'hidden md:block'} />
        <span className="headline  ml-3 text-sm font-semibold">
          <FormattedMessage id="playbackSpeed" />
        </span>
      </button>
      {OPTIONS_PLAYBACK.map((item, index) => {
        return (
          <button
            key={index}
            className={
              'flex h-12 w-full items-center py-3 px-4  text-sm' +
              (playbackRate === item.value ? 'text-primary' : '')
            }
            onClick={() => {
              player.playbackRate(item.value)
              localStorage.setItem(PLAYBACK_RATE, item.value.toString())
              onClose()
            }}
          >
            {playbackRate === item.value ? (
              <CheckIcon />
            ) : (
              <div className="w-6 " />
            )}
            <span className="ml-3">{item.label}</span>
          </button>
        )
      })}
    </>
  )
}
