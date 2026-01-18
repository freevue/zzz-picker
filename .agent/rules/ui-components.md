---
trigger: model_decision
description: UI 컴포넌트 설계 원칙 및 사용 가이드
---

# 🎨 UI Components Rule (@zzz-picker/components)

이 문서는 `packages/components` 내의 UI 라이브러리를 설계하고 사용할 때 준수해야 할 원칙을 정의합니다. 본 프로젝트의 컴포넌트는 일반적인 웹 서비스와 달리 **인터넷 방송 환경**에 최적화된 특수한 설계 철학을 가집니다.

## 1. 핵심 설계 철학

### 📺 Broadcast-First (큰 UI 사이즈)
인터넷 방송 송출 화면(OBS, 가상 데스크탑 등)의 뷰포트는 시청자가 화면의 일부로 보게 되므로, 일반적인 웹 UI 사이즈로는 시인성이 확보되지 않습니다.
- **Large Scaling**: 모든 타이포그래피, 버튼, 버튼 영역은 일반적인 표준보다 **1.5배~2배** 이상 크게 설계합니다.
- **High Visibility**: 송출 화면 내에서 보더라도 텍스트와 숫자가 뚜렷하게 보여야 합니다. (최소 폰트 사이즈 및 가독성 높은 폰트 두께 지향)

### 🖱️ Interaction-Centric
본 서비스는 **클릭(Click)**, **숫자 입력(Number Input)**, **이미지(Image)** 리소스를 메인으로 다룹니다.
- **Clickable Area**: 클릭 가능한 영역은 오차 없이 선택될 수 있도록 넓고 명확하게 정의합니다.
- **Input Focus**: 숫자 입력 컴포넌트는 빠른 입력과 시각적 피드백을 위해 강조된 디자인을 적용합니다.
- **Image Display**: 이미지는 서비스의 핵심 에셋이므로, 로딩 상태와 고해상도 출력을 위한 최적화된 프레코 (ImagePreview 등)를 제공합니다.

### 🧩 Independent & Reusable
`packages/components` 프로젝트는 특정 서비스(`www`, `admin`)에 종속되지 않는 **독립적인 디자인 시스템** 역할을 수행합니다.
- **Tailwind Native**: 모든 스타일은 `@zzz-picker/tailwind-config`를 기반으로 한 Tailwind CSS를 사용합니다.
- **Solid Aesthetic**: 어드민과 메인 서비스 모두 일관된 다크/솔리드 톤을 유지해야 하므로, 복잡한 그라데이션 대신 명확한 대비를 가진 솔리드 디자인을 선호합니다.

## 2. 프로젝트 구조 (v2 기준)

| 디렉토리 | 설명 |
| :--- | :--- |
| `Typo/` | 방송용 고시인성 타이포그래피 컴포넌트 |
| `Form/` | 숫자 및 이미지 입력을 포함한 대형 폼 컴포넌트 |
| `Dialog/` | 화면을 가득 채우는 명확한 모달 시스템 |
| `Increase/` | 숫자 증감을 위한 특화 인터랙션 컴포넌트 |
| `Agent/` | AI 및 에이전트 인터페이스 관련 컴포넌트 |

## 3. 구현 가이드라인

1. **Named Export 사용**: 트리쉐이킹과 명확한 참조를 위해 `named export`를 기본으로 합니다.
2. **Tailwind Config 의존성**: 반드시 `@zzz-picker/tailwind-config` 내의 컬러 토큰(`--charade-***`, `--color-primary` 등)을 활용하여 스타일을 정의합니다.
3. **Framing & Rounded**: 인터넷 방송 특유의 부드럽고 세련된 느낌을 위해 `v2` 컴포넌트들은 상황에 따라 유동적인 `Rounded` 스타일(`useRoundedSize` 훅 활용)을 가집니다.

---

> [!IMPORTANT]
> 본 패키지는 프로젝트 전체의 **기본 디자인 틀**입니다. 여기서 정의된 스타일과 컴포넌트는 모든 하위 앱의 기준이 되므로, 변경 시 전역적인 일관성을 고려해야 합니다.
