import { some } from '@common/constants'
import { Carousel } from 'react-responsive-carousel'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { ROUTES } from '@utility/constant'
interface Props {
  banners: some[]
}

const FAKE_BANNER = [
  {
    coverImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREX69JmTsc2xWGoMJDLz08yIAEXhru4u6jrMcv415YuPVB0nOP0qWaUOAFSdvAPrQtrJA&usqp=CAU',
    tag: 'FAKE SHOWBIZ',
    name: 'Hoài Lâm giờ ăn mặc giản dị, ngoại hình phát tướng hơn trước',
    description:
      'Hoài Lâm giờ ăn mặc giản dị, ngoại hình phát tướng hơn trước Hoài Lâm giờ ăn mặc giản dị, ngoại hình phát tướng hơn trước',
  },
  {
    coverImage: 'https://www.sportpit.net/image/cache/catalog/bsn-860x324.jpg',
    tag: 'FAKE NEWS',
    name: 'ÔNG CHÔN 7 CÂY VÀNG GÓC NHÀ NHỜ CON CHÁU ĐÀO LÊN: SỢ LÚC NẰM XUỐNG GIA ĐÌNH VẤT VẢ VÌ MÌNH',
    description:
      'Cụ thể, người đăng tải đoạn video chia sẻ, chị không nghĩ bản thân sẽ là người trải qua câu chuyện “đào vàng” như phim vậy. Chuyện là ông nội bên chồng của chị từ lúc còn là thanh niên trai tráng đến khi về già đã tích góp được hơn 7 cây vàng, cất ở một góc nhà mà đến con cái hay cả vợ cũng đều không hề hay biết.',
  },
]

const BannersCarousel = (props: Props) => {
  const { banners } = props
  const router = useRouter()

  // const banners = FAKE_BANNER

  function onChange() {}

  function onClickItem(position) {}

  function onClickThumb() {}

  const renderThumb = ({
    coverImage,
    description,
    id,
    itemId,
    link,
    name,
    tag,
    type,
  }) => {
    return (
      <div className="relative  h-full" key={itemId}>
        <div
          className={`relative h-full bg-cover bg-center bg-no-repeat blur-2xl`}
          style={{ backgroundImage: `url('${coverImage}')` }}
        ></div>
        <div className="container absolute top-0 left-1/2 flex h-full w-full -translate-x-1/2 items-center">
          <div className="flex h-full flex-1 flex-col pr-10 text-left  leading-[57px]  sm:py-[37px] 2xl:py-10">
            {tag && (
              <button className="btn-container h-7 w-fit rounded-md text-black caption1 sm:mb-2 2xl:mb-4">
                {tag}
              </button>
            )}
            <p className="font-bold sm:mb-2 sm:text-3xl sm:leading-[42px] 2xl:mb-4 2xl:text-5xl 2xl:leading-[57px]">
              {name}
            </p>
            <p className="font-semibold leading-8 text-white opacity-60 sm:text-base 2xl:text-xl">
              {description}
            </p>
          </div>
          <div
            className="rounded-xl drop-shadow-3xl sm:h-[292px] sm:max-h-[292px] sm:w-[775px] sm:max-w-[775px] 2xl:h-[324px] 2xl:max-h-[324px] 2xl:w-[860px] 2xl:max-w-[860px]"
            // style={{ backgroundImage: `url('${coverImage}')` }}
          >
            <ProgressiveImg
              onMouseDown={(e) => {
                if (e.button == 2) {
                  e.preventDefault()
                  if (e.stopPropagation) e.stopPropagation()
                  // right click
                  return false // do nothing!
                }
              }}
              shape="banner"
              src={coverImage}
              alt=""
              className="h-full w-full  rounded-xl"
            />
          </div>
        </div>
      </div>
    )
  }
  if (banners.length === 0) {
    return null
  }

  return (
    <div className="w-full sm:h-[366px] 2xl:h-[406px]">
      <Carousel
        showArrows={false}
        showThumbs={false}
        showStatus={false}
        autoPlay
        infiniteLoop
        interval={5000}
        onChange={onChange}
        onClickItem={onClickItem}
        onClickThumb={onClickThumb}
        className="home-carousel-banner"
      >
        {banners.map((banner, i) => {
          const { coverImage, description, id, itemId, link, name, tag, type } =
            banner
          if (type === 'HREF') {
            if (link) {
              return (
                <MyLink
                  href={{
                    pathname: link,
                  }}
                  key={itemId}
                  target="_blank"
                >
                  {renderThumb({
                    coverImage,
                    description,
                    id,
                    itemId,
                    link,
                    name,
                    tag,
                    type,
                  })}
                </MyLink>
              )
            } else {
              return renderThumb({
                coverImage,
                description,
                id,
                itemId,
                link,
                name,
                tag,
                type,
              })
            }
          } else {
            const href: any = {}
            if (type === 'VOD') {
              href.pathname = ROUTES.video.detail
              href.query = {
                id: itemId,
              }
            } else if (type === 'LIVE') {
              href.pathname = ROUTES.live.detail
              href.query = {
                id: itemId,
              }
            } else if (type === 'FILM') {
              href.pathname = ROUTES.phim.detail
              href.query = {
                id: itemId,
              }
            }
            return (
              <MyLink
                href={href}
                key={id + i}
                target={link && type === 'HREF' ? '_blank' : '_self'}
              >
                {renderThumb({
                  coverImage,
                  description,
                  id,
                  itemId,
                  link,
                  name,
                  tag,
                  type,
                })}
              </MyLink>
            )
          }
        })}
      </Carousel>
    </div>
  )
}

export default BannersCarousel
