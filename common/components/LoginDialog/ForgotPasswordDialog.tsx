import { FormattedMessage } from 'react-intl'

const ForgotPasswordDialog = ({ setOpenRegisterForm }) => {
  return (
    <>
      <div className="m-auto flex  w-89 flex-col items-center rounded-xl bg-bg2 py-6 px-9 text-center">
        <h2 className="font-inter mt-4 text-xl font-bold not-italic leading-6 tracking-[-0.26px] text-white">
          <FormattedMessage id="registerTitle" />
        </h2>
        <p className="relative mt-5 ">
          <FormattedMessage id="registerMessage" />
        </p>
        <p className="relative mt-5 font-bold text-yellow title">
          <FormattedMessage id="getPassSyntax" />
        </p>
        <div className="mt-8 flex flex-row">
          <button
            onClick={() => setOpenRegisterForm(false)}
            className="flex h-10 w-32 items-center justify-center rounded-xl bg-primary py-3 px-4"
          >
            <span className="font-inter text-[16px] font-bold not-italic leading-[21px] tracking-[-0.408px] text-white">
              <FormattedMessage id="understood" />
            </span>
          </button>
        </div>
      </div>
    </>
  )
}
export default ForgotPasswordDialog
