import { FormattedMessage } from 'react-intl'

const SignUpToReceiveMoney = () => {
  return (
    <div style={{ width: 354, marginLeft: 24 }}>
      <button className="btn w-full">
        <FormattedMessage id="registerForReward" />
      </button>
      <div className="w-full pl-8 pr-6">
        <p className="mt-12 mb-8 text-xl font-bold">
          <FormattedMessage id="guideUploadVideo" />
        </p>
        <FormattedMessage id="guideUploadTitle" />
        <p className="mt-5">
          <FormattedMessage id={'guideReceiveMoney_1'} />
        </p>
        <p className="mt-5">
          <FormattedMessage id={'guideReceiveMoney_2'} />
        </p>
        <p className="mt-5">
          <FormattedMessage id={'guideReceiveMoney_4'} />
        </p>
        <p className="mt-5">
          <FormattedMessage id={'guideReceiveMoney_5'} />
        </p>
        <p className="mt-5">
          <FormattedMessage id={'guideReceiveMoney_6'} />
        </p>
      </div>
    </div>
  )
}
export default SignUpToReceiveMoney
