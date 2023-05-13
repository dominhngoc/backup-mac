import Link, { LinkProps } from 'next/link'
import React, { HTMLAttributeAnchorTarget } from 'react'
interface Props extends LinkProps {
  className?: string
  children?: React.ReactNode
  rel?: string | undefined
  target?: HTMLAttributeAnchorTarget | undefined
  title?: string
  style?: object
  checkId?: boolean
}
export default function MyLink(props: Props) {
  const {
    children,
    target,
    rel,
    title,
    style,
    className = '',
    checkId,
    ...rest
  } = props

  if (
    !!checkId &&
    !(rest.href as any).query?.id &&
    (rest.href as any).pathname?.includes('[id]')
  ) {
    return (
      <div
        className={className}
        title={title}
        style={style}
        aria-label={rest['aria-label']}
      >
        {children}
      </div>
    )
  }
  return (
    <Link passHref {...rest}>
      <a
        className={className}
        target={target}
        rel={rel}
        title={title}
        style={style}
        aria-label={rest['aria-label']}
      >
        {children}
      </a>
    </Link>
  )
}
