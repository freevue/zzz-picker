import { Typo } from '@zzz-picker/components/v2'
import { motion } from 'motion/react'

const MODEL_PROFILE_URL =
  'https://images.zzz.freevue.dev/images/agents/156728/8bbef43670d3f27df029bcb3fff252f3_4423906655536049482.webp'

export const EmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex h-full flex-col items-center justify-center text-center opacity-40 py-20"
  >
    <div className="size-32 rounded-3xl overflow-hidden bg-white/5 mb-6 border border-white/10">
      <img src={MODEL_PROFILE_URL} alt="Model Profile" className="size-full object-cover" />
    </div>
    <Typo.Heading className="text-2xl font-black mb-2">무엇을 도와드릴까요?</Typo.Heading>
    <Typo.Body className="text-lg italic opacity-70">
      강습전의 실시간 데이터를 기반으로 답변합니다.
    </Typo.Body>
  </motion.div>
)
