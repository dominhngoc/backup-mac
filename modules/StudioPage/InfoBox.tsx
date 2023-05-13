import { some } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import { AddIcon, CircleStudioIcon, Pen2Icon } from '@public/icons'
import { AppState } from '@redux/store'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'

interface Props {
  data?: some
  setFormData: (value?: some) => void
}

const InfoBox = (props: Props) => {
  const { data, setFormData } = props
  const { intl } = useGeneralHook()
  const listCategory = useSelector(
    (appState: AppState) => appState.studio.listCategory,
    shallowEqual
  )
  return (
    <>
      <div className="flex w-full items-start rounded-xl bg-bg2 p-4">
        <div className="relative flex min-h-[234px] w-[426px] flex-col items-center justify-center rounded-xl bg-black text-center">
          <CircleStudioIcon />
          <p
            className="mt-4 text-neutral-500 caption1"
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage({ id: 'noteStudio' }),
            }}
          ></p>
        </div>
        <div className="ml-12 mr-3 flex-1">
          <div className="mb-4">
            <p className="mb-1 text-neutral-400 caption1">
              <FormattedMessage id="title" />
            </p>
            <p>{data?.name}&nbsp;</p>
          </div>
          <div className="mb-4">
            <p className="mb-1 text-neutral-400 caption1">
              <FormattedMessage id="type" />
            </p>
            <p>
              {data?.categoryId &&
                listCategory?.find((v) => v.id === data?.categoryId)?.name}
              &nbsp;
            </p>
          </div>
          <div className="mb-4 flex">
            <div className="mr-6">
              <p className="mb-1 text-neutral-400 caption1">
                <FormattedMessage id="numberWatingPeople" />
              </p>
              <p>0</p>
            </div>
            <div>
              <p className="mb-1 text-neutral-400 caption1">
                <FormattedMessage id="likeCount" />
              </p>
              <p>0</p>
            </div>
          </div>
          <div>
            <p className="mb-1 text-neutral-400 caption1">
              <FormattedMessage id="connectionStatus" />
            </p>
            <p>
              Để phát trực tiếp, hãy gửi video của bạn đến Myclip bằng phần mềm
              phát trực tiếp
            </p>
          </div>
        </div>
        {data ? (
          <button className="btn" onClick={() => setFormData(data)}>
            <Pen2Icon className="mr-2" />
            <FormattedMessage id={'edit'} />
          </button>
        ) : (
          <button className="btn" onClick={() => setFormData({})}>
            <AddIcon className="mr-2" />
            <FormattedMessage id={'createNew'} />
          </button>
        )}
      </div>
    </>
  )
}

export default InfoBox
