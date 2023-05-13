import { some } from '@common/constants'
import Checkbox from '../Checkbox'
interface Props {
  item: some
  checked: boolean
  saveToPlaylist(item, status): void
}
const PlaylistItem = (props: Props) => {
  const { item, checked, saveToPlaylist } = props
  return (
    <div
      className="flex cursor-pointer items-center py-3"
      key={item.id}
      onClick={() => {
        saveToPlaylist(item, !checked)
      }}
    >
      <Checkbox checked={checked} />
      <p className="ml-2 line-clamp-1">{item.name}</p>
    </div>
  )
}
export default PlaylistItem
