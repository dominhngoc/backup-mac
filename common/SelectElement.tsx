import { ChevronDownIcon } from '@public/icons'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { usePopper } from 'react-popper'

export interface Option {
  value: any
  label: string
}
interface Props {
  value?: string | number
  options?: Option[]
  onChange?: (value: Option) => void
  placeholder?: any
  rootId?: string
  rawOption?: boolean
}

const SelectElement = forwardRef((props: Props, ref: any) => {
  const { value, options, placeholder, onChange, rootId, rawOption } = props
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const refRoot = useRef<any>(null)
  const [referenceElement, setReferenceElement] = useState<any>(null)
  const [popperElement, setPopperElement] = useState<any>(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
    ...options,
  })

  const labelValue = options?.find((v) => v.value === value)?.label

  useEffect(() => {
    refRoot.current = rootId
      ? document.getElementById(rootId)
      : document.getElementById('append-root')
  }, [rootId])

  const handleClickOutside = useCallback(
    (event: any) => {
      if (
        popperElement &&
        !popperElement.contains(event.target) &&
        !referenceElement.contains(event.target)
      ) {
        setOpen(false)
      }
    },
    [popperElement, referenceElement, setOpen]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside])

  return (
    <>
      <div ref={refRoot} className="relative w-full">
        <div className="relative" ref={setReferenceElement}>
          <input
            ref={ref}
            onFocus={() => {
              setOpen(!open)
            }}
            placeholder={placeholder}
            className={'text-field pr-10'}
            value={
              rawOption
                ? labelValue
                : labelValue && intl.formatMessage({ id: labelValue })
            }
            readOnly
          />
          <div
            className={
              'absolute right-2 top-2 origin-center text-neutral-400 transition-all ' +
              (open ? 'rotate-180' : 'rotate-0')
            }
          >
            <ChevronDownIcon />
          </div>
        </div>
        {open &&
          createPortal(
            <div
              ref={setPopperElement}
              style={{
                ...styles.popper,
                width: referenceElement?.getBoundingClientRect().width,
              }}
              {...attributes.popper}
              className={
                'z-max mt-2 max-h-[400px] overflow-auto rounded-lg border border-neutral-100 bg-bg2 shadow-sm '
              }
            >
              {options?.map((item, index) => {
                return (
                  <div
                    key={item.value}
                    tabIndex={index}
                    className={
                      'subtitle1 cursor-pointer py-4 px-6 ' +
                      (index ? 'border-t-[0.5px] border-neutral-100 ' : '') +
                      (item.value === value ? 'bg-neutral-100' : 'bg-bg2')
                    }
                    onClick={() => {
                      onChange && onChange(item.value)
                      setOpen(false)
                    }}
                  >
                    {rawOption
                      ? item.label
                      : item.label && <FormattedMessage id={item.label} />}
                  </div>
                )
              })}
            </div>,
            refRoot.current
          )}
      </div>
    </>
  )
})
export default SelectElement
