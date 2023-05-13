export const DEVICE_ID = 'DEVICE_ID'
export const MODE_PLAY = 'MODE_PLAY'
export const SHORT_SLIDE_INDEX = 'SLIDE_INDEX'
export const SHORT_SLIDE_PAGE = 'SLIDE_PAGE'
export const ROUTES = {
  home: '/',
  explorer: '/explorer',
  karaoke: '/karaoke',
  video: { index: '/video', detail: '/video/[id]/[[...slug]]' },
  phim: { index: '/phim', detail: '/phim/[id]/[[...slug]]' },
  live: { index: '/live', detail: '/live/[id]' },
  shorts: { index: '/shorts', hashtags: '/shorts/[hashtag]' },
  favourites: '/favourites',
  interesting: '/interesting',
  category: '/category/[id]',
  introduce: '/introduce',
  termsOfUse: '/terms-of-use',
  operationalRegulations: '/operational-regulations',
  privacyPolicy: '/privacy-policy',
  guide: '/guide',
  contact: '/contact',
  account: {
    index: '/account',
    contacts: '/account/contacts',
    guides: '/account/guides',
    generalSettings: '/account/general-settings',
    history: '/account/history',
    watchLater: '/account/watch-later',
    channel: '/account/channel',
    followed: '/account/followed',
    followedList: '/account/followedList',
  },
  channel: {
    detail: '/channel/[id]',
    videos: '/channel/[id]/videos',
    playlists: '/channel/[id]/playlists',
    channel: '/channel/[id]/channel',
    introduction: '/channel/[id]/introduction',
  },
  playlist: {
    detail: '/playlist/[id]',
    play: '/playlist/[id]/play',
  },
  search: {
    index: '/search',
  },
  upload: {
    index: '/upload',
  },
  studio: {
    index: '/studio',
  },
}
