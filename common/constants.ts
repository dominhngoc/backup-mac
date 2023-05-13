export type some = { [key: string]: any }

export interface VideoObject {
  categoryId?: number
  channel?: {
    avatarImage: string
    followCount: number
    id: number
    name: string
    status: number
    videoCount: number
  }
  filmChannel?: {
    avatarImage: string
    followCount: number
    id: number
    name: string
    status: number
    videoCount: number
  }
  commentCount?: number
  convertStatusStr?: string
  coverImage?: string
  firstFrameImage?: string
  description?: string
  duration: number
  hashtag?: string
  id: number
  likeCount?: number
  viewerCount?: number
  link?: string
  linkShare?: string
  linkSocial?: string
  name?: string
  playTimes: number
  publishedTime?: string
  reason?: string
  previewImage?: string
  slug: string
  status: number
  type?: 'VOD' | 'FILM' | 'SHORT'
}

export interface PlayListObject {
  id: number
  name: string
  description: string
  coverImage: string
  numVideo: number
  playTimes: number
  status: number
  slug: string
  channel: VideoObject['channel']
}
export interface SearchObject {
  term: string
  time: number
}

export const SUCCESS_CODE = 200
export const PAGE_SIZE = 10

export const VIDEO_STATUS = [
  {
    value: 1,
    label: 'public',
  },
  // {
  //   value: 0,
  //   label: 'private',
  // },
]
