import Modal from '@common/components/Modal'
import { PlayListObject, some } from '@common/constants'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'

interface Props {
  formData?: PlayListObject
  mutate: () => void
  onClose: () => void
  onSubmit: (value: some) => void
}

export const UpdateFormBox = (props: Props) => {
  const { formData, mutate, onClose, onSubmit } = props
  const intl = useIntl()
  const { register, handleSubmit, reset, control } = useForm<{
    id?: number
    name: string
    mode?: string
  }>({ defaultValues: { mode: '1' } })

  useEffect(() => {
    reset({ id: formData?.id, name: formData?.name })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, formData])

  return (
    <form
      onSubmit={handleSubmit((value) => {
        onSubmit(value)
      })}
      className="flex w-full items-center"
    >
      <Controller
        name="name"
        control={control}
        rules={{
          required: intl.formatMessage({ id: 'required' }),
        }}
        render={({
          field: { name, onChange, ref, value = '' },
          fieldState: { error },
        }) => {
          return (
            <div className="flex-1">
              <input
                className="h-10 w-full border-b-[1px] border-white bg-transparent text-xl font-bold outline-none"
                name={name}
                onChange={onChange}
                ref={ref}
                value={value}
                placeholder={intl.formatMessage({ id: 'title' })}
                autoFocus
                maxLength={255}
                autoComplete="off"
              />
              <div className="flex items-center justify-between gap-2">
                <p className="mt-1 ml-2 text-xs text-red">
                  {error?.message}&nbsp;
                </p>
                <p className="caption2 text-neutral-400">
                  {value?.length || 0}/255
                </p>
              </div>
            </div>
          )
        }}
      />

      <button
        type="button"
        className="btn ml-10 mr-4 w-fit"
        onClick={() => onClose()}
      >
        <FormattedMessage id="cancel" />
      </button>
      <button className="btn-container w-24" type="submit">
        <FormattedMessage id="save" />
      </button>
    </form>
  )
}

export default UpdateFormBox
