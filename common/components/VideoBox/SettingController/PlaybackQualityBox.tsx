import { CheckIcon, LeftArrowIcon } from '@public/icons'
import { FormattedMessage } from 'react-intl'
export const QUALITY_LEVEL = 'QUALITY_LEVEL'

interface Props {
  qualityControlRef: any
  onClose: () => void
  qualityMetaData?: number
  isAuto?: boolean
}

export default function PlaybackQualityBox(props: Props) {
  const { qualityMetaData, qualityControlRef, isAuto, onClose } = props
  return (
    <>
      <button
        className={
          'flex w-full items-center border-b border-neutral-200 py-4 px-4 '
        }
        onClick={onClose}
      >
        <LeftArrowIcon className={'hidden md:block'} />
        <span className="headline  ml-3 text-sm font-semibold">
          <FormattedMessage id="playbackQuality" />
        </span>
      </button>

      {qualityControlRef?.levels_?.map((item) => {
        return (
          <button
            key={item.id}
            className={
              'flex h-12 w-full items-center py-3 px-4  text-sm' +
              (!isAuto && qualityMetaData === item.height ? 'text-primary' : '')
            }
            onClick={() => {
              for (var i = 0; i < qualityControlRef.length; i++) {
                let qualityLevel = qualityControlRef[i]
                if (qualityLevel.id === item.id) {
                  qualityLevel.enabled = true
                  localStorage.setItem(QUALITY_LEVEL, item.id.toString())
                } else {
                  qualityLevel.enabled = false
                }
              }
              onClose()
            }}
          >
            {!isAuto && qualityMetaData === item.height ? (
              <CheckIcon />
            ) : (
              <div className="w-6" />
            )}
            <span className="ml-3">{item.height}p</span>
          </button>
        )
      })}
      <button
        className={
          'flex h-12 w-full items-center py-3 px-4  text-sm' +
          (isAuto ? 'text-primary' : '')
        }
        onClick={() => {
          for (var i = 0; i < qualityControlRef.length; i++) {
            let qualityLevel = qualityControlRef[i]
            localStorage.setItem(QUALITY_LEVEL, '')
            qualityLevel.enabled = true
          }
          onClose
        }}
      >
        {isAuto ? <CheckIcon /> : <div className="w-6" />}
        <p className="ml-3">
          <FormattedMessage id="autoQuality" />
        </p>
      </button>
      <div className="divider" />
    </>
  )
}
