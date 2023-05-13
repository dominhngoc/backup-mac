import React, { useEffect, useState } from 'react'

function LoginOtp() {
  const [stateTime, setStateTime] = useState(5)

  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 m-auto flex h-[660px] w-[480px] flex-col items-center rounded-2xl border border-solid border-[#141414] bg-black">
      <h2 className="font-inter relative mt-5 flex h-10 w-full items-center justify-center text-xl font-bold not-italic leading-6 tracking-[-0.26px] text-white">
        Liên kết tài khoản
        <button className="absolute left-5 h-6 w-6">
          {/* <
           icon={faAngleLeft} className="text-white" /> */}
        </button>
      </h2>
      <div className="relative mt-2 flex h-[218px] w-[218px] items-center"></div>
      <p className="font-inter mt-8 text-center text-base font-normal not-italic leading-[21px] tracking-[-0.408px] text-white">
        Vui lòng nhập mã OTP đã được gửi về số điện thoại <br /> 0395179999
      </p>
      <div className="mt-8 flex w-full flex-row justify-between px-16">
        <input className="h-[52px] w-[52px] rounded-[5.2px] bg-bg2" />
        <input className="h-[52px] w-[52px] rounded-[5.2px] bg-bg2" />
        <input className="h-[52px] w-[52px] rounded-[5.2px] bg-bg2" />
        <input className="h-[52px] w-[52px] rounded-[5.2px] bg-bg2" />
        <input className="h-[52px] w-[52px] rounded-[5.2px] bg-bg2" />
        <input className="h-[52px] w-[52px] rounded-[5.2px] bg-bg2" />
      </div>
      <div className="font-inter mt-4 text-[14px] font-bold not-italic leading-5 tracking-[-0.5px] text-[#D8D8DA]">
        <a href="#" className="">
          Gửi lại OTP
        </a>
        <span>&nbsp; {stateTime}</span>
      </div>
      <button className="mt-8 flex h-10 w-[369px] flex-row items-center justify-center rounded-xl bg-neutral-100">
        Xác nhận
      </button>
    </div>
  )
}

export default LoginOtp
