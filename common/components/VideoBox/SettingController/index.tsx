import { PlaybackSpeedIcon, SettingIcon } from '@public/icons'
import { AppState } from '@redux/store'
import { useCallback, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import PlaybackQualityBox from './PlaybackQualityBox'
import PlaybackSpeedBox, { OPTIONS_PLAYBACK } from './PlaybackSpeedBox'

interface Props {
  qualityControlRef: any
}

export default function SettingController(props: Props) {
  const { qualityControlRef } = props
  const { metadata, quality } = useSelector(
    (state: AppState) => state.videoPlayer,
    shallowEqual
  )

  const [openSpeedControl, setOpenSpeedControl] = useState(false)
  const [openQualityControl, setOpenQualityControl] = useState(false)

  const isAutoQuality = useCallback(() => {
    for (var i = 0; i < qualityControlRef?.length; i++) {
      let qualityLevel = qualityControlRef[i]
      if (!qualityLevel.enabled) {
        return false
      }
    }
    return true
  }, [qualityControlRef])

  const OPTIONS = useMemo(() => {
    return [
      {
        icon: <SettingIcon />,
        label: (
          <span>
            <FormattedMessage id="quality" />
            {quality && (
              <span className="text-neutral-300">
                &nbsp;•&nbsp;
                {isAutoQuality() ? (
                  <>
                    <FormattedMessage id="autoQuality" /> ({quality}p)
                  </>
                ) : (
                  `${quality}p`
                )}
              </span>
            )}
          </span>
        ),
        onClick: () => setOpenQualityControl(true),
      },
      {
        icon: <PlaybackSpeedIcon />,
        label: (
          <span>
            <FormattedMessage id="playbackSpeed" />
            {metadata.playbackRate && (
              <span className="text-neutral-300">
                &nbsp;•&nbsp;
                {
                  OPTIONS_PLAYBACK.find(
                    (v) => v.value === metadata.playbackRate
                  )?.label
                }
              </span>
            )}
          </span>
        ),
        onClick: () => setOpenSpeedControl(true),
      },
    ]
  }, [isAutoQuality, metadata.playbackRate, quality])

  const settingContent = useMemo(() => {
    if (openSpeedControl || openQualityControl) {
      return null
    }
    return (
      <>
        {OPTIONS.map((item, index) => {
          return (
            <button
              key={index}
              className="flex w-full items-center py-3 px-4"
              onClick={() => {
                item.onClick && item.onClick()
              }}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </button>
          )
        })}
      </>
    )
  }, [OPTIONS, openQualityControl, openSpeedControl])

  return (
    <>
      <div
        className="qualityControl-video z-10 w-[283px] overflow-hidden rounded-lg bg-bg2 bg-opacity-80 backdrop-blur-[27px] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {settingContent}
        {openQualityControl && (
          <PlaybackQualityBox
            qualityControlRef={qualityControlRef}
            qualityMetaData={quality}
            onClose={() => setOpenQualityControl(false)}
            isAuto={isAutoQuality()}
          />
        )}
        {openSpeedControl && (
          <PlaybackSpeedBox
            playbackRate={metadata.playbackRate}
            onClose={() => setOpenSpeedControl(false)}
          />
        )}
      </div>
    </>
  )
}
