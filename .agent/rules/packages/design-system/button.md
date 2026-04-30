# Button

## Information

Button 컴포넌트는 모든 버튼의 원시(Primitive) 형태를 제공하는 컴포넌트입니다.
순수하게 클릭 등의 액션 기능과 껍데기를 위한 `button` 태그를 반환하며, 내부에 `children` 속성을 렌더링합니다.

- state: 없음.
- props:
  - `children`: 내부 노드
  - 기타 `button` 태그에 전달가능한 기본 속성(`onClick`, `disabled` 등) 모두 허용

## Usage

```tsx
import { Button } from '@zzz-picker/design-system'

const Example = () => {
  return (
    <Button onClick={() => alert('clicked')} className="bg-primary text-white">
      Click Me
    </Button>
  )
}
```
