import React from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
require('videojs-contrib-quality-levels')
require('videojs-hls-quality-selector')
require('videojs-sprite-thumbnails')
interface Props {
  elProp?: React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >
  containerProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  options?: any
  onReady?: (player: any, qualityLevels: any, videoElement: any) => void
  onError?: (player: any) => void
}
export const VideoJS = (props: Props) => {
  const videoRef = React.useRef<any>(null)
  const playerRef = React.useRef<any>(null)
  const { options, containerProps, elProp, onReady, onError } = props

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current

      if (!videoElement) return

      const player = (playerRef.current = videojs(
        videoElement,
        options,
        (e) => {
          player.hlsQualitySelector()
          let qualityLevels = player.qualityLevels()
          qualityLevels.selectedIndex_ = 0
          qualityLevels.trigger({ type: 'change', selectedIndex: 0 })

          onReady && onReady(player, qualityLevels, videoElement)
          // let tmp = player.spriteThumbnails({
          //   url: 'https://example.com/sprite.jpg',
          //   width: 160,
          //   height: 90,
          // })
        }
      ))
      player.on('error', () => {
        onError && onError(player)
      })
      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      // const player = playerRef.current;
      // player.autoplay(options.autoplay);
      // player.src(options.sources);
    }
  }, [onError, onReady, options, videoRef])

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current
    return () => {
      if (player) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <>
      <div data-vjs-player {...containerProps}>
        <video
          {...elProp}
          autoPlay={true}
          playsInline
          ref={videoRef}
          className={'video-js vjs-big-play-centered ' + elProp?.className}
        />
      </div>
    </>
  )
}

export default VideoJS
