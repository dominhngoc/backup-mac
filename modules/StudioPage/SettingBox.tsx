import Radio from '@common/components/Radio'
import { some } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import { EyeIcon, WrenchOutlineIcon } from '@public/icons'
import { copyToClipboard } from '@utility/helper'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import CensorDialog from './CensorDialog'

interface Props {
  data?: some
  onResetLiveToken: (mode) => void
}

const SettingBox = (props: Props) => {
  const { data, onResetLiveToken } = props
  const { intl, setMessage } = useGeneralHook()
  const [mode, setMode] = useState(data?.mode)
  const [type, setType] = useState('password')
  const [open, setOpen] = useState<boolean>(false)

  const onCopy = (value) => {
    copyToClipboard(value)
    setMessage({ message: intl.formatMessage({ id: 'copySuccess' }) })
  }

  return (
    <>
      <div className="mt-6 rounded-xl bg-bg2 p-8">
        <p className="font-bold title">
          <FormattedMessage id="settingLivesteam" />
        </p>
        <div className="mt-8 flex w-full flex-wrap items-start">
          <div className="mr-24 flex-[1.5]">
            <p className="font-bold headline">
              <FormattedMessage id="livesteamKey" />
            </p>
            {/*----------------*/}
            <div className="mt-6 flex items-end">
              <div className="w-80">
                <p className="ml-2 mb-2 font-bold uppercase text-neutral-300 caption2">
                  <FormattedMessage id="liveToken" />
                </p>
                <div className="relative">
                  <input
                    className="text-field pr-14"
                    autoComplete="off"
                    type={type}
                    value={data?.liveToken || ''}
                    readOnly
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      type="button"
                      className="p-2 text-neutral-400"
                      onMouseDown={() => {
                        setType('text')
                      }}
                      onMouseUp={() => {
                        setType('password')
                      }}
                    >
                      <EyeIcon />
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="btn mx-4"
                onClick={() => onResetLiveToken(mode)}
              >
                <FormattedMessage id="reset" />
              </button>
              <button className="btn" onClick={() => onCopy(data?.liveToken)}>
                <FormattedMessage id="copy" />
              </button>
            </div>
            {/*----------------*/}
            <div className="mt-6 flex items-end">
              <div className="w-80">
                <p className="ml-2 mb-2 font-bold uppercase text-neutral-300 caption2">
                  <FormattedMessage id="urlLive" />
                </p>
                <input
                  className="text-field"
                  autoComplete="off"
                  value={data?.liveSource || ''}
                  readOnly
                  disabled
                />
              </div>
              <button
                className="btn ml-4"
                onClick={() => onCopy(data?.liveSource)}
              >
                <FormattedMessage id="copy" />
              </button>
            </div>
            {/*----------------*/}
            <p className="mt-8 mb-6 font-bold headline">
              <FormattedMessage id="livesteamKey" />
            </p>
            <div>
              {['normal', 'low-latency', 'ultra-low-latency'].map((item) => {
                return (
                  <button
                    key={item}
                    className="flex items-center py-2 text-neutral-500"
                    onClick={() => setMode(item)}
                  >
                    <Radio checked={item === mode} className="mr-2" />
                    <FormattedMessage id={`modeStudio.${item}`} />
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex-1 pr-24 ">
            <p className="font-bold headline">
              <FormattedMessage id="extraSetting" />
            </p>
            <div className="mt-6 text-neutral-500">
              <div className="flex justify-between py-2">
                <FormattedMessage id="recordMode" />
                <label
                  className="relative ml-2 inline-flex cursor-pointer items-center"
                  onChange={(e) => {
                    // localStorage.setItem('AUTO_PLAY', !autoPlay + '')
                    // setAutoPlay(!autoPlay)
                  }}
                >
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={true}
                    autoComplete="off"
                    disabled
                  />
                  <div className="peer-focus:ring-blue-300 peer h-6 w-11 rounded-full bg-neutral-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
                </label>
              </div>
              {/*----------------*/}
              <div className="flex items-start justify-between py-2 text-neutral-500">
                <FormattedMessage id="replayMode" />
                <label
                  className="relative ml-2 inline-flex cursor-pointer items-center"
                  onChange={(e) => {
                    // localStorage.setItem('AUTO_PLAY', !autoPlay + '')
                    // setAutoPlay(!autoPlay)
                  }}
                >
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    // checked={autoPlay}
                    autoComplete="off"
                    disabled
                  />
                  <div className="peer-focus:ring-blue-300 peer h-6 w-11 rounded-full bg-neutral-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
                </label>
              </div>
              {/*----------------*/}
              <div className="flex items-start justify-between py-2 text-neutral-500">
                <FormattedMessage id="commentMode" />
                <label
                  className="relative ml-2 inline-flex cursor-pointer items-center"
                  onChange={(e) => {
                    // localStorage.setItem('AUTO_PLAY', !autoPlay + '')
                    // setAutoPlay(!autoPlay)
                  }}
                >
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={true}
                    autoComplete="off"
                    disabled
                  />
                  <div className="peer-focus:ring-blue-300 peer h-6 w-11 rounded-full bg-neutral-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
                </label>
              </div>
              {/*----------------*/}
              <button className="btn mt-6 w-full" onClick={() => setOpen(true)}>
                <WrenchOutlineIcon className="mr-2" />
                <FormattedMessage id="addModerators" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <CensorDialog
        open={open}
        onClose={() => setOpen(false)}
        fomrData={data}
      />
    </>
  )
}

export default SettingBox
