import { some } from '@common/constants'
import { ShareFillIcon } from '@public/icons'
import { useState } from 'react'
import ShareModal from '../ShareModal'

interface Props {
  data: some
}

const ShareBoxShort = (props: Props) => {
  const { data } = props
  const [openShare, setOpenShare] = useState(false)
  return (
    <div>
      <button className="flex  items-center" onClick={() => setOpenShare(true)}>
        <div
          className={
            'flex h-12 w-12 items-center justify-center rounded-full bg-[#ffffff1a]' +
            (status ? 'text-primary' : 'text-white')
          }
        >
          <ShareFillIcon />
        </div>
      </button>
      <ShareModal
        open={openShare}
        onClose={() => {
          setOpenShare(false)
        }}
        shareUrl={data?.linkShare}
      />
    </div>
  )
}

export default ShareBoxShort
