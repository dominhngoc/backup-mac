import { some } from '@common/constants'
import { CheckIcon, ClockIcon, CloseCircleIcon } from '@public/icons'
import { FormattedMessage } from 'react-intl'

interface Props {
  dataUser?: some
}
export default function AcceptBox(props: Props) {
  const { dataUser } = props

  const AcceptStatus = () => (
    <div
      className="flex h-full w-full items-center rounded-lg px-2 font-semibold"
      style={{ background: 'rgba(85, 237, 219, 0.16)', color: '#D21F3C' }}
    >
      <CheckIcon className="mr-2 scale-75" />
      <FormattedMessage id="accepted" />
    </div>
  )

  const WaitingStatus = () => (
    <div
      className="flex h-full w-full items-center rounded-lg px-2 font-semibold"
      style={{ background: 'rgba(255, 209, 48, 0.16)', color: '#FFD130' }}
    >
      <ClockIcon className="mr-2 scale-75" />
      <FormattedMessage id="waiting" />
    </div>
  )

  const RejectStatus = () => (
    <div
      className="flex h-full w-full items-center rounded-lg px-2 font-semibold"
      style={{ background: 'rgba(255, 59, 48, 0.16)', color: '#FF3B30' }}
    >
      <CloseCircleIcon className="mr-2 scale-75" />
      <FormattedMessage id="deny" />
    </div>
  )

  return (
    <div className="flex w-fit flex-col gap-3 rounded-xl bg-bg2 py-3">
      <div className="flex items-center justify-between">
        <div className="mr-6 font-semibold text-neutral-500">
          <FormattedMessage id="requestUpdate" />
        </div>
        <div className="h-8 w-32">
          {dataUser?.status === 0 ? (
            <WaitingStatus />
          ) : dataUser?.status === 1 ? (
            <AcceptStatus />
          ) : dataUser?.status === 2 ? (
            <RejectStatus />
          ) : null}
        </div>
      </div>
      {dataUser?.status === 2 && (
        <div className="caption2 ">
          <FormattedMessage id="reason" />: {dataUser?.reason}
        </div>
      )}
    </div>
  )
}
