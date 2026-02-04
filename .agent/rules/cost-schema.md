---
trigger: always_on
---

# 캐릭터의 Cost에 대한 설명

경기를 진행함에 있어 캐릭터의 경우 고유의 설정(돌파)이 존재합니다. 해당 설정에 따라 Cost가 정해집니다.

캐릭터 및 무기 돌파에 대한 설명은 [`game-rule.md`](./game-rule.md), [`zzz-agent.md`](./zzz-agent.md), [`zzz-engine.md`](./zzz-engine.md) Rule을 참고하면 됩니다.

## 관리 위치

Cost에 대한 데이터 저장은 2곳에서 관리 됩니다.

- window localStorage: 화면을 새로고침하였을때 데이터를 보존하기 위한 용도
- `packages/provider/src/Play.tsx`: 실제 데이터를 화면에 표시하기 위한 전역 상태 관리

## Schema

기본적으로 Cost의 타입은 아래와 같이 정의됩니다.

```typescript
type AgentCostSetting = {
  agentId: AgentId
  engineId: EngineId | null
  agentRate: number
  engineRate: number
}

type Cost = {
  A: Map<number, AgentCostSetting>
  B: Map<number, AgentCostSetting>
}
```

상태에서 사용하는 Cost는 Map 형식이며, `AgentId`를 Key로 활용하여 통해 각 Side에서 설정한 값들을 기록합니다.

경기 타입과 상관없이 하나로 관리됩니다.

### localStorage 활용시

localStorage에는 Map이 저장이 안되는 것을 감안하여, 데이터 셋을 정제합니다.

```json
{
  "A": [
    [
      155659,
      {
        "agentId": 155659,
        "engineId": null,
        "agentRate": 0,
        "engineRate": 1
      }
    ],
    [
      113671,
      {
        "agentId": 113671,
        "engineId": null,
        "agentRate": 0,
        "engineRate": 1
      }
    ]
  ],
  "B": []
}
```

위와 같이 Map 형식에서 각각의 Side별 배열로 담은 객체를 활용합니다.
