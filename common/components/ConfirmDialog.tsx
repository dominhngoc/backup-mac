import Modal from '@common/components/Modal'
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { FormattedMessage } from 'react-intl'

interface Params {
  title?: React.ReactNode
  message?: React.ReactNode
  cancelText?: string
  okText?: string
  open?: boolean
  centered?: boolean
  warning?: boolean
  className?: string
  close?: () => void
  onOK?: () => void
  onCancel?: () => void
}

export interface ConfirmDialogParams {
  promptConfirmation: (setting?: Params) => Promise<unknown>
  close: () => void
  open: boolean
}

interface Props extends Params {}
const ConfirmDialog = forwardRef((props: Props, ref) => {
  const { onCancel, onOK, open, close: onCloseProps } = props
  const [settings, setOptions] = useState<Props>(props)
  const [confirmDialogResolveRef, setConfirmDialogResolveRef] = useState<
    | {
        resolve?: (confirm: boolean) => void //Đố biết sao phải để trong Object
      }
    | undefined
  >()
  const {
    title,
    warning,
    message,
    cancelText,
    okText,
    centered,
    className = '',
  } = settings

  const promptConfirmation = useCallback(
    async (setting?: Omit<Props, 'children'>) => {
      setting && setOptions((old) => setting)
      const confirmTmp = await new Promise((resolve) => {
        setConfirmDialogResolveRef({ resolve })
      })
      return confirmTmp
    },
    []
  )

  const close = useCallback(() => {
    setConfirmDialogResolveRef(undefined)
  }, [])

  const params: ConfirmDialogParams = useMemo(
    () => ({
      promptConfirmation,
      close,
      open: confirmDialogResolveRef?.resolve !== undefined,
    }),
    [promptConfirmation, close, confirmDialogResolveRef?.resolve]
  )

  const onClose = useCallback(() => {
    confirmDialogResolveRef?.resolve && confirmDialogResolveRef?.resolve(false)
    onCloseProps && onCloseProps()
    onCancel && onCancel()
  }, [confirmDialogResolveRef, onCancel, onCloseProps])

  const onAccept = useCallback(() => {
    confirmDialogResolveRef?.resolve && confirmDialogResolveRef?.resolve(true)
    onCloseProps && onCloseProps()
    onOK && onOK()
  }, [confirmDialogResolveRef, onCloseProps, onOK])

  useImperativeHandle(ref, () => params)

  const openDialog = confirmDialogResolveRef?.resolve !== undefined || !!open

  if (centered) {
    return (
      <>
        <Modal open={openDialog} onClose={onClose}>
          <div className={'flex flex-col px-7 py-8  ' + className}>
            <div className="flex-1 text-center">
              {title && <p className="font-bold title">{title}</p>}
              {message && <p className="mt-6 text-neutral-500">{message}</p>}
            </div>
            <div
              className={
                'flex justify-center ' + (!!message ? 'mt-8' : 'mt-14')
              }
            >
              <button
                className="btn mr-4 min-w-[136px]"
                onClick={() => onClose()}
              >
                <FormattedMessage id={cancelText || 'cancel'} />
              </button>
              <button
                className={
                  'btn btn-container min-w-[136px] ' +
                  (warning ? 'bg-primary' : '')
                }
                onClick={onAccept}
              >
                <FormattedMessage id={okText || 'ok'} />
              </button>
            </div>
          </div>
        </Modal>
      </>
    )
  }
  return (
    <>
      <Modal open={openDialog} onClose={onClose}>
        <div className={'flex w-[480px] flex-col p-8 pb-5 ' + className}>
          <div className="flex-1">
            {title && <p className="font-bold title">{title}</p>}
            {message && <p className="mt-6 text-neutral-500">{message}</p>}
          </div>
          <div
            className={'flex justify-end ' + (!!message ? 'mt-10 ' : 'mt-20')}
          >
            <button
              className="btn mr-4 min-w-[143px]"
              onClick={() => onClose()}
            >
              <FormattedMessage id={cancelText || 'cancel'} />
            </button>
            <button
              className={
                'btn btn-container min-w-[164px] ' +
                (warning ? 'bg-primary' : '')
              }
              onClick={onAccept}
            >
              <FormattedMessage id={okText || 'ok'} />
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
})

export default ConfirmDialog
