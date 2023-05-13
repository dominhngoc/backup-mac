import FormUpload from './FormUpload'
import SignUpToReceiveMoney from './SignUpToReceiveMoney'

const UploadScreen = () => {
  return (
    <>
      <div className="flex w-[1231px] justify-between">
        <div className="h-[664px] w-[855px] rounded-xl bg-bg2 p-8">
          <FormUpload />
        </div>
        <div className="h-[664px] w-[356px]">
          <SignUpToReceiveMoney />
        </div>
      </div>
    </>
  )
}
export default UploadScreen
