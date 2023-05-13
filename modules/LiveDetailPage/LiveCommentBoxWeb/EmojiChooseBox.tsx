import ProgressiveImg from '@common/components/ProgressiveImg'
import ScrollMenu from '@common/components/ScrollMenu'
import { some } from '@common/constants'
import { AppState } from '@redux/store'
import { useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'

// const socket = io('http://localhost:8034')

interface Props {
  open: boolean
  onSendEmoji: (value: some) => void
}

const EmojiChooseBox = (props: Props) => {
  const { open, onSendEmoji } = props
  const emojiData = useSelector(
    (state: AppState) => state.common.chatAccess.emoji,
    shallowEqual
  )
  const [indexSelected, setIndex] = useState('0')

  return (
    <div
      className={
        'flex h-full w-full flex-col justify-center transition-all duration-500' +
        (open ? 'h-96 ease-in' : 'h-0 overflow-hidden ease-out')
      }
    >
      <ScrollMenu className="flex justify-center py-2 px-1">
        {emojiData.map((item, index) => {
          return (
            <div
              key={item.id}
              className="mr-3 h-8 w-8 shrink-0"
              onClick={() => {
                setIndex(index.toString())
              }}
            >
              <ProgressiveImg src={item.avatar} />
              {indexSelected === `${index}` ? (
                <div className="mt-1 h-1 w-full rounded bg-primary" />
              ) : (
                <div className="mt-1 h-1" />
              )}
            </div>
          )
        })}
      </ScrollMenu>
      <div
        className="grid flex-1 grid-cols-4 overflow-y-auto overflow-x-hidden"
        style={{ maxHeight: 'calc(100% - 48px)' }}
      >
        {emojiData[indexSelected]?.liveAssetChilds?.map((item) => {
          return (
            <div
              key={item.id}
              className="flex w-full items-center justify-center p-1.5"
              onClick={() => {
                onSendEmoji(item)
              }}
            >
              <ProgressiveImg src={item.image} isEmoji={true} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EmojiChooseBox
