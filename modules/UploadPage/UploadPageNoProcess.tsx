import { UploadBigIcon } from '@public/icons'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import SignUpToReceiveMoney from './SignUpToReceiveMoney'
interface Props {
  setFileSelect(file: any): void
}
const UploadPageNoProcess = (props: Props) => {
  const { setFileSelect } = props
  const [key, setKey] = useState(false)
  const handleUploadVideo = async (e: any) => {
    const listFiles = e.target?.files
    if (listFiles && listFiles.length > 0) {
      setFileSelect(listFiles[0])
      setKey((old) => !old)
    }
  }
  return (
    <div className="flex">
      <div className="flex-1">
        <label
          htmlFor="input-file-video"
          className="relative flex h-full w-full flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200"
        >
          <input
            key={`${key}`}
            className={'hidden'}
            id="input-file-video"
            type="file"
            autoComplete="off"
            accept="video/*"
            onChange={(v) => handleUploadVideo(v)}
          />

          <UploadBigIcon className="text-primary" />
          <div className="btn-container mt-8 h-10 w-72 ">
            <FormattedMessage id="chooseVideoToUpload" />
          </div>
        </label>
      </div>
      <SignUpToReceiveMoney />
    </div>
  )
}
export default UploadPageNoProcess
