import { useEffect } from 'react'
import Router from 'next/router'

const Redirect = ({ to = '/404', isBack = false }) => {
  useEffect(() => {
    if (isBack) Router.back()
    else Router.replace(to)
  }, [isBack, to])

  return null
}

export default Redirect
