import { Body, Button, Heading } from '@zzz-picker/zpds'
import { Link } from '@remix-run/react'

const ENTRIES = [
  {
    to: '/admin',
    badge: 'HOST',
    title: '관리자 콘솔',
    desc: '경기 타입 전환, 양 팀 픽/밴, 점수·시간, 보스 선택을 모두 제어합니다.',
    accent: 'var(--color-primary)',
  },
  {
    to: '/play/a',
    badge: 'SIDE A',
    title: '선수 A 화면',
    desc: 'A 팀 전용 픽/밴 및 점수 입력. 관리자/B 화면과 실시간 동기화됩니다.',
    accent: 'var(--color-primary)',
  },
  {
    to: '/play/b',
    badge: 'SIDE B',
    title: '선수 B 화면',
    desc: 'B 팀 전용 픽/밴 및 점수 입력. 관리자/A 화면과 실시간 동기화됩니다.',
    accent: 'var(--color-secondary)',
  },
]

export default function Index() {
  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hidden bg-[var(--color-base)] text-[var(--color-ink)] flex flex-col items-center justify-center p-6 gap-10">
      <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
        <Heading level="4xl" className="flex items-center gap-3 flex-wrap justify-center">
          <span>ZZZ-PICKER v3</span>
          <span className="text-xs bg-[var(--color-netural)] px-3 py-1 rounded text-[var(--color-secondary)] font-bold tracking-widest border border-[var(--color-secondary)]/20">
            SANDBOX
          </span>
        </Heading>
        <Body size="md" className="text-[var(--color-ink)]/55">
          신규 디자인 시스템(zpds) 기반 실시간 방송 밴픽 콘솔. 아래 화면을 각각 다른 탭/창에서 열면
          BroadcastChannel 로 즉시 동기화됩니다. (현재 mock 데이터)
        </Body>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl">
        {ENTRIES.map((e) => (
          <Link
            key={e.to}
            to={e.to}
            className="group flex flex-col gap-3 bg-[var(--color-content)] p-6 rounded-2xl border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] hover:border-[var(--color-secondary)]/50 transition-all"
          >
            <span
              className="text-[10px] font-black tracking-widest w-fit px-2.5 py-1 rounded border"
              style={{ color: e.accent, borderColor: `${e.accent}55` }}
            >
              {e.badge}
            </span>
            <Heading level="xl" className="text-[var(--color-ink)]">
              {e.title}
            </Heading>
            <Body size="sm" className="text-[var(--color-ink)]/50 leading-relaxed flex-1">
              {e.desc}
            </Body>
            <Button variant="secondary" size="sm" className="w-full mt-2">
              화면 열기 →
            </Button>
          </Link>
        ))}
      </div>

      <Link
        to="/sandbox"
        className="text-xs text-[var(--color-ink)]/35 hover:text-[var(--color-secondary)] font-bold underline underline-offset-4 transition-colors"
      >
        기존 단일 샌드박스 화면(legacy) 보기 →
      </Link>
    </div>
  )
}
