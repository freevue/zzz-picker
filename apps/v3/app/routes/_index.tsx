import { Button } from '@zzz-picker/zpds'
import { Link } from '@remix-run/react'

const ENTRIES = [
  { to: '/admin', label: '관리자', accent: 'var(--color-primary)' },
  { to: '/play/a', label: '선수 A', accent: 'var(--color-primary)' },
  { to: '/play/b', label: '선수 B', accent: 'var(--color-secondary)' },
]

export default function Index() {
  return (
    <div className="w-full h-full bg-[var(--color-base)] text-[var(--color-ink)] flex flex-col items-center justify-center gap-8 p-6">
      <span className="text-2xl font-black text-[var(--color-primary)] tracking-wide">ZZZ-PICKER v3</span>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
        {ENTRIES.map((e) => (
          <Link key={e.to} to={e.to} className="flex-1">
            <Button variant="neutral" size="lg" className="w-full">
              <span style={{ color: e.accent }}>{e.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
