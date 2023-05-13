import { VolumeFillIcon, VolumeFillMuteIcon } from '@public/icons'
import { useState } from 'react'

interface Props {
  mute: boolean
  onChange: (value: boolean) => void
}
const VolumeBox = (props: Props) => {
  const { mute, onChange } = props

  const [_mute, setMute] = useState(mute)

  const handleOnClick = (e) => {
    onChange?.(!mute)
    setMute(!_mute)
  }

  return (
    <>
      <button
        // className="absolute top-6 right-6 flex h-12 w-12  items-center  justify-center rounded-full bg-neutral-100 bg-opacity-30"
        // className="flex h-12 w-12  items-center  justify-center rounded-full bg-neutral-100 bg-opacity-30"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white bg-opacity-10 disabled:text-neutral-200"
        onClick={handleOnClick}
      >
        {mute ? <VolumeFillMuteIcon /> : <VolumeFillIcon />}
      </button>
    </>
  )
}
export default VolumeBox
