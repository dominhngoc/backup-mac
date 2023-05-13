import MyLink from '@common/components/MyLink'
import ProgressiveImg from '@common/components/ProgressiveImg'
import ShareModal from '@common/components/ShareModal'
import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { DeleteIcon, EditPen, PlayIcon, ShareIcon } from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import Head from 'next/head'
import { useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import PlaylistBox from './PlaylistBox'
import UpdateFormBox from './UpdateFormBox'
interface Props {
  host: string
  dataCategorySSR: some[]
}

const PlaylistDetailPage = (props: Props) => {
  const { host, dataCategorySSR } = props
  const { setMessage, dispatch, isLogin, router, confirmDialog, intl } =
    useGeneralHook()
  const { query, asPath, push } = router
  const id = query?.id as string
  const { promptConfirmation, close } = confirmDialog
  const [openShare, setOpenShare] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)

  const { data: playlistInfo, mutate } = useSWR(
    id ? API_PATHS.channel.playlists.detail(id) : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }, true))
      return json?.data?.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  const onDelete = async () => {
    if (!isLogin) {
      dispatch(setOpenLoginDialog(true))
      return
    }
    const confirm = await promptConfirmation({
      warning: true,
      title: intl.formatMessage({ id: 'deletePlaylistTitle' }),
      message: (
        <>
          <FormattedMessage
            id="deleteConfirm"
            values={{
              name: <strong className="text-white">{playlistInfo.name}</strong>,
            }}
          />
          <br />
          <FormattedMessage id="noteDelete" />
        </>
      ),
      okText: 'deletePlaylist',
    })
    if (confirm) {
      try {
        const json = await dispatch(
          fetchThunk({
            url: API_PATHS.playlists.delete,
            method: 'POST',
            data: {
              id: playlistInfo?.id,
            },
          })
        )
        setMessage({ message: json.data?.message })
        if (json.status === 200) {
          router.back()
        }
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    }
    close()
  }

  const onUpdate = async (values) => {
    if (!isLogin) {
      dispatch(setOpenLoginDialog(true))
      return
    }
    try {
      const json = await dispatch(
        fetchThunk({
          url: API_PATHS.playlists.update,
          method: 'POST',
          data: {
            id: values?.id,
            name: values?.name,
            mode: values?.mode,
          },
        })
      )
      setMessage({ message: json.data?.message })
      if (json.status === 200) {
        mutate()
        setOpenUpdate(false)
      }
    } catch (e: any) {
      setMessage({ message: e.response?.data?.message })
    }
  }

  const swr = useSWRInfinite(
    (index) =>
      id
        ? API_PATHS.playlists.child(id, {
            type: 'PLAYLIST',
            page_token: index,
            page_size: 12,
          })
        : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data?.[0]?.contents
    },
    {
      revalidateAll: false,
      revalidateFirstPage: false,
      initialSize: 1,
      revalidateOnFocus: false,
      persistSize: true,
    }
  )
  const mappedData = useMemo(() => {
    return swr.data?.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [swr.data])

  return (
    <>
      <Head>
        <title>{playlistInfo?.name}</title>
      </Head>
      <MenuCategories hasDivider={true} listCategory={dataCategorySSR} />
      <div className="container flex py-6 min-h-screen">
        <div className="mr-5 flex-1">
          <ProgressiveImg
            src={playlistInfo?.coverImage}
            alt="coverImage"
            className="h-80 w-full"
            shape="rect_w"
          />
          <div className="bg-bg2 bg-opacity-90 p-3">
            <button
              className="btn-container w-full"
              disabled={mappedData?.length === 0}
              onClick={() => {
                push({ pathname: ROUTES.playlist.play, query: query })
              }}
            >
              <PlayIcon className="mr-2" />
              <FormattedMessage id="playAll" />
            </button>
          </div>
          {openUpdate ? (
            <div className="flex h-24 border-b border-white border-opacity-10 bg-bg2 p-4">
              <UpdateFormBox
                formData={playlistInfo}
                mutate={mutate}
                onClose={() => {
                  setOpenUpdate(false)
                }}
                onSubmit={onUpdate}
              />
            </div>
          ) : (
            <div className="flex h-24 items-center border-b border-white border-opacity-10 bg-bg2 p-4">
              <div className="flex-1">
                <span className="font-bold title">{playlistInfo?.name}</span>
                <span className="mt-2 flex text-neutral-400">
                  <span>{playlistInfo?.numVideo || 0}</span>
                  &nbsp;
                  <span>
                    <FormattedMessage
                      id={playlistInfo?.numVideo ? 'videos' : 'video'}
                    />
                  </span>
                  &nbsp;•&nbsp;
                  <span>{playlistInfo?.playTimes || 0}</span>
                  &nbsp;
                  <span>
                    <FormattedMessage id="view" />
                  </span>
                </span>
              </div>
              <div className="flex">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-10"
                  onClick={() => {
                    setOpenUpdate(true)
                  }}
                >
                  <EditPen />
                </button>
                <button
                  className="mx-6 flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-10"
                  onClick={() => setOpenShare(true)}
                >
                  <ShareIcon />
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-10"
                  onClick={onDelete}
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          )}
          <div className="flex h-24 rounded-b-xl bg-bg2 p-4">
            <MyLink
              href={{
                pathname: ROUTES.channel.detail,
                query: { id: playlistInfo?.channel?.id },
              }}
              className="flex items-center"
            >
              <ProgressiveImg
                src={playlistInfo?.channel?.avatarImage}
                alt="avatarImage"
                className="avatar mr-2 h-12 w-12"
              />
              <p>{playlistInfo?.channel?.name}</p>
            </MyLink>
          </div>
        </div>
        <PlaylistBox
          swr={swr}
          playlistInfo={playlistInfo}
          revalidate={mutate}
        />
      </div>
      <ShareModal
        open={openShare}
        onClose={() => setOpenShare(false)}
        shareUrl={`${host}${asPath}`}
      />
    </>
  )
}

export default PlaylistDetailPage
