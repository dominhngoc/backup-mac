import { ListEmptyIcon } from '@public/icons'
import { FormattedMessage } from 'react-intl'

interface Props {
  className?: string
  children?: any
  message?: string
}
const NoDataFound = (props: Props) => {
  const { className = '', children, message } = props
  return (
    <div
      className={
        'mt-12 mb-20 flex w-full flex-col items-center justify-center ' + className
      }
    >
      <ListEmptyIcon />
      {!children && (
        <p className="headline mt-3 font-bold">
          <FormattedMessage id={message || 'notFoundData'} />
        </p>
      )}
      {children}
    </div>
  )
}
export default NoDataFound
