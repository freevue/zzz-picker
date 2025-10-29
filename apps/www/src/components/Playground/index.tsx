import BottomSheet from './BottomSheet'
import Nickname from './Nickname'
import Reset from './Reset'
import Round from './Round'

const Side: React.FC = () => {
  return (
    <>
      <div className="flex w-full p-4 gap-5 items-center sticky top-0 bg-black z-10">
        <Nickname side="A" />
        <span className="text-3xl font-extrabold text-foreground/50">VS</span>
        <Nickname side="B" />
      </div>
      <div className="p-4 flex flex-col gap-20 mt-8">
        <Round id="personal" />
        <Round id="common" />
      </div>
      <div className="p-4 my-8">{/* <TotalScore /> */}</div>
      <BottomSheet />
      <Reset />
    </>
  )
}

export default Side
