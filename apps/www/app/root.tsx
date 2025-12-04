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
  { title: '젠레스 존 제로: 강습전 밴픽' },
  { name: 'description', content: '강습전 경기를 위한 밴픽 사이트입니다.' },

  // Facebook Meta Tags
  { property: 'og:locale', content: 'ko_KR' },
  { property: 'og:url', content: 'https://zzz-picker.freevue.dev' },
  { property: 'og:type', content: 'website' },
  { property: 'og:title', content: '젠레스 존 제로: 강습전 밴픽' },
  { property: 'og:description', content: '강습전 경기를 위한 밴픽 사이트입니다.' },
  { property: 'og:image', content: 'https://zzz-picker.freevue.dev/og_image.webp' },

  // Twitter Meta Tags
  { name: 'twitter:card', content: 'summary_large_image' },
  { property: 'twitter:domain', content: 'zzz-picker.freevue.dev' },
  { property: 'twitter:url', content: 'https://zzz-picker.freevue.dev' },
  { name: 'twitter:title', content: '젠레스 존 제로: 강습전 밴픽' },
  { name: 'twitter:description', content: '강습전 경기를 위한 밴픽 사이트입니다.' },
  { name: 'twitter:image', content: 'https://zzz-picker.freevue.dev/og_image.webp' },
]

const Router: React.FC = () => {
  return (
    <html lang="ko">
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
        <Store>
          <Outlet />
        </Store>
        <Scripts />
      </body>
    </html>
  )
}

export default Router
