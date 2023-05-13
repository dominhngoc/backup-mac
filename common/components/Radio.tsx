import { RadioChecked, RadioEmpty } from '@public/icons'

interface Props {
  checked: boolean
  onChange?: (value: boolean) => void
  className?: string
}

const Radio = (props: Props) => {
  const { checked, className, onChange } = props
  return (
    <div
      className={'cursor-pointer ' + className}
      onClick={() => {
        onChange && onChange(!checked)
      }}
    >
      {checked ? (
        <RadioChecked className="text-primary" />
      ) : (
        <RadioEmpty className="text-neutral-500" />
      )}
    </div>
  )
}
export default Radio
