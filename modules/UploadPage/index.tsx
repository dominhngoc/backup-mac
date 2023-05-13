import MyLink from '@common/components/MyLink'
import { some } from '@common/constants'
import useGeneralHook from '@common/hook/useGeneralHook'
import MenuCategories from '@modules/HomePage/MenuCategories'
import { AddIcon, LoadingIcon } from '@public/icons'
import { AppState } from '@redux/store'
import { checkInfoUpload } from '@redux/uploadReducer'
import { ROUTES } from '@utility/constant'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import FormRegister from './FormRegister'
import UploadCard from './UploadCard'
import UploadPageNoProcess from './UploadPageNoProcess'
interface Props {
  dataCategorySSR: some[]
}

const UploadPage = (props: Props) => {
  const { dataCategorySSR = [] } = props

  const { intl, userData, dispatch } = useGeneralHook()

  const [listFormVideo, setListFormVideo] = useState<Array<File>>([])
  const userId = userData?.id
  const { userInfomation, loading } = useSelector(
    (state: AppState) => state.upload,
    shallowEqual
  )
  const handleSlectFile = async (file: File) => {
    setListFormVideo((old) => [...old, file])
  }

  const canUpload = !userInfomation || userInfomation?.status === 2

  const processContent = (
    <div style={{ display: canUpload ? undefined : 'none' }}>
      {listFormVideo.length === 0 && (
        <UploadPageNoProcess setFileSelect={handleSlectFile} />
      )}
      {listFormVideo.length > 0 && (
        <div className="mx-auto max-w-[980px]">
          {listFormVideo.map((file, index) => {
            return <UploadCard key={index} file={file} index={index} />
          })}
          <div className="mt-6 mb-12 flex w-full justify-end">
            <MyLink
              href={{
                pathname: ROUTES.channel.videos,
                query: { id: userId },
              }}
              className="btn "
            >
              <FormattedMessage id="myPlaylist" />
            </MyLink>
            <button className="btn ml-4">
              <input
                className={'hidden'}
                id="image-back-input"
                type="file"
                accept="video/*"
                autoComplete="off"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement
                  const listFiles = target.files
                  if (listFiles && listFiles.length > 0) {
                    handleSlectFile(listFiles[0])
                  }
                }}
              />
              <label
                htmlFor="image-back-input"
                className="flex cursor-pointer items-center"
              >
                <AddIcon className="mr-2" />
                <FormattedMessage id="addNewVideo" />
              </label>
            </button>
          </div>
        </div>
      )}
    </div>
  )

  useEffect(() => {
    dispatch(checkInfoUpload())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="flex w-full shrink-0 items-center justify-center min-h-screen">
        <LoadingIcon className="h-10 animate-spin" />
      </div>
    )
  }
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'upload' })}</title>
      </Head>
      <MenuCategories listCategory={dataCategorySSR} hasDivider />
      <div className="container flex flex-col min-h-screen">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col pb-10">
          {listFormVideo.length === 0 && (
            <nav className="mt-6 mb-4 flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center text-neutral-400">
                  <FormattedMessage id="upload" />{' '}
                  <span className="mx-4">/</span>
                </li>
              </ol>
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <FormattedMessage id="registerForReward" />
                </li>
              </ol>
            </nav>
          )}
          {!canUpload && <FormRegister formData={userInfomation} />}
          {processContent}
        </div>
      </div>
    </>
  )
}

export default UploadPage
