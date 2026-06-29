import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts } from '@remix-run/react'
import { Background } from '~/components'
import styles from '~/index.css?url'

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.png' },
  { rel: 'stylesheet', href: styles },
]

export const meta: MetaFunction = () => [
  { charSet: 'UTF-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
]

const App: React.FC = () => {
  return (
    <html lang="ko" className="dark">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Background />
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}

export default App
