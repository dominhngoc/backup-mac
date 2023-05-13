import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

const MyDocument = () => {
  return (
    <Html lang="en-US">
      <Head>
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        /> */}
        <meta property="og:locale" content={'en_US'} />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>
      <body className='overflow-x-hidden'>
        <Main />
        <NextScript />
        <div id="append-root" />
      </body>
    </Html>
  )
}

export default MyDocument

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      // Useful for wrapping the whole react tree
      enhanceApp: (App) => App,
      // Useful for wrapping in a per-page basis
      enhanceComponent: (Component) => Component,
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles)],
  }
}
