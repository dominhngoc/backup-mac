import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import ScrollMenu from '@common/components/ScrollMenu'
import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { LoadingIcon, MonopolyIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import { useMemo } from 'react'
import useSWRInfinite from 'swr/infinite'
interface PropsWapper {
  data: some
  children?: React.ReactChild
}
const WapperLink = (props: PropsWapper) => {
  const { data, children } = props

  return (
    <>
      {data.type === 'LINK' ? (
        data.content ? (
          <MyLink href={data.content} target={'_blank'}>
            {children}
          </MyLink>
        ) : (
          children
        )
      ) : data.type === 'FIX ' ? (
        data.content ? (
          <MyLink href={data.content}>{children}</MyLink>
        ) : (
          children
        )
      ) : ['VOD', 'LIVE', 'FILM'].includes(data.type) && data.id ? (
        <MyLink
          href={{
            pathname:
              data.type === 'VOD'
                ? ROUTES.video.detail
                : data.type === 'LIVE'
                ? ROUTES.live.detail
                : ROUTES.phim.detail,
            query:
              data.type === 'LIVE'
                ? {
                    id: JSON.parse(data.content)?.id || 'null',
                  }
                : {
                    slug: [data.slug],
                    id: data.content,
                  },
          }}
        >
          {children}
        </MyLink>
      ) : (
        children
      )}
    </>
  )
}

const Card = ({ data }) => {
  return (
    <div className="ml-5 shrink-0 pb-5">
      {data.tag ? (
        <div className="flex items-center gap-1 font-bold text-primary caption1">
          <MonopolyIcon className="w-4 shrink-0" />
          <span className="uppercase line-clamp-1">{data.tag}</span>
        </div>
      ) : (
        <div className="h-5" />
      )}
      <WapperLink data={data}>
        <p className="my-0.5 font-bold title line-clamp-1">{data.name}&nbsp;</p>
      </WapperLink>
      <p className="mb-3 text-neutral-500 line-clamp-1">
        {data.description}&nbsp;
      </p>
      <WapperLink data={data}>
        <ProgressiveImg
          src={data.coverImage}
          shape="rect_w"
          alt="coverImage"
          className="ounded-lg h-full w-[31vw] max-h-[17vw] xl:w-[25vw] xl:max-h-[14vw] rounded-xl bg-bg2 object-cover"
        />
      </WapperLink>
    </div>
  )
}
interface Props {
  data: some[]
}
const EventBannerList = (props: Props) => {
  const { data } = props
  const { dispatch } = useGeneralHook()

  const {
    data: listBanner = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      API_PATHS.home.event({
        page_token: index + 1,
        page_size: 12,
      }),
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data
    },
    {
      revalidateAll: false,
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnMount: false,
    }
  )

  const mappedData = useMemo(() => {
    return listBanner.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, data)
  }, [data, listBanner])

  if (!mappedData.length) {
    return null
  }

  return (
    <ScrollMenu
      classArrowBox="max-w-[40px]"
      onScroll={(e) => {
        if (
          e.currentTarget.scrollLeft + e.currentTarget.offsetWidth + 135 * 2 >=
            e.currentTarget.scrollWidth &&
          !isValidating &&
          data?.length > 0 &&
          listBanner?.every((v) => v?.length > 0)
        ) {
          setSize(size + 1)
        }
      }}
    >
      {mappedData.map((data) => {
        return <Card data={data} key={data.id} />
      })}
      {isValidating && (
        <div className="flex h-[192px] w-[341px] shrink-0 items-center justify-center">
          <LoadingIcon className="h-10 animate-spin" />
        </div>
      )}
    </ScrollMenu>
  )
}

export default EventBannerList
