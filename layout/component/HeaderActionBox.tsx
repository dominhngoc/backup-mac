import MyLink from '@common/components/MyLink'
import Popper from '@common/components/Popper'
import useGeneralHook from '@common/hook/useGeneralHook'
import {
  AccountIcon,
  BookIcon,
  ContactIcon,
  DocumentIcon,
  MoreIcon,
  ShieldIcon,
} from '@public/icons'
import { setOpenLoginDialog } from '@redux/dialogReducer'
import { ROUTES } from '@utility/constant'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

const HeaderActionBox = () => {
  const [open, setOpen] = useState(false)
  const { dispatch } = useGeneralHook()

  const MENU = [
    {
      id: 'option',
      list: [
        {
          name: 'intro',
          icon: <DocumentIcon />,
          href: { pathname: ROUTES.introduce },
        },
        {
          name: 'policy',
          icon: <ShieldIcon />,
          href: { pathname: ROUTES.termsOfUse },
        },
        {
          name: 'guide',
          icon: <BookIcon />,
          href: { pathname: ROUTES.guide },
        },
        {
          name: 'supportContact',
          icon: <ContactIcon />,
          href: { pathname: ROUTES.contact },
        },
      ],
    },
  ]

  return (
    <>
      <button
        className="btn-container ml-6"
        onClick={() => {
          dispatch(setOpenLoginDialog(true))
        }}
      >
        <AccountIcon className="mr-2" />
        <FormattedMessage id="login" />
      </button>
      <Popper
        open={open}
        setOpen={setOpen}
        className="ml-3 p-3"
        wrapper={<MoreIcon className="scale-125" />}
        classNamePaper="z-max mt-3 py-2 overflow-hidden"
      >
        <div
          className={`max-h-[75vh] overflow-auto`}
          onClick={() => setOpen(false)}
        >
          {MENU.map((item) => {
            return (
              <div key={item.id}>
                <div className="mb-1.5 flex w-60 flex-col">
                  {item.list.map((item, index2) => {
                    return (
                      <MyLink
                        key={index2}
                        href={item.href}
                        className="flex items-center py-2 px-4 hover:bg-neutral-100"
                      >
                        {item.icon}
                        <p className={'ml-3'}>
                          <FormattedMessage id={item.name} />
                        </p>
                      </MyLink>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Popper>
    </>
  )
}
export default HeaderActionBox
