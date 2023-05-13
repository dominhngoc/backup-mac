import { ImgHTMLAttributes, LegacyRef, useEffect, useState } from 'react'
import ProgressiveImage from 'react-progressive-graceful-image'
interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  placeholder?: string
  isAvatar?: boolean
  shape?: 'circle' | 'rect_w' | 'rect_h' | 'banner' | 'channel'
  isEmoji?: boolean
  refImg?: LegacyRef<HTMLImageElement>
}

const ProgressiveImg = (props: Props) => {
  const {
    src = '',
    shape = 'circle',
    placeholder,
    isAvatar,
    className = '',
    isEmoji,
    refImg,
    ...rest
  } = props

  const getImageDefault = () => {
    switch (shape) {
      case 'circle':
        return '/icons/default_avatar.svg'
      case 'rect_h':
        return '/icons/default_cover_image_h.png'
      case 'rect_w':
        return '/icons/default_cover_image_w.jpg'
      case 'banner':
        return '/icons/default_banner.svg'
      case 'channel':
        return '/icons/bg_channel.png'
      default:
        return '/icons/default_avatar.svg'
    }
  }

  if (isEmoji) {
    if (!src) {
      return null
    }
    return (
      <ProgressiveImage
        src={src}
        placeholder={placeholder || getImageDefault()}
      >
        {(value, loading) => {
          return loading ? (
            <div className="h-20 w-20 rounded-md bg-neutral-100"></div>
          ) : (
            <img
              alt="ProgressiveImage"
              className={className}
              {...rest}
              src={value}
            />
          )
        }}
      </ProgressiveImage>
    )
  }
  return (
    <ProgressiveImage
      src={src || getImageDefault()}
      placeholder={placeholder || getImageDefault()}
    >
      {(value, loading) => {
        return loading ? (
          <img
            src={getImageDefault()}
            className={' bg-bg2 ' + className}
            alt="defaultImage"
            ref={refImg}
            {...rest}
          />
        ) : (
          <img
            alt="ProgressiveImage"
            className={className}
            ref={refImg}
            {...rest}
            src={value}
          />
        )
      }}
    </ProgressiveImage>
  )
}
export default ProgressiveImg
