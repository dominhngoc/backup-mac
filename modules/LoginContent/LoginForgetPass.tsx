import React from 'react'

function LoginForgetPass() {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 m-auto flex h-[255px] w-[343px] flex-col items-center rounded-xl bg-bg2">
      <h2 className="font-inter mt-[21px] text-xl font-bold not-italic leading-6 tracking-[-0.26px] text-white">
        Đăng ký - Quên mật khẩu
      </h2>
      <p className="relative mt-5 h-[94px] w-[259px] text-center font-sans text-[13px] font-normal not-italic leading-[18px] tracking-[-0.078px] text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:text-xl after:font-bold after:text-primary after:content-['MK_gửi_9062']">
        Tính năng này hiện tại dành cho thuê bao Viettel, để đăng ký/lấy mật
        khẩu bạn vui
        <br /> lòng soạn:
      </p>
      <div className="mt-8 flex flex-row">
        <button className="mr-4 flex h-10 w-[136px] items-center justify-center rounded-xl bg-neutral-100 py-3 px-4">
          <span className="font-inter text-[16px] font-bold not-italic leading-[21px] tracking-[-0.408px] text-white">
            Hủy
          </span>
        </button>
        <button className="flex h-10 w-[136px] items-center justify-center rounded-xl bg-primary py-3 px-4">
          <span className="font-inter text-[16px] font-bold not-italic leading-[21px] tracking-[-0.408px] text-white">
            Soạn tin nhắn
          </span>
        </button>
      </div>
    </div>
  )
}

export default LoginForgetPass
