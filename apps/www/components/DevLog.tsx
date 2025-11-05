import { pipe, isString, map, toArray, zipWithIndex } from '@fxts/core'
import { Dialog, Typo } from '@zzz-picker/components/v2'
import { useState } from 'react'

const Wrapper: React.FC<{ children: React.ReactNode; date: string }> = (props) => {
  return (
    <div>
      <Typo.Heading className="heading-xl text-netural mb-2">{props.date}</Typo.Heading>
      <div className="flex flex-col gap-2 p-8 bg-base/70 rounded-bl-3xl rounded-tr-3xl">
        {props.children}
      </div>
    </div>
  )
}
const Text: React.FC<{ children: React.ReactNode }> = (props) => {
  return <Typo.Body className="body-md">{props.children}</Typo.Body>
}
const DevLog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-ink/70 body-lg hover:text-primary cursor-pointer focus:outline-none"
      >
        개발일지
      </button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-4 w-2xl">
          <Typo.Heading className="heading-4xl text-primary">Dev Log</Typo.Heading>
          <div className="flex flex-col gap-8">
            <Wrapper date="2025-11-05">
              <Text>디자인을 전면 개편했습니다.</Text>
              <Text>
                현재 신규로 추가할 기능을 개발중인데, 기존 디자인은 이 기능을 적용하기 어렵다고
                판단했습니다.
                <br />
                그냥 쉽게 만든 사이트 하나로 끝낼 생각이었는데, 작업을 진행할 수 있는 환경이
                좋아지며 목표를 조금 키우게 되었습니다.
              </Text>
              <Text>기술 검토는 끝난 상황이며, 열심히 코딩만 하면 되겠네요.</Text>
            </Wrapper>
            <Wrapper date="2025-11-01">
              <Text>정식으로 서비스를 오픈하게 되었습니다.</Text>
              <Text>
                기존에도 사용은 가능했지만, 단순히 오픈 베타 정도라 생각하고 있었습니다. 그러다 보니
                실시간으로 업데이트 되는 것을 목격했다는 글을 자주 보게 되었습니다.
              </Text>
              <Text>이 이후로는 배포와 업데이트를 실시간으로 진행되지는 않을 예정입니다.</Text>
            </Wrapper>
            <Wrapper date="2025-10-29">
              <Text>여러 상태에 따른 검토를 마무리 했습니다.</Text>
              <Text>
                기존 한가지 리그에서 3가지 리스로 확정지었습니다. 이에 따라 각 리그에 대한 상태를
                반영하여 분리가 진행되었습니다.
              </Text>
            </Wrapper>
            <Wrapper date="2025-10-25">
              <Text>버그를 수정했습니다.</Text>
              <Text>정식 오픈하기 전 치명적인 버그들을 중심으로 수정했습니다.</Text>
            </Wrapper>
            <Wrapper date="2025-10-08">
              <Text>개발을 시작했습니다.</Text>
              <Text>
                단순 저녁에 술한잔 하면서 라이브 방송을 보고 있었는데, 쉽게 만들 수 있을 것 같아
                진행했습니다.
                <br />
                실제 최초 공유하는데 걸린 시잔은 30분정도 걸렸습니다.
              </Text>
            </Wrapper>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default DevLog
