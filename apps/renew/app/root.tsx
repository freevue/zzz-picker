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
  { title: '젠레스 존 제로: 엔강대' },
  { name: 'description', content: '젠레스 존 제로: 엔강대 경기 대시보드' },

  // Facebook Meta Tags
  { property: 'og:locale', content: 'ko_KR' },
  { property: 'og:url', content: 'https://ncore.freevue.dev' },
  { property: 'og:type', content: 'website' },
  { property: 'og:title', content: '젠레스 존 제로: 엔강대' },
  { property: 'og:description', content: '젠레스 존 제로: 엔강대 경기 대시보드' },
  {
    property: 'og:image',
    content:
      'https://images.zzz.freevue.dev/images/background/618031f1-6871-44a3-9d20-cd880e74ae88.jpg',
  },

  // Twitter Meta Tags
  { name: 'twitter:card', content: 'summary_large_image' },
  { property: 'twitter:domain', content: 'ncore.freevue.dev' },
  { property: 'twitter:url', content: 'https://ncore.freevue.dev' },
  { name: 'twitter:title', content: '젠레스 존 제로: 엔강대' },
  { name: 'twitter:description', content: '젠레스 존 제로: 엔강대 경기 대시보드' },
  {
    name: 'twitter:image',
    content:
      'https://images.zzz.freevue.dev/images/background/618031f1-6871-44a3-9d20-cd880e74ae88.jpg',
  },
]

const App: React.FC = () => {
  return (
    <html lang="ko" className="dark">
      <head>
        <Meta />
        <Links />

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7E861ERT9C" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag() { dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', 'G-7E861ERT9C');
            `,
          }}
        />
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
