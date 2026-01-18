import type { MetaFunction } from '@remix-run/node'
import { ImageUploader } from '~/components/image-uploader'

export const meta: MetaFunction = () => {
  return [
    { title: 'ZZZ Picker Admin - 이미지 업로드' },
    { name: 'description', content: 'Cloudflare R2에 이미지 업로드' },
  ]
}

export default function Index() {
  return (
    <main className="min-h-screen bg-charade-950 p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-ink">ZZZ Picker Admin</h1>
          <p className="mt-1 text-charade-400">Cloudflare R2 이미지 관리</p>
        </header>

        <div className="flex justify-center">
          <ImageUploader />
        </div>
      </div>
    </main>
  )
}
