import { Typo } from '@zzz-picker/components/v2'

export const ChatHeader: React.FC = () => (
  <header className="flex h-20 items-center border-b border-white/10 bg-content/20 px-6 backdrop-blur-md">
    <Typo.Heading className="text-2xl font-black tracking-tight text-ink">
      ZZZ Assistant
    </Typo.Heading>
    <div className="ml-3 flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary"></span>
      </span>
      <Typo.Body className="text-sm text-ink/50 uppercase tracking-widest font-black">
        Gemini 2.5 Flash
      </Typo.Body>
    </div>
  </header>
)
