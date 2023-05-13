import { SquareEmptyIcon, SquareIcon } from '@public/icons'

interface Props {
  checked?: boolean
  onChange?: (value: boolean) => void
  className?: string
}

const Checkbox = (props: Props) => {
  const { checked, onChange, className } = props
  return (
    <button
      type="button"
      onClick={() => {
        onChange && onChange(!checked)
      }}
      className={className}
    >
      {checked ? (
        <SquareIcon className="text-primary" />
      ) : (
        <SquareEmptyIcon className="text-neutral-500" />
      )}
    </button>
  )
}
export default Checkbox
