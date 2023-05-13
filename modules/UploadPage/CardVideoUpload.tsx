import ProgressiveImg from '@common/components/ProgressiveImg'
import React from 'react'
interface Props {
  data: string
}
export default function CardVideoUpload(props: Props) {
  const { data } = props
  return (
    <div className="my-3 flex">
      <ProgressiveImg
        src={data}
        shape="rect_w"
        className="h-[150px] w-[266px]"
      />
      <div className="ml-4 flex-1">
        <div className="flex">
          <div className="mr-14">
            <p className="font-semibold">
              Video Công Phương ghi bàn thời điểm quan trọng giúp Việt Nam vô
              địch AFF Cup 2018
            </p>
            <p className="mt-2 text-neutral-500">Công khai</p>
          </div>
          <button className="h-5 whitespace-nowrap text-sm text-primary">
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  )
}
