import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { setMessage } from '@redux/snackbarReducer'
import { API_PATHS } from '@utility/API_PATH'
import useSWR from 'swr'

const useGetLinkVideo = (props: {
  videoId?: number | null
  isLive?: boolean
  optionsSWR?: { refreshInterval?: number }
}) => {
  const { isLive, optionsSWR, videoId } = props
  const { dispatch } = useGeneralHook()

  const {
    data: url,
    isValidating: loading,
    mutate,
  } = useSWR(
    videoId
      ? isLive
        ? API_PATHS.lives.getLink(videoId)
        : API_PATHS.videos.getLink(videoId)
      : null,
    async (url) => {
      try {
        const json = await dispatch(fetchThunk({ url, method: 'get' }))
        return isLive ? json?.data?.data?.streamUrl : json?.data?.data
      } catch (error: any) {
        if (error.response) {
          dispatch(setMessage(error.response?.data?.message || 'ERROR'))
        }
      }
    },
    {
      revalidateOnFocus: false,
      ...optionsSWR,
    }
  )

  return { url, loading, mutate }
}
export default useGetLinkVideo
