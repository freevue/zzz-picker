import { Link } from '@remix-run/react'

const ENTRIES = [
  { to: '/admin', label: '관리자', accent: 'var(--color-primary)' },
  { to: '/play/a', label: '선수 A', accent: 'var(--color-primary)' },
  { to: '/play/b', label: '선수 B', accent: 'var(--color-secondary)' },
]

export default function Index() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-10 p-6" style={{ background: 'var(--grad-page)' }}>
      <span className="text-2xl font-black tracking-wide" style={{ color: 'var(--color-primary)' }}>
        ZZZ-PICKER v3
      </span>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
        {ENTRIES.map((e) => (
          <Link
            key={e.to}
            to={e.to}
            className="flex-1 rounded-[28px] p-1.5"
            style={{ background: 'var(--color-base)' }}
          >
            <div
              className="rounded-[22px] py-10 flex items-center justify-center text-base font-black transition-all duration-200 hover:brightness-110"
              style={{ background: `linear-gradient(160deg, ${e.accent}26, var(--color-content))`, color: e.accent }}
            >
              {e.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
