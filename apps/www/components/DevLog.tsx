import { Text, Wrapper, Image } from './Docs'
import { Dialog, Typo } from '@zzz-picker/components/v2'
import { useState } from 'react'

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
            <Wrapper title="2025-11-16">
              <Text>피드백 반영</Text>
              <Image
                className="aspect-[624/409]"
                src="https://nng-phinf.pstatic.net/MjAyNTA2MDlfOTAg/MDAxNzQ5NDM3NTkzNTQx.SCBYePF842V1102Rd-N9EkRBhmp1ngrIa6UCJ0LgoUog.IFqtA00xgYuc1I2XUqvuvF431RKpUuPYJMagTi8VNLwg.PNG/%EC%95%A8%EB%A6%AC%EC%8A%A41.png"
                alt="2025-11-16"
              />
            </Wrapper>
            <Wrapper title="2025-11-15">
              <Text>엔강대가 정식으로 시작합니다.</Text>
              <Text>
                경기 히스토리를 저장하여 통계를 지원하고자 했는데, 데이터 구성을 완료하지
                못하였습니다. <br />
                당장은 직접 수기로 입력할 것 같네요.
              </Text>
              <Text>
                엔진 선택 사용성을 개선했습니다. 단순하게 등급만 보여주는 것이 아닌, 실제 무엇을
                사용하는지 보여주고자 했습니다.
              </Text>
            </Wrapper>
            <Wrapper title="2025-11-05">
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
            <Wrapper title="2025-11-01">
              <Text>정식으로 서비스를 오픈하게 되었습니다.</Text>
              <Text>
                기존에도 사용은 가능했지만, 단순히 오픈 베타 정도라 생각하고 있었습니다. 그러다 보니
                실시간으로 업데이트 되는 것을 목격했다는 글을 자주 보게 되었습니다.
              </Text>
              <Text>이 이후로는 배포와 업데이트를 실시간으로 진행되지는 않을 예정입니다.</Text>
            </Wrapper>
            <Wrapper title="2025-10-29">
              <Text>여러 상태에 따른 검토를 마무리 했습니다.</Text>
              <Text>
                기존 한가지 리그에서 3가지 리스로 확정지었습니다. 이에 따라 각 리그에 대한 상태를
                반영하여 분리가 진행되었습니다.
              </Text>
            </Wrapper>
            <Wrapper title="2025-10-25">
              <Text>버그를 수정했습니다.</Text>
              <Text>정식 오픈하기 전 치명적인 버그들을 중심으로 수정했습니다.</Text>
            </Wrapper>
            <Wrapper title="2025-10-08">
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
