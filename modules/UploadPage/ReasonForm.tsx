import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { setInfoUserUpload } from '@redux/uploadReducer'
import { API_PATHS } from '@utility/API_PATH'
import { DATE_FORMAT } from '@utility/moment'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useCountdown } from 'usehooks-ts'
import SignUpToReceiveMoney from './SignUpToReceiveMoney'

interface Props {}

const FormRegister = (props: Props) => {
  const {} = props
  const { dispatch, setMessage, intl } = useGeneralHook()
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    countStop: 0,
  })

  const { handleSubmit, control } = useForm<{
    reason: string
  }>({
    defaultValues: {
      reason: '',
    },
    reValidateMode: 'onChange',
  })

  const onSubmit = async (value) => {
    try {
      const json = await dispatch(
        fetchThunk(
          {
            url: API_PATHS.users.getInfomation,
            method: 'POST',
            data: {
              ...value,
              id_card_created_at:
                value.id_card_created_at &&
                moment(value.id_card_created_at).format(DATE_FORMAT),
            },
          },
          true
        )
      )
      setMessage({ message: json.data?.message })
      dispatch(setInfoUserUpload(undefined))
    } catch (error: any) {
      setMessage({ message: error.response?.data?.message })
    }
  }

  return (
    <>
      <div className="mt-6 flex">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col rounded-xl bg-bg2 p-8 "
          style={{ userSelect: 'none' }}
          autoComplete="off"
        >
          <p className="text-xl font-bold">
            <FormattedMessage id="confirmPersonalInfo" />
          </p>
          <p className="mt-6 mb-8 italic text-secondary caption2">
            <FormattedMessage id="confirmPersonalInfoNote" />
          </p>
          <Controller
            control={control}
            name="reason"
            rules={{ required: true, validate: (value) => !!value?.trim() }}
            render={({
              field: { value, ref, onChange },
              fieldState: { invalid },
            }) => {
              return (
                <div className="relative mb-4">
                  <input
                    className={
                      'text-field rounded-xl px-4 ' +
                      (invalid ? 'error-field' : '')
                    }
                    autoComplete="off"
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    placeholder={intl.formatMessage({ id: 'fullName' })}
                  />
                </div>
              )
            }}
          />
          <div className="mt-12 flex justify-end">
            <button
              className="btn h-10 w-32"
              onClick={() => {
                dispatch(setInfoUserUpload(undefined))
              }}
            >
              <FormattedMessage id="deny" />
            </button>
            <button type="submit" className="btn-container ml-4 w-32">
              <FormattedMessage id="accept" />
            </button>
          </div>
        </form>
        <SignUpToReceiveMoney />
      </div>
    </>
  )
}

export default FormRegister
