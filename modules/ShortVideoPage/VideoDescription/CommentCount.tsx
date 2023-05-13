import { MessageFilledIcon } from '@public/icons'

interface Props {
  data: any
}

const CommentCount = (props: Props) => {
  const { data } = props

  return (
    <div className="flex items-center justify-center">
      <div
        className={
          'mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white bg-opacity-10 text-white '
        }
      >
        <MessageFilledIcon className="scale-125" />
      </div>
      <p className="font-bold headline">{data?.commentCount || 0}</p>
    </div>
  )
}

export default CommentCount
