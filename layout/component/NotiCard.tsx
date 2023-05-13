import MyLink from '@common/components/MyLink'
import Popper from '@common/components/Popper'
import ProgressiveImg from '@common/components/ProgressiveImg'
import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { EyeOffIcon, MoreIcon, NotiOffIcon } from '@public/icons'
import { API_PATHS } from '@utility/API_PATH'
import { ROUTES } from '@utility/constant'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  data: some
  mutate: () => void
}
const NotiCard = (props: Props) => {
  const { data, mutate } = props
  const { dispatch, setMessage, intl, confirmDialog } = useGeneralHook()
  const { promptConfirmation, close } = confirmDialog
  const [open, setOpen] = useState(false)

  const onHiddenNoti = async () => {
    setOpen(false)
    try {
      const json = await dispatch(
        fetchThunk(
          {
            url: API_PATHS.notifications.delete,
            method: 'post',
            data: { ids: data?.record_id },
          },
          true
        )
      )
      if (json.status === 200) {
        mutate()
      }
      setMessage({ message: json.data?.message })
    } catch (e: any) {
      setMessage({ message: e.response?.data?.message })
    }
  }

  const turnOfNotiChannel = async () => {
    setOpen(false)
    const confirm = await promptConfirmation({
      title: intl.formatMessage(
        { id: 'turnOfNotiTitle' },
        { name: data?.channel_name }
      ),
    })
    if (confirm) {
      try {
        const json = await dispatch(
          fetchThunk(
            {
              url: API_PATHS.users.followChannel,
              method: 'post',
              data: { id: data?.channel_id, status: 0 },
            },
            true
          )
        )
        if (json.status === 200) {
          mutate()
        }
        setMessage({ message: json.data?.message })
      } catch (e: any) {
        setMessage({ message: e.response?.data?.message })
      }
    }
    close()
  }

  var unicodeToChar = function (text) {
    return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
  }
  return (
    <div className="flex items-start py-2 hover:bg-neutral-100">
      <div className="ml-2 flex items-center">
        <div
          className={
            data.is_read
              ? 'mx-2 h-2 w-2 shrink-0'
              : 'mx-2 h-2 w-2 shrink-0 rounded bg-primary'
          }
        />
        <MyLink
          href={{
            pathname: ROUTES.channel.detail,
            query: { id: data.channel_id },
          }}
        >
          <ProgressiveImg
            src={data.avatarImage}
            isAvatar
            className="avatar h-9 w-9"
            alt="avatarImage"
          />
        </MyLink>
      </div>
      <MyLink
        href={{
          pathname:
            data.type === 'VOD'
              ? ROUTES.video.detail
              : data.type === 'LIVE'
              ? ROUTES.live.detail
              : data.type === 'SHORT'
              ? ROUTES.shorts.index
              : ROUTES.phim.detail,
          query: {
            id: data.type === 'FILM' ? data.group_id : data.item_id,
            slug: [data.slug],
          },
        }}
        className="flex flex-1"
      >
        <div className="mx-2 flex-1">
          <p
            className="line-clamp-4"
            dangerouslySetInnerHTML={{ __html: unicodeToChar(data.message) }}
          />

          <p className="mt-2 text-neutral-500 caption2">
            {data.sent_time_format}
          </p>
        </div>
        <ProgressiveImg
          src={data.coverImage}
          className="h-14 w-25 rounded-lg border border-neutral-100"
          alt="coverImage"
          shape="rect_w"
        />
      </MyLink>
      <Popper
        open={open}
        setOpen={setOpen}
        className="-mt-2 px-3 py-2"
        wrapper={<MoreIcon />}
        noPortal
        classNamePaper="z-50 overflow-hidden min-w-[282px]"
      >
        <div className="flex flex-col">
          <button
            className="flex h-12 flex-row items-center px-6 hover:bg-neutral-100"
            onClick={onHiddenNoti}
          >
            <EyeOffIcon className="mr-2" />
            <p className="whitespace-nowrap">
              <FormattedMessage id="hiddenNoti" />
            </p>
          </button>
          <button
            className="flex h-12 flex-row items-center px-6 hover:bg-neutral-100"
            onClick={() => turnOfNotiChannel()}
          >
            <NotiOffIcon className="mr-2" />
            <p className="whitespace-nowrap">
              <FormattedMessage id="turnOfNoti" />
            </p>
          </button>
        </div>
      </Popper>
    </div>
  )
}
export default NotiCard
