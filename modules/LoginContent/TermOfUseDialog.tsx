import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { API_PATHS } from '@utility/API_PATH'
import { FormattedMessage } from 'react-intl'
import useSWR from 'swr'

interface Props {
  open: boolean
  onClose: (value: boolean) => void
}

const TermOfUseDialog = (props: Props) => {
  const { open, onClose } = props
  const { dispatch } = useGeneralHook()

  const { data } = useSWR(
    open ? API_PATHS.home.getArticle('ARTICLE_TERM_CONDITION') : null,
    async (url) => {
      const json = await dispatch(
        fetchThunk({
          url,
          method: 'get',
        })
      )
      return json?.data?.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  return (
    <div className="relative m-auto h-[640px] max-h-[90vh] w-[800px] overflow-hidden rounded-2xl px-6 pb-5 flex flex-col">
      <p className="title my-5 text-center font-bold text-white">
        <FormattedMessage id="termOfUse" />
      </p>
      <div className="w-full flex-1 rounded-lg bg-white overflow-auto">
        <div
          className="text-justify"
          dangerouslySetInnerHTML={{ __html: data?.content }}
        />
      </div>
      <p className="font-inter left-0 right-0 mx-auto mt-4 flex h-10 items-center justify-center text-xs font-normal not-italic leading-[18px] text-neutral-400">
        <FormattedMessage id="agreeWithTerm" />
        &nbsp;
        <span className="text-yellow">
          <FormattedMessage id="termOfUseMyclip" />
        </span>
      </p>
      <button
        onClick={() => onClose(true)}
        className="mx-auto flex h-10 w-[200px] flex-row items-center justify-center rounded-xl bg-primary py-3 px-5"
      >
        <p className="font-inter text-base font-bold not-italic leading-[21px] tracking-[-0.408px] text-white">
          <FormattedMessage id="angree" />
        </p>
      </button>
    </div>
  )
}

export default TermOfUseDialog
