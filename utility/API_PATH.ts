import { some } from '@common/constants'
import { stringify } from 'query-string'

export const IS_DEV_EVN: boolean =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const DOMAIN = process.env.NEXT_PUBLIC_API_SSR
const DOMAIN_PROXY = IS_DEV_EVN ? '/api' : process.env.NEXT_PUBLIC_API_CSR

export const API_PATHS = {
  login: `${DOMAIN_PROXY}/users/login`,
  getTopic: (params?: some) =>
    `${DOMAIN_PROXY}/topics?${stringify(params || {})}`,
  notifications: {
    get: (params: some) => `${DOMAIN_PROXY}/notifications?${stringify(params)}`,
    read: `${DOMAIN_PROXY}/notifications/read`,
    delete: `${DOMAIN_PROXY}/notifications/delete`,
  },
  lives: {
    getChatAccess: `${DOMAIN_PROXY}/lives/get-chat-assets`,
    getChatRoom: (video_id: number) =>
      `${DOMAIN_PROXY}/lives/get-chat-room?live_id=${video_id}`,
    banners: (params: some) => `${DOMAIN_PROXY}/banners?${stringify(params)}`,
    getLink: (video_id: number) =>
      `${DOMAIN_PROXY}/lives/stream?live_id=${video_id}`,
    checkPermission: `${DOMAIN_PROXY}/lives/check-permission`,
    currentLives: `${DOMAIN_PROXY}/lives/current-livestream`,
    create: `${DOMAIN_PROXY}/lives/create-livestream`,
    update: `${DOMAIN_PROXY}/lives/update-livestream`,
    moderator: (params: some) =>
      `${DOMAIN_PROXY}/lives/list-moderator?${stringify(params)}`,
    updateModerator: `${DOMAIN_PROXY}/lives/edit-moderator`,
  },
  home: {
    getArticle: (id: string) => `${DOMAIN_PROXY}/home/get-article/${id}`,
    getListHint: (params: some) =>
      `${DOMAIN_PROXY}/search/suggestion/?${stringify(params)}`,
    shorts: (params: some) => `${DOMAIN_PROXY}/shorts?${stringify(params)}`,
    lives: (params: some) => `${DOMAIN_PROXY}/lives?${stringify(params)}`,
    videos: (params: some) => `${DOMAIN_PROXY}/home?${stringify(params)}`,
    listVideo: (params: some) => `${DOMAIN_PROXY}/videos?${stringify(params)}`,
    channelsHome: (params: some) =>
      `${DOMAIN_PROXY}/channels?${stringify(params)}`,
    event: (params: some) => `${DOMAIN_PROXY}/home/event?${stringify(params)}`,
  },
  films: {
    index: (params: some) => `${DOMAIN_PROXY}/films?${stringify(params)}`,
    topicsFilm: (params: some) =>
      `${DOMAIN_PROXY}/films/topic-film?${stringify(params)}`,
    topics: (params: some) => `${DOMAIN_PROXY}/topics?${stringify(params)}`,
    detail: (id: string) => `${DOMAIN_PROXY}/films/${id}`,

    video: (video_id: number) =>
      `${DOMAIN_PROXY}/videos/stream?video_id=${video_id}`,
    child: (
      id: string,
      params: { page_size: number; page_token: number; type: 'FILM' }
    ) => `${DOMAIN_PROXY}/playlists/childs/${id}?${stringify(params)}`,
  },
  playlists: {
    index: (params: some) => `${DOMAIN_PROXY}/playlists?${stringify(params)}`,
    insert: `${DOMAIN_PROXY}/playlists/create`,
    update: `${DOMAIN_PROXY}/playlists/update`,
    delete: `${DOMAIN_PROXY}/playlists/delete`,
    toggleVideo: `${DOMAIN_PROXY}/playlists/toggle-video`,
    checkVideo: `${DOMAIN_PROXY}/playlists/check-video`,
    child: (
      id: any,
      params: { page_size: number; page_token: number; type: 'PLAYLIST' }
    ) => `${DOMAIN_PROXY}/playlists/childs/${id}?${stringify(params)}`,
  },
  videos: {
    index: (params: some) => `${DOMAIN_PROXY}/videos?${stringify(params)}`,
    home: (params: some) => `${DOMAIN_PROXY}/videos?${stringify(params)}`,
    detail: (id: string) => `${DOMAIN_PROXY}/videos/${id}`,
    related: (params: some) =>
      `${DOMAIN_PROXY}/videos/related?${stringify(params)}`,
    getLink: (video_id: number) =>
      `${DOMAIN_PROXY}/videos/stream?video_id=${video_id}`,
  },
  kpi: {
    init: `${DOMAIN_PROXY}/kpi/init`,
    trace: `${DOMAIN_PROXY}/kpi/trace`,
  },
  users: {
    refreshToken: `${DOMAIN_PROXY}/users/refresh-token`,
    like: `${DOMAIN_PROXY}/users/cache/like`,
    followChannel: `${DOMAIN_PROXY}/users/follow-channel`,
    dislikeChannel: `${DOMAIN_PROXY}/users/dislike-channel`,
    getSettings: `${DOMAIN_PROXY}/users/get-setting`,
    feedBack: `${DOMAIN_PROXY}/users/feedback`,
    insertWatchLater: `${DOMAIN_PROXY}/users/cache/insert-watch-later`,
    captcha: `${DOMAIN_PROXY}/users/captcha`,
    profile: `${DOMAIN_PROXY}/users/profile`,
    cache: {
      get: (params: some) =>
        `${DOMAIN_PROXY}/users/cache/get?${stringify(params)}`,
      delete: `${DOMAIN_PROXY}/users/cache/delete`,
      insertHistory: `${DOMAIN_PROXY}/users/cache/insert-history`,
    },
    pushImg: `${DOMAIN_PROXY}/uploads/push-file/`,
    uploadVideo: `${DOMAIN_PROXY}/uploads/create`,
    updateProfile: `${DOMAIN_PROXY}/users/update-profile`,
    autoLogin: `${DOMAIN_PROXY}/users/auto-login`,
    socialLogin: `${DOMAIN_PROXY}/users/social-login`,
    subscriber: `${DOMAIN_PROXY}/users/subscriber`,
    unsubscriber: `${DOMAIN_PROXY}/users/unsubscriber`,
    changePassword: `${DOMAIN_PROXY}/users/change-password`,
    insertHistory: `${DOMAIN_PROXY}/users/insert-history`,
    packageData: (params: some) =>
      `${DOMAIN_PROXY}/users/packages?${stringify(params)}`,
    getOTP: `${DOMAIN_PROXY}/users/push-otp`,
    getInfomation: `${DOMAIN_PROXY}/users/account-infomation`,
  },
  comment: {
    get: (params: some) => `${DOMAIN_PROXY}/comments?${stringify(params)}`,
    commentQuick: (params: some) =>
      `${DOMAIN_PROXY}/quick-comments?${stringify(params)}`,
    sendComment: `${DOMAIN_PROXY}/comments/send`,
    like: `${DOMAIN_PROXY}/comments/toggle-like`,
    delete: `${DOMAIN_PROXY}/comments/delete`,
    edit: `${DOMAIN_PROXY}/comments/edit`,
  },
  playList: {
    get: (params: some) => `${DOMAIN_PROXY}/playlists?${stringify(params)}`,
    insert: `${DOMAIN_PROXY}/playlists/create`,
    toggleVideo: `${DOMAIN_PROXY}/playlists/toggle-video`,
    checkVideo: `${DOMAIN_PROXY}/playlists/check-video`,
  },
  favourites: {
    videos: (params: some) =>
      `${DOMAIN_PROXY}/users/cache/get?${stringify(params)}`,
    shorts: (params: some) =>
      `${DOMAIN_PROXY}/users/cache/get?${stringify(params)}`,
  },
  search: {
    index: (params: some) => `${DOMAIN_PROXY}/search?${stringify(params)}`,
    suggestion: (params: some) =>
      `${DOMAIN_PROXY}/search/suggestion?${stringify(params)}`,
    trending: (params: some) =>
      `${DOMAIN_PROXY}/search/trending?${stringify(params)}`,
  },
  shorts: {
    list: (params: some) => `${DOMAIN_PROXY}/shorts?${stringify(params)}`,
    getListByTag: (params: some) =>
      `${DOMAIN_PROXY}/shorts/video-hashtag?${stringify(params)}`,
  },
  channel: {
    detail: (id: string) => `${DOMAIN_PROXY}/channels/${id}`,
    short: (params: some) => `${DOMAIN_PROXY}/shorts?${stringify(params)}`,
    videosLatest: (params: string) => `${DOMAIN_PROXY}/videos?${params}`,
    videosPopular: (params: string) => `${DOMAIN_PROXY}/videos?${params}`,
    lives: (params: some) => `${DOMAIN_PROXY}/lives?${stringify(params)}`,
    videos: {
      video: (params: some) => `${DOMAIN_PROXY}/videos?${stringify(params)}`,
      shorts: (params: some) => `${DOMAIN_PROXY}/shorts?${stringify(params)}`,
    },
    playlists: {
      get: (params: some) => `${DOMAIN_PROXY}/playlists?${stringify(params)}`,
      detail: (id: string) => `${DOMAIN_PROXY}/playlists/${id}`,
    },
    list: (params: some) => `${DOMAIN_PROXY}/channels?${stringify(params)}`,
  },
}

export const API_PATHS_SERVER = {
  home: {
    shorts: (params: some) => `${DOMAIN}/shorts?${stringify(params)}`,
    lives: (params: some) => `${DOMAIN}/lives?${stringify(params)}`,
    home: (params: some) => `${DOMAIN}/home?${stringify(params)}`,
    categories: (params: some) => `${DOMAIN}/categories?${stringify(params)}`,
    categoriesDetail: (id: Number | string) => `${DOMAIN}/categories/${id}`,
    banner: (params: some) => `${DOMAIN}/banners?${stringify(params)}`,
    channelsHome: (params: some) => `${DOMAIN}/channels?${stringify(params)}`,
    getArticle: (id: string) => `${DOMAIN}/home/get-article/${id}`,
    event: (params: some) => `${DOMAIN}/home/event?${stringify(params)}`,
  },
  films: {
    index: (params: some) => `${DOMAIN}/films?${stringify(params)}`,
    topicsFilm: (params: some) =>
      `${DOMAIN}/films/topic-film?${stringify(params)}`,
    topics: (params: some) => `${DOMAIN}/topics?${stringify(params)}`,
    detail: (id: string) => `${DOMAIN}/films/${id}`,
    video: (video_id: string) => `${DOMAIN}/videos/stream?video_id=${video_id}`,
    child: (
      id: string,
      params: { page_size: number; page_token: number; type: 'FILM' }
    ) => `${DOMAIN}/playlists/childs/${id}?${stringify(params)}`,
  },
  playList: {
    insert: `${DOMAIN}/playlist/create`,
  },
  channel: {
    detail: (id: string) => `${DOMAIN}/channels/${id}`,
    short: (params: some) => `${DOMAIN}/shorts?${stringify(params)}`,
    videosLatest: (params: some) => `${DOMAIN}/videos?${stringify(params)}`,
    videosPopular: (params: some) => `${DOMAIN}/videos?${stringify(params)}`,
    lives: (params: some) => `${DOMAIN}/lives?${stringify(params)}`,
  },
  videos: {
    live: {
      detail: (id: string) => `${DOMAIN}/lives/${id}`,
      related: (params: {
        page_size: number
        category_id: string
        channel_id: string
        id: string
        page_token: number
      }) => `${DOMAIN}/lives/related?${stringify(params)}`,
    },
    index: (params: some) => `${DOMAIN}/videos?${stringify(params)}`,
    home: (params: some) => `${DOMAIN}/videos?${stringify(params)}`,
    detail: (id: string) => `${DOMAIN}/videos/${id}`,
    related: (params: {
      page_size: number
      category_id: string
      channel_id: string
      id: string
      page_token: number
    }) => `${DOMAIN}/videos/related?${stringify(params)}`,

    favourites: {
      videos: (params: some) =>
        `${DOMAIN}/users/cache/get?${stringify(params)}`,
      shorts: (params: some) =>
        `${DOMAIN}/users/cache/get?${stringify(params)}`,
    },
  },
  shorts: {
    getListByTag: (params: some) =>
      `${DOMAIN}/shorts/video-hashtag?${stringify(params)}`,
    getInfoByTag: (params: some) =>
      `${DOMAIN}/shorts/hashtag?${stringify(params)}`,
    getPopularHashtag: (params: some) =>
      `${DOMAIN}/shorts/hashtag?${stringify(params)}`,
  },
  lives: {
    detail: (id: string) => `${DOMAIN}/lives/${id}`,
    related: (params: {
      page_size: number
      category_id: string
      channel_id: string
      id: string
      page_token: number
    }) => `${DOMAIN}/lives/related?${stringify(params)}`,
    checkPermission: `${DOMAIN_PROXY}/lives/check-permission`,
  },
  playlists: {
    get: (id: string) => `${DOMAIN}/playlists/${id}`,
    child: (
      id: string,
      params: { page_size: number; page_token: number; type: 'PLAYLIST' }
    ) => `${DOMAIN}/playlists/childs/${id}?${stringify(params)}`,
  },
}
