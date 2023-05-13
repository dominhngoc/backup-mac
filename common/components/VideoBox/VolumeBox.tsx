import { MuteIcon, Volume1Icon, Volume2Icon, Volume3Icon } from '@public/icons'

interface Props {
  value: number
  onChange: (value: number) => void
}
const VolumeBox = (props: Props) => {
  const { value, onChange } = props

  const RATE = [
    {
      value: 0,
      icon: <MuteIcon />,
    },
    {
      value: 0.3,
      icon: <Volume1Icon />,
    },
    {
      value: 0.6,
      icon: <Volume2Icon />,
    },
    {
      value: 1,
      icon: <Volume3Icon />,
    },
  ]

  return (
    <>
      <div className="relative flex items-center px-3">
        <button
          onClick={() => {
            if (value === 0) {
              onChange(0.6)
            } else {
              onChange(0)
            }
          }}
        >
          {RATE.find((v) => v.value >= value)?.icon}
        </button>
        <input
          type="range"
          value={value}
          min={0}
          max={1}
          step={0.1}
          onChange={(e) => onChange(Number(e.target.value || 0))}
          className="mx-2 h-0.5 w-12 cursor-pointer appearance-none bg-white"
        />
      </div>
    </>
  )
}
export default VolumeBox
