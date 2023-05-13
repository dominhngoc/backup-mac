import FollowBox from '@common/components/FollowBox'
import VideoAction from './VideoAction'
import { FormattedMessage } from 'react-intl'
import CommentsBoxShort from '@modules/ShortVideoPage/CommentsBoxShort'
import { useEffect, useState } from 'react'
import MyLink from '@common/components/MyLink'
import { ROUTES } from '@utility/constant'

interface Props {
  videoData: any
  hashtag?: string
}

const VideoDescription = (props: Props) => {
  const { videoData } = props
  const [openDesc, setOpenDesc] = useState(false)

  const renderVideoAction = () => {
    if (videoData) {
      return <VideoAction data={videoData} />
    }

    return null
  }

  const renderFollowBox = () => {
    if (videoData) {
      return (
        <div className="child-video-description">
          <FollowBox channelData={videoData?.channel} />
        </div>
      )
    }
    return null
  }

  const renderVideoHashtag = () => {
    let hashtagArray = videoData?.hashtag?.split(',')

    return (
      <div className="flex flex-wrap headline">
        {hashtagArray?.map((item, index) => {
          return (
            <MyLink
              href={{
                pathname: ROUTES.shorts.hashtags,
                query: { hashtag: item },
              }}
              key={index}
              className="mr-2 hover:text-primary hover:underline"
            >
              {item && `#${item}`}
            </MyLink>
          )
        })}
      </div>
    )
  }

  return (
    <>
      {/* ------------------------------------------------- || follow box || ------------------------------------------------- */}
      {renderFollowBox()}
      {/* ------------------------------------------------- || description box || ------------------------------------------------- */}
      <div className={`text-justify`}>
        {openDesc ? (
          <div className={`mt-6 text-white  headline`}>
            {videoData?.description}
          </div>
        ) : (
          <div className={`mt-6 text-white headline line-clamp-1`}>
            {videoData?.description}
          </div>
        )}
      </div>
      {/* ------------------------------------------------- || hashtag box || ------------------------------------------------- */}
      {renderVideoHashtag()}
      {/* ------------------------------------------------- || open description box || ------------------------------------------------- */}
      {videoData?.description && videoData?.description.length > 351 && (
        <div className="mt-1">
          <button
            className="text-sm uppercase text-neutral-300"
            onClick={() => setOpenDesc(!openDesc)}
          >
            <FormattedMessage id={!openDesc ? 'showMore' : 'showLess'} />
          </button>
        </div>
      )}
      {/* ------------------------------------------------- || action box || ------------------------------------------------- */}
      <div className="mt-6">{renderVideoAction()}</div>
      <CommentsBoxShort
        type="SHORT"
        contentId={videoData?.id}
        total={videoData?.commentCount || 0}
      />
    </>
  )
}

export default VideoDescription
