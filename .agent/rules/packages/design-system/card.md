---
name: design-system-card
description: 콘텐츠를 감싸는 컨테이너 형태인 Card 컴포넌트에 대한 정의입니다.
trigger: model_decision
---

# Card


## Information

Card 컴포넌트는 콘텐츠를 감싸는 컨테이너 형태로 요소간의 경계를 명확하게 해줍니다. 미리 tailwind-config 에 구성해둔 `.card` 유틸 클래스를 적용하여 모서리 둥글기 효과가 반영됩니다.

- state: 없음.
- props:
  - `children`: Card 내부에 포함될 컴포넌트 요소
  - `reverse`: 둥근 모서리 방향 반전 여부
  - `full`: 원형에 가깝게 전체적으로 둥글게 할지 여부
  - `inverse`: 모서리 곡률 역전 여부
  - 및 기타 `div` 요소 허용 프로퍼티 지원.

## Usage

```tsx
import { Card } from '@zzz-picker/design-system'

const Example = () => {
  return (
    <Card className="bg-surface shadow" reverse={true}>
      <p>Content inside the card</p>
    </Card>
  )
}
```
