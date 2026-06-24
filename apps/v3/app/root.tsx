import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts } from '@remix-run/react'
import { Store } from '@zzz-picker/provider'
import styles from '~/index.css?url'

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.png' },
  { rel: 'stylesheet', href: styles },
]

export const meta: MetaFunction = () => [
  { charSet: 'UTF-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
  { title: 'ZZZ-PICKER: V3 Sandbox' },
  { name: 'description', content: 'V3 디자인 시스템 및 통합 데이터 모델 검증 격리 구역' },
]

const App: React.FC = () => {
  return (
    <html lang="ko" className="v3">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Store>
          <Outlet />
        </Store>
        <Scripts />
      </body>
    </html>
  )
}

export default App
