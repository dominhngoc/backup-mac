import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { some, VideoObject } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import AsideBox from '@modules/ShortVideoPage/AsideBox'
import { LoadingIcon, PlayIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import Head from 'next/head'
import { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWRInfinite from 'swr/infinite'

interface Props {
  hashtagInfo: some
  dataSSR: some[]
  listHashtagSSR: some[]
}

const ShortHashTagPage = (props: Props) => {
  const { hashtagInfo, dataSSR, listHashtagSSR } = props
  const { intl, dispatch, router } = useGeneralHook()
  const hashtag = router.query?.hashtag

  const {
    data: dataCSR = [],
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      API_PATHS.shorts.getListByTag({
        hashtag,
        page_token: index + 1,
        page_size: 12,
      }),
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    }
  )

  const mappedData = useMemo(() => {
    return [dataSSR, ...dataCSR]
  }, [dataCSR, dataSSR])

  const onScroll = useCallback(() => {
    if (
      window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 320 &&
      !isValidating &&
      dataCSR?.length > 0 &&
      dataCSR?.every((item) => item?.length > 0)
    ) {
      setSize(size + 1)
    }
  }, [dataCSR, isValidating, setSize, size])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({ id: 'hashtag' })}:&nbsp;{hashtag}
        </title>
      </Head>
      <div className="container relative flex select-none">
        <AsideBox listChannelSSR={[]} listHashtagSSR={listHashtagSSR} />
        <div className="relative mx-auto w-[730px]">
          <div className="flex items-start">
            <div
              className="flex items-center justify-center rounded-full sm:h-20 sm:w-20 2xl:h-32 2xl:w-32 "
              style={{
                background:
                  'linear-gradient(90deg, #FF7110 -4.89%, #FFB556 102.03%)',
              }}
            >
              <span className="font-semibold leading-[50px] sm:text-[46px] 2xl:text-[68px]">
                #
              </span>
            </div>
            <div className="ml-3 flex flex-col justify-center">
              <p className="max-w-lg break-all font-bold line-clamp-1 sm:text-xl 2xl:text-3xl">
                #{hashtagInfo.hashtag}
              </p>
              <p className="mt-4 text-neutral-500 headline">
                {hashtagInfo.viewCount || 0}&nbsp;
                <FormattedMessage id="viewNumber" />
              </p>
              <p className="mt-2 text-neutral-500 headline">
                {hashtagInfo.videoCount || 0}&nbsp;
                <FormattedMessage id="video" />
              </p>
            </div>
          </div>
          <div className="-ml-5 -mb-5 grid grid-cols-3 sm:mt-3 2xl:mt-6">
            {mappedData.map((value, pageSize) => {
              return value?.map((item: VideoObject, slideIndex) => {
                return (
                  <MyLink
                    href={{
                      pathname: ROUTES.shorts.index,
                      query: { type: 'hashtag', hashtag, pageSize, slideIndex },
                    }}
                    className="pl-5 pb-5"
                    key={item.id}
                  >
                    <div className="relative h-[420px] w-full rounded-xl">
                      <ProgressiveImg
                        src={item.coverImage}
                        shape="rect_h"
                        className="h-full w-full rounded-xl object-cover"
                      />
                      <div
                        className="absolute bottom-[-1px] left-0 right-0 flex h-40 w-full flex-col justify-end rounded-b-xl"
                        style={{
                          background:
                            'linear-gradient(0deg, #0D0D0D 4.69%, rgba(0, 0, 0, 0.0001) 100%)',
                        }}
                      >
                        <div className="mb-4 ml-4 flex items-center text-sm font-semibold">
                          <PlayIcon className="scale-50" />
                          <p>
                            {item.playTimes} <FormattedMessage id="view" />
                          </p>
                        </div>
                      </div>
                    </div>
                  </MyLink>
                )
              })
            })}
          </div>

          {isValidating && (
            <div className="flex h-48 items-center justify-center">
              <LoadingIcon className="h-10 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ShortHashTagPage
