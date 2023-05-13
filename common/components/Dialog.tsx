import React from 'react'
interface Props {
  children: any
  open: boolean
  onClose: (val: boolean) => void
  classNamePaper?: string
  className?: string
}

export default function Dialog(props: Props) {
  const { children, classNamePaper, className = '', open, onClose } = props
  return (
    <main
      className={
        'pointer fixed inset-0 top-0 z-50 transform overflow-hidden bg-transparent ease-in-out' +
        (open
          ? ' translate-y-0 opacity-100 transition-opacity duration-500 '
          : ' translate-y-full opacity-0 transition-all delay-500')
      }
    >
      <section
        className={
          'delay-400  absolute left-3 right-3 top-1/2 bottom-auto z-10 min-h-[150px] transform rounded-2xl bg-bg2 transition-all duration-500 ease-in-out md:mx-auto md:max-w-sm ' +
          className +
          (open ? ' -translate-y-1/2' : ' translate-y-[200%]')
        }
      >
        <article
          className={
            'relative flex h-full max-h-[75vh] w-full flex-col overflow-hidden ' +
            classNamePaper
          }
        >
          {children}
        </article>
      </section>
      <section
        className="h-full w-screen cursor-none "
        onClick={() => {
          onClose(false)
        }}
      ></section>
    </main>
  )
}
