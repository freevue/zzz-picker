// import type { MetaFunction } from '@remix-run/node'
import RuleBook from '~/components/Rule/Book'

// export const meta: MetaFunction = () => {
//   return [{ title: '젠레스 존 제로: 엔강대 룰북' }]
// }

const Rule: React.FC = () => {
  return (
    <div className="overflow-y-auto size-full">
      <div className="bg-content p-8">
        <RuleBook className="flex flex-col gap-4 max-w-xl mx-auto" />
      </div>
    </div>
  )
}

export default Rule
