import RuleBook from '~/components/Rule/Book'

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
