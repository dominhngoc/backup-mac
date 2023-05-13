import MyLink from '@common/components/MyLink'
import Popper from '@common/components/Popper'
import { some } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import { FilterIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { DEFAULT_FILTER, DEFAULT_TAB } from '.'

interface Props {
  filterList: some[]
}
export default function FilterVideos(props: Props) {
  const { filterList } = props
  const { router } = useGeneralHook()
  const { query } = router
  const { filter = DEFAULT_FILTER, type = DEFAULT_TAB, id } = query

  const [open, setOpen] = useState<boolean>(false)

  const label = filterList.find((v) => v.value === filter)?.label
  return (
    <Popper
      open={open}
      className="headline flex h-fit font-bold uppercase"
      wrapper={
        <>
          <FilterIcon className="mr-2" />
          <FormattedMessage id={label || 'sortBy'} />
        </>
      }
      setOpen={setOpen}
      classNamePaper="w-72"
    >
      {filterList.map((item, index) => (
        <MyLink
          href={{
            pathname: ROUTES.channel.videos,
            query: { type: type, filter: item.value, id: id },
          }}
          key={index}
        >
          <div
            className={
              'flex h-12 w-full items-center gap-3 py-3 px-4 ' +
              (filter === item.value ? 'bg-neutral-100' : '')
            }
            onClick={() => {
              setOpen(false)
            }}
          >
            <FormattedMessage id={item.label} />
          </div>
        </MyLink>
      ))}
    </Popper>
  )
}
