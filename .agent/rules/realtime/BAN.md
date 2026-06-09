---
name: realtime-ban
description: 실시간 밴픽에서 Ban 페이즈에 대한 상세 진행 방식과 규칙입니다.
trigger: model_decision
---

# Realtime Ban

**Ban**의 경우 Boss(공용무대) 선택이 종료된 후 진행됩니다. `공허사냥꾼`경기인 경우 Boss 선택은 스킵되며, 바로 Ban을 진행합니다.

밴픽에 대한 자세한 설명은 [banpick-rule.md](../banpick-rule.md)를 참고합니다.

캐릭터에 대한 자세한 설명은 [zzz-agent.md](../zzz-agent.md)를 참고합니다.

## Sequence Diagram

아래의 다이어그램을 참고하여, Ban에 대한 스텝을 이해하세요.

```mermaid
sequenceDiagram
    participant Host
    participant Supabase
    participant ASide as A Side
    participant BSide as B Side

    Note over Host, BSide: Boss 선택 완료 후 진행 (공허사냥꾼은 생략)

    Note right of ASide: 1차 밴 캐릭터(Pickup S) 2개 선택
    ASide->>Supabase: Ban 선택 전파
    activate Supabase
    Supabase-->>Host: 현재 선택 정보 전파
    Supabase-->>BSide: 현재 선택 정보 전파
    deactivate Supabase

    BSide->>Supabase: 2개 중 1개 최종 Ban 선택
    activate Supabase
    Supabase->>Host: 1차 Ban 정보 전파
    Supabase->>ASide: 1차 Ban 정보 전파
    deactivate Supabase

    Note right of BSide: 2차 밴 캐릭터(Pickup S) 2개 선택
    Note over BSide: 1차 밴과 다른 포지션 선택 (딜러 <-> 서포터)
    BSide->>Supabase: Ban 선택 전파
    activate Supabase
    Supabase-->>Host: 현재 선택 정보 전파
    Supabase-->>ASide: 현재 선택 정보 전파
    deactivate Supabase

    ASide->>Supabase: 2개 중 1개 최종 Ban 선택
    activate Supabase
    Supabase->>Host: 2차 Ban 정보 전파
    Supabase->>BSide: 2차 Ban 정보 전파
    deactivate Supabase

    Note over Host, BSide: Pick 페이즈로 이동
```

![BAN](./BAN.png)


## 캐릭터(에이전트) 포지션

캐릭터는 6가지 특성(`specialty`)중 한가지를 가지는데, 이 특성(`specialty`)을 기반으로 `서포터`, `딜러`구분을 합니다.

- **딜러**: `강공`, `이상`, `명파`
- **서포터**: `지원`, `격파`, `방어`

## Ban이 가능한 캐릭터 조건

- Pickup S등급 캐릭터만 밴이 가능합니다. `isPickup`값과 `rarity`값을 확인하세요.
- `Allow Agent`인 경우 밴이 불가능합니다. `isAllow`값을 참고하세요.
- 티저 캐릭터의 경우 선택 자체가 불가능합니다. `isTeaser`값을 참고하세요.
