import { some } from '@common/constants'
import MenuCategories from '@modules/HomePage/MenuCategories'
import Head from 'next/head'
import ChannelInfoBox from '../ChannelInfoBox'

interface Props {
  channelId: string
  channelInfo: some
  dataCategorySSR: some[]
}

export default function IntroduceChannel(props: Props) {
  const { channelId, channelInfo, dataCategorySSR } = props

  return (
    <>
      <Head>
        <title>{channelInfo?.name}</title>
      </Head>
      <MenuCategories hasDivider={true} listCategory={dataCategorySSR} />
      <div className="container pt-6 pb-36 min-h-screen">
        <ChannelInfoBox channelInfo={channelInfo} />
        <div className="flex flex-col gap-9"></div>
      </div>
    </>
  )
}
