import MyLink from '@common/components/MyLink'
import { CloseIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import Router from 'next/router'
interface Props {
  data: any
  value: string
  query: any
}
const Filter: React.FC<Props> = (props: Props) => {
  const { data, value, query } = props

  const clearFilter = () => {
    delete query[data.key]
    Router.push({
      pathname: ROUTES.search.index,
      query,
    })
  }

  return (
    <div className="container flex flex-col bg-bg1 px-[12px] font-normal text-neutral-500">
      <div className="mb-[16px] border-b border-[#1E1E1E] py-[12px] uppercase">
        {data.header}
      </div>
      <div className="flex flex-col items-start">
        {data.selections.map((item: any, index) => {
          return (
            <div key={index} className="flex items-center py-[14px]">
              {item.disible ? (
                <div
                  className={
                    'mr-[14px] flex flex-col ' +
                    (item.value === value ? 'font-semibold text-white' : '')
                  }
                >
                  <div className="flex whitespace-nowrap">
                    {item.icon}
                    <span className="ml-1">{item.label}</span>
                  </div>
                </div>
              ) : (
                <>
                  <MyLink
                    href={
                      item.href || {
                        pathname: ROUTES.search.index,
                        query: {
                          ...query,
                          [data.key]: item.value,
                        },
                      }
                    }
                    className={
                      'mr-[14px] flex flex-col ' +
                      (item.value === value ? 'font-semibold text-white' : '')
                    }
                  >
                    <div className="flex whitespace-nowrap">
                      {item.icon}
                      <span className="ml-1">{item.label}</span>
                    </div>
                  </MyLink>
                  <CloseIcon
                    className={(item.value === value ? '' : 'hidden') + ''}
                    onClick={(e) => {
                      e.stopPropagation()
                      clearFilter()
                    }}
                  />
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Filter
