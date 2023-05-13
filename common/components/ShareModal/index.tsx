import Modal from '../Modal'
import ShareContent from './ShareContent'

interface Props {
  open: boolean
  onClose: (value: boolean) => void
  shareUrl?: string
}
const ShareModal = (props: Props) => {
  const { open, onClose, shareUrl } = props

  if (!shareUrl) {
    return null
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ShareContent onClose={onClose} shareUrl={shareUrl} />
    </Modal>
  )
}

export default ShareModal
