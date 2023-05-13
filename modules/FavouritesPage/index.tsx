import MyLink from '@common/components/MyLink'
import { some } from '@common/constants'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
import ShortList from './ShortList'
import VideoList from './VideoList'
interface Props {
  dataCategorySSR: some[]
}
const FavouritesPage = (props: Props) => {
  const { dataCategorySSR } = props

  const { query } = useRouter()
  const { type = 'video' } = query

  const TABS = [
    {
      label: 'video',
      type: 'video',
    },
    {
      label: 'shorts',
      type: 'shorts',
    },
  ]

  return (
    <>
      <MenuCategories listCategory={dataCategorySSR} />
      <div className="container mb-[134px] px-3 min-h-screen">
        <p className="pt-5 text-2xl font-semibold">
          <FormattedMessage id="favourites" />
        </p>
        <div className="z-20 flex overflow-x-auto bg-black pt-9 pb-6 font-semibold">
          <div className="flex">
            {TABS.map((item, index) => {
              return (
                <MyLink
                  key={index}
                  href={{ query: { type: item.type } }}
                  className={`mr-3 flex items-center justify-center whitespace-nowrap rounded-3xl px-3 py-1.5 ${
                    type === item.type
                      ? 'bg-white text-bg1'
                      : 'bg-bg2 text-inherit'
                  }`}
                >
                  {item.label && <FormattedMessage id={item.label} />}
                </MyLink>
              )
            })}
          </div>
        </div>
        {type === 'video' && <VideoList />}
        {type === 'shorts' && <ShortList />}
      </div>
    </>
  )
}

export default FavouritesPage
