import ProgressiveImg from '@common/components/ProgressiveImg'
import { some } from '@common/constants'
import { removeMotion } from '@redux/liveReducer'
import { AppState } from '@redux/store'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

interface Props {
  onSendEmotion: (value: some) => void
}

const MotionChooseBox = (props: Props) => {
  const { onSendEmotion } = props
  const dispatch = useDispatch()
  const motionData = useSelector(
    (state: AppState) => state.common.chatAccess.motion,
    shallowEqual
  )

  const { queueMotion } = useSelector(
    (state: AppState) => state.live,
    shallowEqual
  )

  return (
    <div className="flex shrink-0 flex-nowrap">
      {/* {(motionData || [])
        ?.reduce((v: any, c) => [...v, ...c.liveAssetChilds], [])
        ?.map((item) => {
          return (
            <button
              key={item.id}
              className="rounded-full bg-neutral-100 p-1"
              onClick={() => {
                onSendEmotion(item)
              }}
            >
              <ProgressiveImg src={item.image} className="h-6 w-6 shrink-0" />
            </button>
          )
        })} */}
      {queueMotion.map((item) => {
        const motionSrc = motionData
          ?.reduce((v: any, c) => {
            return [...v, ...c.liveAssetChilds]
          }, [])
          ?.find((v) => v.id === item.msg)?.image

        return (
          <div
            key={item.id}
            onAnimationEnd={() => dispatch(removeMotion(item.id))}
            className="animate-bubble-like icon-fly pointer-events-none absolute mr-3 h-6 w-6"
            style={{
              right: Number(item.position) * 1.5,
            }}
          >
            <ProgressiveImg
              src={motionSrc}
              className="h-full w-full shrink-0"
            />
          </div>
        )
      })}
    </div>
  )
}

export default MotionChooseBox
