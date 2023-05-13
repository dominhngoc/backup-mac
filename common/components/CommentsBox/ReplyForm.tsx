import { some } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'

export interface IComment {
  comment: string
}

interface Props {
  formData?: some
  onSubmit: (value: some, setLoading: any) => void
  onClose: (value: boolean) => void
}

const ReplyForm = (props: Props) => {
  const { onSubmit, onClose } = props
  const { dispatch, isLogin, intl } = useGeneralHook()
  const [loading, setLoading] = useState(false)
  const methods = useForm<IComment>()

  const { handleSubmit, control } = methods

  return (
    <form
      className="mb-1 w-auto xl:w-105"
      onSubmit={handleSubmit((value) => onSubmit(value, setLoading))}
    >
      <Controller
        name="comment"
        control={control}
        rules={{
          required: true,
          validate: (value) => !!value?.trim(),
        }}
        render={({
          field: { name, onBlur, onChange, ref, value = '' },
          fieldState: { invalid },
        }) => {
          return (
            <div className="flex w-full flex-col">
              <input
                className={
                  'text-field small-field w-auto ' +
                  (invalid ? 'error-field' : '')
                }
                name={name}
                ref={ref}
                autoComplete="off"
                onBlur={onBlur}
                autoFocus
                onFocus={() => {
                  if (!isLogin) {
                    dispatch(setOpenLoginDialog(true))
                  }
                }}
                onChange={onChange}
                value={value}
                placeholder={
                  intl.formatMessage({
                    id: 'enterFeedback',
                  }) + '...'
                }
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => onClose(false)}
                  className="btn mr-3 h-8 text-sm font-semibold"
                >
                  <FormattedMessage id="cancel" />
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-container h-8 whitespace-nowrap text-sm"
                >
                  <FormattedMessage id="feedback" />
                </button>
              </div>
            </div>
          )
        }}
      />
    </form>
  )
}

export default ReplyForm
