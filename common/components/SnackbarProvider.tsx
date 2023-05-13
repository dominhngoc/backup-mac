import { CheckIcon } from '@public/icons'
import { remove } from '@redux/snackbarReducer'
import { AppState } from '@redux/store'
import { useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
const DURATION = 3000

const Content = ({ item }) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false)
    }, DURATION)

    return () => {
      clearTimeout(timer)
    }
  }, [dispatch, item.id])

  return (
    <button
      key={item.id}
      onAnimationEnd={() => {
        if (!open) {
          dispatch(remove(item.id))
        }
      }}
      className={
        'mb-2 flex min-w-[160px] items-center rounded-lg bg-white p-3 text-black ' +
        (!open ? 'animate-slide-left-out ' : 'animate-slide-left ') +
        item?.className
      }
    >
      <CheckIcon />
      <p className="ml-2 flex-1"> {item?.message + ''}</p>
    </button>
  )
}
interface Props {}

const SnackbarProvider = (props: Props) => {
  const { stack } = useSelector(
    (state: AppState) => state.snackbar,
    shallowEqual
  )

  return (
    <div
      className={
        'fixed bottom-6 left-6 z-snackbar my-1 flex flex-col transition-all'
      }
    >
      {stack.map((item) => {
        if (item.message) {
          return <Content key={item.id} item={item} />
        }
      })}
    </div>
  )
}

export default SnackbarProvider
