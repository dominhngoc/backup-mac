import { PhoneIcon } from '@public/icons'
import { FormattedMessage } from 'react-intl'

interface Props {
  className?: string
}
const EmptyNotiBox = (props: Props) => {
  const { className = '' } = props
  return (
    <div
      className={
        'flex h-96 w-full flex-col items-center justify-center ' + className
      }
    >
      <PhoneIcon />
      <p className="headline mt-8 font-bold">
        <FormattedMessage id={'noNoti'} />
      </p>
      <p className="mt-2 w-3/5 text-center text-neutral-500">
        <FormattedMessage id={'notiNote'} />
      </p>
    </div>
  )
}
export default EmptyNotiBox
