import Redirect from '@common/components/Redirect'
import { PlayListObject, some, VideoObject } from '@common/constants'
import { api } from '@common/fetchThunk'
import PlaylistPlayerPage from '@modules/PlaylistPlayerPage'
import { API_PATHS_SERVER } from '@utility/API_PATH'

interface Props {
  playlistInfo: PlayListObject
  listVideoSSR: VideoObject[]
  dataRelatedVideoSSR: some[]
  playlistId: string
  dataCategorySSR: some[]
}

const NextPage = (props: Props) => {
  if (props.playlistInfo) {
    return <PlaylistPlayerPage {...props} />
  }

  return <Redirect />
}
export async function getServerSideProps({ query }) {
  const id = query?.id
  try {
    const [dataCategory, jsonInfo] = await Promise.all([
      api({
        url: API_PATHS_SERVER.home.categories({
          page_token: 0,
          page_size: 100,
          filter: 'PARENT',
        }),
      }),
      api({
        url: API_PATHS_SERVER.playlists.get(id),
      }),
    ])
    const playlistInfo = jsonInfo?.data?.data

    const listVideoJson = await api({
      url: API_PATHS_SERVER.playlists.child(id, {
        type: 'PLAYLIST',
        page_token: 0,
        page_size: 10000,
      }),
    })

    let dataRelatedVideoSSR = []

    if (playlistInfo?.channel?.id && playlistInfo?.categoryId && id) {
      const listVideos = await api({
        url: API_PATHS_SERVER.videos.related({
          page_size: 12,
          page_token: 0,
          id,
          channel_id: playlistInfo?.channel?.id,
          category_id: playlistInfo?.categoryId,
        }),
      })
      dataRelatedVideoSSR = listVideos?.data?.data?.[0]?.contents
    }
    return {
      props: {
        dataCategorySSR: dataCategory?.data?.data?.[0]?.contents,
        playlistInfo: playlistInfo,
        listVideoSSR: listVideoJson?.data?.data?.[0]?.contents || [],
        dataRelatedVideoSSR,
      },
    }
  } catch (err) {
    return {
      props: {
        dataCategorySSR: [],
        infoSSR: null,
        listVideoSSR: [],
        dataRelatedVideoSSR: [],
        playlistId: id,
      },
    }
  }
}

export default NextPage
