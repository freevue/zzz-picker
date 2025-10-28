import { Header, Playground, CostTable, Boss } from '@/components'
import { Play } from '@zzz-picker/provider'

const CustomPlay: React.FC = () => {
  return (
    <div className="w-full h-full overflow-auto scrollbar-hidden">
      <div className="h-full ml-auto w-fit flex z-10 relative flex-1 overflow-auto scrollbar-hidden">
        <div className="min-w-xl w-xl dark:text-white bg-content flex flex-col gap-6 overflow-y-auto overflow-x-hidden scrollbar-hidden">
          <Header />
          <Boss />
          <CostTable />
        </div>
        <Play>
          <div className="min-w-4xl w-4xl overflow-auto scrollbar-hidden min-h-screen">
            <Playground />
          </div>
        </Play>
      </div>
    </div>
  )
}

export default CustomPlay
