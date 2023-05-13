import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { some } from '@common/constants'
import { LeftArrowIcon } from '@public/icons'
import { ROUTES } from '@utility/constant'
import { useRouter } from 'next/router'
import { Carousel } from 'react-responsive-carousel'

interface Props {
  bannersSSR: some[]
}

const BannerSlider = (props: Props) => {
  const { bannersSSR } = props
  const { query } = useRouter()
  if (!bannersSSR?.length) {
    return null
  }
  return (
    <>
      <div className="container mt-6 mb-3 h-[494px] w-full p-0 ">
        <Carousel
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          showArrows={true}
          autoPlay
          swipeable
          infiniteLoop
          interval={3000}
          className="home-carousel-banner"
          renderArrowNext={(clickHandler: () => void) => (
            <div
              className="absolute top-0 right-0 z-10 flex h-full w-[122px] items-center justify-end "
              style={{
                background:
                  'linear-gradient(90deg, rgba(0, 0, 0, 0) 6.79%, #000000 100%)',
              }}
            >
              <button
                onClick={clickHandler}
                className=" flex rotate-180 items-center justify-center rounded-full bg-[#ffffff0d] 2xl:h-12  2xl:w-12"
              >
                <LeftArrowIcon />
              </button>
            </div>
          )}
          renderArrowPrev={(
            clickHandler: () => void,
            hasPrev: boolean,
            label: string
          ) => (
            <div
              onClick={clickHandler}
              style={{
                background:
                  'linear-gradient(-90deg, rgba(0, 0, 0, 0) 7.79%, #000000 100%)',
              }}
              className="absolute top-0 left-0 z-10 flex h-full w-[122px] items-center justify-start  "
            >
              <button className="flex items-center justify-center rounded-full bg-[#ffffff0d]    2xl:h-12  2xl:w-12">
                <LeftArrowIcon />
              </button>
            </div>
          )}
        >
          {bannersSSR.map((banner, i) => {
            let href = {}
            if (banner.type === 'HREF') {
              href = {
                pathname: banner?.link,
              }
            } else if (banner.type === 'VOD') {
              href = {
                pathname: ROUTES.video.detail,
                query: {
                  id: banner.itemId,
                },
              }
            } else if (banner.type === 'LIVE') {
              href = {
                pathname: ROUTES.live.detail,
                query: {
                  id: banner.itemId,
                  slug: '',
                },
              }
            } else if (banner.type === 'FILM') {
              href = {
                pathname: ROUTES.phim.detail,
                query: { id: banner.itemId },
              }
            }
            return (
              <MyLink
                href={href}
                key={banner.itemId}
                target={banner.type === 'HREF' ? '_blank' : '_self'}
              >
                <div className="relative flex h-full  w-full items-center justify-center">
                  <ProgressiveImg
                    shape="banner"
                    src={banner.coverImage}
                    alt="avatarImage"
                    className="max-h-full max-w-full shrink-0"
                  />
                </div>
              </MyLink>
            )
          })}
        </Carousel>
      </div>
    </>
  )
}

export default BannerSlider
