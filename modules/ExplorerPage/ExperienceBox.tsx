import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import useGeneralHook from '@common/hook/useGeneralHook'
import { KaraokeIcon } from '@public/icons'
import { setOpenDownloadDialog } from '@redux/commonReducer'
import { ROUTES } from '@utility/constant'
import { FormattedMessage } from 'react-intl'

const LIST = [
  {
    image: '/images/karaoke.jpg',
    title: 'ikara',
    desc: 'Hàng trăm ca khúc nhạc trẻ mới nhất',
    href: { pathname: ROUTES.karaoke },
  },
  {
    image: '/images/vr360.jpg',
    title: 'VR360º',
    desc: 'Trải nghiệm xem video chân thực và sống động',
  },
]
const ExperienceBox = () => {
  const { dispatch } = useGeneralHook()
  return (
    <div className="mt-6 flex flex-col gap-3 px-3">
      <p className="flex-1 font-bold title">
        <FormattedMessage id="salientFeature" />
      </p>
      <div className="flex flex-wrap">
        {LIST.map((item, index) => {
          return (
            <div
              key={index}
              className="relative mr-5 overflow-hidden rounded-xl p-0.5"
              style={{
                height: 248,
              }}
            >
              <ProgressiveImg
                src={item.image}
                alt="img"
                shape="rect_w"
                className="h-full w-full object-cover"
              />
              <div
                className="absolute bottom-0 right-0 left-0 flex px-3 py-4"
                style={{
                  background: 'rgba(16, 16, 16, 0.7)',
                  backdropFilter: 'blur(27px)',
                }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white bg-opacity-10 backdrop-blur-md">
                  <KaraokeIcon />
                </div>
                <div className="ml-3 mr-1">
                  <p className="font-bold title line-clamp-1">{item.title}</p>
                  <p className="mt-1 text-neutral-500 caption2">{item.desc}</p>
                </div>
                {item.href ? (
                  <MyLink
                    href={item.href}
                    className="btn-container btn-small ml-4 self-center px-3 font-bold headline"
                  >
                    <FormattedMessage id="experience" />
                  </MyLink>
                ) : (
                  <button
                    className="btn-container btn-small ml-4 self-center px-3 font-bold headline"
                    onClick={() => {
                      dispatch(setOpenDownloadDialog(true))
                    }}
                  >
                    <FormattedMessage id="experience" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default ExperienceBox
